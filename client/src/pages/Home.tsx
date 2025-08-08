import React from 'react';
import CareerLogger from '@/components/CareerLogger';
import AIPortfolioGenerator from '@/components/AIPortfolioGenerator';
import { Helmet } from 'react-helmet';
import AIResumeEditing from '@/components/AIResumeEditing';

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>내 이력 | BAESH - AI 기반 커리어 에이전트</title>
        <meta name="description" content="경험을 기록하고 AI가 자동으로 분석해 포트폴리오를 생성합니다." />
      </Helmet>
      
      <div>
        <CareerLogger />
        <AIPortfolioGenerator />
        <AIResumeEditing />
      </div>
    </>
  );
};

export default Home;
