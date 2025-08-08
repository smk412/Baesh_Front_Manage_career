import React, { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, CheckCheck } from 'lucide-react';

const CloneRecommender: React.FC = () => {
  const recommendedUsers = useStore(state => state.recommendedUsers);
  const fetchRecommendedUsers = useStore(state => state.fetchRecommendedUsers);
  const acceptUser = useStore(state => state.acceptUser);
  const rejectUser = useStore(state => state.rejectUser);
  
  useEffect(() => {
    fetchRecommendedUsers();
  }, [fetchRecommendedUsers]);
  
  return (
    <div className="p-5 md:p-6 lg:p-8 responsive-container">
      <div className="mb-6 lg:mb-8 max-w-4xl mx-auto">
        <h2 className="text-lg md:text-xl font-semibold mb-1">AI 팀원 추천</h2>
        <p className="text-gray-500 text-sm md:text-base">당신의 경험과 목표에 맞는 팀원을 추천해드려요</p>
      </div>

      <div className="relative overflow-hidden max-w-4xl mx-auto">
        <div className="md:grid md:grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {recommendedUsers.map((user, index) => (
              <motion.div 
                key={user.id}
                className="bg-white rounded-xl shadow-elevated p-5 md:p-6 mb-5 lg:mb-0"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-start">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 mr-4 flex-shrink-0 overflow-hidden">
                    {user.imgUrl ? (
                      <img 
                        src={user.imgUrl} 
                        alt={`${user.name} profile`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl md:text-2xl">
                        <span>{user.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg md:text-xl">{user.name}</h3>
                      <span className={`
                        text-xs md:text-sm px-2 py-1 rounded-full
                        ${user.match > 90 
                          ? 'bg-green-100 text-success' 
                          : 'bg-blue-100 text-primary'}
                      `}>
                        {user.match}% 일치
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base">{user.role} | {user.experience}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 rounded-md bg-blue-50 text-primary text-xs md:text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm md:text-base text-gray-600">{user.description}</p>
                </div>
                <div className="flex justify-between mt-4 gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-500 font-medium text-sm md:text-base hover:bg-gray-50"
                    onClick={() => rejectUser(user.id)}
                  >
                    <X className="w-4 h-4 mr-1" />
                    패스
                  </Button>
                  <Button 
                    className="flex-1 py-2.5 rounded-lg bg-primary text-white font-medium text-sm md:text-base btn-hover-effect"
                    onClick={() => acceptUser(user.id)}
                  >
                    <CheckCheck className="w-4 h-4 mr-1" />
                    함께하기
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {recommendedUsers.length === 0 && (
          <motion.div 
            className="bg-white rounded-xl shadow-card p-6 md:p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-500 md:text-lg">현재 추천할 팀원이 없습니다.</p>
            <p className="text-gray-500 text-sm md:text-base mt-2">조금 후에 다시 확인해주세요.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CloneRecommender;
