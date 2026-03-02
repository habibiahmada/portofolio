/**
 * Script to test sitemap generation
 * This verifies the sitemap can be generated without errors
 */

import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.local') });

import sitemap from '../src/app/sitemap';

async function testSitemap() {
  console.log('Testing sitemap generation...\n');
  
  try {
    const entries = await sitemap();
    
    console.log(`✓ Sitemap generated successfully`);
    console.log(`✓ Total entries: ${entries.length}\n`);
    
    // Group by type
    const staticPages = entries.filter(e => 
      !e.url.includes('/articles/') || e.url.endsWith('/articles')
    );
    const articlePages = entries.filter(e => 
      e.url.includes('/articles/') && !e.url.endsWith('/articles')
    );
    
    console.log(`Static pages: ${staticPages.length}`);
    console.log(`Article pages: ${articlePages.length}\n`);
    
    // Show sample entries
    console.log('Sample static pages:');
    staticPages.slice(0, 3).forEach(entry => {
      console.log(`  - ${entry.url}`);
      const lastModified = entry.lastModified 
        ? (entry.lastModified instanceof Date 
          ? entry.lastModified.toISOString() 
          : entry.lastModified)
        : 'N/A';
      console.log(`    Last modified: ${lastModified}`);
      console.log(`    Priority: ${entry.priority}, Change frequency: ${entry.changeFrequency}`);
    });
    
    if (articlePages.length > 0) {
      console.log('\nSample article pages:');
      articlePages.slice(0, 3).forEach(entry => {
        console.log(`  - ${entry.url}`);
        const lastModified = entry.lastModified 
          ? (entry.lastModified instanceof Date 
            ? entry.lastModified.toISOString() 
            : entry.lastModified)
          : 'N/A';
        console.log(`    Last modified: ${lastModified}`);
        console.log(`    Priority: ${entry.priority}, Change frequency: ${entry.changeFrequency}`);
      });
    }
    
    // Verify all entries have required fields
    const missingFields = entries.filter(e => 
      !e.url || !e.lastModified || !e.changeFrequency || e.priority === undefined
    );
    
    if (missingFields.length > 0) {
      console.error('\n✗ Some entries are missing required fields:');
      console.error(missingFields);
      process.exit(1);
    }
    
    console.log('\n✓ All entries have required fields');
    console.log('✓ Sitemap test passed!');
    
  } catch (error) {
    console.error('✗ Error generating sitemap:', error);
    process.exit(1);
  }
}

testSitemap();
