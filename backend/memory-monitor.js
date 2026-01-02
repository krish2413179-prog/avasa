#!/usr/bin/env node

/**
 * Memory Monitor Script
 * Monitors Node.js memory usage and helps identify leaks
 */

const http = require('http');

function formatBytes(bytes) {
  return Math.round(bytes / 1024 / 1024) + ' MB';
}

function checkMemory() {
  const usage = process.memoryUsage();
  
  console.log('\n📊 Memory Usage Report:');
  console.log(`RSS (Resident Set Size): ${formatBytes(usage.rss)}`);
  console.log(`Heap Total: ${formatBytes(usage.heapTotal)}`);
  console.log(`Heap Used: ${formatBytes(usage.heapUsed)}`);
  console.log(`External: ${formatBytes(usage.external)}`);
  console.log(`Uptime: ${Math.round(process.uptime())} seconds`);
  
  // Alert if memory usage is high
  const rssGB = usage.rss / 1024 / 1024 / 1024;
  if (rssGB > 0.5) {
    console.log(`⚠️  WARNING: High memory usage (${rssGB.toFixed(2)} GB)`);
  }
  if (rssGB > 1) {
    console.log(`🚨 CRITICAL: Very high memory usage (${rssGB.toFixed(2)} GB)`);
  }
}

function checkBackendMemory() {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/memory',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        const memoryData = JSON.parse(data);
        console.log('\n🖥️  Backend Memory Status:');
        console.log(`RSS: ${memoryData.memory.rss}`);
        console.log(`Heap Used: ${memoryData.memory.heapUsed}`);
        console.log(`Uptime: ${memoryData.uptime}`);
        console.log(`Active Intervals: ${memoryData.activeIntervals}`);
        console.log(`Active Listeners: ${memoryData.activeListeners}`);
      } catch (error) {
        console.log('❌ Could not parse backend memory data');
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Could not connect to backend:', error.message);
  });

  req.end();
}

function performCleanup() {
  console.log('\n🧹 Performing cleanup...');
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/cleanup',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log('✅', result.message);
        console.log('Memory after cleanup:', result.memoryAfterCleanup.rss);
      } catch (error) {
        console.log('❌ Could not parse cleanup response');
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Could not perform cleanup:', error.message);
  });

  req.end();
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'check':
    checkMemory();
    checkBackendMemory();
    break;
  case 'cleanup':
    performCleanup();
    break;
  case 'monitor':
    console.log('🔍 Starting memory monitor (press Ctrl+C to stop)...');
    setInterval(() => {
      checkMemory();
      checkBackendMemory();
    }, 10000); // Check every 10 seconds
    break;
  default:
    console.log('Memory Monitor Usage:');
    console.log('  node memory-monitor.js check    - Check current memory usage');
    console.log('  node memory-monitor.js cleanup  - Perform memory cleanup');
    console.log('  node memory-monitor.js monitor  - Continuous monitoring');
    break;
}