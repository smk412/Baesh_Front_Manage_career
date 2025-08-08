import React, { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FileDown, Zap, Calendar, Star, BarChart2, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'wouter';

const MyClonePage: React.FC = () => {
  const aiClone = useStore(state => state.aiClone);
  const fetchAIClone = useStore(state => state.fetchAIClone);
  
  useEffect(() => {
    fetchAIClone();
  }, [fetchAIClone]);
  
  if (!aiClone) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-t-2 border-primary rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">AI 클론을 불러오는 중입니다...</p>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>내 AI 클론 | BAESH - AI 기반 커리어 에이전트</title>
        <meta name="description" content="당신의 커리어 AI 클론을 확인하세요. 맞춤형 커리어 추천과 분석을 제공합니다." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Profile header */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="w-24 h-24 md:w-28 md:h-28 bg-primary/10 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
              <span className="text-4xl text-primary font-semibold">{aiClone.name.charAt(0)}</span>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{aiClone.name}</h1>
                  <p className="text-gray-600">{aiClone.role}</p>
                </div>
                
                <div className="flex mt-4 md:mt-0 space-x-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <FileDown className="w-4 h-4" />
                    <span>내보내기</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Share2 className="w-4 h-4" />
                    <span>공유</span>
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>업데이트: {new Date(aiClone.lastUpdated).toLocaleDateString('ko-KR')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold mb-3">성격 요약</h2>
            <p className="text-gray-700">{aiClone.personality}</p>
          </div>
        </div>
        
        {/* Clone summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div 
            className="bg-white rounded-xl shadow-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">강점 분석</h2>
                <p className="text-gray-500 text-sm">당신의 주요 강점</p>
              </div>
            </div>
            
            <ul className="space-y-3">
              {aiClone.strengths.map((strength, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + (index * 0.1) }}
                  className="flex items-start"
                >
                  <span className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center mr-2 flex-shrink-0 text-xs text-primary font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{strength}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl shadow-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">추천 커리어 경로</h2>
                <p className="text-gray-500 text-sm">AI 분석 기반 추천</p>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">적합한 커리어 경로</h3>
              <div className="bg-blue-50 text-primary p-3 rounded-lg font-medium">
                {aiClone.recommendations.careerPath}
              </div>
            </div>
            
            <h3 className="font-medium mb-2">다음 단계 추천</h3>
            <ul className="space-y-2">
              {aiClone.recommendations.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center mr-2 flex-shrink-0 text-xs text-primary font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        {/* Skills section */}
        <motion.div 
          className="bg-white rounded-xl shadow-card p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
              <BarChart2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">중요 핵심 역량</h2>
              <p className="text-gray-500 text-sm">발전시키면 좋을 역량 분석</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiClone.recommendations.skills.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-sm text-gray-500">중요도: {skill.importance}%</span>
                </div>
                <Progress value={skill.importance} className="h-2" />
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Action buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/resume">
            <Button variant="outline" className="w-full">이력서 생성</Button>
          </Link>
          <Link href="/feedback">
            <Button variant="outline" className="w-full">커리어 상담</Button>
          </Link>
          <Link href="/recommend">
            <Button variant="outline" className="w-full">추천 팀원 보기</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MyClonePage;