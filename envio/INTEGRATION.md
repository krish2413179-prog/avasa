# 🔗 PropChain AI Envio Indexer - Frontend Integration Guide

This guide shows how to integrate the PropChain AI Envio indexer into your frontend applications for real-time DeFi analytics.

## 🚀 **Quick Start**

### **GraphQL Endpoint**
```
Production: https://indexer.propchain.ai/graphql
Development: http://localhost:8080/graphql
```

### **Basic Query Example**
```javascript
const query = `
  query GetActivePayments {
    paymentSchedules(where: { isActive: true }, first: 10) {
      id
      payer
      recipient
      amount
      interval
      executionsLeft
    }
  }
`;

fetch('https://indexer.propchain.ai/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query })
})
.then(res => res.json())
.then(data => console.log(data));
```

## ⚛️ **React Integration**

### **Setup Apollo Client**
```bash
npm install @apollo/client graphql
```

```javascript
// apollo-client.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'https://indexer.propchain.ai/graphql',
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      pollInterval: 5000, // Poll every 5 seconds for real-time updates
    },
  },
});
```

```javascript
// App.js
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo-client';
import PaymentDashboard from './components/PaymentDashboard';

function App() {
  return (
    <ApolloProvider client={client}>
      <PaymentDashboard />
    </ApolloProvider>
  );
}
```

### **Payment Dashboard Component**
```javascript
// components/PaymentDashboard.js
import { useQuery, gql } from '@apollo/client';

const GET_ACTIVE_PAYMENTS = gql`
  query GetActivePayments {
    paymentSchedules(where: { isActive: true }, first: 20) {
      id
      payer
      recipient
      amount
      interval
      executionsLeft
      nextPayment
      executorReward
      
      executions(first: 5, orderBy: timestamp, orderDirection: desc) {
        timestamp
        executor
        transactionHash
      }
    }
  }
`;

function PaymentDashboard() {
  const { loading, error, data } = useQuery(GET_ACTIVE_PAYMENTS);

  if (loading) return <div>Loading payments...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="payment-dashboard">
      <h2>Active Payment Schedules</h2>
      {data.paymentSchedules.map(schedule => (
        <PaymentCard key={schedule.id} schedule={schedule} />
      ))}
    </div>
  );
}

function PaymentCard({ schedule }) {
  const nextPaymentDate = new Date(schedule.nextPayment * 1000);
  
  return (
    <div className="payment-card">
      <h3>Payment Schedule</h3>
      <p><strong>From:</strong> {schedule.payer}</p>
      <p><strong>To:</strong> {schedule.recipient}</p>
      <p><strong>Amount:</strong> {schedule.amount / 1e18} USDC</p>
      <p><strong>Executions Left:</strong> {schedule.executionsLeft}</p>
      <p><strong>Next Payment:</strong> {nextPaymentDate.toLocaleString()}</p>
      <p><strong>Executor Reward:</strong> {schedule.executorReward / 1e18} USDC</p>
      
      <div className="recent-executions">
        <h4>Recent Executions</h4>
        {schedule.executions.map(execution => (
          <div key={execution.transactionHash}>
            <span>{new Date(execution.timestamp * 1000).toLocaleString()}</span>
            <span>Executor: {execution.executor.slice(0, 8)}...</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### **Executor Leaderboard Component**
```javascript
// components/ExecutorLeaderboard.js
import { useQuery, gql } from '@apollo/client';

const GET_TOP_EXECUTORS = gql`
  query GetTopExecutors {
    executorStats(
      orderBy: totalRewardsEarned
      orderDirection: desc
      first: 10
    ) {
      executor
      totalExecutions
      totalRewardsEarned
      paymentExecutions
      swapExecutions
      averageReward
    }
  }
`;

