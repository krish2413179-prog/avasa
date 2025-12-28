# 🚀 PropChain AI Envio Indexer - Deployment Guide

This guide walks you through deploying the award-winning PropChain AI Envio indexer for production use.

## 📋 **Prerequisites**

### **System Requirements**
- Node.js 18+ 
- npm or yarn
- Git
- Envio CLI

### **Install Envio CLI**
```bash
npm install -g envio
```

### **Verify Installation**
```bash
envio --version
```

## 🔧 **Local Development Setup**

### **1. Clone Repository**
```bash
git clone <repository-url>
cd envio
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Generate Types**
```bash
envio codegen
```

### **4. Start Development Server**
```bash
envio dev
```

The indexer will start syncing from Base Sepolia and provide a GraphQL endpoint at `http://localhost:8080`.

## 🌐 **Production Deployment**

### **Option 1: Envio Cloud (Recommended)**

#### **1. Build for Production**
```bash
envio build
```

#### **2. Deploy to Envio Cloud**
```bash
envio deploy
```

#### **3. Configure Environment**
- Set up monitoring alerts
- Configure backup strategies
- Set up access controls

### **Option 2: Self-Hosted Deployment**

#### **1. Prepare Production Environment**
```bash
# Install Docker (if using containerization)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Or install Node.js directly
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### **2. Build Application**
```bash
npm run build
```

#### **3. Start Production Server**
```bash
npm run start
```

#### **4. Set Up Process Management**
```bash
# Using PM2
npm install -g pm2
pm2 start npm --name "propchain-indexer" -- run start
pm2 save
pm2 startup
```

## 🔍 **Configuration**

### **Environment Variables**
```bash
# .env file
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://user:pass@localhost:5432/propchain_indexer
REDIS_URL=redis://localhost:6379
LOG_LEVEL=info
```

### **Network Configuration**
The indexer is configured for Base Sepolia (Chain ID: 84532). To change networks, update `config.yaml`:

```yaml
networks:
  - id: 8453 # Base Mainnet
    start_block: 0
    # ... rest of configuration
```

### **Contract Addresses**
Current deployed contracts on Base Sepolia:
- **AutoRecurringPayments**: `0x6cB93c4538E7166F3E8c64bA654Ec13b9fB74C96`
- **SimpleSwapPool**: `0xCe3bf5DEd091c822193F14502B724a1bf1040E5C`
- **USDC Token**: `0x6B0dacea6a72E759243c99Eaed840DEe9564C194`

## 📊 **Monitoring & Analytics**

### **Health Checks**
```bash
# Check indexer status
curl http://localhost:8080/health

# Check GraphQL endpoint
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ _meta { block { number } } }"}'
```

### **Performance Monitoring**
```bash
# Monitor sync status
curl http://localhost:8080/metrics

# Check database performance
curl http://localhost:8080/stats
```

### **Log Analysis**
```bash
# View real-time logs
tail -f logs/indexer.log

# Search for specific events
grep "PaymentExecuted" logs/indexer.log

# Monitor error rates
grep "ERROR" logs/indexer.log | wc -l
```

## 🔒 **Security Configuration**

### **API Security**
```yaml
# Add to config.yaml
security:
  cors:
    enabled: true
    origins: ["https://your-frontend.com"]
  rate_limiting:
    enabled: true
    requests_per_minute: 1000
  authentication:
    enabled: true
    jwt_secret: "your-secret-key"
```

### **Database Security**
```bash
# PostgreSQL security
sudo -u postgres psql
CREATE USER propchain_indexer WITH PASSWORD 'secure_password';
CREATE DATABASE propchain_indexer OWNER propchain_indexer;
GRANT ALL PRIVILEGES ON DATABASE propchain_indexer TO propchain_indexer;
```

### **Network Security**
```bash
# Firewall configuration
sudo ufw allow 22/tcp
sudo ufw allow 8080/tcp
sudo ufw enable

