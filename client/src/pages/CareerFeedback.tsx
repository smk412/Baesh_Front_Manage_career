import React from 'react';
import CareerInsightChat from '@/components/CareerInsightChat';
import { Helmet } from 'react-helmet';

const CareerFeedback: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>커리어 피드백 | BAESH - AI 기반 커리어 에이전트</title>
        <meta name="description" content="AI에게 커리어 관련 질문을 하고 피드백을 받아보세요." />
      </Helmet>
      
      <CareerInsightChat />
    </>
  );
};

export default CareerFeedback;
