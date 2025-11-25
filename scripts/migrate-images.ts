/**
 * Image Migration Script
 * 
 * This script uploads images from a local folder to Sanity.
 * It does NOT modify or delete any existing documents.
 * It only ADDS new image assets to Sanity.
 * 
 * Usage: tsx scripts/migrate-images.ts
 * 
 * IMPORTANT: Set the IMAGES_DIR constant below to your image folder path.
 */

import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'

// ============================================================================
// CONFIGURATION
// ============================================================================
// TODO: Set this to the absolute path of your images folder
const IMAGES_DIR = '/ABSOLUTE/PATH/HERE'

// Import environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-06-08'
const token = process.env.SANITY_API_TOKEN // Required for uploading assets

if (!projectId) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID')
}

if (!dataset) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SANITY_DATASET')
}

if (!token) {
  throw new Error('Missing environment variable: SANITY_API_TOKEN (required for uploading assets)')
}

// TypeScript: After the checks above, projectId is guaranteed to be a string
const safeProjectId: string = projectId
const safeToken: string = token

// Create Sanity client with write token
const client = createClient({
  projectId: safeProjectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: safeToken,
})

interface UploadResult {
  file: string
  assetId: string | null
  success: boolean
  error?: string
}

interface UploadReport {
  totalUploaded: number
  totalFailed: number
  timestamp: string
  dataset: string
  projectId: string
  uploaded: Array<{
    file: string
    assetId: string
  }>
  failed: Array<{
    file: string
    error: string
  }>
}

/**
 * Get all image files from directory
 */
function getImageFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    throw new Error(`Directory does not exist: ${dir}`)
  }

  const files = fs.readdirSync(dir)
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff']
  
  return files
    .filter(file => {
      const ext = path.extname(file).toLowerCase()
      return imageExtensions.includes(ext)
    })
    .map(file => path.join(dir, file))
}

/**
 * Get filename without extension for title
 */
function getFilenameWithoutExtension(filepath: string): string {
  return path.basename(filepath, path.extname(filepath))
}

/**
 * Upload a single image to Sanity
 */
async function uploadImage(filepath: string): Promise<UploadResult> {
  const filename = path.basename(filepath)
  const title = getFilenameWithoutExtension(filepath)

  try {
    console.log(`   📤 Uploading: ${filename}...`)

    // Read file buffer
    const buffer = fs.readFileSync(filepath)
    
    // Upload asset to Sanity
    const asset = await client.assets.upload('image', buffer, {
      filename: filename,
      contentType: getContentType(filepath),
    })

    // Update asset with title
    await client
      .patch(asset._id)
      .set({
        originalFilename: filename,
        title: title,
      })
      .commit()

    console.log(`   ✅ Success: ${filename} → ${asset._id}`)
    
    return {
      file: filename,
      assetId: asset._id,
      success: true,
    }
  } catch (error: any) {
    const errorMessage = error?.message || 'Unknown error'
    console.error(`   ❌ Failed: ${filename} - ${errorMessage}`)
    
    return {
      file: filename,
      assetId: null,
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Get content type based on file extension
 */
function getContentType(filepath: string): string {
  const ext = path.extname(filepath).toLowerCase()
  const contentTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.bmp': 'image/bmp',
    '.tiff': 'image/tiff',
  }
  
  return contentTypes[ext] || 'image/jpeg'
}

/**
 * Main migration function
 */
async function migrateImages(): Promise<void> {
  try {
    console.log('🖼️  Starting image migration...')
    console.log(`   Project ID: ${projectId}`)
    console.log(`   Dataset: ${dataset}`)
    console.log(`   Images Directory: ${IMAGES_DIR}`)
    console.log('')

    // Validate images directory
    if (IMAGES_DIR === '/ABSOLUTE/PATH/HERE') {
      throw new Error('Please set the IMAGES_DIR constant to your images folder path')
    }

    if (!fs.existsSync(IMAGES_DIR)) {
      throw new Error(`Images directory does not exist: ${IMAGES_DIR}`)
    }

    // Get all image files
    const imageFiles = getImageFiles(IMAGES_DIR)
    
    if (imageFiles.length === 0) {
      console.log('⚠️  No image files found in the specified directory')
      return
    }

    console.log(`📁 Found ${imageFiles.length} image file(s)`)
    console.log('')

    // Upload each image
    const results: UploadResult[] = []
    
    for (let i = 0; i < imageFiles.length; i++) {
      const filepath = imageFiles[i]
      console.log(`[${i + 1}/${imageFiles.length}]`)
      const result = await uploadImage(filepath)
      results.push(result)
      
      // Small delay to avoid rate limiting
      if (i < imageFiles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    // Generate report
    const successful = results.filter(r => r.success)
    const failed = results.filter(r => !r.success)

    const report: UploadReport = {
      totalUploaded: successful.length,
      totalFailed: failed.length,
      timestamp: new Date().toISOString(),
      dataset,
      projectId: safeProjectId,
      uploaded: successful.map(r => ({
        file: r.file,
        assetId: r.assetId!,
      })),
      failed: failed.map(r => ({
        file: r.file,
        error: r.error || 'Unknown error',
      })),
    }

    // Save report
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                      new Date().toISOString().replace(/[:.]/g, '-').split('T')[1].split('.')[0]
    const filename = `upload-report-${timestamp}.json`
    const backupDir = path.join(process.cwd(), 'backup')
    const filepath = path.join(backupDir, filename)

    // Ensure backup directory exists
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    fs.writeFileSync(filepath, JSON.stringify(report, null, 2), 'utf-8')

    // Print summary
    console.log('')
    console.log('='.repeat(60))
    console.log('📊 Migration Summary')
    console.log('='.repeat(60))
    console.log(`   Total files: ${results.length}`)
    console.log(`   ✅ Successful: ${successful.length}`)
    console.log(`   ❌ Failed: ${failed.length}`)
    console.log(`   📄 Report: ${filepath}`)
    console.log('')

    if (failed.length > 0) {
      console.log('Failed uploads:')
      failed.forEach(f => {
        console.log(`   - ${f.file}: ${f.error}`)
      })
      console.log('')
    }

    console.log('✅ Migration completed!')
    console.log('')
  } catch (error: any) {
    console.error('')
    console.error('❌ Migration failed:', error?.message || error)
    process.exit(1)
  }
}

// Run migration
migrateImages()

