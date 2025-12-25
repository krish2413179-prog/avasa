'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  TrendingUp,
  Shield,
  Coins,
  ArrowUpRight,
  Loader2,
  Mic,
  MicOff,
  Copy,
  Check,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'action' | 'success' | 'error';
  metadata?: {
    action?: string;
    amount?: string;
    asset?: string;
  };
}

interface QuickAction {
  label: string;
  command: string;
  icon: React.ElementType;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    label: 'Auto-Compound Yield',
    command: 'Enable auto-compound for all my RWA properties',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
  },
  {
    label: 'Smart DCA Setup',
    command: 'Set up weekly DCA of $100 into Miami Beach property',
    icon: Coins,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    label: 'Emergency Protection',
    command: 'Activate emergency brake if ETH drops below $2800',
    icon: Shield,
    color: 'from-red-500 to-pink-500',
  },
  {
    label: 'Portfolio Rebalance',
    command: 'Rebalance my portfolio to 60% RWA, 40% DeFi',
    icon: Zap,
    color: 'from-purple-500 to-indigo-500',
  },
];

export function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Welcome to PropChain AI! I'm your intelligent DeFi assistant, ready to help you manage your Real World Asset portfolio. I can execute trades, set up automated strategies, and monitor your investments. What would you like to do today?",
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate API call to backend
    try {
      const response = await fetch('http://localhost:3001/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: userMessage }),
      });
      
      const data = await response.json();
      
      if (data.type) {
        return `✅ Command processed: ${data.description}. I've ${data.type.replace('_', ' ')} as requested. The transaction will be executed with the following parameters: ${JSON.stringify(data.params, null, 2)}`;
      }
    } catch (error) {
      console.error('API Error:', error);
    }

    // Fallback responses
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('auto-compound') || lowerMessage.includes('compound')) {
      return "🔄 Auto-compound strategy activated! I'll automatically reinvest all yield from your RWA properties. Expected APY increase: +2.3%. Next compound: in 7 days.";
    }
    
    if (lowerMessage.includes('dca') || lowerMessage.includes('invest')) {
      return "💰 Smart DCA strategy configured! I'll invest the specified amount weekly into your selected property. Risk level: Low. Expected returns: 8-12% annually.";
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('protection')) {
      return "🛡️ Emergency protection activated! I'm monitoring ETH price and will automatically convert to USDC if the threshold is breached. Safety first!";
    }
    
    if (lowerMessage.includes('rebalance') || lowerMessage.includes('portfolio')) {
      return "⚖️ Portfolio rebalancing initiated! Analyzing current allocations and optimizing for maximum risk-adjusted returns. This may take a few minutes.";
    }
    
    return "🤖 I understand your request and I'm processing it. My AI algorithms are analyzing the best execution strategy for your portfolio. Is there anything specific you'd like me to prioritize?";
  };

  const handleSendMessage = async (messageText: string = input) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateResponse(messageText);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        type: 'success',
      };

      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000 + Math.random() * 1000); // Simulate processing time
      
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I encountered an error processing your request. Please try again or contact support if the issue persists.",
        timestamp: new Date(),
        type: 'error',
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleQuickAction = (command: string) => {
    setInput(command);
    handleSendMessage(command);
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">PropChain AI Assistant</h3>
            <p className="text-xs text-slate-500">Online • Ready to help</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
          <span className="text-xs font-medium text-slate-600">AI Powered</span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-slate-600 to-slate-700' 
                    : 'bg-gradient-to-br from-blue-600 to-indigo-600'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`relative group ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                      : message.type === 'success'
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 text-green-900 border border-green-200'
                      : message.type === 'error'
                      ? 'bg-gradient-to-br from-red-50 to-pink-50 text-red-900 border border-red-200'
                      : 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Copy button */}
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-500" />
                        )}
                      </button>
                    )}
                  </div>
                  
                  {/* Timestamp */}
                  <p className={`text-xs text-slate-400 mt-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm text-slate-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="px-6 py-4 border-t border-slate-200/50">
          <p className="text-xs font-medium text-slate-600 mb-3">Quick Actions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleQuickAction(action.command)}
                className={`p-3 rounded-xl text-left text-xs font-medium text-white bg-gradient-to-r ${action.color} hover:scale-105 transition-all duration-200 shadow-sm`}
              >
                <div className="flex items-center space-x-2">
                  <action.icon className="w-4 h-4" />
                  <span>{action.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-slate-200/50">
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your portfolio..."
              disabled={isLoading}
              className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
            />
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                isListening ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
