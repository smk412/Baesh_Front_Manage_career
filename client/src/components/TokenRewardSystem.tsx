import React, { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, BarChart, Briefcase, Globe } from 'lucide-react';

const TokenRewardSystem: React.FC = () => {
  const tokenBalance = useStore(state => state.tokenBalance);
  const tokenHistory = useStore(state => state.tokenHistory);
  const availableServices = useStore(state => state.availableServices);
  const fetchTokenData = useStore(state => state.fetchTokenData);
  const useTokens = useStore(state => state.useTokens);
  
  useEffect(() => {
    fetchTokenData();
  }, [fetchTokenData]);
  
  const handleUseTokens = (serviceId: number) => {
    useTokens(serviceId);
  };
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'file-text': return <FileText className="w-6 h-6 md:w-7 md:h-7 text-primary" />;
      case 'bar-chart': return <BarChart className="w-6 h-6 md:w-7 md:h-7 text-primary" />;
      case 'briefcase': return <Briefcase className="w-6 h-6 md:w-7 md:h-7 text-primary" />;
      case 'globe': return <Globe className="w-6 h-6 md:w-7 md:h-7 text-primary" />;
      default: return <FileText className="w-6 h-6 md:w-7 md:h-7 text-primary" />;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="bg-primary text-white p-6 md:p-8 lg:p-10">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-lg md:text-xl font-medium opacity-90">보유 토큰</h2>
          <p className="text-4xl md:text-5xl font-bold mt-2">{tokenBalance.toLocaleString()}</p>
          <div className="mt-1 opacity-90 text-sm md:text-base">다양한 AI 기능에 사용할 수 있습니다</div>
        </div>
        <div className="flex justify-between mt-6 md:mt-8 max-w-lg mx-auto">
          <Button 
            variant="secondary" 
            className="flex-1 py-2.5 mr-2 rounded-lg bg-white text-primary font-medium text-sm md:text-base"
          >
            토큰 사용
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 py-2.5 ml-2 rounded-lg bg-white bg-opacity-20 text-white font-medium text-sm md:text-base"
          >
            토큰 충전
          </Button>
        </div>
      </div>

      <div className="p-5 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <h3 className="font-medium text-gray-800 mb-4 md:text-lg">최근 토큰 내역</h3>
          <div className="divide-y divide-gray-100">
            {tokenHistory.map(item => (
              <div key={item.id} className="py-3 md:py-4 flex justify-between items-center">
                <div>
                  <h4 className="font-medium md:text-lg">{item.title}</h4>
                  <p className="text-sm md:text-base text-gray-500">{new Date(item.date).toLocaleDateString('ko-KR')}</p>
                </div>
                <div className={`font-medium md:text-lg ${item.amount > 0 ? 'text-success' : 'text-error'}`}>
                  {item.amount > 0 ? '+' : ''}{item.amount}
                </div>
              </div>
            ))}
            
            {tokenHistory.length === 0 && (
              <div className="py-5 text-center text-gray-500">
                <p className="md:text-lg">토큰 사용 내역이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 md:p-6 lg:p-8 border-t-8 border-gray-50">
        <div className="max-w-4xl mx-auto">
          <h3 className="font-medium text-gray-800 mb-4 md:text-lg md:mb-6">이용 가능한 서비스</h3>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {availableServices.map(service => (
              <motion.div 
                key={service.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl shadow-card p-4 md:p-5 text-center cursor-pointer hover:shadow-elevated transition-all duration-300"
                onClick={() => handleUseTokens(service.id)}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-2 md:mb-3">
                  {getIconComponent(service.icon)}
                </div>
                <h4 className="font-medium text-sm md:text-base">{service.title}</h4>
                <p className="text-xs md:text-sm text-gray-500 mt-1">{service.cost} 토큰</p>
              </motion.div>
            ))}
            
            {availableServices.length === 0 && (
              <div className="col-span-2 lg:col-span-4 py-5 text-center text-gray-500">
                <p className="md:text-lg">이용 가능한 서비스가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenRewardSystem;