function ExecutorLeaderboard() {
  const { loading, error, data } = useQuery(GET_TOP_EXECUTORS);

  if (loading) return <div>Loading leaderboard...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="executor-leaderboard">
      <h2>🏆 Top Executors</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Executor</th>
            <th>Total Rewards</th>
            <th>Executions</th>
            <th>Avg Reward</th>
          </tr>
        </thead>
        <tbody>
          {data.executorStats.map((executor, index) => (
            <tr key={executor.executor}>
              <td>{index + 1}</td>
              <td>{executor.executor.slice(0, 8)}...</td>
              <td>{(executor.totalRewardsEarned / 1e18).toFixed(2)} USDC</td>
              <td>{executor.totalExecutions}</td>
              <td>{(executor.averageReward / 1e18).toFixed(4)} USDC</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### **Swap Analytics Component**
```javascript
// components/SwapAnalytics.js
import { useQuery, gql } from '@apollo/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GET_SWAP_DATA = gql`
  query GetSwapData($timeframe: BigInt!) {
    swapExecutions(
      where: { timestamp_gte: $timeframe }
      orderBy: timestamp
      orderDirection: asc
    ) {
      timestamp
      usdcAmount
      ethAmount
      swapType
    }
  }
`;

function SwapAnalytics() {
  const timeframe = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60); // Last 7 days
  const { loading, error, data } = useQuery(GET_SWAP_DATA, {
    variables: { timeframe: timeframe.toString() }
  });

  if (loading) return <div>Loading swap data...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Process data for chart
  const chartData = data.swapExecutions.map(swap => ({
    timestamp: swap.timestamp * 1000,
    date: new Date(swap.timestamp * 1000).toLocaleDateString(),
    usdcVolume: swap.usdcAmount / 1e18,
    ethVolume: swap.ethAmount / 1e18,
    type: swap.swapType
  }));

  return (
    <div className="swap-analytics">
      <h2>📊 Swap Volume Analytics</h2>
      
      <div className="chart-container">
        <h3>USDC Volume Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="usdcVolume" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="swap-summary">
        <h3>Summary</h3>
        <p>Total Swaps: {data.swapExecutions.length}</p>
        <p>Total USDC Volume: {chartData.reduce((sum, item) => sum + item.usdcVolume, 0).toFixed(2)}</p>
        <p>Total ETH Volume: {chartData.reduce((sum, item) => sum + item.ethVolume, 0).toFixed(4)}</p>
      </div>
    </div>
  );
}
```

## 🔄 **Real-Time Updates with Subscriptions**

### **WebSocket Setup**
```javascript
// apollo-client-ws.js
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const httpLink = new HttpLink({
  uri: 'https://indexer.propchain.ai/graphql'
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'wss://indexer.propchain.ai/graphql',
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
```

### **Real-Time Payment Notifications**
```javascript
// components/PaymentNotifications.js
import { useSubscription, gql } from '@apollo/client';

const PAYMENT_EXECUTED_SUBSCRIPTION = gql`
  subscription OnPaymentExecuted {
    paymentExecuted {
      id
      payer
      recipient
      amount
      executor
      timestamp
      transactionHash
    }
  }
`;

function PaymentNotifications() {
  const { data, loading } = useSubscription(PAYMENT_EXECUTED_SUBSCRIPTION);

  if (loading) return <div>Listening for payments...</div>;

  return (
    <div className="payment-notifications">
      <h3>🔔 Live Payment Notifications</h3>
      {data && (
        <div className="notification">
          <p>💸 Payment executed!</p>
          <p>Amount: {data.paymentExecuted.amount / 1e18} USDC</p>
          <p>From: {data.paymentExecuted.payer.slice(0, 8)}...</p>
          <p>To: {data.paymentExecuted.recipient.slice(0, 8)}...</p>
          <p>Executor: {data.paymentExecuted.executor.slice(0, 8)}...</p>
        </div>
      )}
    </div>
  );
}
```

## 📱 **Mobile Integration (React Native)**

### **Setup**
```bash
npm install @apollo/client graphql react-native-get-random-values
```

```javascript
// App.js
import 'react-native-get-random-values'; // Required for Apollo Client
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://indexer.propchain.ai/graphql',
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <PaymentApp />
    </ApolloProvider>
  );
}
```

### **Mobile Payment Tracker**
```javascript
// components/MobilePaymentTracker.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useQuery, gql } from '@apollo/client';

const GET_USER_PAYMENTS = gql`
  query GetUserPayments($user: String!) {
    paymentExecutions(
      where: { payer: $user }
      orderBy: timestamp
      orderDirection: desc
      first: 20
    ) {
      id
      recipient
      amount
      timestamp
      transactionHash
    }
  }
`;

function MobilePaymentTracker({ userAddress }) {
  const { loading, error, data } = useQuery(GET_USER_PAYMENTS, {
    variables: { user: userAddress }
  });

  const renderPayment = ({ item }) => (
    <View style={styles.paymentItem}>
      <Text style={styles.amount}>{(item.amount / 1e18).toFixed(2)} USDC</Text>
      <Text style={styles.recipient}>To: {item.recipient.slice(0, 8)}...</Text>
      <Text style={styles.date}>
        {new Date(item.timestamp * 1000).toLocaleDateString()}
      </Text>
    </View>
  );

  if (loading) return <Text>Loading payments...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Payments</Text>
      <FlatList
        data={data.paymentExecutions}
        renderItem={renderPayment}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  recipient: {
    fontSize: 14,
    color: '#666',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});
```

## 🎨 **Vue.js Integration**

### **Setup Vue Apollo**
```bash
npm install @vue/apollo-composable @apollo/client graphql
```

```javascript
// main.js
import { createApp } from 'vue';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { DefaultApolloClient } from '@vue/apollo-composable';
import App from './App.vue';

const apolloClient = new ApolloClient({
  uri: 'https://indexer.propchain.ai/graphql',
  cache: new InMemoryCache(),
});

const app = createApp(App);
app.provide(DefaultApolloClient, apolloClient);
app.mount('#app');
```

### **Vue Payment Component**
```vue
<!-- components/PaymentDashboard.vue -->
<template>
  <div class="payment-dashboard">
    <h2>Payment Analytics</h2>
    
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    
    <div v-else class="payment-grid">
      <div 
        v-for="schedule in result?.paymentSchedules" 
        :key="schedule.id"
        class="payment-card"
      >
        <h3>{{ schedule.payer.slice(0, 8) }}... → {{ schedule.recipient.slice(0, 8) }}...</h3>
        <p>Amount: {{ formatAmount(schedule.amount) }} USDC</p>
        <p>Executions Left: {{ schedule.executionsLeft }}</p>
        <p>Next Payment: {{ formatDate(schedule.nextPayment) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const GET_PAYMENTS = gql`
  query GetPayments {
    paymentSchedules(where: { isActive: true }, first: 10) {
      id
      payer
      recipient
      amount
      executionsLeft
      nextPayment
    }
  }
`;

const { result, loading, error } = useQuery(GET_PAYMENTS);

const formatAmount = (amount) => {
  return (amount / 1e18).toFixed(2);
};

const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString();
};
</script>

<style scoped>
.payment-dashboard {
  padding: 20px;
}

.payment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.payment-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: #f9f9f9;
}
</style>
```

## 🔧 **Advanced Integration Patterns**

### **Custom Hooks for React**
```javascript
// hooks/usePaymentAnalytics.js
import { useQuery, gql } from '@apollo/client';
import { useMemo } from 'react';

const GET_PAYMENT_ANALYTICS = gql`
  query GetPaymentAnalytics($timeframe: BigInt!) {
    paymentExecutions(where: { timestamp_gte: $timeframe }) {
      amount
      timestamp
      executor
    }
    
    dailyProtocolStats(
      orderBy: date
      orderDirection: desc
      first: 30
    ) {
      date
      totalPayments
      totalPaymentVolume
    }
  }
`;

export function usePaymentAnalytics(days = 30) {
  const timeframe = Math.floor(Date.now() / 1000) - (days * 24 * 60 * 60);
  
  const { data, loading, error } = useQuery(GET_PAYMENT_ANALYTICS, {
    variables: { timeframe: timeframe.toString() }
  });

  const analytics = useMemo(() => {
    if (!data) return null;

    const totalVolume = data.paymentExecutions.reduce(
      (sum, payment) => sum + parseFloat(payment.amount),
      0
    ) / 1e18;

    const uniqueExecutors = new Set(
      data.paymentExecutions.map(p => p.executor)
    ).size;

    const dailyAverage = data.dailyProtocolStats.reduce(
      (sum, day) => sum + parseFloat(day.totalPaymentVolume),
      0
    ) / (data.dailyProtocolStats.length * 1e18);

    return {
      totalVolume,
      totalPayments: data.paymentExecutions.length,
      uniqueExecutors,
      dailyAverage,
      dailyStats: data.dailyProtocolStats
    };
  }, [data]);

  return { analytics, loading, error };
}
```

### **Error Handling & Retry Logic**
```javascript
// utils/apolloErrorHandler.js
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

export const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`);
    
    // Show user-friendly error message
    if (networkError.statusCode === 429) {
      showNotification('Rate limit exceeded. Please try again later.');
    } else if (networkError.statusCode >= 500) {
      showNotification('Server error. Please try again.');
    }
  }
});

