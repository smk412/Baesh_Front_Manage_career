import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  Building,
  Award,
  ChevronRight,
  Filter
} from 'lucide-react';

const ProgramBoardPage: React.FC = () => {
  const programs = useStore(state => state.programs);
  const fetchPrograms = useStore(state => state.fetchPrograms);
  const applyToProgram = useStore(state => state.applyToProgram);
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);
  
  // Handle program application
  const handleApply = async (id: number) => {
    await applyToProgram(id);
    toast({
      title: "지원이 완료되었습니다",
      description: "AI 클론 정보가 전송되었습니다",
    });
  };
  
  // Filter programs based on search and filters
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || categoryFilter === 'all' || program.category === categoryFilter;
    const matchesLocation = !locationFilter || locationFilter === 'all' || program.location === locationFilter;
    const matchesStatus = !statusFilter || statusFilter === 'all' || program.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
  });
  
  // Get unique filter options
  const categories = Array.from(new Set(programs.map(p => p.category)));
  const locations = Array.from(new Set(programs.map(p => p.location)));
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'recruiting':
        return { label: '모집 중', color: 'bg-green-100 text-green-800' };
      case 'active':
        return { label: '진행 중', color: 'bg-blue-100 text-blue-800' };
      case 'completed':
        return { label: '종료', color: 'bg-gray-100 text-gray-800' };
      default:
        return { label: '알 수 없음', color: 'bg-gray-100 text-gray-800' };
    }
  };
  
  return (
    <>
      <Helmet>
        <title>활동 보드 | BAESH - AI 기반 커리어 에이전트</title>
        <meta name="description" content="다양한 공모전, 해커톤, 스터디 등의 활동에 참여하고 팀원을 모집하세요." />
      </Helmet>
      
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">활동 보드</h1>
              <p className="text-gray-500">공모전, 해커톤, 스터디 등 다양한 활동에 참여해보세요</p>
            </div>
          </div>
          
          {/* Search and filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="활동명 또는 키워드로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              <Filter className="w-4 h-4 text-gray-400" />
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="지역" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="recruiting">모집 중</SelectItem>
                  <SelectItem value="active">진행 중</SelectItem>
                  <SelectItem value="completed">종료</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Programs grid */}
        <div className="space-y-4">
          {filteredPrograms.map((program, index) => {
            const status = getStatusBadge(program.status);
            
            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={status.color}>{status.label}</Badge>
                          <Badge variant="outline">{program.category}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Building className="w-4 h-4 mr-2 text-gray-400" />
                          <span>주최: {program.organizer}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{program.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{new Date(program.startDate).toLocaleDateString('ko-KR')} - {new Date(program.endDate).toLocaleDateString('ko-KR')}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {program.teamSize && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2 text-gray-400" />
                            <span>팀 구성: {program.teamSize}명</span>
                          </div>
                        )}
                        {program.applicants !== undefined && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            <span>지원자: {program.applicants}명</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-700 line-clamp-2">{program.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {program.requirements.map((req, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-50 text-primary text-xs rounded-md">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-4 flex md:flex-col gap-2 md:flex-shrink-0">
                    <Button 
                      variant="outline"
                      className="flex-1 md:flex-none"
                    >
                      자세히
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                    
                    {program.status === 'recruiting' && (
                      <Button 
                        className="flex-1 md:flex-none"
                        onClick={() => handleApply(program.id)}
                      >
                        지원하기
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500">다른 키워드로 검색해보세요.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProgramBoardPage;