import React from 'react';
import NavigationBar from './NavigationBar';
import Header from './Header';
import { useStore, TabType } from '@/lib/store';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const activeTab = useStore(state => state.activeTab);
  const isMobile = useIsMobile();
  
  const tabTitles: Record<TabType, string> = {
    career: '내 이력',
    recommend: '추천 팀원',
    feedback: '피드백',
    explore: '탐색',
    profile: '내 정보',
    onboarding: '시작하기',
    myclone: '내 AI 클론',
    resume: '이력서 관리',
    referral: '초대하기',
    program: '활동 보드',
    settings: '설정',
    mentor: '멘토 찾기'
  };

  return (
    <div className="bg-white text-dark w-full h-screen flex flex-col lg:flex-row overflow-hidden relative">
      {/* Desktop sidebar navigation - visible on lg screens and up */}
      <div className="hidden lg:flex lg:w-64 border-r border-gray-100 h-screen flex-shrink-0">
        <NavigationBar orientation="vertical" />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col max-w-full lg:max-w-[calc(100%-16rem)] mx-auto w-full">
        <Header title={tabTitles[activeTab]} />
        
        <motion.main 
          className="flex-1 overflow-y-auto pb-20 lg:pb-4 w-full max-w-4xl mx-auto"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          key={activeTab}
        >
          {children}
        </motion.main>
        
        {/* Mobile navigation - only visible on small screens */}
        <div className="lg:hidden">
          <NavigationBar orientation="horizontal" />
        </div>
      </div>
    </div>
  );
};

export default Layout;
