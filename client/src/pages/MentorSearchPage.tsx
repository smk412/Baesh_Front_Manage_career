import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  MapPin, 
  ExternalLink, 
  Star, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Clock,
  Mail
} from 'lucide-react';

// Platform-specific icons
import { SiLinkedin, SiGithub, SiBehance, SiMedium } from 'react-icons/si';

const MentorSearchPage: React.FC = () => {
  const { toast } = useToast();
  const mentors = useStore(state => state.mentors);
  const fetchMentors = useStore(state => state.fetchMentors);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [mentorDialogOpen, setMentorDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);
  
  const handleSearch = () => {
    fetchMentors(searchQuery);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <SiLinkedin className="w-4 h-4" />;
      case 'github':
        return <SiGithub className="w-4 h-4" />;
      case 'behance':
        return <SiBehance className="w-4 h-4" />;
      case 'medium':
        return <SiMedium className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };
  
  // Filter mentors by expertise category based on active tab
  const filteredMentors = mentors.filter(mentor => {
    if (activeTab === 'all') return true;
    return mentor.expertise.some(exp => exp.toLowerCase().includes(activeTab));
  });
  
  // Group mentors by expertise for the "Browse by category" section
  const expertiseCategories = [
    { id: 'development', label: '개발' },
    { id: 'design', label: '디자인' },
    { id: 'product', label: '기획' },
    { id: 'marketing', label: '마케팅' },
    { id: 'management', label: '매니지먼트' }
  ];
  
  return (
    <>
      <Helmet>
        <title>멘토 찾기 | BAESH - AI 기반 커리어 에이전트</title>
        <meta name="description" content="당신의 경력 성장을 도와줄 전문가 멘토를 찾아보세요. AI가 외부 데이터를 분석하여 최적의 멘토를 추천합니다." />
      </Helmet>
      
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">멘토 찾기</h1>
          <p className="text-gray-600">AI가 SNS/블로그 데이터를 분석해 최적의 멘토를 찾아줍니다</p>
        </div>
        
        {/* Hero search section */}
        <div className="bg-gradient-to-br from-blue-500 to-primary text-white rounded-xl p-6 md:p-8 mb-8">
          <div className="max-w-2xl mx-auto text-center mb-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">당신의 분야에 맞는 멘토를 찾아보세요</h2>
            <p className="text-blue-100 mb-6">
              링크드인, 깃허브, 미디엄 등 외부 정보를 AI가 자동으로 분석하여 최적의 멘토를 찾아드립니다
            </p>
            
            <div className="relative max-w-lg mx-auto">
              <Input 
                className="pr-12 border-0 shadow-lg text-gray-900 h-12 placeholder:text-gray-500"
                placeholder="직무, 기술, 관심사로 검색 (예: 'UX 디자인 멘토')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button 
                className="absolute right-1 top-1 h-10 w-10"
                size="icon"
                onClick={handleSearch}
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <span className="text-sm text-blue-100">추천 검색어:</span>
              {['프론트엔드 개발자', 'UX 디자이너', '스타트업 PM', '5년차 백엔드'].map((term, i) => (
                <button
                  key={i}
                  onClick={() => setSearchQuery(term)}
                  className="text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-full transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Browse by category */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">분야별 탐색</h2>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="all">전체</TabsTrigger>
              {expertiseCategories.map(cat => (
                <TabsTrigger key={cat.id} value={cat.id}>{cat.label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Mentors grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.length > 0 ? (
            filteredMentors.map((mentor, index) => (
              <motion.div 
                key={mentor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-card hover:shadow-elevated transition-shadow overflow-hidden"
              >
                <div className="p-5">
                  {/* Header with name and rating */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{mentor.name}</h3>
                    {mentor.rating && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm ml-1">{mentor.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Role and company */}
                  <div className="mb-3">
                    <div className="flex items-center text-sm text-gray-700">
                      <Briefcase className="w-4 h-4 mr-1 text-gray-400" />
                      <span>{mentor.role} @ {mentor.company}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      <span>{mentor.location}</span>
                    </div>
                  </div>
                  
                  {/* Expertise tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.expertise.slice(0, 3).map((exp, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {exp}
                      </Badge>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{mentor.expertise.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Availability if present */}
                  {mentor.availability && (
                    <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md text-xs flex items-center mb-4">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{mentor.availability}</span>
                    </div>
                  )}
                  
                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedMentor(mentor);
                        setMentorDialogOpen(true);
                      }}
                    >
                      <GraduationCap className="w-4 h-4 mr-1.5" />
                      프로필
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => {
                        setSelectedMentor(mentor);
                        setContactDialogOpen(true);
                      }}
                    >
                      멘토 요청
                    </Button>
                  </div>
                </div>
                
                {/* Platform badge */}
                <div className="bg-gray-50 border-t px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-1.5">출처:</span>
                    <div className="flex items-center">
                      {getPlatformIcon(mentor.platform)}
                      <span className="ml-1">{mentor.platform}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => window.open(mentor.profileUrl, '_blank')}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-xl shadow-card p-10 text-center">
              <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-1">검색 결과가 없습니다</h3>
              <p className="text-gray-500 mb-6">다른 검색어를 입력하거나 다른 분야를 선택해보세요</p>
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
                fetchMentors();
              }}>
                모든 멘토 보기
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mentor profile dialog */}
      {selectedMentor && (
        <Dialog open={mentorDialogOpen} onOpenChange={setMentorDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl">멘토 프로필</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="bg-gray-100 rounded-xl p-5">
                  <div className="text-center mb-4">
                    {selectedMentor.imageUrl ? (
                      <img 
                        src={selectedMentor.imageUrl} 
                        alt={selectedMentor.name}
                        className="w-24 h-24 mx-auto rounded-full object-cover mb-3"
                      />
                    ) : (
                      <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl mb-3">
                        <span>{selectedMentor.name.charAt(0)}</span>
                      </div>
                    )}
                    <h3 className="font-semibold text-lg">{selectedMentor.name}</h3>
                    <p className="text-gray-600 text-sm">{selectedMentor.role}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{selectedMentor.company}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{selectedMentor.location}</span>
                    </div>
                    {selectedMentor.availability && (
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{selectedMentor.availability}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <div className="mr-2 text-gray-400">
                        {getPlatformIcon(selectedMentor.platform)}
                      </div>
                      <a 
                        href={selectedMentor.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                      >
                        <span>{selectedMentor.platform} 프로필</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">전문 분야</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMentor.expertise.map((exp: string, i: number) => (
                        <Badge key={i} variant="secondary">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">멘토 정보</h3>
                    <p className="text-gray-700 text-sm">
                      {selectedMentor.description || `${selectedMentor.name}님은 ${selectedMentor.company}의 ${selectedMentor.role}로 근무하며 ${selectedMentor.expertise.join(', ')} 분야의 전문가입니다.`}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">멘토링 가능 주제</h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start">
                        <span className="w-4 h-4 bg-blue-50 rounded-full flex items-center justify-center mr-2 flex-shrink-0 text-primary font-medium text-xs">
                          1
                        </span>
                        <span>경력 경로 및 성장 전략</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-4 h-4 bg-blue-50 rounded-full flex items-center justify-center mr-2 flex-shrink-0 text-primary font-medium text-xs">
                          2
                        </span>
                        <span>기술적 역량 개발</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-4 h-4 bg-blue-50 rounded-full flex items-center justify-center mr-2 flex-shrink-0 text-primary font-medium text-xs">
                          3
                        </span>
                        <span>포트폴리오 및 이력서 리뷰</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-4 h-4 bg-blue-50 rounded-full flex items-center justify-center mr-2 flex-shrink-0 text-primary font-medium text-xs">
                          4
                        </span>
                        <span>업계 트렌드 및 인사이트</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button
                onClick={() => {
                  setMentorDialogOpen(false);
                  setContactDialogOpen(true);
                }}
              >
                멘토 요청하기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Contact mentor dialog */}
      {selectedMentor && (
        <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>멘토 요청하기</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="flex items-center bg-blue-50 p-4 rounded-lg mb-4">
                <div className="mr-3">
                  {selectedMentor.imageUrl ? (
                    <img 
                      src={selectedMentor.imageUrl} 
                      alt={selectedMentor.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      <span>{selectedMentor.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{selectedMentor.name}</p>
                  <p className="text-sm text-gray-600">{selectedMentor.role} @ {selectedMentor.company}</p>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                AI가 멘토 정보를 기반으로 맞춤형 메시지를 작성하였습니다. 필요시 수정하여 보내세요.
              </p>
              
              <div className="bg-gray-50 border p-4 rounded-lg mb-4">
                <p className="text-sm">
                  안녕하세요, {selectedMentor.name}님! BAESH AI 커리어 에이전트를 통해 연락드립니다. 
                  저는 {selectedMentor.expertise[0]} 분야에 관심이 있어 멘토링을 요청드립니다. 
                  특히 경력 성장 방향에 대한 조언을 받고 싶습니다. 
                  가능하시다면 30분 정도 시간을 내주실 수 있을까요?
                </p>
              </div>
              
              <div className="text-center">
                <Button 
                  className="w-full"
                  onClick={() => {
                    setContactDialogOpen(false);
                    toast({
                      title: "멘토 요청이 전송되었습니다",
                      description: `${selectedMentor.name}님에게 멘토링 요청을 보냈습니다`,
                    });
                  }}
                >
                  <Mail className="w-4 h-4 mr-1.5" />
                  요청 보내기
                </Button>
                <p className="mt-2 text-xs text-gray-500">
                  또는 <a 
                    href={selectedMentor.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {selectedMentor.platform}에서 직접 연락하기
                  </a>
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default MentorSearchPage;