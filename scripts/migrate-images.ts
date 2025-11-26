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
const IMAGES_DIR = '/Users/rvelse/Desktop/personal/lazo/lazo-nieuweproducten/test'

// Default product values (can be customized)
const DEFAULT_PRODUCT_VALUES = {
  category: '', // Options: Likeur, Ouzo, Rakia, Whisky, Wijn, Wodka
  land: 'Polen', // Options: Bulgarije, Griekenland, Polen
  price: 0, // Default price (you can change this)
  volume: '70cl', // Options: 20cl, 50cl, 70cl, 100cl, 175cl, 200cl
  percentage: '40%', // Options: 12%, 25%, 35%, 36%, 37.5%, 38%, 40%, 42.5%, 43%, 47%
  quantityInBox: 6,
  inStock: true,
  inSale: false,
  isNew: true, // Set to true for new products
  draft: true,
}

// Import environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'rx2p8wni'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-06-08'
const token = process.env.SANITY_API_TOKEN || 'skAKbEBNaX9WBlNIdQFQfgxdxd6wc7kzt9zyDlxhIL5zIMYq5JGBktcSgpXx2mKlte5JZBS2O4erqYBTI8Vd9lYC9UBxZgqnzxySbkaZy1gnwd4943Avwnri5Fm6GPXSfp2Fje6X1O2SLgKniHZT1Mw8fXR14EuafZO7aAg0SQCNIwi2cdMK'

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
  productId: string | null
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
    productId: string
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
 * Get the highest productId from existing products
 */
async function getNextProductId(): Promise<number> {
  try {
    const query = `*[_type == "product"] | order(productId desc) [0].productId`
    const maxProductId = await client.fetch(query)
    return maxProductId ? maxProductId + 1 : 1
  } catch (error) {
    console.warn('⚠️  Could not fetch max productId, starting from 1')
    return 1
  }
}

/**
 * Create a product document in Sanity
 */
async function createProduct(
  assetId: string,
  productName: string,
  productId: number
): Promise<string | null> {
  try {
    // Generate a unique ID for the product
    // If draft is true, prefix with "drafts." to make it unpublished
    const baseId = `product-${productId}-${Date.now()}`
    const documentId = DEFAULT_PRODUCT_VALUES.draft ? `drafts.${baseId}` : baseId

    const product = {
      _id: documentId,
      _type: 'product',
      name: productName,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: assetId,
        },
      },
      category: DEFAULT_PRODUCT_VALUES.category || undefined,
      land: DEFAULT_PRODUCT_VALUES.land || undefined,
      price: DEFAULT_PRODUCT_VALUES.price,
      volume: DEFAULT_PRODUCT_VALUES.volume,
      percentage: DEFAULT_PRODUCT_VALUES.percentage,
      quantityInBox: DEFAULT_PRODUCT_VALUES.quantityInBox,
      quantity: 0,
      productId: productId,
      inStock: DEFAULT_PRODUCT_VALUES.inStock,
      inSale: DEFAULT_PRODUCT_VALUES.inSale,
      isNew: DEFAULT_PRODUCT_VALUES.isNew,
    }

    const created = await client.create(product)
    const status = DEFAULT_PRODUCT_VALUES.draft ? 'draft (unpublished)' : 'published'
    console.log(`   📝 Created as ${status}`)
    return created._id
  } catch (error: any) {
    console.error(`   ❌ Failed to create product: ${error?.message || 'Unknown error'}`)
    return null
  }
}

/**
 * Upload a single image to Sanity and create a product
 */
async function uploadImageAndCreateProduct(
  filepath: string,
  nextProductId: number
): Promise<UploadResult> {
  const filename = path.basename(filepath)
  const productName = getFilenameWithoutExtension(filepath)

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
        title: productName,
      })
      .commit()

    console.log(`   ✅ Image uploaded: ${filename} → ${asset._id}`)

    // Create product document
    console.log(`   📦 Creating product: ${productName}...`)
    const productId = await createProduct(asset._id, productName, nextProductId)

    if (!productId) {
      return {
        file: filename,
        assetId: asset._id,
        productId: null,
        success: false,
        error: 'Failed to create product document',
      }
    }

    console.log(`   ✅ Product created: ${productName} → ${productId}`)
    
    return {
      file: filename,
      assetId: asset._id,
      productId: productId,
      success: true,
    }
  } catch (error: any) {
    const errorMessage = error?.message || 'Unknown error'
    console.error(`   ❌ Failed: ${filename} - ${errorMessage}`)
    
    return {
      file: filename,
      assetId: null,
      productId: null,
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
    if (!IMAGES_DIR || IMAGES_DIR.trim() === '') {
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

    // Get the next productId to use
    console.log('🔍 Getting next productId...')
    let currentProductId = await getNextProductId()
    console.log(`   Starting from productId: ${currentProductId}`)
    console.log('')

    // Upload each image and create product
    const results: UploadResult[] = []
    
    for (let i = 0; i < imageFiles.length; i++) {
      const filepath = imageFiles[i]
      console.log(`[${i + 1}/${imageFiles.length}]`)
      const result = await uploadImageAndCreateProduct(filepath, currentProductId)
      results.push(result)
      
      // Increment productId for next product
      if (result.success) {
        currentProductId++
      }
      
      // Small delay to avoid rate limiting
      if (i < imageFiles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200))
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
        productId: r.productId!,
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

