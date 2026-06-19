import fs from 'node:fs/promises';

/**
 * indexnow-ping.mjs
 * Notifies IndexNow participating search engines about updated content.
 */

async function ping() {
  console.log('Pinging IndexNow...');

  try {
    // In a real production environment, you would read the site URL 
    // and the list of updated URLs from a manifest or build output.
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ziweidoushu.com'; // Replace with actual domain
    const KEY_FILE = '.well-known/indexnow.txt'; 
    
    // We check for the existence of a key file or use an env var
    let apiKey = process.env.INDEXNOW_KEY;
    if (!apiKey) {
      try {
        apiKey = await fs.readFile(KEY_FILE, 'utf8');
      } catch (e) {
        console.warn('⚠️ IndexNow key not found in .well-known/indexnow.txt or INDEXNOW_KEY env var. Skipping ping.');
        return;
      }
    }

    // Example endpoints for IndexNow (Bing and Yandex)
    const ENDPOINTS = [
      `https://www.bing.com/indexnow?url=${SITE_URL}&key=${apiKey}`,
      `https://yandex.com/indexnow?url=${SITE_URL}&key=${apiKey}`
    ];

    for (const endpoint of ENDPOINTS) {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          console.log(`✅ Successfully pinged: ${new URL(endpoint).hostname}`);
        } else {
          console.error(`❌ Failed to ping ${new URL(endpoint).hostname}: ${response.status}`);
        }
      } catch (err) {
        console.error(`❌ Network error pinging ${endpoint}:`, err.message);
      }
    }
  } catch (criticalErr) {
    console.error('💥 Critical error during IndexNow ping:', criticalErr);
    // We don't exit(1) here because we don't want a failed SEO ping to fail the entire build/deploy process
  }
}

ping();
