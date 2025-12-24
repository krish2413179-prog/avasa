import sqlite3 from 'sqlite3'
import { promisify } from 'util'

const DB_PATH = process.env.DB_URL || './database.sqlite'

let db: sqlite3.Database

export function initDatabase() {
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Database connection error:', err)
    } else {
      console.log('Connected to SQLite database')
      createTables()
    }
  })
}

function createTables() {
  const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_address TEXT NOT NULL,
      action_type TEXT NOT NULL,
      action_params TEXT NOT NULL,
      permission_context TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      next_execution_time DATETIME,
      executed_at DATETIME,
      tx_hash TEXT,
      error_message TEXT
    )
  `

  const createSessionKeysTable = `
    CREATE TABLE IF NOT EXISTS session_keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_address TEXT NOT NULL,
      session_key TEXT NOT NULL,
      permissions TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT 1
    )
  `

  const createAdvancedPermissionsTable = `
    CREATE TABLE IF NOT EXISTS advanced_permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_address TEXT NOT NULL,
      permission_type TEXT NOT NULL,
      contract_address TEXT NOT NULL,
      allowed_methods TEXT NOT NULL,
      restrictions TEXT NOT NULL,
      policies TEXT NOT NULL,
      duration INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      description TEXT
    )
  `

  const createPermissionExecutionsTable = `
    CREATE TABLE IF NOT EXISTS permission_executions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      permission_id INTEGER NOT NULL,
      user_address TEXT NOT NULL,
      contract_address TEXT NOT NULL,
      method_name TEXT NOT NULL,
      value TEXT NOT NULL,
      tx_hash TEXT,
      executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      success BOOLEAN NOT NULL,
      error_message TEXT,
      FOREIGN KEY (permission_id) REFERENCES advanced_permissions (id)
    )
  `

  const createDCAHistoryTable = `
    CREATE TABLE IF NOT EXISTS dca_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_address TEXT NOT NULL,
      property_id TEXT NOT NULL,
      amount TEXT NOT NULL,
      price_per_share TEXT NOT NULL,
      shares_acquired TEXT NOT NULL,
      tx_hash TEXT,
      executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `

  const createRebalanceHistoryTable = `
    CREATE TABLE IF NOT EXISTS rebalance_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_address TEXT NOT NULL,
      permission_id INTEGER,
      last_rebalance_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      target_allocations TEXT NOT NULL,
      actual_allocations TEXT NOT NULL,
      trades_executed INTEGER DEFAULT 0,
      FOREIGN KEY (permission_id) REFERENCES advanced_permissions (id)
    )
  `

  db.run(createOrdersTable, (err) => {
    if (err) console.error('Error creating orders table:', err)
  })

  db.run(createSessionKeysTable, (err) => {
    if (err) console.error('Error creating session_keys table:', err)
  })

  db.run(createAdvancedPermissionsTable, (err) => {
    if (err) console.error('Error creating advanced_permissions table:', err)
  })

  db.run(createPermissionExecutionsTable, (err) => {
    if (err) console.error('Error creating permission_executions table:', err)
  })

  db.run(createDCAHistoryTable, (err) => {
    if (err) console.error('Error creating dca_history table:', err)
  })

  db.run(createRebalanceHistoryTable, (err) => {
    if (err) console.error('Error creating rebalance_history table:', err)
  })
}

export interface Order {
  id?: number
  userAddress: string
  actionType: string
  actionParams: string
  permissionContext: string
  status: 'pending' | 'executing' | 'completed' | 'failed'
  createdAt?: string
  nextExecutionTime?: string
  executedAt?: string
  txHash?: string
  errorMessage?: string
}

export interface AdvancedPermission {
  id?: number
  userAddress: string
  permissionType: 'yield_farmer' | 'smart_dca' | 'emergency_brake'
  contractAddress: string
  allowedMethods: string
  restrictions: string
  policies: string
  duration: number
  createdAt?: string
  expiresAt: string
  isActive: boolean
  description?: string
}

export interface PermissionExecution {
  id?: number
  permissionId: number
  userAddress: string
  contractAddress: string
  methodName: string
  value: string
  txHash?: string
  executedAt?: string
  success: boolean
  errorMessage?: string
}

export interface DCAHistory {
  id?: number
  userAddress: string
  propertyId: string
  amount: string
  pricePerShare: string
  sharesAcquired: string
  txHash?: string
  executedAt?: string
}

export interface RebalanceHistory {
  id?: number
  userAddress: string
  permissionId?: number
  lastRebalanceTime?: string
  targetAllocations: string
  actualAllocations: string
  tradesExecuted: number
}

export class OrderRepository {
  static async create(order: Omit<Order, 'id' | 'createdAt'>): Promise<number> {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO orders (user_address, action_type, action_params, permission_context, status, next_execution_time)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      
      stmt.run([
        order.userAddress,
        order.actionType,
        order.actionParams,
        order.permissionContext,
        order.status,
        order.nextExecutionTime
      ], function(err) {
        if (err) reject(err)
        else resolve(this.lastID)
      })
    })
  }

  static async findDueOrders(): Promise<Order[]> {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT * FROM orders 
        WHERE status = 'pending' 
        AND next_execution_time <= datetime('now')
      `, (err, rows) => {
        if (err) reject(err)
        else resolve(rows as Order[])
      })
    })
  }

  static async updateStatus(id: number, status: string, txHash?: string, errorMessage?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        UPDATE orders 
        SET status = ?, executed_at = datetime('now'), tx_hash = ?, error_message = ?
        WHERE id = ?
      `)
      
      stmt.run([status, txHash, errorMessage, id], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }
}

export class AdvancedPermissionRepository {
  static async create(permission: Omit<AdvancedPermission, 'id' | 'createdAt'>): Promise<number> {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO advanced_permissions (
          user_address, permission_type, contract_address, allowed_methods, 
          restrictions, policies, duration, expires_at, is_active, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      
      stmt.run([
        permission.userAddress,
        permission.permissionType,
        permission.contractAddress,
        permission.allowedMethods,
        permission.restrictions,
        permission.policies,
        permission.duration,
        permission.expiresAt,
        permission.isActive ? 1 : 0,
        permission.description
      ], function(err) {
        if (err) reject(err)
        else resolve(this.lastID)
      })
    })
  }

  static async findByUser(userAddress: string): Promise<AdvancedPermission[]> {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT * FROM advanced_permissions 
        WHERE user_address = ? AND is_active = 1 AND expires_at > datetime('now')
      `, [userAddress], (err, rows) => {
        if (err) reject(err)
        else resolve(rows as AdvancedPermission[])
      })
    })
  }

  static async findByContract(userAddress: string, contractAddress: string): Promise<AdvancedPermission[]> {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT * FROM advanced_permissions 
        WHERE user_address = ? AND contract_address = ? AND is_active = 1 AND expires_at > datetime('now')
      `, [userAddress, contractAddress], (err, rows) => {
        if (err) reject(err)
        else resolve(rows as AdvancedPermission[])
      })
    })
  }

  static async deactivate(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(`UPDATE advanced_permissions SET is_active = 0 WHERE id = ?`, [id], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }
}

export class PermissionExecutionRepository {
  static async create(execution: Omit<PermissionExecution, 'id' | 'executedAt'>): Promise<number> {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO permission_executions (
          permission_id, user_address, contract_address, method_name, 
          value, tx_hash, success, error_message
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      
      stmt.run([
        execution.permissionId,
        execution.userAddress,
        execution.contractAddress,
        execution.methodName,
        execution.value,
        execution.txHash,
        execution.success ? 1 : 0,
        execution.errorMessage
      ], function(err) {
        if (err) reject(err)
        else resolve(this.lastID)
      })
    })
  }

  static async findByPermission(permissionId: number): Promise<PermissionExecution[]> {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT * FROM permission_executions 
        WHERE permission_id = ? 
        ORDER BY executed_at DESC
      `, [permissionId], (err, rows) => {
        if (err) reject(err)
        else resolve(rows as PermissionExecution[])
      })
    })
  }
}

