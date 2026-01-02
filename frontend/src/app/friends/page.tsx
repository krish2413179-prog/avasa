'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  Brain, 
  Users, 
  Building2, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Copy, 
  Check,
  ArrowLeft,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import { useAccount } from 'wagmi';

interface Friend {
  id: number;
  user_address: string;
  friend_name: string;
  friend_address: string;
  created_at: string;
  updated_at: string;
}

export default function FriendsPage() {
  const [mounted, setMounted] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  
  // Form states
  const [friendName, setFriendName] = useState('');
  const [friendAddress, setFriendAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { address, isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      fetchFriends();
    }
  }, [isConnected, address]);

  const fetchFriends = async () => {
    if (!address) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/friends/${address}`);
      const data = await response.json();
      
      if (response.ok) {
        setFriends(data.friends || []);
      } else {
        setError(data.error || 'Failed to fetch friends');
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setError('');
    setSuccess('');

    // Validate inputs
    if (!friendName.trim() || !friendAddress.trim()) {
      setError('Both name and address are required');
      return;
    }

    // Validate Ethereum address format
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(friendAddress)) {
      setError('Invalid Ethereum address format');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/friends`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: address,
          friendName: friendName.trim(),
          friendAddress: friendAddress.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Friend added successfully!');
        setFriendName('');
        setFriendAddress('');
        setShowAddForm(false);
        fetchFriends();
      } else {
        setError(data.error || 'Failed to add friend');
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      setError('Failed to connect to server');
    }
  };

  const handleUpdateFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !editingFriend) return;

    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/friends/${editingFriend.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: address,
          friendName: friendName.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Friend updated successfully!');
        setEditingFriend(null);
        setFriendName('');
        fetchFriends();
      } else {
        setError(data.error || 'Failed to update friend');
      }
    } catch (error) {
      console.error('Error updating friend:', error);
      setError('Failed to connect to server');
    }
  };

  const handleDeleteFriend = async (friendId: number) => {
    if (!address) return;
    
    if (!confirm('Are you sure you want to delete this friend?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/friends/${friendId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: address,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Friend deleted successfully!');
        fetchFriends();
      } else {
        setError(data.error || 'Failed to delete friend');
      }
    } catch (error) {
      console.error('Error deleting friend:', error);
      setError('Failed to connect to server');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(text);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const startEditing = (friend: Friend) => {
    setEditingFriend(friend);
    setFriendName(friend.friend_name);
    setShowAddForm(false);
  };

  const cancelEditing = () => {
    setEditingFriend(null);
    setFriendName('');
    setError('');
  };

  const filteredFriends = friends.filter(friend =>
    friend.friend_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.friend_address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) return null;

  return (
    <div style={{ 
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#ffffff',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(15, 15, 35, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '0.75rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100vw',
        margin: 0,
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          width: '100%',
          margin: '0',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box'
        }}>
          {/* Logo */}
          <Link href="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            textDecoration: 'none' 
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Brain style={{ width: '18px', height: '18px', color: 'white' }} />
            </div>
            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: '700', 
              color: '#ffffff' 
            }}>
              Veda
            </span>
          </Link>

          {/* Navigation */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem' 
          }}>
            <Link
              href="/friends"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.5rem 0.75rem',
                background: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#ffffff',
                fontWeight: '500',
                fontSize: '0.75rem'
              }}
            >
              <Users style={{ width: '14px', height: '14px' }} />
              Friends
            </Link>

            <Link
              href="/properties"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.5rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#ffffff',
                fontWeight: '500',
                fontSize: '0.75rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <Building2 style={{ width: '14px', height: '14px' }} />
              Properties
            </Link>

            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Page Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#ffffff',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <ArrowLeft style={{ width: '16px', height: '16px' }} />
            </Link>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '700',
                margin: 0,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Friends
              </h1>
              <p style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '0.25rem 0 0 0'
              }}>
                Manage your contacts for easy payments
              </p>
            </div>
          </div>

          {isConnected && (
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingFriend(null);
                setFriendName('');
                setFriendAddress('');
                setError('');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <UserPlus style={{ width: '16px', height: '16px' }} />
              Add Friend
            </button>
          )}
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <AlertCircle style={{ width: '48px', height: '48px', color: '#f59e0b', margin: '0 auto 1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem', color: '#f59e0b' }}>Wallet Not Connected</h3>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)' }}>
              Please connect your wallet to manage your friends list
            </p>
          </div>
        )}

        {/* Success/Error Messages */}
        {success && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            color: '#22c55e'
          }}>
            {success}
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            color: '#ef4444'
          }}>
            {error}
          </div>
        )}

        {isConnected && (
          <>
            {/* Add/Edit Friend Form */}
            {(showAddForm || editingFriend) && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '2rem'
              }}>
                <h3 style={{
                  margin: '0 0 1.5rem',
                  fontSize: '1.25rem',
                  fontWeight: '600'
                }}>
                  {editingFriend ? 'Edit Friend' : 'Add New Friend'}
                </h3>

                <form onSubmit={editingFriend ? handleUpdateFriend : handleAddFriend}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}>
                      Friend Name
                    </label>
                    <input
                      type="text"
                      value={friendName}
                      onChange={(e) => setFriendName(e.target.value)}
                      placeholder="Enter friend's name"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        color: '#ffffff',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      required
                    />
                  </div>

                  {!editingFriend && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: 'rgba(255, 255, 255, 0.9)'
                      }}>
                        Ethereum Address
                      </label>
                      <input
                        type="text"
                        value={friendAddress}
                        onChange={(e) => setFriendAddress(e.target.value)}
                        placeholder="0x..."
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          color: '#ffffff',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                        required
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      type="submit"
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {editingFriend ? 'Update Friend' : 'Add Friend'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        cancelEditing();
                      }}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Search Bar */}
            <div style={{
              position: 'relative',
              marginBottom: '2rem'
            }}>
              <Search style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                color: 'rgba(255, 255, 255, 0.5)'
              }} />
              <input
                type="text"
                placeholder="Search friends by name or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  color: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Friends List */}
            {loading ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                Loading friends...
              </div>
            ) : filteredFriends.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Users style={{
                  width: '48px',
                  height: '48px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  margin: '0 auto 1rem'
                }} />
                <h3 style={{
                  margin: '0 0 0.5rem',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  {searchQuery ? 'No friends found' : 'No friends yet'}
                </h3>
                <p style={{
                  margin: 0,
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                  {searchQuery 
                    ? 'Try adjusting your search terms'
                    : 'Add your first friend to get started'
                  }
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem'
                    }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#ffffff'
                      }}>
                        {friend.friend_name}
                      </h3>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => startEditing(friend)}
                          style={{
                            padding: '0.5rem',
                            background: 'rgba(59, 130, 246, 0.2)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '6px',
                            color: '#3b82f6',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit2 style={{ width: '14px', height: '14px' }} />
                        </button>
                        <button
                          onClick={() => handleDeleteFriend(friend.id)}
                          style={{
                            padding: '0.5rem',
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '6px',
                            color: '#ef4444',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 style={{ width: '14px', height: '14px' }} />
                        </button>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontFamily: 'monospace'
                    }}>
                      <span style={{
                        flex: 1,
                        color: 'rgba(255, 255, 255, 0.8)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {friend.friend_address}
                      </span>
                      <button
                        onClick={() => copyToClipboard(friend.friend_address)}
                        style={{
                          padding: '0.25rem',
                          background: 'none',
                          border: 'none',
                          color: copiedAddress === friend.friend_address ? '#22c55e' : 'rgba(255, 255, 255, 0.7)',
                          cursor: 'pointer'
                        }}
                      >
                        {copiedAddress === friend.friend_address ? (
                          <Check style={{ width: '14px', height: '14px' }} />
                        ) : (
                          <Copy style={{ width: '14px', height: '14px' }} />
                        )}
                      </button>
                    </div>

                    <div style={{
                      marginTop: '1rem',
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.5)'
                    }}>
                      Added {new Date(friend.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}