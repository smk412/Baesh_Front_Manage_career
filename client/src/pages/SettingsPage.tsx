import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Fingerprint, 
  Key, 
  Lock, 
  Mail, 
  User, 
  LogOut, 
  CreditCard, 
  Wallet, 
  HelpCircle, 
  Shield, 
  Save,
  Trash
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const userProfile = useStore(state => state.userProfile);
  const fetchUserProfile = useStore(state => state.fetchUserProfile);
  const updateUserProfile = useStore(state => state.updateUserProfile);
  const tokenBalance = useStore(state => state.tokenBalance);
  const tokenHistory = useStore(state => state.tokenHistory);
  const fetchTokenData = useStore(state => state.fetchTokenData);
  
  const [activeTab, setActiveTab] = useState('account');
  const [deleteAccountConfirm, setDeleteAccountConfirm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      recommendAlerts: true,
      feedbackAlerts: true,
      programAlerts: false,
      emailNotifications: true,
      tokenAlerts: true
    }
  });
  
  useEffect(() => {
    fetchUserProfile();
    fetchTokenData();
  }, [fetchUserProfile, fetchTokenData]);
  
  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        name: userProfile.name || '',
        email: userProfile.email || ''
      }));
    }
  }, [userProfile]);
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleToggleNotification = (field: keyof typeof formData.notifications) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field]
      }
    }));
  };
  
  const handleSaveProfile = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "이름과 이메일을 입력해주세요",
        variant: "destructive",
      });
      return;
    }
    
    await updateUserProfile({ 
      name: formData.name,
      email: formData.email,
    });
    
    toast({
      title: "프로필이 업데이트되었습니다",
    });
  };
  
  const handleChangePassword = () => {
    if (!formData.password.trim()) {
      toast({
        title: "현재 비밀번호를 입력해주세요",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.newPassword.trim().length < 8) {
      toast({
        title: "새 비밀번호는 8자 이상이어야 합니다",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "새 비밀번호가 일치하지 않습니다",
        variant: "destructive",
      });
      return;
    }
    
    // TODO: Implement password change API call
    
    toast({
      title: "비밀번호가 변경되었습니다",
    });
    
    // Reset password fields
    setFormData(prev => ({
      ...prev,
      password: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };
  
  const handleLogout = () => {
    // TODO: Implement logout functionality
    
    toast({
      title: "로그아웃되었습니다",
    });
  };
  
  const handleDeleteAccount = () => {
    // TODO: Implement account deletion API call
    
    toast({
      title: "계정이 삭제되었습니다",
      description: "그동안 BAESH를 이용해 주셔서 감사합니다",
    });
    
    setDeleteAccountConfirm(false);
  };
  
  const handleSaveNotifications = () => {
    // TODO: Implement notification settings API call
    
    toast({
      title: "알림 설정이 저장되었습니다",
    });
  };
  
  return (
    <>
      <Helmet>
        <title>설정 | BAESH - AI 기반 커리어 에이전트</title>
        <meta name="description" content="계정 정보 관리 및 앱 설정을 변경하세요." />
      </Helmet>
      
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">설정</h1>
        
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col md:flex-row h-full">
            <div className="border-b md:border-b-0 md:border-r md:w-64 md:flex-shrink-0">
              <TabsList className="w-full justify-start md:flex-col h-auto rounded-none space-x-0 md:space-y-1 md:p-2 bg-white">
                <TabsTrigger 
                  value="account" 
                  className="data-[state=active]:bg-gray-100 rounded-none md:rounded-md w-full justify-start md:mb-1"
                >
                  <User className="w-4 h-4 mr-2" />
                  계정 정보
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="data-[state=active]:bg-gray-100 rounded-none md:rounded-md w-full justify-start md:mb-1"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  보안 및 로그인
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="data-[state=active]:bg-gray-100 rounded-none md:rounded-md w-full justify-start md:mb-1"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  알림 설정
                </TabsTrigger>
                <TabsTrigger 
                  value="payments" 
                  className="data-[state=active]:bg-gray-100 rounded-none md:rounded-md w-full justify-start md:mb-1"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  토큰 및 결제
                </TabsTrigger>
                <TabsTrigger 
                  value="help" 
                  className="data-[state=active]:bg-gray-100 rounded-none md:rounded-md w-full justify-start"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  고객 지원
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6 flex-1">
              <TabsContent value="account" className="mt-0 h-full">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">이름</Label>
                        <Input 
                          id="name" 
                          value={formData.name} 
                          onChange={(e) => handleChange('name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">이메일</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={(e) => handleChange('email', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h2 className="text-lg font-semibold mb-4">추가 정보</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="mbti">MBTI</Label>
                        <Input 
                          id="mbti" 
                          value={userProfile?.mbti || ''} 
                          disabled 
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">
                          MBTI 정보는 온보딩에서 설정한 값이며, 변경이 필요하면 AI 클론을 재생성해주세요.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t flex justify-end">
                    <Button onClick={handleSaveProfile}>
                      <Save className="w-4 h-4 mr-1.5" />
                      저장하기
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="mt-0 h-full">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">비밀번호 변경</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">현재 비밀번호</Label>
                        <Input 
                          id="current-password" 
                          type="password" 
                          value={formData.password} 
                          onChange={(e) => handleChange('password', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">새 비밀번호</Label>
                        <Input 
                          id="new-password" 
                          type="password" 
                          value={formData.newPassword} 
                          onChange={(e) => handleChange('newPassword', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">비밀번호 확인</Label>
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          value={formData.confirmPassword} 
                          onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button onClick={handleChangePassword}>
                        <Key className="w-4 h-4 mr-1.5" />
                        비밀번호 변경
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <h2 className="text-lg font-semibold mb-4">계정 관리</h2>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-1.5" />
                        로그아웃
                      </Button>
                      
                      <Dialog open={deleteAccountConfirm} onOpenChange={setDeleteAccountConfirm}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash className="w-4 h-4 mr-1.5" />
                            계정 삭제
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>계정을 삭제하시겠습니까?</DialogTitle>
                            <DialogDescription>
                              계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="bg-red-50 p-4 rounded-md text-red-600 text-sm mt-2">
                            <p>삭제될 데이터:</p>
                            <ul className="list-disc pl-5 mt-1">
                              <li>AI 클론 정보</li>
                              <li>이력서 및 포트폴리오</li>
                              <li>메시지 및 피드백 내역</li>
                              <li>토큰 잔액 및 구매 내역</li>
                            </ul>
                          </div>
                          <DialogFooter className="mt-4">
                            <Button variant="outline" onClick={() => setDeleteAccountConfirm(false)}>
                              취소
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteAccount}>
                              계정 삭제
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0 h-full">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">앱 알림</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="recommend-alerts">추천 팀원 알림</Label>
                          <p className="text-sm text-gray-500">새로운 팀원 추천이 도착했을 때 알림</p>
                        </div>
                        <Switch 
                          id="recommend-alerts" 
                          checked={formData.notifications.recommendAlerts}
                          onCheckedChange={() => handleToggleNotification('recommendAlerts')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="feedback-alerts">피드백 알림</Label>
                          <p className="text-sm text-gray-500">AI 피드백이 도착했을 때 알림</p>
                        </div>
                        <Switch 
                          id="feedback-alerts" 
                          checked={formData.notifications.feedbackAlerts}
                          onCheckedChange={() => handleToggleNotification('feedbackAlerts')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="program-alerts">공모전/활동 알림</Label>
                          <p className="text-sm text-gray-500">새로운 공모전이나 대외활동 정보 알림</p>
                        </div>
                        <Switch 
                          id="program-alerts" 
                          checked={formData.notifications.programAlerts}
                          onCheckedChange={() => handleToggleNotification('programAlerts')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="token-alerts">토큰 상태 알림</Label>
                          <p className="text-sm text-gray-500">토큰 잔액이 부족할 때 알림</p>
                        </div>
                        <Switch 
                          id="token-alerts" 
                          checked={formData.notifications.tokenAlerts}
                          onCheckedChange={() => handleToggleNotification('tokenAlerts')}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <h2 className="text-lg font-semibold mb-4">이메일 알림</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">이메일 알림</Label>
                          <p className="text-sm text-gray-500">중요 업데이트 및 알림을,이메일로 수신</p>
                        </div>
                        <Switch 
                          id="email-notifications" 
                          checked={formData.notifications.emailNotifications}
                          onCheckedChange={() => handleToggleNotification('emailNotifications')}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t flex justify-end">
                    <Button onClick={handleSaveNotifications}>
                      <Save className="w-4 h-4 mr-1.5" />
                      설정 저장
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="payments" className="mt-0 h-full">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">토큰 정보</h2>
                    <div className="bg-gradient-to-br from-blue-500 to-primary text-white rounded-xl p-6 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100">현재 보유 토큰</p>
                          <h2 className="text-3xl font-bold">{tokenBalance}</h2>
                        </div>
                        <Button variant="secondary" size="sm">
                          토큰 충전
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">결제 방법</h3>
                      <div className="border rounded-lg p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 mr-3 text-gray-400" />
                          <div>
                            <p className="font-medium">신용카드 등록</p>
                            <p className="text-sm text-gray-500">토큰 충전을 위한 결제 수단을 등록하세요</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          카드 추가
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <h2 className="text-lg font-semibold mb-4">토큰 사용 내역</h2>
                    <div className="space-y-3">
                      {tokenHistory.length > 0 ? (
                        tokenHistory.slice(0, 5).map(item => (
                          <div key={item.id} className="border rounded-lg p-3 flex justify-between items-center">
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString('ko-KR')}</p>
                            </div>
                            <div className={`font-medium ${item.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {item.amount > 0 ? '+' : ''}{item.amount}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          토큰 사용 내역이 없습니다
                        </div>
                      )}
                      
                      {tokenHistory.length > 5 && (
                        <Button variant="outline" className="w-full mt-2">
                          모든 내역 보기
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="help" className="mt-0 h-full">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">고객 지원</h2>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">문의하기</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          서비스 이용 중 문제가 발생하셨나요? 아래 이메일로 문의해주세요.
                        </p>
                        <div className="flex items-center text-primary">
                          <Mail className="w-4 h-4 mr-1.5" />
                          <a href="mailto:support@baesh.ai" className="text-primary hover:underline">
                            support@baesh.ai
                          </a>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">개인정보 보호정책</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          저희가 사용자 데이터를 어떻게 처리하는지 확인하세요.
                        </p>
                        <Button variant="link" className="h-auto p-0">
                          <Shield className="w-4 h-4 mr-1.5" />
                          개인정보 보호정책 보기
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">이용약관</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          서비스 이용 약관을 확인하세요.
                        </p>
                        <Button variant="link" className="h-auto p-0">
                          <Fingerprint className="w-4 h-4 mr-1.5" />
                          이용약관 보기
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <h2 className="text-lg font-semibold mb-4">버전 정보</h2>
                    <div className="text-sm text-gray-600">
                      <p>BAESH AI 커리어 에이전트</p>
                      <p>버전: 1.0.0</p>
                      <p className="mt-1">© 2024 BAESH Inc. All rights reserved.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;