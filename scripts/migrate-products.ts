/**
 * Product Migration Script
 * 
 * Migrates products from CSV to Sanity as DRAFT documents.
 * 
 * Features:
 * - Idempotent: safe to run multiple times
 * - Draft-only: all products created as drafts
 * - Deterministic IDs: uses CSV data for stable IDs
 * - Image upload: uploads images from local paths
 * - Data validation: validates and transforms CSV data
 * 
 * Usage: tsx scripts/migrate-products.ts
 * 
 * Environment variables required:
 * - NEXT_PUBLIC_SANITY_PROJECT_ID
 * - NEXT_PUBLIC_SANITY_DATASET
 * - SANITY_API_TOKEN (write token)
 */

import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables from .env file
try {
  const envPath = path.join(__dirname, '../.env')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8')
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        const value = match[2].trim().replace(/^["']|["']$/g, '')
        if (!process.env[key]) {
          process.env[key] = value
        }
      }
    })
  }
} catch (error) {
  // Ignore .env loading errors
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const CSV_PATH = path.join(__dirname, '../scripts/nieuwe-producten-engine/products.final.csv')
const IMAGES_BASE_DIR = path.join(__dirname, '../scripts/nieuwe-producten-engine')

// Test mode: set to number to limit imports (e.g., 1 for testing)
// Set via environment: TEST_MODE=1 tsx scripts/migrate-products.ts
// Or uncomment and set directly:
const TEST_MODE_LIMIT = process.env.TEST_MODE ? parseInt(process.env.TEST_MODE, 10) : 1 // Set to null for full migration

// Sanity configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'rx2p8wni'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-06-08'
const token = process.env.SANITY_API_TOKEN

if (!token) {
  throw new Error('Missing environment variable: SANITY_API_TOKEN (required for uploading assets)')
}

// Create Sanity client with write token
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
})

// ============================================================================
// TYPES
// ============================================================================

interface CSVRow {
  productId: string
  name: string
  volume: string
  quantityInBox: string
  percentage: string
  price: string
  category: string
  description: string
  inStock: string
  inSale: string
  isNew: string
  quantity: string
  imageFile: string
}

interface ProductData {
  name: string
  volume: string // e.g., "70cl"
  quantityInBox: number
  percentage: string // e.g., "40%"
  price: number
  category: string
  description?: string
  inStock: boolean
  inSale: boolean
  isNew: boolean
  quantity: number
  imageFile: string
}

interface MigrationResult {
  productId: string
  name: string
  success: boolean
  error?: string
  action: 'created' | 'updated' | 'skipped'
}

interface MigrationReport {
  total: number
  created: number
  updated: number
  skipped: number
  failed: number
  results: MigrationResult[]
  timestamp: string
}

// ============================================================================
// VALIDATION & TRANSFORMATION
// ============================================================================

/**
 * Valid categories from Sanity schema
 */
const VALID_CATEGORIES = ['Cognac', 'Gin', 'Jenever', 'Lavish', 'Likeur', 'Ouzo', 'Rakia', 'Rum', 'Tequila', 'Whisky', 'Wijn', 'Wodka']

/**
 * Convert volume from number (e.g., 0.7) to string format (e.g., "70cl")
 */
function convertVolume(volumeStr: string): string {
  const volume = parseFloat(volumeStr)
  if (!Number.isFinite(volume) || volume <= 0) {
    throw new Error(`Invalid volume: ${volumeStr}`)
  }
  
  // Convert to cl (centiliters)
  const cl = Math.round(volume * 100)
  return `${cl}cl`
}

/**
 * Convert percentage from number (e.g., 40) to string format (e.g., "40%")
 */
function convertPercentage(percentageStr: string): string {
  const percentage = parseFloat(percentageStr)
  if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
    throw new Error(`Invalid percentage: ${percentageStr}`)
  }
  
  // Handle decimal percentages (e.g., 12.5 -> "12.5%")
  if (percentage % 1 === 0) {
    return `${Math.round(percentage)}%`
  }
  return `${percentage}%`
}

/**
 * Generate deterministic product ID from CSV data
 */
function generateProductId(row: CSVRow, index: number): string {
  // If productId exists in CSV, use it
  if (row.productId && row.productId.trim() !== '') {
    return `product-${row.productId.trim()}`
  }
  
  // Otherwise, generate from name + volume + percentage
  const nameSlug = row.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 30)
  const volume = convertVolume(row.volume).replace('cl', '')
  const percentage = row.percentage.replace('.', '-').replace('%', '')
  
  return `product-${nameSlug}-${volume}cl-${percentage}pct`
}

/**
 * Parse and validate CSV row
 */
