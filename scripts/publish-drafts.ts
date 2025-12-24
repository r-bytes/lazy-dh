/**
 * Publish Drafts Script
 * 
 * Publishes all draft product documents in Sanity to make them live.
 * 
 * Usage: tsx scripts/publish-drafts.ts
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
  throw new Error('Missing environment variable: SANITY_API_TOKEN (required for publishing)')
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

interface PublishResult {
  draftId: string
  publishedId: string
  name: string
  success: boolean
  error?: string
}

interface PublishReport {
  total: number
  published: number
  failed: number
  results: PublishResult[]
  timestamp: string
}

// ============================================================================
// SANITY OPERATIONS
// ============================================================================

/**
 * Publish a draft document
 */
async function publishDraft(draftId: string): Promise<PublishResult> {
  try {
    // Get the draft document
    const draft = await client.getDocument(draftId)
    
    if (!draft) {
      return {
        draftId,
        publishedId: '',
        name: 'Unknown',
        success: false,
        error: 'Draft not found',
      }
    }

    const publishedId = draftId.replace('drafts.', '')
    
    // Check if published version already exists
    let publishedExists = false
    try {
      const published = await client.getDocument(publishedId)
      publishedExists = !!published
    } catch (error: any) {
      if (error.statusCode !== 404) {
        throw error
      }
    }

    if (publishedExists) {
      // Update existing published document
      await client
        .patch(publishedId)
        .set(draft)
        .commit()
    } else {
      // Create new published document
      const publishedDoc = {
        ...draft,
        _id: publishedId,
      }
      delete publishedDoc._rev
      await client.create(publishedDoc)
    }

    return {
      draftId,
      publishedId,
      name: draft.name || 'Unknown',
      success: true,
    }
  } catch (error: any) {
    return {
      draftId,
      publishedId: '',
      name: 'Unknown',
      success: false,
      error: error?.message || 'Unknown error',
    }
  }
}

// ============================================================================
// MAIN PUBLISH FUNCTION
// ============================================================================

/**
 * Main publish function
 */
async function publishAllDrafts(): Promise<void> {
  console.log('🚀 Starting draft publication...')
  console.log(`   Project ID: ${projectId}`)
  console.log(`   Dataset: ${dataset}`)
  console.log('')

  // Fetch all draft product documents
  console.log('📄 Fetching draft products...')
  const drafts = await client.fetch(
    `*[_type == "product" && _id match "drafts.*"] | order(_createdAt desc)`
  )
  
  console.log(`   Found ${drafts.length} draft product(s)`)
  console.log('')

  if (drafts.length === 0) {
    console.log('✅ No drafts to publish')
    return
  }

  // Publish drafts
  console.log('📦 Publishing drafts...')
  const results: PublishResult[] = []

  for (let i = 0; i < drafts.length; i++) {
    const draft = drafts[i]
    const draftId = draft._id
    const name = draft.name || 'Unknown'
    
    console.log(`[${i + 1}/${drafts.length}] ${name}`)
    
    const result = await publishDraft(draftId)
    results.push(result)
    
    if (result.success) {
      console.log(`   ✅ Published: ${result.publishedId}`)
    } else {
      console.log(`   ❌ Failed: ${result.error}`)
    }
    
    // Small delay to avoid rate limiting
    if (i < drafts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }

  // Generate report
  const report: PublishReport = {
    total: results.length,
    published: results.filter(r => r.success).length,
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
  const reportPath = path.join(backupDir, `publish-drafts-${timestamp}.json`)
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8')

  // Print summary
  console.log('')
  console.log('='.repeat(60))
  console.log('📊 Publication Summary')
  console.log('='.repeat(60))
  console.log(`   Total drafts: ${report.total}`)
  console.log(`   ✅ Published: ${report.published}`)
  console.log(`   ❌ Failed: ${report.failed}`)
  console.log(`   📄 Report: ${reportPath}`)
  console.log('')

  if (report.failed > 0) {
    console.log('Failed publications:')
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   - ${r.name} (${r.draftId}): ${r.error}`)
      })
    console.log('')
  }

  console.log('✅ Publication completed!')
  console.log('')
}

// Run publication
publishAllDrafts().catch(error => {
  console.error('')
  console.error('❌ Publication failed:', error?.message || error)
  process.exit(1)
})

