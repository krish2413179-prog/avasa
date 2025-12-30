#!/bin/bash

# 🚀 Initialize Envio Real-Time Financial Engine
# This script sets up the Envio indexer for zero-latency financial data

echo "🚀 Initializing Envio Real-Time Financial Engine..."

# Check if we're in the right directory
if [ ! -d "envio" ]; then
    echo "❌ Error: envio directory not found. Please run this script from the project root."
    exit 1
fi

cd envio

echo "📦 Installing Envio dependencies..."
npm install

echo "🔧 Generating TypeScript types from schema..."
npx envio codegen

echo "🏗️ Building the indexer..."
npx envio build

echo "🚀 Starting Envio indexer in development mode..."
echo "📊 GraphQL endpoint will be available at: http://localhost:8080/v1/graphql"
echo "🎯 This will index all AutoRecurringPayments events and transform them into financial intelligence"
echo ""
echo "⚡ Features enabled:"
echo "  • Zero-latency payment schedule queries"
echo "  • Real-time credit score tracking"
echo "  • Property performance analytics"
echo "  • User portfolio intelligence"
echo "  • Global protocol statistics"
echo ""
echo "🎮 To start the indexer, run:"
echo "  npx envio dev"
echo ""
echo "🔗 To start the backend with Envio integration:"
echo "  cd ../backend && npm run dev-engine"
echo ""
echo "✅ Envio Real-Time Financial Engine is ready!"
echo "🎯 This transforms your backend from a 'transaction pusher' to a high-performance financial intelligence system"