/**
 * Sanity Backup Script
 * 
 * This script exports ALL existing documents from Sanity (read-only).
 * It does NOT modify, delete, or write anything to Sanity.
 * 
 * Usage: tsx scripts/backup-sanity.ts
 */

import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'

// Import environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-06-08'

if (!projectId) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID')
}

if (!dataset) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SANITY_DATASET')
}

// Create Sanity client (read-only operations)
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Optional: only needed if dataset requires authentication
})

interface BackupResult {
  count: number
  documents: any[]
  timestamp: string
  dataset: string
  projectId: string
}

/**
 * Fetch all documents from Sanity
 */
async function fetchAllDocuments(): Promise<any[]> {
  console.log('🔍 Fetching all documents from Sanity...')
  
  // GROQ query to fetch all documents (all types)
  const query = `*[] | order(_createdAt desc)`
  
  try {
    const documents = await client.fetch(query)
    console.log(`✅ Found ${documents.length} documents`)
    return documents
  } catch (error) {
    console.error('❌ Error fetching documents:', error)
    throw error
  }
}

/**
 * Main backup function
 */
async function backupSanity(): Promise<void> {
  try {
    console.log('📦 Starting Sanity backup...')
    console.log(`   Project ID: ${projectId}`)
    console.log(`   Dataset: ${dataset}`)
    console.log(`   API Version: ${apiVersion}`)
    console.log('')

    // Fetch all documents
    const documents = await fetchAllDocuments()

    // Create backup result
    const backupResult: BackupResult = {
      count: documents.length,
      documents,
      timestamp: new Date().toISOString(),
      dataset,
      projectId,
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                      new Date().toISOString().replace(/[:.]/g, '-').split('T')[1].split('.')[0]
    const filename = `sanity-export-${timestamp}.json`
    const backupDir = path.join(process.cwd(), 'backup')
    const filepath = path.join(backupDir, filename)

    // Ensure backup directory exists
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    // Write backup to file
    fs.writeFileSync(filepath, JSON.stringify(backupResult, null, 2), 'utf-8')

    console.log('')
    console.log('✅ Backup completed successfully!')
    console.log(`   File: ${filepath}`)
    console.log(`   Documents: ${documents.length}`)
    console.log('')
  } catch (error) {
    console.error('')
    console.error('❌ Backup failed:', error)
    process.exit(1)
  }
}

// Run backup
backupSanity()

