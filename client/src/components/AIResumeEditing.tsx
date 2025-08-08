import React, { useEffect, useState} from 'react';
import { SelfIntrFeedBack, useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { ChevronDown, FileText, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLocation } from 'wouter';

const AIResumeEditing:React.FC =()=>{
  const [_, navigate] = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelfIntrFeedBack | null >(null);

  const selfIntrFeedBackItems = useStore(state => state.selfIntrFeedBackList);
  const fetchFeedBack = useStore(state => state.fetchFeedBack);

  useEffect(()=>{
    fetchFeedBack();
  },[fetchFeedBack]);

  const handleDocumentCreation = () => {
    navigate('/selfintro');
    console.log('DocumentCreation...');
  };

  const handleItemClick = (item:React.SetStateAction<SelfIntrFeedBack | null >) => {
    setSelectedItem(item); // 클릭된 항목의 데이터를 저장합니다.
    setIsModalOpen(true); // 모달을 엽니다.
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달을 닫습니다.
    setSelectedItem(null); // 선택된 항목 데이터를 초기화합니다.
  };

  
  const visibleItems = expanded ? selfIntrFeedBackItems : selfIntrFeedBackItems.slice(0, 2);

  return (
    <div className="p-5 md:p-6 lg:p-8 border-t-8 border-gray-50">
      <div className="mb-6 lg:mb-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-semibold">AI 자기소개서 첨삭</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDocumentCreation}
            className="text-primary font-medium text-sm md:text-base"
          >
            <FileText className="w-4 h-4 mr-1" />
            자소서 작성 하기
          </Button>
        </div>
        <p className="text-gray-500 text-sm md:text-base">AI 자기소개서 첨삭 최근 항목</p>
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
              onClick={()=> handleItemClick(item)}
            >
              <Label htmlFor="query">자기소개서 질문</Label>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium md:text-lg">{item.subject}</h3>
              </div>

              <Label htmlFor="AIselfInfo">AI 첨삭 자기소개서</Label>
              <p className="text-sm md:text-base text-gray-600 mb-3">
                {item.content.length > 300? item.content.substring(0,300)+"...": item.content}
              </p>
              
              <Label htmlFor="AIfeedback">AI 피드백</Label>
              <p className="text-sm md:text-base text-gray-600">
                {item.feedback.length > 300? item.feedback.substring(0,300)+"...": item.feedback}
              </p>
            </motion.div>
          ))}
        </motion.div>

      {/* 모달 컴포넌트 렌더링 */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-semibold"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="font-bold text-xl md:text-2xl mb-4 border-b pb-2">{selectedItem.subject}</h2>
            
            <h3 className="font-semibold text-lg mt-4 mb-2">AI 첨삭 자기소개서</h3>
            <p className="text-gray-800 whitespace-pre-wrap mb-4">{selectedItem.content}</p>

            <h3 className="font-semibold text-lg mt-4 mb-2">AI 피드백</h3>
            <p className="text-gray-800 whitespace-pre-wrap">{selectedItem.feedback}</p>
          </motion.div>
        </div>)}

        {!expanded&&selfIntrFeedBackItems.length > 2 && (
          <Button 
            variant="outline" 
            onClick={() => setExpanded(true)}
            className="w-full py-4 bg-white rounded-xl border border-gray-200 text-gray-500 text-sm md:text-base flex items-center justify-center"
          >
            <ChevronUp className="w-4 h-4 mr-1" />
                더보기
          </Button>
        )}

        {selfIntrFeedBackItems.length === 0 && (
          <div className="p-6 md:p-8 bg-white rounded-xl shadow-card text-center">
            <p className="text-gray-500 md:text-lg">아직 자기소개서 항목이 없습니다.</p>
            <p className="text-gray-500 text-sm md:text-base mt-2">자기소개서를 작성하거나 올리면 AI가 도와드립니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIResumeEditing;