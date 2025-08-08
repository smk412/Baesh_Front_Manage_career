import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Edit, 
  Download,
  Sparkles,
  Save,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ResumeEditorPage: React.FC = () => {
  const { toast } = useToast();
  const resumes = useStore(state => state.resumes);
  const currentResume = useStore(state => state.currentResume);
  const fetchResumes = useStore(state => state.fetchResumes);
  const createResume = useStore(state => state.createResume);
  const updateResume = useStore(state => state.updateResume);
  const requestFeedback = useStore(state => state.requestFeedback);
  const setCurrentResume = useStore(state => state.setCurrentResume);
  
  const [resumeTitle, setResumeTitle] = useState('');
  const [resumeContent, setResumeContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('view');
  
  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);
  
  useEffect(() => {
    if (currentResume) {
      setResumeContent(currentResume.content);
    }
  }, [currentResume]);
  
  const handleCreateResume = async () => {
    if (!resumeTitle.trim()) {
      toast({
        title: "이력서 제목을 입력해주세요",
        variant: "destructive",
      });
      return;
    }
    
    await createResume(resumeTitle);
    setResumeTitle('');
    toast({
      title: "이력서가 생성되었습니다",
      description: "이제 내용을 편집할 수 있습니다",
    });
  };
  
  const handleSaveResume = async () => {
    if (!currentResume) return;
    
    await updateResume(currentResume.id, resumeContent);
    setIsEditing(false);
    setSelectedTab('view');
    toast({
      title: "저장되었습니다",
      description: "이력서 내용이 업데이트되었습니다",
    });
  };
  
  const handleRequestFeedback = async () => {
    if (!currentResume) return;
    
    await requestFeedback(currentResume.id);
    toast({
      title: "피드백 요청이 완료되었습니다",
      description: "AI가 이력서를 분석하고 있습니다. 잠시 후 확인해주세요.",
    });
  };
  
  const handleDownloadPDF = () => {
    if (!currentResume) return;
    
    // Mock PDF download
    toast({
      title: "PDF 다운로드",
      description: "이력서를 PDF로 다운로드합니다",
    });
    
    // Create temporary link for download
    const blob = new Blob([currentResume.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentResume.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <>
      <Helmet>
        <title>이력서 에디터 | BAESH - AI 기반 커리어 에이전트</title>
        <meta name="description" content="AI가 생성한 이력서를 확인하고 편집하세요. AI 피드백을 받아 이력서의 완성도를 높입니다." />
      </Helmet>
      
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">이력서 관리</h1>
            <p className="text-gray-500">맞춤형 이력서를 생성하고 AI 피드백을 받아보세요</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <FileText className="w-4 h-4" />
                <span>새 이력서</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 이력서 만들기</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="resume-title">이력서 제목</Label>
                <Input 
                  id="resume-title"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  placeholder="예: 프론트엔드 개발자 이력서"
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">취소</Button>
                </DialogClose>
                <Button onClick={handleCreateResume}>
                  <FileText className="w-4 h-4 mr-2" />
                  이력서 생성
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Resume list and editor */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Resume list */}
          <div className="bg-white rounded-xl shadow-card p-4 md:p-5">
            <h2 className="text-lg font-semibold mb-4">내 이력서 목록</h2>
            
            <div className="space-y-3">
              {resumes.length > 0 ? (
                resumes.map(resume => (
                  <button
                    key={resume.id}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      currentResume?.id === resume.id
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentResume(resume)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{resume.title}</h3>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{new Date(resume.lastEdited).toLocaleDateString('ko-KR')}</span>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        resume.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {resume.status === 'published' ? '완료' : '작성 중'}
                      </span>
                    </div>
                    
                    {resume.feedbackRequested && (
                      <div className="mt-2 text-xs text-blue-600 flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" />
                        <span>AI 피드백 요청됨</span>
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p>아직 이력서가 없습니다</p>
                  <p className="text-sm mt-1">새 이력서를 생성해보세요</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Resume editor/viewer */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-card overflow-hidden">
            {currentResume ? (
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="font-semibold">{currentResume.title}</h2>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button size="sm" variant="outline" onClick={() => {
                          setResumeContent(currentResume.content);
                          setIsEditing(false);
                          setSelectedTab('view');
                        }}>
                          취소
                        </Button>
                        <Button size="sm" onClick={handleSaveResume}>
                          <Save className="w-4 h-4 mr-1" />
                          저장
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={handleDownloadPDF}>
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </Button>
                        <Button size="sm" onClick={() => {
                          setIsEditing(true);
                          setSelectedTab('edit');
                        }}>
                          <Edit className="w-4 h-4 mr-1" />
                          편집
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
                  <div className="px-4 border-b">
                    <TabsList>
                      <TabsTrigger value="view" disabled={isEditing}>보기</TabsTrigger>
                      <TabsTrigger value="edit" disabled={!isEditing}>편집</TabsTrigger>
                      <TabsTrigger value="feedback" disabled={isEditing || !currentResume.feedbackContent}>
                        AI 피드백
                        {currentResume.feedbackContent && (
                          <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="view" className="flex-1 p-5 overflow-y-auto">
                    <div className="prose max-w-none">
                      {currentResume.content ? (
                        <div>
                          {currentResume.content.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 italic">이력서 내용이 없습니다. 편집 버튼을 눌러 내용을 추가하세요.</div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="edit" className="flex-1 p-5">
                    <Textarea 
                      className="w-full h-full min-h-[300px] p-4 bg-gray-50"
                      value={resumeContent}
                      onChange={(e) => setResumeContent(e.target.value)}
                      placeholder="이력서 내용을 입력하세요..."
                    />
                  </TabsContent>
                  
                  <TabsContent value="feedback" className="flex-1 p-5 overflow-y-auto">
                    {currentResume.feedbackContent ? (
                      <div className="prose max-w-none bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-4">AI 피드백 및 제안</h3>
                        <div>
                          {currentResume.feedbackContent.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">아직 AI 피드백이 없습니다</h3>
                        <p className="text-gray-500 mb-6">AI에게 이력서 첨삭을 요청해보세요</p>
                        <Button onClick={handleRequestFeedback}>
                          <Sparkles className="w-4 h-4 mr-1" />
                          AI 피드백 요청하기
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
                
                {!isEditing && !currentResume.feedbackContent && currentResume.status !== 'published' && (
                  <div className="p-4 border-t bg-gray-50 flex justify-end">
                    <Button onClick={handleRequestFeedback}>
                      <Sparkles className="w-4 h-4 mr-1" />
                      AI 피드백 요청하기
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center p-6">
                  <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <h3 className="text-lg font-medium">이력서를 선택해주세요</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    왼쪽 목록에서 이력서를 선택하거나<br />
                    새 이력서를 생성하세요
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 mt-6">
          <h3 className="text-primary font-medium mb-2">AI 이력서 작성 팁</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 구체적인 경험과 성과를 수치화하여 기재하세요.</li>
            <li>• 짧고 간결한 문장으로 작성하고 불필요한 단어는 제거하세요.</li>
            <li>• 자신의 강점과 기술력이 돋보이는 키워드를 활용하세요.</li>
            <li>• 지원하는 회사나 직무에 맞춰 이력서를 커스터마이징하세요.</li>
            <li>• AI 피드백을 통해 부족한 부분을 보완하세요.</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ResumeEditorPage;