function parseRow(row: CSVRow, index: number): ProductData {
  try {
    const volume = convertVolume(row.volume)
    const percentage = convertPercentage(row.percentage)
    const quantityInBox = parseInt(row.quantityInBox, 10)
    const price = parseFloat(row.price)
    
    if (!Number.isFinite(quantityInBox) || quantityInBox < 1) {
      throw new Error(`Invalid quantityInBox: ${row.quantityInBox}`)
    }
    
    if (!Number.isFinite(price) || price < 0) {
      throw new Error(`Invalid price: ${row.price}`)
    }
    
    // Validate category
    const category = row.category.trim()
    if (!category) {
      throw new Error('Category is required')
    }
    if (!VALID_CATEGORIES.includes(category)) {
      console.warn(`⚠️  Warning: Category "${category}" not in valid list. Using as-is.`)
    }
    
    // Parse booleans - if empty, default to true for inStock and isNew, false for inSale
    const inStockValue = row.inStock.trim()
    const inStock = inStockValue === '' ? true : (inStockValue.toLowerCase() === 'true' || inStockValue === '1')
    
    const inSaleValue = row.inSale.trim()
    const inSale = inSaleValue === '' ? false : (inSaleValue.toLowerCase() === 'true' || inSaleValue === '1')
    
    const isNewValue = row.isNew.trim()
    const isNew = isNewValue === '' ? true : (isNewValue.toLowerCase() === 'true' || isNewValue === '1')
    
    // Quantity defaults to 0
    const quantity = row.quantity.trim() !== '' ? parseInt(row.quantity, 10) : 0
    if (!Number.isFinite(quantity)) {
      throw new Error(`Invalid quantity: ${row.quantity}`)
    }
    
    // Description is optional
    const description = row.description.trim() || undefined
    
    // Image file path
    let imageFile = row.imageFile.trim()
    if (imageFile.startsWith('./')) {
      imageFile = imageFile.substring(2)
    }
    const imagePath = path.join(IMAGES_BASE_DIR, imageFile)
    
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`)
    }
    
    return {
      name: row.name.trim(),
      volume,
      quantityInBox,
      percentage,
      price,
      category,
      description,
      inStock,
      inSale,
      isNew,
      quantity,
      imageFile: imagePath,
    }
  } catch (error: any) {
    throw new Error(`Row ${index + 1}: ${error.message}`)
  }
}

// ============================================================================
// SANITY OPERATIONS
// ============================================================================

/**
 * Check if a draft document exists
 */
async function draftExists(draftId: string): Promise<boolean> {
  try {
    const doc = await client.getDocument(draftId)
    return !!doc
  } catch (error: any) {
    if (error.statusCode === 404) {
      return false
    }
    throw error
  }
}

/**
 * Upload image to Sanity and return asset ID
 */
async function uploadImage(imagePath: string): Promise<string> {
  const filename = path.basename(imagePath)
  const ext = path.extname(imagePath).toLowerCase()
  
  // Check if asset already exists by filename
  const existingAssets = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]`,
    { filename }
  )
  
  if (existingAssets) {
    console.log(`   📷 Image already exists: ${filename} → ${existingAssets._id}`)
    return existingAssets._id
  }
  
  // Read file buffer
  const buffer = fs.readFileSync(imagePath)
  
  // Determine content type
  const contentTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  }
  const contentType = contentTypes[ext] || 'image/jpeg'
  
  // Upload asset
  const asset = await client.assets.upload('image', buffer, {
    filename,
    contentType,
  })
  
  // Update asset metadata
  await client
    .patch(asset._id)
    .set({
      originalFilename: filename,
      title: path.basename(imagePath, ext),
    })
    .commit()
  
  console.log(`   📷 Image uploaded: ${filename} → ${asset._id}`)
  return asset._id
}

/**
 * Create or update product document
 */
async function upsertProduct(
  productId: string,
  data: ProductData,
  imageAssetId: string
): Promise<MigrationResult> {
  const draftId = `drafts.${productId}`
  
  try {
    const exists = await draftExists(draftId)
    
    const productDoc = {
      _id: draftId,
      _type: 'product',
      name: data.name,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAssetId,
        },
      },
      category: data.category,
      volume: data.volume,
      percentage: data.percentage,
      quantityInBox: data.quantityInBox,
      quantity: data.quantity,
      price: data.price,
      inStock: data.inStock,
      inSale: data.inSale,
      isNew: data.isNew,
      ...(data.description && { description: data.description }),
    }
    
    if (exists) {
      // Update existing draft
      await client
        .patch(draftId)
        .set(productDoc)
        .commit()
      
      return {
        productId,
        name: data.name,
        success: true,
        action: 'updated',
      }
    } else {
      // Create new draft
      await client.create(productDoc)
      
      return {
        productId,
        name: data.name,
        success: true,
        action: 'created',
      }
    }
  } catch (error: any) {
    return {
      productId,
      name: data.name,
      success: false,
      error: error?.message || 'Unknown error',
      action: 'skipped',
    }
  }
}

// ============================================================================
// MAIN MIGRATION
// ============================================================================

/**
 * Simple CSV parser that handles quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i++ // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  // Add last field
  result.push(current.trim())
  
  return result
}

/**
 * Parse CSV content
 */
