import React from 'react';
import InternalSNSConnector from '@/components/InternalSNSConnector';
import ExternalSNSConnector from '@/components/ExternalSNSConnector';
import JobMatchingBoard from '@/components/JobMatchingBoard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from 'react-helmet';

const Explore: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>탐색 | BAESH - AI 기반 커리어 에이전트</title>
        <meta name="description" content="전문가를 찾고 당신에게 맞는 채용 정보를 확인하세요." />
      </Helmet>
      
      <Tabs defaultValue="experts" className="w-full">
        <div className="px-5 pt-3">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100">
            <TabsTrigger value="experts">전문가 찾기</TabsTrigger>
            <TabsTrigger value="hiddenexpert">숨은 전문가 찾기</TabsTrigger>
            <TabsTrigger value="jobs">채용 매칭</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="experts" className="mt-0">
          <InternalSNSConnector />
        </TabsContent>

        <TabsContent value="hiddenexpert" className="mt-0">
          <ExternalSNSConnector />
        </TabsContent>

        <TabsContent value="jobs" className="mt-0">
          <JobMatchingBoard />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Explore;
