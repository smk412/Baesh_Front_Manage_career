import React, { useEffect,useState } from 'react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { ChevronDown, FileText, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const AIPortfolioGenerator: React.FC = () => {
  const portfolioItems = useStore(state => state.portfolioItems);
  const fetchPortfolio = useStore(state => state.fetchPortfolio);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);
  
  const handleExportPDF = () => {
    // PDF export logic here
    console.log('Exporting to PDF...');
  };
  
  const visibleItems = expanded ? portfolioItems : portfolioItems.slice(0, 2);

  return (
    <div className="p-5 md:p-6 lg:p-8 border-t-8 border-gray-50">
      <div className="mb-6 lg:mb-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-semibold">AI 포트폴리오</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleExportPDF}
            className="text-primary font-medium text-sm md:text-base"
          >
            <FileText className="w-4 h-4 mr-1" />
            PDF 내보내기
          </Button>
        </div>
        <p className="text-gray-500 text-sm md:text-base">AI 포트폴리오 최근 항목</p>
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        <motion.div layout className="md:grid md:grid-cols-1 lg:grid-cols-2 gap-6">
          {visibleItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white p-5 md:p-6 rounded-xl shadow-card hover:shadow-elevated transition-all duration-300 mb-4 lg:mb-0"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium md:text-lg">{item.title}</h3>
                <span className={`text-xs md:text-sm ${
                  item.type === 'strength' 
                    ? 'bg-green-100 text-success' 
                    : 'bg-blue-100 text-primary'
                } px-2 py-1 rounded-md`}>
                  {item.type === 'strength' ? '강점' : '발전 중'}
                </span>
              </div>
              <p className="text-sm md:text-base text-gray-600 mt-2">{item.description}</p>
              <div className="mt-3">
                <Progress value={item.proficiency} className="h-2 md:h-3" />
                <div className="flex justify-between mt-1">
                  <span className="text-xs md:text-sm text-gray-500">숙련도</span>
                  <span className="text-xs md:text-sm font-medium">{item.proficiency}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
          
        {!expanded&&portfolioItems.length > 2 && (
          <Button 
            variant="outline" 
            onClick={() => setExpanded(true)}
            className="w-full py-4 bg-white rounded-xl border border-gray-200 text-gray-500 text-sm md:text-base flex items-center justify-center"
          >
            <ChevronUp className="w-4 h-4 mr-1" />
                더보기
          </Button>
        )}
          
        {portfolioItems.length === 0 && (
          <div className="p-6 md:p-8 bg-white rounded-xl shadow-card text-center">
            <p className="text-gray-500 md:text-lg">아직 포트폴리오 항목이 없습니다.</p>
            <p className="text-gray-500 text-sm md:text-base mt-2">경험을 추가하면 AI가 자동으로 항목을 생성합니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPortfolioGenerator;