function parseCSV(csvContent: string): CSVRow[] {
  const lines = csvContent.split('\n').filter(line => line.trim() !== '')
  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header and one data row')
  }
  
  // Parse header
  const header = parseCSVLine(lines[0])
  
  // Parse rows
  const rows: CSVRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const row: any = {}
    header.forEach((key, index) => {
      row[key] = values[index] || ''
    })
    rows.push(row as CSVRow)
  }
  
  return rows
}

/**
 * Load and parse CSV file
 */
function loadCSV(): CSVRow[] {
  if (!fs.existsSync(CSV_PATH)) {
    throw new Error(`CSV file not found: ${CSV_PATH}`)
  }
  
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8')
  return parseCSV(csvContent)
}

/**
 * Main migration function
 */
async function migrateProducts(): Promise<void> {
  console.log('🚀 Starting product migration...')
  console.log(`   Project ID: ${projectId}`)
  console.log(`   Dataset: ${dataset}`)
  console.log(`   CSV Path: ${CSV_PATH}`)
  if (TEST_MODE_LIMIT) {
    console.log(`   ⚠️  TEST MODE: Limiting to ${TEST_MODE_LIMIT} product(s)`)
  }
  console.log('')
  
  // Load CSV
  console.log('📄 Loading CSV file...')
  const rows = loadCSV()
  console.log(`   Found ${rows.length} product(s)`)
  console.log('')
  
  // Parse and validate rows
  console.log('🔍 Parsing and validating data...')
  const products: Array<{ productId: string; data: ProductData }> = []
  const errors: Array<{ index: number; error: string }> = []
  
  for (let i = 0; i < rows.length; i++) {
    try {
      const productId = generateProductId(rows[i], i)
      const data = parseRow(rows[i], i)
      products.push({ productId, data })
    } catch (error: any) {
      errors.push({ index: i + 1, error: error.message })
      console.error(`   ❌ Row ${i + 1}: ${error.message}`)
    }
  }
  
  if (errors.length > 0) {
    console.log(`\n⚠️  ${errors.length} row(s) had errors and were skipped`)
  }
  
  console.log(`   Valid products: ${products.length}`)
  
  // Apply test mode limit if set
  const productsToMigrate = TEST_MODE_LIMIT 
    ? products.slice(0, TEST_MODE_LIMIT)
    : products
  
  if (TEST_MODE_LIMIT && productsToMigrate.length < products.length) {
    console.log(`   ⚠️  TEST MODE: Only migrating first ${productsToMigrate.length} product(s)`)
  }
  console.log('')
  
  if (productsToMigrate.length === 0) {
    console.log('❌ No valid products to migrate')
    return
  }
  
  // Migrate products
  console.log('📦 Migrating products...')
  const results: MigrationResult[] = []
  
  for (let i = 0; i < productsToMigrate.length; i++) {
    const { productId, data } = productsToMigrate[i]
    console.log(`[${i + 1}/${products.length}] ${data.name}`)
    
    try {
      // Upload image
      const imageAssetId = await uploadImage(data.imageFile)
      
      // Create or update product
      const result = await upsertProduct(productId, data, imageAssetId)
      results.push(result)
      
      if (result.success) {
        console.log(`   ✅ ${result.action === 'created' ? 'Created' : 'Updated'} draft: ${productId}`)
      } else {
        console.log(`   ❌ Failed: ${result.error}`)
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Unknown error'
      console.log(`   ❌ Error: ${errorMsg}`)
      results.push({
        productId,
        name: data.name,
        success: false,
        error: errorMsg,
        action: 'skipped',
      })
    }
    
    // Small delay to avoid rate limiting
    if (i < productsToMigrate.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }
  
  // Generate report
  const report: MigrationReport = {
    total: results.length,
    created: results.filter(r => r.success && r.action === 'created').length,
    updated: results.filter(r => r.success && r.action === 'updated').length,
    skipped: results.filter(r => !r.success).length,
    failed: results.filter(r => !r.success).length,
    results,
    timestamp: new Date().toISOString(),
  }
  
  // Save report
  const backupDir = path.join(process.cwd(), 'backup')
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
  const reportPath = path.join(backupDir, `product-migration-${timestamp}.json`)
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8')
  
  // Print summary
  console.log('')
  console.log('='.repeat(60))
  console.log('📊 Migration Summary')
  console.log('='.repeat(60))
  console.log(`   Total products: ${report.total}`)
  console.log(`   ✅ Created: ${report.created}`)
  console.log(`   🔄 Updated: ${report.updated}`)
  console.log(`   ❌ Failed: ${report.failed}`)
  console.log(`   📄 Report: ${reportPath}`)
  console.log('')
  
  if (report.failed > 0) {
    console.log('Failed products:')
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   - ${r.name} (${r.productId}): ${r.error}`)
      })
    console.log('')
  }
  
  console.log('✅ Migration completed!')
  console.log('')
  console.log('📝 Note: All products were created as DRAFTS.')
  console.log('   Review and publish them in Sanity Studio.')
  console.log('')
}

// Run migration
migrateProducts().catch(error => {
  console.error('')
  console.error('❌ Migration failed:', error?.message || error)
  process.exit(1)
})

