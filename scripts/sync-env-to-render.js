#!/usr/bin/env node
/**
 * Sync GitHub Secrets to Render Environment Variables
 * Run this script when you update secrets to keep Render in sync
 */

import fetch from 'node-fetch';

const RENDER_API_KEY = process.env.RENDER_API_KEY;
const RENDER_SERVICE_ID = process.env.RENDER_SERVICE_ID;

if (!RENDER_API_KEY || !RENDER_SERVICE_ID) {
  console.error('❌ Missing RENDER_API_KEY or RENDER_SERVICE_ID');
  process.exit(1);
}

const envVars = {
  GIT_REGISTRY_TOKEN: process.env.GIT_REGISTRY_TOKEN,
  GRAPHQL_BAPHOMET_SERVER_RENDER_URL: process.env.GRAPHQL_BAPHOMET_SERVER_RENDER_URL || 'https://baphomet-server.onrender.com/graphql'
};

async function syncEnvVars() {
  console.log('🔄 Syncing environment variables to Render...');
  
  for (const [key, value] of Object.entries(envVars)) {
    if (!value) {
      console.warn(`⚠️  Skipping ${key} - no value provided`);
      continue;
    }

    try {
      const response = await fetch(`https://api.render.com/v1/services/${RENDER_SERVICE_ID}/env-vars`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RENDER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key,
          value
        })
      });

      if (response.ok) {
        console.log(`✅ Updated ${key}`);
      } else {
        // Try to update existing env var
        const updateResponse = await fetch(`https://api.render.com/v1/services/${RENDER_SERVICE_ID}/env-vars/${key}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${RENDER_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ value })
        });

        if (updateResponse.ok) {
          console.log(`✅ Updated existing ${key}`);
        } else {
          console.error(`❌ Failed to update ${key}:`, await updateResponse.text());
        }
      }
    } catch (error) {
      console.error(`❌ Error updating ${key}:`, error.message);
    }
  }

  console.log('🎉 Environment sync complete!');
}

syncEnvVars();