# SSL/TLS setup (using Let's Encrypt)
sudo apt install certbot
sudo certbot --nginx -d your-domain.com
```

## 📈 **Scaling Configuration**

### **Horizontal Scaling**
```yaml
# docker-compose.yml
version: '3.8'
services:
  indexer:
    image: propchain-indexer:latest
    replicas: 3
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    ports:
      - "8080-8082:8080"
    
  load_balancer:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

### **Database Optimization**
```sql
-- PostgreSQL optimization
CREATE INDEX CONCURRENTLY idx_payment_executions_timestamp 
ON payment_executions(timestamp);

CREATE INDEX CONCURRENTLY idx_swap_executions_user_timestamp 
ON swap_executions(user, timestamp);

CREATE INDEX CONCURRENTLY idx_user_portfolios_user 
ON user_portfolios(user);

-- Partitioning for large tables
CREATE TABLE payment_executions_2024 PARTITION OF payment_executions
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

### **Caching Strategy**
```bash
# Redis configuration
redis-cli CONFIG SET maxmemory 2gb
redis-cli CONFIG SET maxmemory-policy allkeys-lru

# Cache frequently accessed queries
redis-cli SET "top_executors" "$(curl -s http://localhost:8080/graphql -d '{"query":"..."}')"
redis-cli EXPIRE "top_executors" 300
```

## 🚨 **Backup & Recovery**

### **Database Backup**
```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump propchain_indexer > backup_${DATE}.sql
aws s3 cp backup_${DATE}.sql s3://propchain-backups/

# Schedule with cron
0 2 * * * /path/to/backup_script.sh
```

### **Configuration Backup**
```bash
# Backup configuration files
tar -czf config_backup_$(date +%Y%m%d).tar.gz \
  config.yaml \
  schema.graphql \
  src/ \
  package.json

# Store in version control
git add .
git commit -m "Production configuration backup"
git push origin production
```

## 🔄 **Deployment Pipeline**

### **CI/CD with GitHub Actions**
```yaml
# .github/workflows/deploy.yml
name: Deploy PropChain Indexer

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Generate types
        run: envio codegen
        
      - name: Build
        run: envio build
        
      - name: Deploy
        run: envio deploy
        env:
          ENVIO_API_KEY: ${{ secrets.ENVIO_API_KEY }}
```

### **Blue-Green Deployment**
```bash
# Deploy to staging
envio deploy --environment staging

# Run health checks
./scripts/health_check.sh staging

# Switch traffic to new version
envio promote --from staging --to production

# Rollback if needed
envio rollback --environment production
```

## 📊 **Performance Optimization**

### **Query Optimization**
```graphql
# Use pagination for large datasets
query OptimizedQuery($first: Int!, $skip: Int!) {
  paymentExecutions(
    first: $first
    skip: $skip
    orderBy: timestamp
    orderDirection: desc
  ) {
    id
    timestamp
    amount
  }
}
```

### **Indexing Strategy**
```sql
-- Composite indexes for common queries
CREATE INDEX idx_payment_executions_payer_timestamp 
ON payment_executions(payer, timestamp DESC);

CREATE INDEX idx_swap_executions_type_timestamp 
ON swap_executions(swap_type, timestamp DESC);
```

### **Memory Optimization**
```yaml
# config.yaml
performance:
  batch_size: 1000
  max_concurrent_requests: 100
  cache_ttl: 300
  memory_limit: "2GB"
```

## 🎯 **Production Checklist**

### **Pre-Deployment**
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] Backup strategy implemented
- [ ] Monitoring configured
- [ ] Documentation updated

### **Post-Deployment**
- [ ] Health checks passing
- [ ] Metrics collection active
- [ ] Error rates within acceptable limits
- [ ] GraphQL endpoint responsive
- [ ] Data integrity verified
- [ ] Team notified of deployment

### **Ongoing Maintenance**
- [ ] Regular backup verification
- [ ] Performance monitoring
- [ ] Security updates
- [ ] Capacity planning
- [ ] Documentation updates
- [ ] Team training

---

**🏆 Your award-winning PropChain AI Envio indexer is now ready for production!**

For support and questions, please refer to the [Envio Documentation](https://docs.envio.dev) or contact the PropChain AI team.