export const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true
  },
  attempts: {
    max: 5,
    retryIf: (error, _operation) => !!error
  }
});
```

### **Caching Strategies**
```javascript
// apollo-cache-config.js
import { InMemoryCache } from '@apollo/client';

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        paymentSchedules: {
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          }
        },
        executorStats: {
          merge(existing = [], incoming) {
            return incoming; // Always use fresh data for leaderboard
          }
        }
      }
    },
    PaymentSchedule: {
      fields: {
        executions: {
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          }
        }
      }
    }
  }
});
```

## 📊 **Performance Optimization**

### **Query Batching**
```javascript
// Batch multiple queries into a single request
const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($timeframe: BigInt!) {
    paymentSchedules(where: { isActive: true }, first: 10) {
      id
      payer
      recipient
      amount
    }
    
    executorStats(orderBy: totalRewardsEarned, orderDirection: desc, first: 5) {
      executor
      totalRewardsEarned
    }
    
    dailyProtocolStats(orderBy: date, orderDirection: desc, first: 7) {
      date
      totalPayments
      totalPaymentVolume
    }
  }
`;
```

### **Pagination Implementation**
```javascript
// components/PaginatedPayments.js
import { useQuery, gql } from '@apollo/client';
import { useState } from 'react';

const GET_PAGINATED_PAYMENTS = gql`
  query GetPaginatedPayments($first: Int!, $skip: Int!) {
    paymentExecutions(
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      payer
      recipient
      amount
      timestamp
    }
  }
`;

function PaginatedPayments() {
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const { loading, error, data, fetchMore } = useQuery(GET_PAGINATED_PAYMENTS, {
    variables: { first: pageSize, skip: page * pageSize }
  });

  const loadMore = () => {
    fetchMore({
      variables: { skip: (page + 1) * pageSize },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          paymentExecutions: [
            ...prev.paymentExecutions,
            ...fetchMoreResult.paymentExecutions
          ]
        };
      }
    });
    setPage(page + 1);
  };

  return (
    <div>
      {/* Render payments */}
      <button onClick={loadMore} disabled={loading}>
        {loading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  );
}
```

---

This integration guide provides comprehensive examples for building real-time DeFi analytics applications using the PropChain AI Envio indexer. The indexer's GraphQL API enables powerful, flexible queries for payment automation, swap analytics, and RWA portfolio tracking across multiple frontend frameworks.