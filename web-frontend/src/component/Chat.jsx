import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

function Chat() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();


  let initialText = `Hello ${user.name || 'User'}! 👋 I am your System Command Assistant. `;
  if (user.role === 'distributor') {
      initialText += 'I can help you track your inventory, pending orders, sales, and market dues.';
  } else if (user.role === 'rep') {
      initialText += 'I can help you track your sales, pending orders, and available schemes.';
  } else {
      initialText += 'I can help you monitor active distributors, track master data, and provide system-wide insights.';
  }

  // State to manage chat messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: initialText
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Dynamic Suggested Queries based on Role
  let suggestedQueries = [];
  if (user.role === 'distributor') {
      suggestedQueries = [
          "How many pending orders do I have?",
          "Check my low stock items",
          "What are my total sales and dues?",
          "How many reps are in my team?"
      ];
  } else if (user.role === 'rep') {
      suggestedQueries = [
          "How many pending orders do I have?",
          "What are my total sales?",
          "Show available schemes"
      ];
  } else {
      suggestedQueries = [
          "How many active distributors?",
          "How many reps do we have?",
          "How many zones are registered?"
      ];
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Ek common function banaya jo text input aur button click dono ke liye chalega
  const processMessage = async (messageText) => {
    if (!messageText.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true); // Show typing indicator

    try {
      let aiResponse = "I am still learning! Please ask me about orders, stock, reps, sales, or distributors.";
      const lowerInput = messageText.toLowerCase();

      // ----- ADMIN SPECIFIC QUERIES -----
      if (lowerInput.includes('zone') && user.role === 'admin') {
        const res = await api.get('/masterdata/zone');
        const count = res.data.zones ? res.data.zones.length : 0;
        aiResponse = `Real-time Data: We currently have ${count} active zones configured in the database.`;
      } else if ((lowerInput.includes('company') || lowerInput.includes('companies')) && user.role === 'admin') {
        const res = await api.get('/masterdata/company');
        const count = res.data.companies ? res.data.companies.length : 0;
        aiResponse = `Real-time Data: There are ${count} onboarded companies in the database right now.`;
      } else if (lowerInput.includes('distributor') && user.role === 'admin') {
        const res = await api.get('/admin/distributors'); 
        const count = res.data.data ? res.data.data.length : 0;
        aiResponse = `Real-time Data: We currently have ${count} active distributors registered in the system.`;
      } 
      
      else if ((lowerInput.includes('rep') || lowerInput.includes('team') || lowerInput.includes('representative')) && (user.role === 'distributor' || user.role === 'admin')) {
        const res = await api.get('/admin/reps'); 
        const count = res.data.data ? res.data.data.length : 0;
        aiResponse = `Team Update: There are ${count} sales representatives operating ${user.role === 'distributor' ? 'under your network' : 'in the system'}.`;
      } else if ((lowerInput.includes('stock') || lowerInput.includes('inventory') || lowerInput.includes('low')) && user.role === 'distributor') {
        const res = await api.get('/products/get-products');
        const products = res.data.data || [];
        const lowStockProducts = products.filter(p => p.stock <= 50);
        aiResponse = `Inventory Update: You have ${products.length} products in your catalog. ${lowStockProducts.length > 0 ? `⚠️ Alert: ${lowStockProducts.length} products are running low on stock (<= 50 units).` : 'All products have sufficient stock levels.'}`;
      } 
      
      // ----- UNIVERSAL QUERIES (Distributor & Rep) -----
      else if (lowerInput.includes('order') || lowerInput.includes('pending')) {
        const res = await api.get('/orders');
        const orders = res.data.data || [];
        const pendingOrders = orders.filter(o => o.status === 'pending');
        aiResponse = `Order Status: You have ${orders.length} total orders. ${pendingOrders.length > 0 ? `Action Required: ${pendingOrders.length} orders are currently PENDING.` : 'Great job! No pending orders right now.'}`;
      } else if (lowerInput.includes('sales') || lowerInput.includes('revenue') || lowerInput.includes('due') || lowerInput.includes('udhaar')) {
        const res = await api.get('/orders');
        const orders = res.data.data || [];
        const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const creditOrders = orders.filter(o => o.orderType === 'credit');
        const totalDues = creditOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        aiResponse = `Financial Update: Total sales volume is ₹${totalSales.toLocaleString('en-IN')} from ${orders.length} orders. ${user.role === 'distributor' ? `🔴 Total market dues (Udhaar/Credit) are ₹${totalDues.toLocaleString('en-IN')}.` : ''}`;
      } else if (lowerInput.includes('scheme') || lowerInput.includes('offer')) {
        const res = await api.get('/schemes/get-schemes');
        const schemes = res.data.data || [];
        aiResponse = `Promotions: There are currently ${schemes.length} active schemes/offers available for your network.`;
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        aiResponse = `Hello! I am connected to the live database. You can ask me about ${user.role === 'distributor' ? 'your stock, pending orders, sales, reps, or dues!' : user.role === 'rep' ? 'your orders, sales, and available schemes!' : 'zones, companies, distributors, reps, or system revenue!'}`;
      }

    
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error("Chatbot API Error:", error);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: "Sorry, I encountered an error fetching live data. Please verify your backend API routes." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    processMessage(input);
  };

  const handleSuggestedClick = (query) => {
    processMessage(query);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavbar />
        
        <main className="flex-1 p-6 flex flex-col overflow-hidden">
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
            
        
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                  
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">System AI Assistant</h2>
                  <p className="text-xs font-semibold text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
                  </p>
                </div>
              </div>
              <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
    
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-2xl flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'}`}>
                      {msg.sender === 'user' ? 'A' : 'AI'}
                    </div>

                    {/* Message Bubble */}
                    <div className={`p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-sm shadow-md shadow-blue-200' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'}`}>
                      <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                    </div>

                  </div>
                </div>
              ))}
              
            
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-2xl flex gap-3 flex-row">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 font-bold text-xs">AI</div>
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Area */}
            
            {/* Suggested Queries */}
            <div className="px-6 py-3 bg-white flex flex-wrap gap-2 justify-start border-t border-slate-100">
              {suggestedQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedClick(query)}
                  disabled={isTyping}
                  className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-colors border border-blue-100 disabled:opacity-50"
                >
                  {query}
                </button>
              ))}
            </div>
            
            <div className="p-4 bg-white border-t border-slate-100">
              <form onSubmit={handleSend} className="flex gap-3 max-w-4xl mx-auto">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about distributors, zones, or sales..." className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium" />
                <button type="submit" disabled={!input.trim() || isTyping} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-200 flex items-center gap-2">
                  <span>Send</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                </button>
              </form>
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}

export default Chat;