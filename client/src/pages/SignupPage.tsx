import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  Phone,
  ArrowRight,
  Check,
  ChevronRight,
  Shield,
  Hotel,
  FilePen,
} from 'lucide-react';

const SignupPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    residenceCity: '',
    intro: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "비밀번호 오류",
        description: "비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }
    
    // 필수 약관 동의 확인
    if (!formData.agreeTerms || !formData.agreePrivacy) {
      toast({
        title: "약관 동의 필요",
        description: "필수 약관에 동의해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phone,
          password: formData.password,
          location: formData.residenceCity,
          intro: formData.intro,
          agreeTerms: formData.agreeTerms,
          agreePrivacy: formData.agreePrivacy,
          agreeMarketing: formData.agreeMarketing,
        }),
      });

      if (response.ok) {
        toast({
          title: "회원가입 완료",
          description: "BAESH에 오신 것을 환영합니다! 로그인해주세요.",
        });
        setLocation('/login');
      } else {
        const error = await response.json();
        toast({
          title: "회원가입 실패",
          description: error.message || "회원가입 중 문제가 발생했습니다. 자기소개를 다시 확인 해주세요",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "회원가입 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      // 1단계 검증
      if (!formData.name || !formData.email || !formData.phone 
        || !formData.residenceCity || !formData.intro) {
        toast({
          title: "필수 정보 입력",
          description: "모든 필수 정보를 입력해주세요.",
          variant: "destructive",
        });
        return;
      }
      
      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "이메일 형식 오류",
          description: "올바른 이메일 주소를 입력해주세요.",
          variant: "destructive",
        });
        return;
      }

      //이메일 중복 검증
      const emailCheckResponse = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email }),
      });
      if (emailCheckResponse.status === 200) {
        const result = await emailCheckResponse.json();
        console.log(result);
        if (result.exists) {
          toast({
            title: "이메일 중복",
            description: "이미 사용 중인 이메일입니다.",
            variant: "destructive",
          });
          return;
        }
      } else {
        toast({
          title: "서버 오류",
          description: "이메일 중복 확인 중 오류가 발생했습니다.",
          variant: "destructive",
        });
        return;
      }
      // 모두 검증 통과 시 다음 단계로 이동
      setCurrentStep(2);
    }
  };

  const validatePassword = (password: string) => {
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      hasLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: hasLength && hasUpper && hasLower && hasNumber && hasSpecial
    };
  };

  const passwordValidation = validatePassword(formData.password);

  return (
    <>
      <Helmet>
        <title>회원가입 | BAESH - AI 기반 커리어 에이전트</title>
        <meta name="description" content="BAESH에 가입하여 AI 기반 커리어 관리를 시작하세요." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <span className="ml-2 font-medium">기본 정보</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <div className={`flex items-center ${currentStep >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="ml-2 font-medium">보안 설정</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">BAESH 회원가입</h1>
              <p className="text-gray-600">AI와 함께하는 새로운 커리어 여정을 시작하세요</p>
            </div>

            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      이름 <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="실명을 입력하세요"
                        className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      이메일 <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      휴대폰 번호 <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="010-0000-0000"
                        className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="residenceCity" className="text-sm font-medium text-gray-700">
                      거주 도시<span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1">
                      <Hotel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="residenceCity"
                        name="residenceCity"
                        type="text"
                        required
                        value={formData.residenceCity}
                        onChange={handleChange}
                        placeholder="거주 도시를 입력하세요"
                        className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="intro" className="text-sm font-medium text-gray-700">
                      자신을 간단히 소개해주세요 (최대 200자)<span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1">
                      <FilePen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="intro"
                        name="intro"
                        type="text"
                        required
                        value={formData.intro}
                        onChange={handleChange}
                        placeholder="AI 전문가로서 데이터 분석과 머신러닝에 열정을 가지고 있습니다."
                        maxLength={200}
                        autoComplete="off"
                        className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors group"
                  >
                    다음 단계
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      비밀번호 <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="안전한 비밀번호를 입력하세요"
                        className="pl-10 pr-10 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {/* Password validation */}
                    <div className="mt-3 space-y-2">
                      <div className={`flex items-center text-sm ${passwordValidation.hasLength ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${passwordValidation.hasLength ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {passwordValidation.hasLength && <Check className="w-3 h-3" />}
                        </div>
                        8자 이상
                      </div>
                      <div className={`flex items-center text-sm ${passwordValidation.hasUpper && passwordValidation.hasLower ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${passwordValidation.hasUpper && passwordValidation.hasLower ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {passwordValidation.hasUpper && passwordValidation.hasLower && <Check className="w-3 h-3" />}
                        </div>
                        대소문자 포함
                      </div>
                      <div className={`flex items-center text-sm ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${passwordValidation.hasNumber ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {passwordValidation.hasNumber && <Check className="w-3 h-3" />}
                        </div>
                        숫자 포함
                      </div>
                      <div className={`flex items-center text-sm ${passwordValidation.hasSpecial ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${passwordValidation.hasSpecial ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {passwordValidation.hasSpecial && <Check className="w-3 h-3" />}
                        </div>
                        특수문자 포함
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      비밀번호 확인 <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="비밀번호를 다시 입력하세요"
                        className="pl-10 pr-10 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">비밀번호가 일치하지 않습니다.</p>
                    )}
                  </div>

                  {/* Terms and conditions */}
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-primary" />
                      <span className="font-medium text-gray-900">약관 동의</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agreeTerms"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: !!checked })}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor="agreeTerms" className="text-sm text-gray-700 cursor-pointer">
                            <span className="text-red-500">*</span> 서비스 이용약관에 동의합니다
                            <button type="button" className="ml-2 text-primary hover:underline">보기</button>
                          </Label>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agreePrivacy"
                          name="agreePrivacy"
                          checked={formData.agreePrivacy}
                          onCheckedChange={(checked) => setFormData({ ...formData, agreePrivacy: !!checked })}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor="agreePrivacy" className="text-sm text-gray-700 cursor-pointer">
                            <span className="text-red-500">*</span> 개인정보 수집 및 이용에 동의합니다
                            <button type="button" className="ml-2 text-primary hover:underline">보기</button>
                          </Label>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agreeMarketing"
                          name="agreeMarketing"
                          checked={formData.agreeMarketing}
                          onCheckedChange={(checked) => setFormData({ ...formData, agreeMarketing: !!checked })}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor="agreeMarketing" className="text-sm text-gray-700 cursor-pointer">
                            마케팅 정보 수신에 동의합니다 (선택)
                            <button type="button" className="ml-2 text-primary hover:underline">보기</button>
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 h-12"
                    >
                      이전
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading || !passwordValidation.isValid}
                      className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors group"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          회원가입 완료
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                이미 계정이 있으신가요?{' '}
                <button
                  onClick={() => setLocation('/login')}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  로그인
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;