export class DCAHistoryRepository {
  static async create(dca: Omit<DCAHistory, 'id' | 'executedAt'>): Promise<number> {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO dca_history (
          user_address, property_id, amount, price_per_share, shares_acquired, tx_hash
        ) VALUES (?, ?, ?, ?, ?, ?)
      `)
      
      stmt.run([
        dca.userAddress,
        dca.propertyId,
        dca.amount,
        dca.pricePerShare,
        dca.sharesAcquired,
        dca.txHash
      ], function(err) {
        if (err) reject(err)
        else resolve(this.lastID)
      })
    })
  }

  static async findByUser(userAddress: string, propertyId?: string): Promise<DCAHistory[]> {
    return new Promise((resolve, reject) => {
      const query = propertyId 
        ? `SELECT * FROM dca_history WHERE user_address = ? AND property_id = ? ORDER BY executed_at DESC`
        : `SELECT * FROM dca_history WHERE user_address = ? ORDER BY executed_at DESC`;
      
      const params = propertyId ? [userAddress, propertyId] : [userAddress];
      
      db.all(query, params, (err, rows) => {
        if (err) reject(err)
        else resolve(rows as DCAHistory[])
      })
    })
  }
}

export class RebalanceHistoryRepository {
  static async create(rebalance: Omit<RebalanceHistory, 'id' | 'lastRebalanceTime'>): Promise<number> {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO rebalance_history (
          user_address, permission_id, target_allocations, actual_allocations, trades_executed
        ) VALUES (?, ?, ?, ?, ?)
      `)
      
      stmt.run([
        rebalance.userAddress,
        rebalance.permissionId,
        rebalance.targetAllocations,
        rebalance.actualAllocations,
        rebalance.tradesExecuted
      ], function(err) {
        if (err) reject(err)
        else resolve(this.lastID)
      })
    })
  }

  static async getLastRebalanceTime(userAddress: string): Promise<Date> {
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT last_rebalance_time FROM rebalance_history 
        WHERE user_address = ? 
        ORDER BY last_rebalance_time DESC 
        LIMIT 1
      `, [userAddress], (err, row: any) => {
        if (err) reject(err)
        else resolve(row ? new Date(row.last_rebalance_time) : new Date(0))
      })
    })
  }

  static async updateLastRebalanceTime(userAddress: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(`
        INSERT OR REPLACE INTO rebalance_history (
          user_address, last_rebalance_time, target_allocations, actual_allocations, trades_executed
        ) VALUES (?, datetime('now'), '{}', '{}', 0)
      `, [userAddress], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }
}