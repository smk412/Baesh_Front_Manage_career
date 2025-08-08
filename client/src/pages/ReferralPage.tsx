import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Copy, RefreshCcw, Share2, Gift, Users, Coins, Calendar, Check } from 'lucide-react';

const ReferralPage: React.FC = () => {
  const { toast } = useToast();
  const referralCode = useStore(state => state.referralCode);
  const referrals = useStore(state => state.referrals);
  const tokenHistory = useStore(state => state.tokenHistory);
  const tokenBalance = useStore(state => state.tokenBalance);
  const fetchReferralData = useStore(state => state.fetchReferralData);
  const fetchTokenData = useStore(state => state.fetchTokenData);
  const generateReferralCode = useStore(state => state.generateReferralCode);
  
  const [activeTab, setActiveTab] = useState('code');
  
  useEffect(() => {
    fetchReferralData();
    fetchTokenData();
  }, [fetchReferralData, fetchTokenData]);
  
  const handleCopyCode = () => {
    if (!referralCode) return;
    
    navigator.clipboard.writeText(referralCode.code);
    toast({
      title: "코드가 복사되었습니다",
      description: "친구에게 공유해보세요!",
    });
  };
  
  const handleGenerateNewCode = async () => {
    await generateReferralCode();
    toast({
      title: "새 초대 코드가 생성되었습니다",
    });
  };
  
  const handleShareCode = () => {
    if (!referralCode) return;
    
    // Use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: 'BAESH AI 커리어 에이전트에 초대합니다',
        text: `BAESH AI 커리어 에이전트에서 함께 성장해요! 내 초대 코드: ${referralCode.code}`,
        url: window.location.origin
      });
    } else {
      // Fallback to copy to clipboard
      handleCopyCode();
    }
  };
  
  // Filter token history to show only referral rewards
  const referralRewards = tokenHistory.filter(item => 
    item.title.includes('초대') && item.amount > 0
  );
  
  return (
    <>
      <Helmet>
        <title>친구 초대 | BAESH - AI 기반 커리어 에이전트</title>
        <meta name="description" content="친구를 초대하고 토큰 보상을 받으세요. 더 많은 기능을 무료로 이용할 수 있습니다." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-1">친구 초대</h1>
        <p className="text-gray-600 mb-6">친구를 초대하고 토큰 보상을 받으세요</p>
        
        <div className="bg-gradient-to-br from-blue-500 to-primary text-white rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold mb-1">친구 초대 프로그램</h2>
              <p className="text-blue-100">초대한 친구가 가입하면 두 사람 모두 500 토큰을 받습니다</p>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-white text-primary rounded-lg py-2 px-4 font-semibold text-sm inline-flex items-center">
                <Gift className="w-4 h-4 mr-1" />
                현재 토큰: {tokenBalance}
              </div>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="code">
              <Share2 className="w-4 h-4 mr-2" />
              초대 코드
            </TabsTrigger>
            <TabsTrigger value="status">
              <Users className="w-4 h-4 mr-2" />
              초대 현황
            </TabsTrigger>
            <TabsTrigger value="rewards">
              <Coins className="w-4 h-4 mr-2" />
              보상 내역
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="code">
            <div className="bg-white rounded-xl shadow-card p-6 space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">나의 초대 코드</h3>
                <p className="text-gray-600 text-sm">
                  이 코드를 친구에게 공유하세요. 친구가 가입 시 이 코드를 입력하면 둘 다 500 토큰을 받습니다.
                </p>
              </div>
              
              {referralCode ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      value={referralCode.code}
                      readOnly
                      className="font-mono text-center bg-gray-50 border-dashed"
                    />
                    <Button variant="outline" size="icon" onClick={handleCopyCode}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>이미 {referralCode.usedCount}명이 이 코드를 사용했습니다</span>
                    <Button variant="ghost" size="sm" onClick={handleGenerateNewCode} className="flex items-center">
                      <RefreshCcw className="w-3 h-3 mr-1" />
                      새 코드 생성
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button className="w-full" onClick={handleShareCode}>
                      <Share2 className="w-4 h-4 mr-2" />
                      초대 코드 공유하기
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">아직 초대 코드가 없습니다</p>
                  <Button onClick={handleGenerateNewCode}>
                    <Share2 className="w-4 h-4 mr-2" />
                    초대 코드 생성하기
                  </Button>
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mt-4">
              <h3 className="font-medium text-primary mb-2">친구 초대 시 이용 가능한 기능</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                  <span>AI 이력서 첨삭 (200 토큰)</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                  <span>합격 가능성 예측 (150 토큰)</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                  <span>맞춤형 포트폴리오 생성 (300 토큰)</span>
                </li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="status">
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="font-semibold text-lg mb-4">초대 현황</h3>
              
              {referrals.length > 0 ? (
                <div className="space-y-4">
                  {referrals.map(referral => (
                    <motion.div
                      key={referral.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-between items-center p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">초대 코드: {referral.code}</p>
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{new Date(referral.createdAt).toLocaleDateString('ko-KR')}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          referral.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {referral.status === 'completed' ? '완료' : '대기 중'}
                        </span>
                        {referral.status === 'completed' && referral.rewardAmount && (
                          <p className="text-green-600 font-medium text-sm mt-1">
                            +{referral.rewardAmount} 토큰
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600">아직 초대한 친구가 없습니다</p>
                  <p className="text-sm text-gray-500 mt-1">친구들을 초대하고 함께 성장해보세요!</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="rewards">
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="font-semibold text-lg mb-4">보상 내역</h3>
              
              {referralRewards.length > 0 ? (
                <div className="space-y-3">
                  {referralRewards.map(reward => (
                    <motion.div
                      key={reward.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-between items-center p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{reward.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(reward.date).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <div className="text-green-600 font-medium">
                        +{reward.amount} 토큰
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <Coins className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600">아직 초대 보상이 없습니다</p>
                  <p className="text-sm text-gray-500 mt-1">친구를 초대하고 토큰 보상을 받아보세요!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ReferralPage;