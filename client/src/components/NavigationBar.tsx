import { useLocation } from 'wouter';
import { useStore, TabType } from '@/lib/store';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  MessageSquare, 
  Search, 
  User,
  Rocket,
  UserCircle,
  FileEdit,
  Share2,
  Award,
  Settings,
  GraduationCap
} from 'lucide-react';

interface NavigationBarProps {
  orientation?: 'horizontal' | 'vertical';
}

const NavigationBar: React.FC<NavigationBarProps> = ({ orientation = 'horizontal' }) => {
  const [location, setLocation] = useLocation();
  const activeTab = useStore(state => state.activeTab);
  const setActiveTab = useStore(state => state.setActiveTab);

  // Main tabs that appear in both horizontal and vertical navigation
  const mainTabs = [
    { id: 'career', path: '/', label: '내 이력', icon: FileText },
    { id: 'recommend', path: '/recommend', label: '추천 팀원', icon: Users },
    { id: 'feedback', path: '/feedback', label: '피드백', icon: MessageSquare },
    { id: 'explore', path: '/explore', label: '탐색', icon: Search },
    { id: 'profile', path: '/profile', label: '내 정보', icon: User }
  ];

  // Additional tabs that only appear in vertical (desktop) navigation
  const additionalTabs = [
    { id: 'myclone', path: '/myclone', label: '내 AI 클론', icon: UserCircle },
    { id: 'resume', path: '/resume', label: '이력서 관리', icon: FileEdit },
    { id: 'referral', path: '/referral', label: '초대하기', icon: Share2 },
    { id: 'program', path: '/program', label: '활동 보드', icon: Award },
    { id: 'mentor', path: '/mentor', label: '멘토 찾기', icon: GraduationCap },
    { id: 'settings', path: '/settings', label: '설정', icon: Settings }
  ];

  // Special tab for onboarding
  const onboardingTab = { id: 'onboarding', path: '/onboarding', label: '시작하기', icon: Rocket };

  const handleTabClick = (tabId: TabType, path: string) => {
    setActiveTab(tabId);
    setLocation(path);
  };

  if (orientation === 'vertical') {
    // For desktop sidebar navigation, show all tabs
    return (
      <nav className="w-full bg-white h-full flex flex-col pt-8">
        <div className="px-4 mb-8">
          <h1 className="text-xl font-bold text-primary">BAESH</h1>
          <p className="text-xs text-gray-500 mt-1">AI 커리어 에이전트</p>
        </div>
        
        <div className="flex-1 flex flex-col space-y-1 px-3">
          {/* Special onboarding button at the top */}
          <button
            key={onboardingTab.id}
            onClick={() => handleTabClick(onboardingTab.id as TabType, onboardingTab.path)}
            className={`flex items-center py-3 px-4 rounded-md relative text-left transition-all mb-2 ${
              activeTab === onboardingTab.id 
                ? 'text-primary bg-blue-50 font-medium' 
                : 'text-primary bg-blue-50/50 hover:bg-blue-50'
            }`}
          >
            <onboardingTab.icon className="w-5 h-5 mr-3" />
            <span>{onboardingTab.label}</span>
            {activeTab === onboardingTab.id && (
              <motion.div
                layoutId="nav-indicator-vertical"
                className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"
                transition={{ duration: 0.3 }}
              />
            )}
          </button>

          {/* Section divider */}
          <div className="my-2 text-xs text-gray-400 px-4 py-1">
            메인 메뉴
          </div>
          
          {/* Main navigation tabs */}
          {mainTabs.map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id as TabType, tab.path)}
                className={`flex items-center py-3 px-4 rounded-md relative text-left transition-all ${
                  isActive 
                    ? 'text-primary bg-blue-50 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator-vertical"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            );
          })}

          {/* Section divider */}
          <div className="my-2 text-xs text-gray-400 px-4 py-1">
            부가 기능
          </div>

          {/* Additional navigation tabs */}
          {additionalTabs.map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id as TabType, tab.path)}
                className={`flex items-center py-3 px-4 rounded-md relative text-left transition-all ${
                  isActive 
                    ? 'text-primary bg-blue-50 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator-vertical"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // For mobile bottom navigation, show only main tabs
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20 w-full">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {mainTabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id as TabType, tab.path)}
              className={`flex flex-col items-center px-3 py-2 relative ${
                isActive ? 'text-primary' : 'text-gray-400'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-primary"
                  transition={{ duration: 0.3 }}
                />
              )}
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default NavigationBar;
