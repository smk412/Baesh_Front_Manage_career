import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useLocation } from 'wouter';

// TypeScript type declaration for React Helmet
declare module 'react-helmet';
import { Rocket, ArrowRight, Check } from 'lucide-react';
import { Helmet } from 'react-helmet';

const OnboardingPage: React.FC = () => {
  const [location, navigate] = useLocation();
  const onboardingStep = useStore(state => state.onboardingStep);
  const setOnboardingStep = useStore(state => state.setOnboardingStep);
  const userProfile = useStore(state => state.userProfile);
  const updateUserProfile = useStore(state => state.updateUserProfile);
  const generateAIClone = useStore(state => state.generateAIClone);
  
  // Form states
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    jobInterest: userProfile?.jobInterest || '',
    workStyle: userProfile?.workStyle || '',
    mbti: userProfile?.mbti || '',
    careerGoal: userProfile?.careerGoal || ''
  });
  
  // Handle form input changes
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Handle next step
  const handleNext = async () => {
    if (onboardingStep < 5) {
      // Update the profile data at each step
      await updateUserProfile({ 
        ...formData
      });
      setOnboardingStep(onboardingStep + 1);
    } else {
      // Final step - generate AI clone and navigate to MyClonePage
      await generateAIClone();
      navigate('/myclone');
    }
  };
  
  // Handle back
  const handleBack = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    }
  };
  
  // Define steps content
  const renderStepContent = () => {
    switch (onboardingStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">반갑습니다!</h2>
              <p className="text-gray-600">AI 커리어 클론 생성을 위해 몇 가지 정보가 필요합니다.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input 
                  id="name" 
                  placeholder="이름을 입력하세요" 
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="이메일을 입력하세요" 
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">직무 관심사</h2>
              <p className="text-gray-600">어떤 직무에 관심이 있으신가요?</p>
            </div>
            
            <div className="space-y-4">
              <RadioGroup 
                value={formData.jobInterest} 
                onValueChange={(value) => handleChange('jobInterest', value)}
              >
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="frontend" id="frontend" />
                  <Label htmlFor="frontend">프론트엔드 개발</Label>
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="backend" id="backend" />
                  <Label htmlFor="backend">백엔드 개발</Label>
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="design" id="design" />
                  <Label htmlFor="design">UX/UI 디자인</Label>
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="pm" id="pm" />
                  <Label htmlFor="pm">프로젝트 관리</Label>
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="marketing" id="marketing" />
                  <Label htmlFor="marketing">마케팅</Label>
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">기타</Label>
                </div>
              </RadioGroup>
              
              {formData.jobInterest === 'other' && (
                <Input 
                  placeholder="관심 직무를 입력하세요" 
                  className="mt-2"
                  onChange={(e) => handleChange('jobInterest', e.target.value)}
                />
              )}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">MBTI</h2>
              <p className="text-gray-600">당신의 MBTI는 무엇인가요?</p>
            </div>
            
            <div className="space-y-4">
              <Select 
                value={formData.mbti} 
                onValueChange={(value) => handleChange('mbti', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="MBTI 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTJ">INTJ - 용의주도한 전략가</SelectItem>
                  <SelectItem value="INTP">INTP - 논리적인 사색가</SelectItem>
                  <SelectItem value="ENTJ">ENTJ - 대담한 통솔자</SelectItem>
                  <SelectItem value="ENTP">ENTP - 뜨거운 논쟁을 즐기는 변론가</SelectItem>
                  <SelectItem value="INFJ">INFJ - 선의의 옹호자</SelectItem>
                  <SelectItem value="INFP">INFP - 열정적인 중재자</SelectItem>
                  <SelectItem value="ENFJ">ENFJ - 정의로운 사회운동가</SelectItem>
                  <SelectItem value="ENFP">ENFP - 재기발랄한 활동가</SelectItem>
                  <SelectItem value="ISTJ">ISTJ - 청렴결백한 논리주의자</SelectItem>
                  <SelectItem value="ISFJ">ISFJ - 용감한 수호자</SelectItem>
                  <SelectItem value="ESTJ">ESTJ - 엄격한 관리자</SelectItem>
                  <SelectItem value="ESFJ">ESFJ - 사교적인 외교관</SelectItem>
                  <SelectItem value="ISTP">ISTP - 만능 재주꾼</SelectItem>
                  <SelectItem value="ISFP">ISFP - 호기심 많은 예술가</SelectItem>
                  <SelectItem value="ESTP">ESTP - 모험을 즐기는 사업가</SelectItem>
                  <SelectItem value="ESFP">ESFP - 자유로운 영혼의 연예인</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">선호하는 업무 스타일</h3>
              <RadioGroup 
                value={formData.workStyle} 
                onValueChange={(value) => handleChange('workStyle', value)}
              >
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="independent" id="independent" />
                  <Label htmlFor="independent">독립적인 업무</Label>
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="collaborative" id="collaborative" />
                  <Label htmlFor="collaborative">협업 위주의 업무</Label>
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="hybrid" id="hybrid" />
                  <Label htmlFor="hybrid">두 가지 모두 균형있게</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">커리어 목표</h2>
              <p className="text-gray-600">당신의 현재 커리어 목표는 무엇인가요?</p>
            </div>
            
            <div className="space-y-4">
              <RadioGroup 
                value={formData.careerGoal} 
                onValueChange={(value) => handleChange('careerGoal', value)}
              >
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="job_change" id="job_change" />
                  <Label htmlFor="job_change">이직 준비</Label>
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="skill_improvement" id="skill_improvement" />
                  <Label htmlFor="skill_improvement">기술 역량 향상</Label>
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="portfolio" id="portfolio" />
                  <Label htmlFor="portfolio">포트폴리오 정리</Label>
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="side_project" id="side_project" />
                  <Label htmlFor="side_project">사이드 프로젝트</Label>
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="networking" id="networking" />
                  <Label htmlFor="networking">인맥 형성 및 네트워킹</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-primary"
              >
                <Rocket className="w-10 h-10" />
              </motion.div>
              <h2 className="text-2xl font-semibold">좋아요!</h2>
              <p className="text-gray-600">
                이제 AI 클론을 생성할 준비가 완료되었습니다.<br />
                AI 클론은 당신의
                {formData.mbti && <span className="font-medium"> {formData.mbti}</span>} 성격과 
                {formData.workStyle === 'independent' && " 독립적인 업무 스타일"}
                {formData.workStyle === 'collaborative' && " 협업 위주의 업무 스타일"}
                {formData.workStyle === 'hybrid' && " 균형 잡힌 업무 스타일"}을 반영하여 생성됩니다.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">정보 요약</h3>
              <ul className="space-y-1 text-sm">
                <li><span className="text-gray-500">이름:</span> {formData.name}</li>
                <li><span className="text-gray-500">직무 관심사:</span> {formData.jobInterest}</li>
                <li><span className="text-gray-500">MBTI:</span> {formData.mbti}</li>
                <li><span className="text-gray-500">업무 스타일:</span> {formData.workStyle}</li>
                <li><span className="text-gray-500">커리어 목표:</span> {formData.careerGoal}</li>
              </ul>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <>
      <Helmet>
        <title>시작하기 | BAESH - AI 기반 커리어 에이전트</title>
        <meta name="description" content="BAESH AI 커리어 에이전트 설정을 시작하고 개인화된 AI 클론을 생성하세요." />
      </Helmet>
      
      <div className="max-w-md mx-auto p-6">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">진행 상황</span>
            <span className="text-sm text-gray-500">{onboardingStep}/5</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(onboardingStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={onboardingStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          {onboardingStep > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              이전
            </Button>
          ) : (
            <div></div> // Empty div for spacing
          )}
          
          <Button onClick={handleNext} disabled={
            // Disable button if required fields are empty
            (onboardingStep === 1 && (!formData.name || !formData.email)) ||
            (onboardingStep === 2 && !formData.jobInterest) ||
            (onboardingStep === 3 && (!formData.mbti || !formData.workStyle)) ||
            (onboardingStep === 4 && !formData.careerGoal)
          }>
            {onboardingStep < 5 ? (
              <>
                다음
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            ) : (
              <>
                AI 클론 생성하기
                <Check className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default OnboardingPage;