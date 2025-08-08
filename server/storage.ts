import { 
  User, InsertUser, 
  Experience, InsertExperience, 
  PortfolioItem, InsertPortfolioItem,
  RecommendedUser, InsertRecommendedUser,
  Message, InsertMessage,
  JobPosting, InsertJobPosting,
  JobMatch, InsertJobMatch,
  TokenTransaction, InsertTokenTransaction,
  Service, InsertService
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserTokens(userId: number, tokens: number): Promise<User>;
  
  // AI Clone operations
  getAIClone(userId: number): Promise<any | undefined>;
  generateAIClone(userId: number): Promise<any>;
  
  // Experience operations
  getExperiences(userId: number): Promise<Experience[]>;
  getExperience(id: number): Promise<Experience | undefined>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: number, experience: Partial<Experience>): Promise<Experience | undefined>;
  deleteExperience(id: number): Promise<boolean>;
  
  // Portfolio operations
  getPortfolioItems(userId: number): Promise<PortfolioItem[]>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  
  // Recommended users operations
  getRecommendedUsers(userId: number): Promise<any[]>;
  updateRecommendedUserStatus(id: number, status: string): Promise<boolean>;
  
  // Messages operations
  getMessages(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Job operations
  getJobsForUser(userId: number): Promise<any[]>;
  updateJobStatus(userId: number, jobId: number, status: string): Promise<boolean>;
  
  // Token operations
  getUserTokenBalance(userId: number): Promise<number>;
  getTokenHistory(userId: number): Promise<TokenTransaction[]>;
  addTokenTransaction(transaction: InsertTokenTransaction): Promise<TokenTransaction>;
  
  // Service operations
  getAvailableServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  
  // Program operations
  getPrograms(): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private experiences: Map<number, Experience>;
  private portfolioItems: Map<number, PortfolioItem>;
  private recommendedUsers: Map<number, RecommendedUser>;
  private messages: Map<number, Message>;
  private jobPostings: Map<number, JobPosting>;
  private jobMatches: Map<number, JobMatch>;
  private tokenTransactions: Map<number, TokenTransaction>;
  private services: Map<number, Service>;
  private aiClones: Map<number, any>;
  private programs: Map<number, any>;
  
  currentUserId: number;
  currentExperienceId: number;
  currentPortfolioId: number;
  currentRecommendedUserId: number;
  currentMessageId: number;
  currentJobId: number;
  currentJobMatchId: number;
  currentTransactionId: number;
  currentServiceId: number;

  constructor() {
    this.users = new Map();
    this.experiences = new Map();
    this.portfolioItems = new Map();
    this.recommendedUsers = new Map();
    this.messages = new Map();
    this.jobPostings = new Map();
    this.jobMatches = new Map();
    this.tokenTransactions = new Map();
    this.services = new Map();
    this.aiClones = new Map();
    this.programs = new Map();
    
    this.currentUserId = 1;
    this.currentExperienceId = 1;
    this.currentPortfolioId = 1;
    this.currentRecommendedUserId = 1;
    this.currentMessageId = 1;
    this.currentJobId = 1;
    this.currentJobMatchId = 1;
    this.currentTransactionId = 1;
    this.currentServiceId = 1;
    
    // Initialize with mock data
    this.initializeMockData();
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      tokens: 1000, 
      createdAt: new Date(),
      phone: insertUser.phone ?? null,
      isEmailVerified: insertUser.isEmailVerified ?? null,
      agreeTerms: insertUser.agreeTerms ?? false,
      agreePrivacy: insertUser.agreePrivacy ?? false,
      agreeMarketing: insertUser.agreeMarketing ?? null,
      bio: insertUser.bio ?? '',
      imageUrl: insertUser.imageUrl ?? '',
      role: insertUser.role ?? null,
      updatedAt: null
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserTokens(userId: number, tokens: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.tokens = tokens;
    this.users.set(userId, user);
    return user;
  }
  
  // Experience operations
  async getExperiences(userId: number): Promise<Experience[]> {
    return Array.from(this.experiences.values()).filter(
      (experience) => experience.userId === userId,
    );
  }
  
  async getExperience(id: number): Promise<Experience | undefined> {
    return this.experiences.get(id);
  }
  
  async createExperience(insertExperience: InsertExperience): Promise<Experience> {
    const id = this.currentExperienceId++;
    const experience: Experience = { 
      ...insertExperience, 
      id, 
      createdAt: new Date(),
      achievement: insertExperience.achievement ?? null
    };
    this.experiences.set(id, experience);
    return experience;
  }
  
  async updateExperience(id: number, updateData: Partial<Experience>): Promise<Experience | undefined> {
    const experience = this.experiences.get(id);
    if (!experience) {
      return undefined;
    }
    
    const updatedExperience = { ...experience, ...updateData };
    this.experiences.set(id, updatedExperience);
    return updatedExperience;
  }
  
  async deleteExperience(id: number): Promise<boolean> {
    return this.experiences.delete(id);
  }
  
  // Portfolio operations
  async getPortfolioItems(userId: number): Promise<PortfolioItem[]> {
    return Array.from(this.portfolioItems.values()).filter(
      (item) => item.userId === userId,
    );
  }
  
  async createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    const id = this.currentPortfolioId++;
    const portfolioItem: PortfolioItem = { 
      ...item, 
      id, 
      createdAt: new Date() 
    };
    this.portfolioItems.set(id, portfolioItem);
    return portfolioItem;
  }
  
  // Recommended users operations
  async getRecommendedUsers(userId: number): Promise<any[]> {
    const recommendedUserRecords = Array.from(this.recommendedUsers.values()).filter(
      (record) => record.userId === userId && record.status === 'pending',
    );
    
    // Join with user data
    const results = [];
    for (const record of recommendedUserRecords) {
      const targetUser = this.users.get(record.targetUserId);
      if (targetUser) {
        results.push({
          id: record.id,
          name: targetUser.name || 'Unknown User',
          role: targetUser.role || 'No Role',
          experience: '2년 경력', // Mock data
          imgUrl: targetUser.imageUrl,
          match: record.match,
          skills: ['React', 'TypeScript', 'Design'], // Mock data
          description: targetUser.bio || '자기소개가 없습니다.',
        });
      }
    }
    
    return results;
  }
  
  async updateRecommendedUserStatus(id: number, status: string): Promise<boolean> {
    const record = this.recommendedUsers.get(id);
    if (!record) {
      return false;
    }
    
    record.status = status;
    this.recommendedUsers.set(id, record);
    return true;
  }
  
  // Messages operations
  async getMessages(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.userId === userId,
    );
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = { 
      ...insertMessage, 
      id, 
      chart: insertMessage.chart ?? null,
      timestamp: new Date() 
    };
    this.messages.set(id, message);
    return message;
  }
  
  // Job operations
  async getJobsForUser(userId: number): Promise<any[]> {
    const jobMatches = Array.from(this.jobMatches.values()).filter(
      (match) => match.userId === userId,
    );
    
    const results = [];
    for (const match of jobMatches) {
      const job = this.jobPostings.get(match.jobId);
      if (job) {
        results.push({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          description: job.description,
          match: match.match,
          skills: job.skills,
          status: match.status,
        });
      }
    }
    
    return results;
  }
  
  async updateJobStatus(userId: number, jobId: number, status: string): Promise<boolean> {
    const matchKey = Array.from(this.jobMatches.entries()).find(
      ([_, match]) => match.userId === userId && match.jobId === jobId
    )?.[0];
    
    if (!matchKey) {
      return false;
    }
    
    const match = this.jobMatches.get(matchKey);
    if (match) {
      match.status = status;
      this.jobMatches.set(matchKey, match);
      return true;
    }
    
    return false;
  }
  
  // Token operations
  async getUserTokenBalance(userId: number): Promise<number> {
    const user = this.users.get(userId);
    return user?.tokens || 0;
  }
  
  async getTokenHistory(userId: number): Promise<TokenTransaction[]> {
    return Array.from(this.tokenTransactions.values()).filter(
      (transaction) => transaction.userId === userId,
    ).sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.getTime() - a.date.getTime();
    });
  }
  
  async addTokenTransaction(transaction: InsertTokenTransaction): Promise<TokenTransaction> {
    const id = this.currentTransactionId++;
    const tokenTransaction: TokenTransaction = { 
      ...transaction, 
      id, 
      date: new Date() 
    };
    this.tokenTransactions.set(id, tokenTransaction);
    
    // Update user's token balance
    const user = this.users.get(transaction.userId);
    if (user) {
      user.tokens = (user.tokens || 0) + transaction.amount;
      this.users.set(user.id, user);
    }
    
    return tokenTransaction;
  }
  
  // Service operations
  async getAvailableServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }
  
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }
  
  async getAIClone(userId: number): Promise<any | undefined> {
    return this.aiClones.get(userId);
  }
  
  async generateAIClone(userId: number): Promise<any> {
    // For simplicity, we'll just return the existing clone or create a new one
    const existingClone = await this.getAIClone(userId);
    if (existingClone) {
      return existingClone;
    }
    
    // Create a mock AI clone
    const clone = {
      id: 1,
      userId: userId,
      name: "박지훈의 AI 클론",
      role: "UX/UI 디자이너",
      personality: "창의적이고 책임감이 강함. 새로운 기술에 대한 호기심이 많으며 팀 프로젝트에서 의사소통 능력이 뛰어남.",
      summary: "디자인 전공 출신으로 UX/UI 디자인에 강점이 있으며, 프론트엔드 개발 능력을 키워나가고 있는 디자이너. 공모전 참가 경험과 스타트업 인턴십을 통해 실무 역량을 키웠으며, 창의적인 문제 해결 접근법이 돋보임.",
      createdAt: new Date(),
      lastUpdated: new Date(),
      strengths: ["UX 디자인", "사용자 조사", "프로토타이핑", "UI 디자인", "React 기초"],
      recommendations: {
        careerPath: "UX/UI 디자이너로서의 역량을 강화하면서 프론트엔드 개발 기술을 접목하여 제품 디자인 리더로 성장하는 것이 적합합니다.",
        nextSteps: [
          "React와 TypeScript 실무 프로젝트에 참여하여 기술 역량 강화",
          "UX 디자인 포트폴리오를 더 다양한 사례로 확장",
          "디자인 시스템 구축 경험 쌓기",
          "팀 리더십 기회 찾기"
        ],
        skills: [
          { name: "프로덕트 디자인", importance: 90 },
          { name: "React", importance: 85 },
          { name: "TypeScript", importance: 75 },
          { name: "디자인 시스템", importance: 70 },
          { name: "프로젝트 관리", importance: 65 }
        ]
      }
    };
    
    this.aiClones.set(userId, clone);
    return clone;
  }
  
  async getPrograms(): Promise<any[]> {
    return Array.from(this.programs.values());
  }
  
  // Initialize mock data
  private initializeMockData() {
    // Create a demo user
    const demoUser: User = {
      id: 1,
      username: 'demo',
      password: 'password123',
      name: '홍길동',
      email: 'demo@example.com',
      role: '개발자',
      bio: '열정적인 개발자로 다양한 프로젝트 경험이 있습니다.',
      imageUrl: '',
      tokens: 3250,
      createdAt: new Date(),
      phone: null,
      isEmailVerified: null,
      agreeTerms: false,
      agreePrivacy: false,
      agreeMarketing: null,
      updatedAt: null
    };
    this.users.set(demoUser.id, demoUser);
    
    // Create mock services
    const services: Service[] = [
      {
        id: 1,
        title: '이력서 첨삭',
        cost: 200,
        icon: 'file-text',
        description: 'AI가 당신의 이력서를 분석하고 개선점을 제안합니다.',
      },
      {
        id: 2,
        title: '심층 분석',
        cost: 300,
        icon: 'bar-chart',
        description: '당신의 커리어 경로를 심층 분석하고 발전 방향을 제시합니다.',
      },
      {
        id: 3,
        title: '합격 예측',
        cost: 150,
        icon: 'briefcase',
        description: '지원한 포지션에 대한 합격 가능성을 분석합니다.',
      },
      {
        id: 4,
        title: '맞춤형 추천',
        cost: 250,
        icon: 'globe',
        description: '당신에게 가장 적합한 직무와 기업을 추천합니다.',
      },
    ];
    
    for (const service of services) {
      this.services.set(service.id, service);
      this.currentServiceId++;
    }
    
    // Create mock experiences for demo user
    const experiences: Experience[] = [
      {
        id: 1,
        userId: 1,
        title: 'UX 디자인 공모전 참가',
        role: '디자인 리드 역할을 맡아 팀 프로젝트 진행',
        startDate: '2023-05-01',
        endDate: '2023-06-30',
        achievement: '최우수상 수상',
        tags: ['UX 디자인', '팀 프로젝트', 'Figma'],
        createdAt: new Date('2023-07-01'),
      },
      {
        id: 2,
        userId: 1,
        title: 'IT 스타트업 인턴십',
        role: '프론트엔드 개발 담당, React 활용 웹 애플리케이션 구현',
        startDate: '2023-01-01',
        endDate: '2023-03-31',
        achievement: '사용자 만족도 20% 향상',
        tags: ['React', 'JavaScript', '인턴십'],
        createdAt: new Date('2023-04-01'),
      },
    ];
    
    for (const exp of experiences) {
      this.experiences.set(exp.id, exp);
      this.currentExperienceId++;
    }
    
    // Create mock portfolio items
    const portfolioItems: PortfolioItem[] = [
      {
        id: 1,
        userId: 1,
        title: 'UX 디자인 역량',
        description: '공모전과 인턴십을 통해 실무 UX 디자인 경험 축적. 특히 사용자 조사와 프로토타이핑 능력이 돋보임.',
        proficiency: 85,
        type: 'strength',
        createdAt: new Date(),
      },
      {
        id: 2,
        userId: 1,
        title: 'React 개발 능력',
        description: '스타트업 인턴십에서 React를 활용한 실무 경험. 컴포넌트 설계와 상태 관리에 대한 이해를 갖춤.',
        proficiency: 70,
        type: 'developing',
        createdAt: new Date(),
      },
      {
        id: 3,
        userId: 1,
        title: 'React 개발 능력',
        description: '스타트업 인턴십에서 React를 활용한 실무 경험. 컴포넌트 설계와 상태 관리에 대한 이해를 갖춤.',
        proficiency: 73,
        type: 'developing',
        createdAt: new Date(),
      },
    ];
    
    for (const item of portfolioItems) {
      this.portfolioItems.set(item.id, item);
      this.currentPortfolioId++;
    }
    
    // Create some mock users for recommendations
    const mockUsers: User[] = [
      {
        id: 2,
        username: 'user2',
        password: 'password',
        name: '김미나',
        email: 'user2@example.com',
        role: 'UX/UI 디자이너',
        bio: '스타트업에서 프로덕트 디자인 경험이 있으며, 사용자 중심 디자인 방법론에 관심이 많습니다. 공모전 경험 다수.',
        imageUrl: '',
        tokens: 1000,
        createdAt: new Date(),
        phone: null,
        isEmailVerified: null,
        agreeTerms: false,
        agreePrivacy: false,
        agreeMarketing: null,
        updatedAt: null
      },
      {
        id: 3,
        username: 'user3',
        password: 'password',
        name: '이준호',
        email: 'user3@example.com',
        role: '프론트엔드 개발자',
        bio: '웹 기반 서비스 개발에 전문성을 갖고 있으며, 디자이너와의 협업 경험이 풍부합니다. 최근 React와 Framer Motion을 활용한 프로젝트 진행 중.',
        imageUrl: '',
        tokens: 1000,
        createdAt: new Date(),
        phone: null,
        isEmailVerified: null,
        agreeTerms: false,
        agreePrivacy: false,
        agreeMarketing: null,
        updatedAt: null
      },
    ];
    
    for (const user of mockUsers) {
      this.users.set(user.id, user);
      this.currentUserId++;
    }
    
    // Create recommendations
    const recommendations: RecommendedUser[] = [
      {
        id: 1,
        userId: 1,
        targetUserId: 2,
        match: 92,
        status: 'pending',
        createdAt: new Date(),
      },
      {
        id: 2,
        userId: 1,
        targetUserId: 3,
        match: 85,
        status: 'pending',
        createdAt: new Date(),
      },
    ];
    
    for (const rec of recommendations) {
      this.recommendedUsers.set(rec.id, rec);
      this.currentRecommendedUserId++;
    }
    
    // Create some mock messages
    const messages: Message[] = [
      {
        id: 1,
        userId: 1,
        content: '안녕하세요! 커리어 분석 결과를 알려드릴게요. 어떤 내용이 궁금하신가요?',
        isUser: false,
        chart: null,
        timestamp: new Date('2023-09-01T09:00:00'),
      },
      {
        id: 2,
        userId: 1,
        content: '제 UX 디자인 경험에 대한 피드백 부탁드려요. 더 보완해야 할 부분이 있을까요?',
        isUser: true,
        chart: null,
        timestamp: new Date('2023-09-01T09:05:00'),
      },
      {
        id: 3,
        userId: 1,
        content: 'UX 디자인 공모전 경험은 좋은 기반이 되었습니다! 다만 사용자 리서치와 데이터 기반 의사결정 경험을 더 쌓으면 좋겠어요. 또한 포트폴리오에 프로세스를 더 자세히 보여주시면 강점이 될 것 같습니다.',
        isUser: false,
        chart: null,
        timestamp: new Date('2023-09-01T09:07:00'),
      },
      {
        id: 4,
        userId: 1,
        content: 'UX 디자인 역량 분석',
        isUser: false,
        chart: [
          { name: '프로토타이핑', value: 85 },
          { name: '사용자 리서치', value: 60 },
          { name: '시각 디자인', value: 75 },
        ],
        timestamp: new Date('2023-09-01T09:08:00'),
      },
    ];
    
    for (const msg of messages) {
      this.messages.set(msg.id, msg);
      this.currentMessageId++;
    }
    
    // Create mock job postings
    const jobPostings: JobPosting[] = [
      {
        id: 1,
        title: 'UX/UI 디자이너',
        company: '테크스타트',
        location: '서울 강남',
        type: '정규직',
        description: '핀테크 서비스의 UX/UI 디자인을 담당할 디자이너를 찾습니다. Figma 활용 능력 필수.',
        skills: ['Figma', 'UX 리서치', '프로토타이핑'],
        createdAt: new Date(),
      },
      {
        id: 2,
        title: '프론트엔드 개발자',
        company: '디지털 솔루션즈',
        location: '서울 성동구',
        type: '정규직',
        description: 'React 기반 웹 애플리케이션 개발 경험이 있는 프론트엔드 개발자를 찾습니다.',
        skills: ['React', 'TypeScript', 'Tailwind'],
        createdAt: new Date(),
      },
    ];
    
    for (const job of jobPostings) {
      this.jobPostings.set(job.id, job);
      this.currentJobId++;
    }
    
    // Create job matches
    const jobMatches: JobMatch[] = [
      {
        id: 1,
        userId: 1,
        jobId: 1,
        match: 94,
        status: 'new',
        createdAt: new Date(),
      },
      {
        id: 2,
        userId: 1,
        jobId: 2,
        match: 85,
        status: 'new',
        createdAt: new Date(),
      },
    ];
    
    for (const match of jobMatches) {
      this.jobMatches.set(match.id, match);
      this.currentJobMatchId++;
    }
    
    // Create mock token transactions
    const tokenTransactions: TokenTransaction[] = [
      {
        id: 1,
        userId: 1,
        title: '친구 초대 보상',
        amount: 500,
        date: new Date('2023-07-15'),
      },
      {
        id: 2,
        userId: 1,
        title: '이력서 첨삭 사용',
        amount: -200,
        date: new Date('2023-07-10'),
      },
      {
        id: 3,
        userId: 1,
        title: '매일 로그인 보상',
        amount: 100,
        date: new Date('2023-07-08'),
      },
      {
        id: 4,
        userId: 1,
        title: '프로필 완성 보상',
        amount: 300,
        date: new Date('2023-07-05'),
      },
    ];
    
    for (const transaction of tokenTransactions) {
      this.tokenTransactions.set(transaction.id, transaction);
      this.currentTransactionId++;
    }
    
    // Initialize programs
    const programs = [
      {
        id: 1,
        title: '2024 UX/UI 디자인 공모전',
        category: '공모전',
        location: '서울',
        startDate: '2024-03-01',
        endDate: '2024-05-30',
        description: '차세대 모바일 앱의 UX/UI 디자인을 제안하는 공모전입니다. 대상 상금 500만원과 함께 실제 서비스 개발 기회를 제공합니다.',
        organizer: '디자인 코리아',
        requirements: ['Figma 활용', 'UX 리서치', '프로토타이핑'],
        teamSize: 3,
        status: 'recruiting',
        applicants: 45,
      },
      {
        id: 2,
        title: '핀테크 해커톤 2024',
        category: '해커톤',
        location: '부산',
        startDate: '2024-04-15',
        endDate: '2024-04-17',
        description: '금융 서비스의 혁신을 이끌 핀테크 솔루션을 개발하는 3일간의 해커톤입니다. 블록체인, AI 기술 활용 권장.',
        organizer: '핀테크 협회',
        requirements: ['React', 'Node.js', '팀워크'],
        teamSize: 4,
        status: 'recruiting',
        applicants: 28,
      },
      {
        id: 3,
        title: 'AI 스터디 그룹',
        category: '스터디',
        location: '온라인',
        startDate: '2024-02-01',
        endDate: '2024-06-30',
        description: '머신러닝과 딥러닝을 함께 공부하는 스터디 그룹입니다. 매주 온라인 미팅과 프로젝트 진행.',
        organizer: 'AI 연구회',
        requirements: ['Python', '수학 기초', '열정'],
        teamSize: 8,
        status: 'active',
        applicants: 12,
      },
      {
        id: 4,
        title: '창업 아이디어 경진대회',
        category: '경진대회',
        location: '대구',
        startDate: '2024-03-20',
        endDate: '2024-04-10',
        description: '혁신적인 창업 아이디어를 발굴하는 경진대회입니다. 사업화 지원과 멘토링 기회 제공.',
        organizer: '대구 창업지원센터',
        requirements: ['사업계획서', '프레젠테이션', '창의성'],
        teamSize: 5,
        status: 'recruiting',
        applicants: 67,
      },
    ];
    
    for (const program of programs) {
      this.programs.set(program.id, program);
    }
  }
}

export const storage = new MemStorage();
