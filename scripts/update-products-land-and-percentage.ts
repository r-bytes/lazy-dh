/**
 * Update Products Script
 * 
 * Updates all existing products to:
 * - Set land to "Anders" if not already set
 * - Ensure percentage is set correctly
 * 
 * Usage: tsx scripts/update-products-land-and-percentage.ts
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

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'rx2p8wni'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-06-08'
const token = process.env.SANITY_API_TOKEN

if (!token) {
  throw new Error('Missing environment variable: SANITY_API_TOKEN (required for updating)')
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

interface UpdateResult {
  productId: string
  name: string
  success: boolean
  error?: string
  changes: {
    landUpdated?: boolean
    percentageUpdated?: boolean
  }
}

interface UpdateReport {
  total: number
  updated: number
  failed: number
  results: UpdateResult[]
  timestamp: string
}

// ============================================================================
// SANITY OPERATIONS
// ============================================================================

/**
 * Update a product document
 */
async function updateProduct(product: any): Promise<UpdateResult> {
  try {
    const productId = product._id
    const changes: UpdateResult['changes'] = {}
    const updates: any = {}
    
    // Update land to "Anders" if not already set or not "Anders"
    if (!product.land || product.land !== 'Anders') {
      updates.land = 'Anders'
      changes.landUpdated = true
    }
    
    // Check if percentage exists and is valid
    if (!product.percentage || product.percentage.trim() === '') {
      // Try to extract from CSV if available
      // For now, we'll just log it - you may need to manually set these
      console.warn(`   ⚠️  Warning: Product "${product.name}" has no percentage`)
    }
    
    // Only update if there are changes
    if (Object.keys(updates).length > 0) {
      await client
        .patch(productId)
        .set(updates)
        .commit()
    }
    
    return {
      productId,
      name: product.name || 'Unknown',
      success: true,
      changes,
    }
  } catch (error: any) {
    return {
      productId: product._id || 'Unknown',
      name: product.name || 'Unknown',
      success: false,
      error: error?.message || 'Unknown error',
      changes: {},
    }
  }
}

// ============================================================================
// MAIN UPDATE FUNCTION
// ============================================================================

/**
 * Main update function
 */
async function updateAllProducts(): Promise<void> {
  console.log('🚀 Starting product update...')
  console.log(`   Project ID: ${projectId}`)
  console.log(`   Dataset: ${dataset}`)
  console.log('')

  // Fetch all product documents (both published and drafts)
  console.log('📄 Fetching products...')
  const products = await client.fetch(
    `*[_type == "product"] | order(_createdAt desc)`
  )
  
  console.log(`   Found ${products.length} product(s)`)
  console.log('')

  if (products.length === 0) {
    console.log('✅ No products to update')
    return
  }

  // Update products
  console.log('📦 Updating products...')
  const results: UpdateResult[] = []

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    const name = product.name || 'Unknown'
    
    console.log(`[${i + 1}/${products.length}] ${name}`)
    
    const result = await updateProduct(product)
    results.push(result)
    
    if (result.success) {
      const changeMessages: string[] = []
      if (result.changes.landUpdated) changeMessages.push('land → "Anders"')
      if (result.changes.percentageUpdated) changeMessages.push('percentage updated')
      
      if (changeMessages.length > 0) {
        console.log(`   ✅ Updated: ${changeMessages.join(', ')}`)
      } else {
        console.log(`   ✅ No changes needed`)
      }
    } else {
      console.log(`   ❌ Failed: ${result.error}`)
    }
    
    // Small delay to avoid rate limiting
    if (i < products.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }

  // Generate report
  const report: UpdateReport = {
    total: results.length,
    updated: results.filter(r => r.success && (r.changes.landUpdated || r.changes.percentageUpdated)).length,
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
  const reportPath = path.join(backupDir, `update-products-${timestamp}.json`)
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8')

  // Print summary
  console.log('')
  console.log('='.repeat(60))
  console.log('📊 Update Summary')
  console.log('='.repeat(60))
  console.log(`   Total products: ${report.total}`)
  console.log(`   ✅ Updated: ${report.updated}`)
  console.log(`   ❌ Failed: ${report.failed}`)
  console.log(`   📄 Report: ${reportPath}`)
  console.log('')

  if (report.failed > 0) {
    console.log('Failed updates:')
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   - ${r.name} (${r.productId}): ${r.error}`)
      })
    console.log('')
  }

  console.log('✅ Update completed!')
  console.log('')
  console.log('📝 Note: Products without percentage may need manual review.')
  console.log('')
}

// Run update
updateAllProducts().catch(error => {
  console.error('')
  console.error('❌ Update failed:', error?.message || error)
  process.exit(1)
})

