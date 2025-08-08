import React from 'react';
import CloneRecommender from '@/components/CloneRecommender';
import { Helmet } from 'react-helmet';

const RecommendedTeammates: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>추천 팀원 | BAESH - AI 기반 커리어 에이전트</title>
        <meta name="description" content="AI가 당신의 경험과 목표에 맞는 팀원을 추천해드립니다." />
      </Helmet>
      
      <CloneRecommender />
    </>
  );
};

export default RecommendedTeammates;
