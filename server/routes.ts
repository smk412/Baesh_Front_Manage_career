import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import session from "express-session";
import axios from 'axios'; 
import cors from 'cors';

export async function registerRoutes(app: Express): Promise<Server> {
  // CORS 설정
  app.use(cors({
    origin: 'http://localhost:3000', // 프론트 도메인
    credentials: true               // 쿠키 허용 필수!
  }));

  // 세션 설정
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));



  // 인증 미들웨어
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  };

    // 세션에서 현재 사용자 ID 가져오기
  const getCurrentUserId = (req:any): number => {
    return (req.session as any)?.userId;
  };

  const getCurrentUserJTW = (req: any): number | null => {
    return (req.session as any)?.userToken;
  };





  // 인증 API 페이지에 직접 구현(storage에 구현 안함함) (완)
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const signupSchema = z.object({
        name: z.string().min(1, "이름을 입력해주세요"),
        email: z.string().email("올바른 이메일을 입력해주세요"),
        phoneNumber: z.string().min(1, "휴대폰 번호를 입력해주세요"),
        password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
        location: z.string().min(1, "지역을 입력해주세요"),
        intro: z.string().min(1, "자기소개를 입력해주세요"),
        agreeTerms: z.boolean().refine((val) => val === true, "서비스 이용약관에 동의해주세요"),
        agreePrivacy: z.boolean().refine((val) => val === true, "개인정보 수집 및 이용에 동의해주세요"),
        agreeMarketing: z.boolean().optional(),
      });

      const validatedData = signupSchema.parse(req.body);


      const user = await axios.post("http://localhost:8080/api/auth/signUp", {
        userId: validatedData.email, // Assuming email is used as userId
        name: validatedData.name,
        email: validatedData.email,
        phoneNumber: validatedData.phoneNumber,
        password: validatedData.password, // Password should be hashed before storing
        location: validatedData.location,
        intro: validatedData.intro,
        role: "USER", // Default role
        agreeTerms: validatedData.agreeTerms,
        agreePrivacy: validatedData.agreePrivacy,
        agreeMarketing: validatedData.agreeMarketing,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if(user.data){
        
      }

      res.status(201).json({ message: '회원가입이 완료되었습니다.'});
    } catch (error) {
      //console.error('Signup error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.' });
    }
  });

  app.post('/api/auth/check-email', async (req, res) => {
  const { email } = req.body;

  try {
    const response = await axios.post("http://localhost:8080/api/auth/signUp/checkEmail", {
      email: email,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 중복된 이메일: 1
    console.log("Check email response:", response.data);
    if (response.data) {
      res.status(200).json({ exists: true });
    } else {
      // 사용 가능: 0
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Check email error:", error);
    res.status(500).json({ message: "서버 오류" });
  }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const loginSchema = z.object({
        userId: z.string().email("올바른 이메일을 입력해주세요"),
        password: z.string().min(1, "비밀번호를 입력해주세요"),
      });

      const validatedData = loginSchema.parse(req.body);

      // Find user
      const user = await axios.post("http://localhost:8080/api/auth/login" , {
        userId: validatedData.userId,
        password: validatedData.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Set session
      (req.session as any).userId = user.data.id;
      (req.session as any).userToken = user.data.userToken;
      req.session.save((err) => {
        if (err) {
          console.error("세션 저장 실패:", err);
        } else {
          console.log("세션 저장 성공");
        }
      });
      
      res.status(200).json({ message: '로그인 성공' });

    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: '로그아웃 중 오류가 발생했습니다.' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: '로그아웃되었습니다.' });
    });
  });
  // 자기정보 불러오기 아직 구현 안됨
  app.get('/api/auth/me', (req, res) => {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    storage.getUser(userId).then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        imageUrl: user.imageUrl,
        tokens: user.tokens
      });
    }).catch(error => {
      console.error('Get user error:', error);
      res.status(500).json({ message: '사용자 정보를 가져오는 중 오류가 발생했습니다.' });
    });
    
  });

  // 이력 관리 API (미완)
  app.get('/api/experiences', async (req, res) => {
    try {
      const experiences = await storage.getExperiences(1);
      res.json(experiences);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      res.status(500).json({ error: 'Failed to fetch experiences' });
    }
  });

  app.post('/api/experiences', async (req, res) => {
    try {
      // 1. 입력 검증
      const experienceSchema = z.object({
        title: z.string().min(1, "Title is required"),
        role: z.string().min(1, "Role is required"),
        startDate: z.string(),
        endDate: z.string(),
        achievement: z.string().optional(),
        tags: z.array(z.string()),
      });
      const validatedData = experienceSchema.parse(req.body);

      // 2. Spring API 서버에 요약 + 저장 요청
      const springResponse = await fetch('http://localhost:8080/api/summarize-experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: validatedData.title,
          role: validatedData.role,
          achievement: validatedData.achievement || '',
          tags: validatedData.tags
        }),
        credentials: 'include'
      });

      const text = await springResponse.text();

      if (!springResponse.ok) {
        console.error('Spring API returned error:', springResponse.status, text);
        throw new Error('Spring API failed');
      }

      if (!text) {
        console.error('Spring 응답이 비어 있습니다.');
        throw new Error('Empty response from Spring API');
      }

      let resultFromSpring;
      try {
        resultFromSpring = JSON.parse(text);
      } catch (e) {
        console.error('JSON 파싱 실패:', e, text);
        throw new Error('Invalid JSON format from Spring API');
      }

      res.status(201).json(resultFromSpring);
    } catch (error) {
      console.error('Error creating experience:', error);
      res.status(400).json({ error: 'Invalid experience data' });
    }
  });

  app.put('/api/experiences/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      const experienceSchema = z.object({
        title: z.string().min(1, "Title is required"),
        role: z.string().min(1, "Role is required"),
        startDate: z.string(),
        endDate: z.string(),
        achievement: z.string().optional(),
        tags: z.array(z.string()),
      });

      const validatedData = experienceSchema.parse(req.body);
      const updatedExperience = await storage.updateExperience(id, validatedData);
      
      if (!updatedExperience) {
        return res.status(404).json({ error: 'Experience not found' });
      }
      
      res.json(updatedExperience);
    } catch (error) {
      console.error('Error updating experience:', error);
      res.status(400).json({ error: 'Invalid experience data' });
    }
  });

  app.delete('/api/experiences/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      const success = await storage.deleteExperience(id);
      if (!success) {
        return res.status(404).json({ error: 'Experience not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting experience:', error);
      res.status(500).json({ error: 'Failed to delete experience' });
    }
  });

  //AI 자기소개서 피드백 (완)
  app.get('/api/selfIntrFeedBack', async(req,res)=>{
    try{
      //API서버에서 배열 형태로 받옴
      const token = getCurrentUserJTW(req);
      
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const fetchFeedBackList = await axios.get('http://localhost:8080/api/SelfIntroList',{
       headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include JWT token for authentication
        },
      });

      console.log(fetchFeedBackList.data);
      res.status(201).json(fetchFeedBackList.data);
    }catch(error){
      console.error("Ai self-introduction feedback API get server error ",error);
    }
  });

  app.post('/api/selfIntrFeedBack', async(req,res)=>{
    try{
      const {subject,content} = req.body;

      const token = getCurrentUserJTW(req);
      
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const sendFeedBacke = await axios.post('http://localhost:8080/api/AISelfIntroFeedback', {
        subject: subject,
        content: content
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include JWT token for authentication
        },
      });

      const sendResSubject = sendFeedBacke.data.subject;
      const sendResContent = sendFeedBacke.data.content;
      const sendResFeedBack = sendFeedBacke.data.feedback;

      const resFeedBack:{
        id: number;
        subject: string;
        content: string;
        feedback: string;
      }={
        id: Date.now(),
        subject: sendResSubject,
        content: sendResContent,
        feedback: sendResFeedBack
      };
      res.status(201).json(resFeedBack);
    }catch(error){
      console.error("Ai self-introduction feedback API server error",error);
    }
  });

  // 포토폴리오 API (미완)
  app.get('/api/portfolio', async (req, res) => {
    try {
      const portfolioItems = await storage.getPortfolioItems(1);
      res.json(portfolioItems);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
  });



  // 추천 사용자 API (미완)
  app.get('/api/recommended-users', async (req, res) => {
    try {
      const recommendedUsers = await storage.getRecommendedUsers(1);
      res.json(recommendedUsers);
    } catch (error) {
      console.error('Error fetching recommended users:', error);
      res.status(500).json({ error: 'Failed to fetch recommended users' });
    }
  });

  app.post('/api/recommended-users/:id/accept', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      const success = await storage.updateRecommendedUserStatus(id, 'accepted');
      if (!success) {
        return res.status(404).json({ error: 'Recommendation not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error accepting recommendation:', error);
      res.status(500).json({ error: 'Failed to accept recommendation' });
    }
  });

  app.post('/api/recommended-users/:id/reject', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      const success = await storage.updateRecommendedUserStatus(id, 'rejected');
      if (!success) {
        return res.status(404).json({ error: 'Recommendation not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error rejecting recommendation:', error);
      res.status(500).json({ error: 'Failed to reject recommendation' });
    }
  });



  // AI 커리어 피드백(챗봇) API (완);
  app.get('/api/messages', async (req, res) => {
    try {
      const messages = await storage.getMessages(getCurrentUserId(req));
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  app.post('/api/messages', async (req, res) => {
    try {
      const { content } = req.body;
      if (!content || typeof content !== 'string') {
        return res.status(400).json({ error: 'Message content is required' });
      }

      const token = getCurrentUserJTW(req);
      
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const sendMessage = await axios.post('http://localhost:8080/api/gpt/generate', {
        message: content,
        userId: getCurrentUserId(req),
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include JWT token for authentication
        },
      });

      const responseData = sendMessage.data.genera;
      
      // Create user message in storage
      await storage.createMessage({
        userId: getCurrentUserId(req),
        content,
        isUser: true,
        chart: null,
      });

      // Generate AI response (mock for demo)
      const aiResponse: {
        id: number;
        userId: number;
        content: string;
        isUser: boolean;
        chart: { name: string; value: number }[] | null;
        timestamp: string;
      } = {
        id: Date.now(),
        userId: getCurrentUserId(req),
        content: responseData,
        isUser: false,
        chart: null,
        timestamp: new Date().toISOString()
      };

      console.log('AI Response:', aiResponse.content);

      // Store AI response
      await storage.createMessage({
        userId: getCurrentUserId(req),
        content: aiResponse.content,
        isUser: false,
        chart: aiResponse.chart,
      });
      
      res.status(201).json(aiResponse);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });



  // 외부 검색 API 페이지에 직접 구현 (완)
  app.get('/api/search-profiles', async (req, res) => {
    try {
      const selfIntroduction = req.query.query as string;
      if (!selfIntroduction || selfIntroduction.trim() === '') {
        return res.status(400).json({ error: 'Search query is required' });
      }
      
      const Jtw = getCurrentUserJTW(req);
      if (!Jtw) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const searchres = await axios.post('http://localhost:8080/api/search', {
        selfIntroduction: selfIntroduction,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Jtw}`, // Include JWT token for authentication
        },
      });

      // Simulate search delay
      setTimeout(() => {
        res.json(searchres.data);
      }, 1000);
    } catch (error) {
      console.error('Error searching profiles:', error);
      res.status(500).json({ error: 'Failed to search profiles' });
    }
  });

  app.get('/api/ex-search-profiles', async (req, res) => {
    try {
      const selfIntroduction = req.query.query as string;
      if (!selfIntroduction || selfIntroduction.trim() === '') {
        return res.status(400).json({ error: 'Search query is required' });
      }
      
      const Jtw = getCurrentUserJTW(req);
      if (!Jtw) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const searchres = await axios.post('http://localhost:8080/api/external_search', {
        selfIntroduction: selfIntroduction,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Jtw}`, // Include JWT token for authentication
        },
      });

      // Simulate search delay
      setTimeout(() => {
        res.json(searchres.data);
      }, 1000);
    } catch (error) {
      console.error('Error searching profiles:', error);
      res.status(500).json({ error: 'Failed to search profiles' });
    }
  });



  // 채용 매칭 API (미완)
  app.get('/api/jobs', async (req, res) => {
    try {
      const jobs = await storage.getJobsForUser(1);
      res.json(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  });

  app.post('/api/jobs/:id/save', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid job ID' });
      }

      const success = await storage.updateJobStatus(1, id, 'saved');
      if (!success) {
        return res.status(404).json({ error: 'Job not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error saving job:', error);
      res.status(500).json({ error: 'Failed to save job' });
    }
  });

  app.post('/api/jobs/:id/apply', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid job ID' });
      }

      const success = await storage.updateJobStatus(1, id, 'applied');
      if (!success) {
        return res.status(404).json({ error: 'Job not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error applying for job:', error);
      res.status(500).json({ error: 'Failed to apply for job' });
    }
  });



  // 토큰 API (미완)
  app.get('/api/tokens/balance', async (req, res) => {
    try {
      const balance = await storage.getUserTokenBalance(1);
      res.json({ amount: balance });
    } catch (error) {
      console.error('Error fetching token balance:', error);
      res.status(500).json({ error: 'Failed to fetch token balance' });
    }
  });

  app.get('/api/tokens/history', async (req, res) => {
    try {
      const history = await storage.getTokenHistory(1);
      res.json(history);
    } catch (error) {
      console.error('Error fetching token history:', error);
      res.status(500).json({ error: 'Failed to fetch token history' });
    }
  });

  app.get('/api/tokens/services', async (req, res) => {
    try {
      const services = await storage.getAvailableServices();
      res.json(services);
    } catch (error) {
      console.error('Error fetching available services:', error);
      res.status(500).json({ error: 'Failed to fetch available services' });
    }
  });

  app.post('/api/tokens/use', async (req, res) => {
    try {
      const { serviceId } = req.body;
      if (!serviceId || isNaN(serviceId)) {
        return res.status(400).json({ error: 'Valid service ID is required' });
      }

      // Get the service and check if user has enough tokens
      const service = await storage.getService(serviceId);
      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }

      const userBalance = await storage.getUserTokenBalance(1);
      if (userBalance < service.cost) {
        return res.status(400).json({ error: 'Insufficient token balance' });
      }

      // Add transaction and update user balance
      const transaction = await storage.addTokenTransaction({
        userId: 1,
        title: `${service.title} 사용`,
        amount: -service.cost,
      });

      const newBalance = userBalance - service.cost;
      await storage.updateUserTokens(1, newBalance);

      res.json({
        newBalance,
        transaction,
      });
    } catch (error) {
      console.error('Error using tokens:', error);
      res.status(500).json({ error: 'Failed to use tokens' });
    }
  });



  // AI 클론 API (미완)
  app.get('/api/clone', async (req, res) => {
    try {
      let clone = await storage.getAIClone(getCurrentUserId(req));
      
      // If there is no clone yet, generate one
      if (!clone) {
        clone = await storage.generateAIClone(getCurrentUserId(req));
      }
      
      res.json(clone);
    } catch (error) {
      console.error('Error fetching AI clone:', error);
      res.status(500).json({ error: 'Failed to fetch AI clone' });
    }
  });
  
  app.post('/api/clone/generate', async (req, res) => {
    try {
      const clone = await storage.generateAIClone(getCurrentUserId(req));
      res.json(clone);
    } catch (error) {
      console.error('Error generating AI clone:', error);
      res.status(500).json({ error: 'Failed to generate AI clone' });
    }
  });
  


  // 프로그램 API (미완)
  app.get('/api/programs', async (req, res) => {
    try {
      const programs = await storage.getPrograms();
      res.json(programs);
    } catch (error) {
      console.error('Error fetching programs:', error);
      res.status(500).json({ error: 'Failed to fetch programs' });
    }
  });
  
  app.post('/api/programs/:id/apply', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid program ID' });
      }
      
      // Mock application logic
      res.status(204).end();
    } catch (error) {
      console.error('Error applying to program:', error);
      res.status(500).json({ error: 'Failed to apply to program' });
    }
  });


  
  const httpServer = createServer(app);
  return httpServer;
}
