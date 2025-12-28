import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';

const router = express.Router();

// Initialize SQLite database for friends
const dbPath = path.join(__dirname, '../../../contacts.db');
const db = new sqlite3.Database(dbPath);

// Create friends table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS friends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_address TEXT NOT NULL,
    friend_name TEXT NOT NULL,
    friend_address TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_address, friend_address)
  )`);
});

// Get all friends for a user
router.get('/:userAddress', (req, res) => {
  const { userAddress } = req.params;
  
  if (!userAddress) {
    return res.status(400).json({ error: 'User address is required' });
  }

  db.all(
    'SELECT * FROM friends WHERE user_address = ? ORDER BY friend_name ASC',
    [userAddress.toLowerCase()],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch friends' });
      }
      res.json({ friends: rows });
    }
  );
});

// Add a new friend
router.post('/', (req, res) => {
  const { userAddress, friendName, friendAddress } = req.body;
  
  if (!userAddress || !friendName || !friendAddress) {
    return res.status(400).json({ 
      error: 'User address, friend name, and friend address are required' 
    });
  }

  // Validate Ethereum address format
  const addressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!addressRegex.test(friendAddress)) {
    return res.status(400).json({ error: 'Invalid friend address format' });
  }

  db.run(
    `INSERT OR REPLACE INTO friends (user_address, friend_name, friend_address, updated_at) 
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
    [userAddress.toLowerCase(), friendName.trim(), friendAddress.toLowerCase()],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to add friend' });
      }
      
      res.json({ 
        success: true, 
        message: 'Friend added successfully',
        friendId: this.lastID
      });
    }
  );
});

// Update a friend's name
router.put('/:friendId', (req, res) => {
  const { friendId } = req.params;
  const { userAddress, friendName } = req.body;
  
  if (!userAddress || !friendName) {
    return res.status(400).json({ 
      error: 'User address and friend name are required' 
    });
  }

  db.run(
    'UPDATE friends SET friend_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_address = ?',
    [friendName.trim(), friendId, userAddress.toLowerCase()],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to update friend' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Friend not found' });
      }
      
      res.json({ 
        success: true, 
        message: 'Friend updated successfully' 
      });
    }
  );
});

// Delete a friend
router.delete('/:friendId', (req, res) => {
  const { friendId } = req.params;
  const { userAddress } = req.body;
  
  if (!userAddress) {
    return res.status(400).json({ error: 'User address is required' });
  }

  db.run(
    'DELETE FROM friends WHERE id = ? AND user_address = ?',
    [friendId, userAddress.toLowerCase()],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to delete friend' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Friend not found' });
      }
      
      res.json({ 
        success: true, 
        message: 'Friend deleted successfully' 
      });
    }
  );
});

// Search friends by name or address
router.get('/:userAddress/search', (req, res) => {
  const { userAddress } = req.params;
  const { query } = req.query;
  
  if (!userAddress || !query) {
    return res.status(400).json({ error: 'User address and search query are required' });
  }

  const searchQuery = `%${query}%`;
  
  db.all(
    `SELECT * FROM friends 
     WHERE user_address = ? 
     AND (friend_name LIKE ? OR friend_address LIKE ?)
     ORDER BY friend_name ASC`,
    [userAddress.toLowerCase(), searchQuery, searchQuery],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to search friends' });
      }
      res.json({ friends: rows });
    }
  );
});

// Resolve friend name to address (for AI parser)
router.get('/:userAddress/resolve/:friendName', (req, res) => {
  const { userAddress, friendName } = req.params;
  
  db.get(
    'SELECT friend_address FROM friends WHERE user_address = ? AND friend_name = ? COLLATE NOCASE',
    [userAddress.toLowerCase(), friendName],
    (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to resolve friend' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Friend not found' });
      }
      
      res.json({ 
        friendName,
        friendAddress: row.friend_address 
      });
    }
  );
});

export default router;