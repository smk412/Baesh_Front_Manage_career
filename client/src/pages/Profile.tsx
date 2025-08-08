import React from 'react';
import TokenRewardSystem from '@/components/TokenRewardSystem';
import { Helmet } from 'react-helmet';

const Profile: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>내 정보 | BAESH - AI 기반 커리어 에이전트</title>
        <meta name="description" content="토큰 리워드를 관리하고 다양한 AI 기능을 이용하세요." />
      </Helmet>
      
      <TokenRewardSystem />
    </>
  );
};

export default Profile;
