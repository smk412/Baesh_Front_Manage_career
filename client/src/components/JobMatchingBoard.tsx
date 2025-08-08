import React, { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Bookmark, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JobMatchingBoard: React.FC = () => {
  const jobListings = useStore(state => state.jobListings);
  const fetchJobListings = useStore(state => state.fetchJobListings);
  const saveJob = useStore(state => state.saveJob);
  const applyForJob = useStore(state => state.applyForJob);
  
  useEffect(() => {
    fetchJobListings();
  }, [fetchJobListings]);
  
  const handleSaveJob = (id: number) => {
    saveJob(id);
  };
  
  const handleApplyForJob = (id: number) => {
    applyForJob(id);
  };
  
  return (
    <div className="p-5 md:p-6 lg:p-8 responsive-container">
      <div className="mb-6 lg:mb-8 max-w-4xl mx-auto">
        <h2 className="text-lg md:text-xl font-semibold mb-1">AI 추천 채용</h2>
        <p className="text-gray-500 text-sm md:text-base">당신의 경험과 기술에 맞는 채용 정보입니다</p>
      </div>

      <motion.div layout className="md:grid md:grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {jobListings.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-card p-5 md:p-6 mb-4 lg:mb-0 hover:shadow-elevated transition-all duration-300"
          >
            <div className="flex justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gray-100 flex items-center justify-center mr-3 md:mr-4">
                  <Briefcase className="text-gray-400 w-6 h-6 md:w-7 md:h-7" />
                </div>
                <div>
                  <h3 className="font-medium md:text-lg">{job.title}</h3>
                  <p className="text-sm md:text-base text-gray-500">{job.company}</p>
                </div>
              </div>
              <span className={`
                ${job.match > 90 ? 'bg-green-100 text-success' : 'bg-blue-100 text-primary'} 
                text-xs md:text-sm px-2 py-1 h-fit rounded-full
              `}>
                {job.match}% 일치
              </span>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center text-sm md:text-base text-gray-600 mb-2">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                <span>{job.location}</span>
                <span className="mx-2">•</span>
                <span>{job.type}</span>
              </div>
              <p className="text-sm md:text-base text-gray-600">{job.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {job.skills.map((skill, i) => (
                  <span key={i} className="px-2 py-1 rounded-md bg-blue-50 text-primary text-xs md:text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between mt-4 gap-3">
              <Button 
                variant="outline" 
                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium text-sm md:text-base hover:bg-gray-50"
                onClick={() => handleSaveJob(job.id)}
              >
                <Bookmark className="w-4 h-4 mr-1" />
                저장하기
              </Button>
              <Button 
                className="flex-1 py-2.5 rounded-lg bg-primary text-white font-medium text-sm md:text-base btn-hover-effect"
                onClick={() => handleApplyForJob(job.id)}
              >
                <Send className="w-4 h-4 mr-1" />
                지원하기
              </Button>
            </div>
          </motion.div>
        ))}
        
        {jobListings.length === 0 && (
          <motion.div 
            className="bg-white rounded-xl shadow-card p-6 md:p-8 text-center lg:col-span-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-500 md:text-lg">추천할 채용 정보가 없습니다.</p>
            <p className="text-gray-500 text-sm md:text-base mt-2">경험을 추가하면 적합한 채용 정보를 찾을 수 있습니다.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default JobMatchingBoard;
