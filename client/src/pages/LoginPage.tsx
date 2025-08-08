import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Star
} from 'lucide-react';

const LoginPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
        console.log('Login response:', response);
      if (response.ok) {
        toast({
          title: "로그인 성공",
          description: "BAESH에 오신 것을 환영합니다!",
        });
        setLocation('/');
      } else {
        const error = await response.json();
        toast({
          title: "로그인 실패",
          description: error.message || "이메일 또는 비밀번호를 확인해주세요.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "로그인 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Helmet>
        <title>로그인 | BAESH - AI 기반 커리어 에이전트</title>
        <meta name="description" content="BAESH에 로그인하여 AI 기반 커리어 관리를 시작하세요." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
        {/* Left side - Hero section */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-blue-600/90" />
          
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute top-20 left-20 w-16 h-16 border-2 border-white/20 rounded-full"
            />
            <motion.div
              animate={{
                y: [-10, 10, -10],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-40 right-32 w-8 h-8 bg-white/10 rounded-lg"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-40 left-32 w-12 h-12 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full"
            />
          </div>
          
          <div className="relative z-10 flex flex-col justify-center px-16 text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">BAESH</h1>
              </div>
              
              <h2 className="text-4xl font-bold leading-tight mb-6">
                당신의 커리어를<br />
                설명하는 건<br />
                <span className="text-yellow-300">이제 AI입니다</span>
              </h2>
              
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                인공지능이 분석한 당신만의 커리어 스토리로<br />
                더 나은 기회를 만나보세요
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center text-white/90">
                <Target className="w-5 h-5 mr-3" />
                <span>맞춤형 커리어 분석 및 추천</span>
              </div>
              <div className="flex items-center text-white/90">
                <Zap className="w-5 h-5 mr-3" />
                <span>AI 기반 이력서 최적화</span>
              </div>
              <div className="flex items-center text-white/90">
                <Star className="w-5 h-5 mr-3" />
                <span>개인화된 커리어 코칭</span>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Right side - Login form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">로그인</h2>
              <p className="text-gray-600">BAESH로 커리어 여정을 시작하세요</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    이메일
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      name="userId"
                      type="email"
                      required
                      value={formData.userId}
                      onChange={handleChange}
                      placeholder="이메일을 입력하세요"
                      className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    비밀번호
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
                      placeholder="비밀번호를 입력하세요"
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
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="ml-2 text-sm text-gray-600">로그인 상태 유지</span>
                </label>
                
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  비밀번호를 잊으셨나요?
                </button>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    로그인
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                아직 계정이 없으신가요?{' '}
                <button
                  onClick={() => setLocation('/signup')}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  회원가입
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;