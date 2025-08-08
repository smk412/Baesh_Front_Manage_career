import { create } from 'zustand';
import { apiRequest } from './queryClient';

// Define interfaces for our store states
export interface Experience {
  id: number;
  title: string;
  role: string;
  startDate: string;
  endDate: string;
  achievement?: string;
  tags: string[];
  summary?: string;
}

export interface SelfIntrFeedBack{
  id: number;
  subject: string;
  content: string;
  feedback: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  proficiency: number;
  type: 'strength' | 'developing';
}

export interface User {
  id: number;
  name: string;
  role: string;
  experience: string;
  imgUrl: string;
  match: number;
  skills: string[];
  description: string;
}

export interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: string;
  chart?: SkillChart[];
}

export interface SkillChart {
  name: string;
  value: number;
}

export interface JobPosting {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  match: number;
  skills: string[];
}

export interface TokenHistory {
  id: number;
  title: string;
  date: string;
  amount: number;
}

export interface Service {
  id: number;
  title: string;
  cost: number;
  icon: string;
}

// New interfaces for the added features
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  mbti?: string;
  workStyle?: string;
  careerGoal?: string;
  jobInterest?: string;
  avatar?: string;
  createdAt: string;
}

export interface AIClone {
  id: number;
  userId: number;
  name: string;
  role: string;
  personality: string;
  summary: string;
  createdAt: string;
  lastUpdated: string;
  strengths: string[];
  recommendations: {
    careerPath: string;
    nextSteps: string[];
    skills: { name: string; importance: number }[];
  };
}

export interface Resume {
  id: number;
  userId: number;
  title: string;
  content: string;
  status: 'draft' | 'published';
  lastEdited: string;
  feedbackRequested: boolean;
  feedbackContent?: string;
}

export interface ReferralCode {
  id: number;
  userId: number;
  code: string;
  usedCount: number;
  createdAt: string;
}

export interface Referral {
  id: number;
  code: string;
  referrerId: number;
  referredId: number;
  status: 'pending' | 'completed';
  createdAt: string;
  completedAt?: string;
  rewardAmount?: number;
}

export interface Program {
  id: number;
  title: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  organizer: string;
  requirements: string[];
  teamSize?: number;
  status: 'recruiting' | 'active' | 'completed';
  applicants?: number;
}

export interface Mentor {
  id: number;
  name: string;
  role: string;
  company: string;
  expertise: string[];
  location: string;
  platform: string;
  profileUrl: string;
  imageUrl?: string;
  rating?: number;
  availability?: string;
}

export type TabType = 'career' | 'recommend' | 'feedback' | 'explore' | 'profile' | 
  'onboarding' | 'myclone' | 'resume' | 'referral' | 'program' | 'settings' | 'mentor';


  //인터페이스 정의후 useStore에 추가
interface Store {
  // Global state
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  
  // 이력 관리
  experiences: Experience[];
  fetchExperiences: () => Promise<void>;
  addExperience: (experience: Omit<Experience, 'id'>) => Promise<Experience | undefined>;
  updateExperience: (experience: Experience) => Promise<void>;
  deleteExperience: (id: number) => Promise<void>;
  
  //자기소개서 AI피드백
  selfIntrFeedBack : SelfIntrFeedBack | null;
  selfIntrFeedBackList : SelfIntrFeedBack[];
  fetchFeedBack: () => Promise<void>;
  sendFeedBacke: (subject: string,content: string) => Promise<void>;

  // Portfolio
  portfolioItems: PortfolioItem[];
  fetchPortfolio: () => Promise<void>;
  
  // Team Recommendations
  recommendedUsers: User[];
  fetchRecommendedUsers: () => Promise<void>;
  acceptUser: (id: number) => Promise<void>;
  rejectUser: (id: number) => Promise<void>;
  
  // Career Feedback
  messages: Message[];
  fetchMessages: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  
  // Job Matching
  jobListings: JobPosting[];
  fetchJobListings: () => Promise<void>;
  saveJob: (id: number) => Promise<void>;
  applyForJob: (id: number) => Promise<void>;
  
