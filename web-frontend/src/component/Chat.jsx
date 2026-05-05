import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

function Chat() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  // State to manage chat messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello ${user.name || 'Admin'}! 👋 I am your System Command Assistant. I can help you monitor active distributors, track master data, and provide system-wide insights. What would you like to know today?`
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Suggested automatic queries for Admin
  const suggestedQueries = [
    "How many active distributors?",
    "How many reps do we have?",
    "How many zones are registered?"
  ];

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
      let aiResponse = "I am still learning! Right now I can pull real-time data for zones, companies, distributors, reps, and sales. Try asking me!";
      const lowerInput = messageText.toLowerCase();

    
      if (lowerInput.includes('zone')) {
        const res = await api.get('/masterdata/zone');
        const count = res.data.zones ? res.data.zones.length : 0;
        aiResponse = `Real-time Data: We currently have ${count} active zones configured in the database.`;
      } else if (lowerInput.includes('company') || lowerInput.includes('companies')) {
        const res = await api.get('/masterdata/company');
        const count = res.data.companies ? res.data.companies.length : 0;
        aiResponse = `Real-time Data: There are ${count} onboarded companies in the database right now.`;
      } else if (lowerInput.includes('distributor') || lowerInput.includes('active')) {
        const res = await api.get('/admin/distributors'); 
        const count = res.data.data ? res.data.data.length : 0;
        aiResponse = `Real-time Data: We currently have ${count} active distributors registered in the system.`;
      } else if (lowerInput.includes('rep') || lowerInput.includes('representative')) {
        const res = await api.get('/admin/reps'); 
        const count = res.data.data ? res.data.data.length : 0;
        aiResponse = `Real-time Data: There are ${count} sales representatives currently operating.`;
      } else if (lowerInput.includes('sales') || lowerInput.includes('revenue') || lowerInput.includes('order')) {
        const orders = res.data.data || [];
        const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        aiResponse = `Real-time Data: The system-wide total revenue is ₹${totalSales.toLocaleString('en-IN')} from ${orders.length} orders.`;
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        aiResponse = "Hello! I am connected to the live database. You can ask me about zones, companies, distributors, reps, or sales/revenue!";
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