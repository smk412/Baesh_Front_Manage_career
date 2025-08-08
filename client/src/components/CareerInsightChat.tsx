import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

const CareerInsightChat: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const messages = useStore(state => state.messages);
  const fetchMessages = useStore(state => state.fetchMessages);
  const sendMessage = useStore(state => state.sendMessage);
  
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };
  
  const handleRefresh = () => {
    fetchMessages();
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 md:px-6 py-4 bg-gray-50">
        <div className="flex flex-col space-y-4 max-w-4xl mx-auto">
          <AnimatePresence>
            {messages.map(message => (
              <motion.div 
                key={message.id} 
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {message.isUser ? (
                  <div className="bg-primary rounded-xl rounded-tr-none p-4 md:p-5 max-w-[80%] text-white">
                    <p className="text-sm md:text-base">{message.content}</p>
                  </div>
                ) : message.chart ? (
                  <div className="bg-white rounded-xl p-4 md:p-6 max-w-[90%] md:max-w-[70%] shadow-sm">
                    <h4 className="font-medium mb-2 md:text-lg">UX 디자인 역량 분석</h4>
                    <div className="space-y-3 md:space-y-4">
                      {message.chart.map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm md:text-base mb-1">
                            <span>{item.name}</span>
                            <span className="font-medium">{item.value}%</span>
                          </div>
                          <Progress value={item.value} className="h-2 md:h-3" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl rounded-tl-none p-4 md:p-5 max-w-[80%] md:max-w-[70%] shadow-sm">
                    <p className="text-gray-800 text-sm md:text-base">{message.content}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {messages.length === 0 && (
            <motion.div 
              className="bg-white rounded-xl p-5 md:p-8 text-center mx-auto max-w-xs md:max-w-sm my-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-500 md:text-lg">AI에게 커리어 관련 질문을 해보세요.</p>
              <p className="text-sm md:text-base text-gray-400 mt-2">예: "내 UX 디자인 역량은 어떤가요?"</p>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 md:p-6 bg-white border-t border-gray-200">
        <form className="flex items-center max-w-4xl mx-auto" onSubmit={handleSendMessage}>
          <Input
            type="text"
            placeholder="질문하기..."
            className="flex-1 py-3 px-4 bg-gray-100 rounded-l-xl focus:outline-none text-sm md:text-base"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <Button type="submit" className="bg-primary text-white py-3 px-5 rounded-r-xl">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CareerInsightChat;