  // Token System
  tokenBalance: number;
  tokenHistory: TokenHistory[];
  availableServices: Service[];
  fetchTokenData: () => Promise<void>;
  useTokens: (serviceId: number) => Promise<void>;
  
  // Onboarding
  userProfile: UserProfile | null;
  onboardingStep: number;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  setOnboardingStep: (step: number) => void;
  
  // AI Clone
  aiClone: AIClone | null;
  fetchAIClone: () => Promise<void>;
  generateAIClone: () => Promise<void>;
  
  // Resume
  resumes: Resume[];
  currentResume: Resume | null;
  fetchResumes: () => Promise<void>;
  createResume: (title: string) => Promise<void>;
  updateResume: (id: number, content: string) => Promise<void>;
  requestFeedback: (id: number) => Promise<void>;
  setCurrentResume: (resume: Resume | null) => void;
  
  // Referral
  referralCode: ReferralCode | null;
  referrals: Referral[];
  fetchReferralData: () => Promise<void>;
  generateReferralCode: () => Promise<void>;
  
  // Programs
  programs: Program[];
  fetchPrograms: () => Promise<void>;
  applyToProgram: (id: number) => Promise<void>;
  
  // Mentors
  mentors: Mentor[];
  fetchMentors: (query?: string) => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
    // 전역 상태
  activeTab: 'career',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // 인증 / 사용자 관련 라우터에 (미완)
  userProfile: null,
  onboardingStep: 1,
  fetchUserProfile: async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        set({ userProfile: data });
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  },
  updateUserProfile: async (data) => {
    try {
      const response = await apiRequest('PATCH', '/api/user/profile', data);
      if (response.ok) {
        const updatedProfile = await response.json();
        set({ userProfile: updatedProfile });
      }
    } catch (error) {
      console.error('Failed to update user profile:', error);
    }
  },
  setOnboardingStep: (step) => set({ onboardingStep: step }),



  // AI 클론 라우터에 (미완)
  aiClone: null,
  fetchAIClone: async () => {
    try {
      const response = await fetch('/api/clone');
      if (response.ok) {
        const data = await response.json();
        set({ aiClone: data });
      }
    } catch (error) {
      console.error('Failed to fetch AI clone:', error);
    }
  },

  generateAIClone: async () => {
    try {
      const response = await apiRequest('POST', '/api/clone/generate', {});
      if (response.ok) {
        const data = await response.json();
        set({ aiClone: data });
      }
    } catch (error) {
      console.error('Failed to generate AI clone:', error);
    }
  },



  // 이력 관리 라우터에 (미완)
  experiences: [],
  fetchExperiences: async () => {
    try {
      const response = await fetch('/api/experiences');
      if (response.ok) {
        const data = await response.json();
        set({ experiences: data });
      }
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
    }
  },

  addExperience: async (
      experience: Omit<Experience, 'id'>
  ): Promise<Experience | undefined> => {
    try {
      const response = await apiRequest('POST', '/api/experiences', experience);
      if (response.ok) {
        const newExperience: Experience = await response.json();
        set(state => ({ experiences: [...state.experiences, newExperience] }));
        return newExperience;
      }
    } catch (error) {
      console.error('Failed to add experience:', error);
    }
  },

  updateExperience: async (experience) => {
    try {
      const response = await apiRequest('PUT', `/api/experiences/${experience.id}`, experience);
      if (response.ok) {
        const updatedExperience = await response.json();
        set(state => ({ 
          experiences: state.experiences.map(exp => 
            exp.id === updatedExperience.id ? updatedExperience : exp
          ) 
        }));
      }
    } catch (error) {
      console.error('Failed to update experience:', error);
    }
  },

  deleteExperience: async (id) => {
    try {
      const response = await apiRequest('DELETE', `/api/experiences/${id}`);
      if (response.ok) {
        set(state => ({ 
          experiences: state.experiences.filter(exp => exp.id !== id) 
        }));
      }
    } catch (error) {
      console.error('Failed to delete experience:', error);
    }
  },

  //AI 자기소개서 피드백 (완)
  selfIntrFeedBack: null,
  selfIntrFeedBackList: [],
  fetchFeedBack: async() =>{
    //여기는 이력 페이지 에서 최근 열개 자소서 보여 줄때 사용
    //라우터에서 리스트에서 받아 옴
    try{
      const response = await apiRequest('GET','/api/selfIntrFeedBack');
      if(response.ok){
        const date = await response.json();
        set({selfIntrFeedBackList: date});
      }
    }catch(error){
      console.error("Ai self-introduction feedback error",error);
    }
  },
  sendFeedBacke: async(subject,content)=>{
    if(subject ==="")subject ="정해진 주제 없음";
    console.log(subject,content);
    try{
      const response = await apiRequest('POST','/api/selfIntrFeedBack',{subject,content});
      if(response.ok){
        const aiFeedback = await response.json();
        set({selfIntrFeedBack: aiFeedback});
      }
    }catch(error){
      console.error("Ai self-introduction feedback error",error);
    }
  },

  // 포트폴리오 라우터에 (미완)
  portfolioItems: [],
  fetchPortfolio: async () => {
    try {
      const response = await fetch('/api/portfolio');
      if (response.ok) {
        const data = await response.json();
        set({ portfolioItems: data });
      }
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    }
  },



  // 추천 사용자 라우터에 (미완)
  recommendedUsers: [],
  fetchRecommendedUsers: async () => {
    try {
      const response = await fetch('/api/recommended-users');
      if (response.ok) {
        const data = await response.json();
        set({ recommendedUsers: data });
      }
    } catch (error) {
      console.error('Failed to fetch recommended users:', error);
    }
  },

  acceptUser: async (id) => {
    try {
      await apiRequest('POST', `/api/recommended-users/${id}/accept`);
      set(state => ({ 
        recommendedUsers: state.recommendedUsers.filter(user => user.id !== id) 
      }));
    } catch (error) {
      console.error('Failed to accept user:', error);
    }
  },

  rejectUser: async (id) => {
    try {
      await apiRequest('POST', `/api/recommended-users/${id}/reject`);
      set(state => ({ 
        recommendedUsers: state.recommendedUsers.filter(user => user.id !== id) 
      }));
    } catch (error) {
      console.error('Failed to reject user:', error);
    }
  },



  // AI 커리어 피드백(챗봇) 라우터에 (완)
  messages: [],
  fetchMessages: async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        set({ messages: data });
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  },

  sendMessage: async (content) => {
    try {
      const userMessage = {
        id: Date.now(),
        content,
        isUser: true,
        timestamp: new Date().toISOString(),
      };
      set(state => ({ messages: [...state.messages, userMessage] }));
      const response = await apiRequest('POST', '/api/messages', { content });
      if (response.ok) {
        const aiMessage = await response.json();
        set(state => ({ messages: [...state.messages, aiMessage] }));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  },



  // 채용 매칭 라우터에 (미완)
  jobListings: [],
  fetchJobListings: async () => {
    try {
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const data = await response.json();
        set({ jobListings: data });
      }
    } catch (error) {
      console.error('Failed to fetch job listings:', error);
    }
  },

  saveJob: async (id) => {
    try {
      await apiRequest('POST', `/api/jobs/${id}/save`);
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  },
  
  applyForJob: async (id) => {
    try {
      await apiRequest('POST', `/api/jobs/${id}/apply`);
    } catch (error) {
      console.error('Failed to apply for job:', error);
    }
  },



  // 토큰 시스템 라우터에 (미완)
  tokenBalance: 0,
  tokenHistory: [],
  availableServices: [],
  fetchTokenData: async () => {
    try {
      const [balanceResponse, historyResponse, servicesResponse] = await Promise.all([
        fetch('/api/tokens/balance'),
        fetch('/api/tokens/history'),
        fetch('/api/tokens/services')
      ]);

      if (balanceResponse.ok && historyResponse.ok && servicesResponse.ok) {
        const balance = await balanceResponse.json();
        const history = await historyResponse.json();
        const services = await servicesResponse.json();

        set({ 
          tokenBalance: balance.amount,
          tokenHistory: history,
          availableServices: services
        });
      }
    } catch (error) {
      console.error('Failed to fetch token data:', error);
    }
  },

  useTokens: async (serviceId) => {
    try {
      const response = await apiRequest('POST', `/api/tokens/use`, { serviceId });
      if (response.ok) {
        const data = await response.json();
        set({ 
          tokenBalance: data.newBalance,
          tokenHistory: [data.transaction, ...get().tokenHistory]
        });
      }
    } catch (error) {
      console.error('Failed to use tokens:', error);
    }
  },



  // 이력서 라우터에 (미완)
  resumes: [],
  currentResume: null,
  fetchResumes: async () => {
    try {
      const response = await fetch('/api/resumes');
      if (response.ok) {
        const data = await response.json();
        set({ resumes: data });
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    }
  },

  createResume: async (title) => {
    try {
      const response = await apiRequest('POST', '/api/resumes', { title });
      if (response.ok) {
        const newResume = await response.json();
        set(state => ({ 
          resumes: [...state.resumes, newResume],
          currentResume: newResume
        }));
      }
    } catch (error) {
      console.error('Failed to create resume:', error);
    }
  },

  updateResume: async (id, content) => {
    try {
      const response = await apiRequest('PATCH', `/api/resumes/${id}`, { content });
      if (response.ok) {
        const updatedResume = await response.json();
        set(state => ({ 
          resumes: state.resumes.map(resume => 
            resume.id === updatedResume.id ? updatedResume : resume
          ),
          currentResume: updatedResume
        }));
      }
    } catch (error) {
      console.error('Failed to update resume:', error);
    }
  },

  requestFeedback: async (id) => {
    try {
      const response = await apiRequest('POST', `/api/resumes/${id}/feedback`);
      if (response.ok) {
        const updatedResume = await response.json();
        set(state => ({ 
          resumes: state.resumes.map(resume => 
            resume.id === updatedResume.id ? updatedResume : resume
          ),
          currentResume: updatedResume
        }));
      }
    } catch (error) {
      console.error('Failed to request feedback:', error);
    }
  },

  setCurrentResume: (resume) => set({ currentResume: resume }),



  // 추천 코드 라우터에 (미완)
  referralCode: null,
  referrals: [],
  fetchReferralData: async () => {
    try {
      const [codeResponse, referralsResponse] = await Promise.all([
        fetch('/api/referrals/code'),
        fetch('/api/referrals')
      ]);

      if (codeResponse.ok && referralsResponse.ok) {
        const code = await codeResponse.json();
        const referrals = await referralsResponse.json();
        set({ referralCode: code, referrals });
      }
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
    }
  },

  generateReferralCode: async () => {
    try {
      const response = await apiRequest('POST', '/api/referrals/code/generate');
      if (response.ok) {
        const newCode = await response.json();
        set({ referralCode: newCode });
      }
    } catch (error) {
      console.error('Failed to generate referral code:', error);
    }
  },



  // 프로그램 라우터에 (미완)
  programs: [],
  fetchPrograms: async () => {
    try {
      const response = await fetch('/api/programs');
      if (response.ok) {
        const data = await response.json();
        set({ programs: data });
      }
    } catch (error) {
      console.error('Failed to fetch programs:', error);
    }
  },

  applyToProgram: async (id) => {
    try {
      await apiRequest('POST', `/api/programs/${id}/apply`);

    } catch (error) {
      console.error('Failed to apply to program:', error);
    }
  },


  
  // 멘토 찾기 라우터에 (미완)
  mentors: [],
  fetchMentors: async (query = '') => {
    try {
      const response = await fetch(`/api/mentors?query=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        set({ mentors: data });
      }
    } catch (error) {
      console.error('Failed to fetch mentors:', error);
    }
  }
}));
