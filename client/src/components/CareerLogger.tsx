import React, { useEffect, useState } from 'react';
import { useStore, Experience } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExperienceForm from './ExperienceForm';

const CareerLogger: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  
  const experiences = useStore(state => state.experiences);
  const fetchExperiences = useStore(state => state.fetchExperiences);
  
  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);
  
  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setIsFormOpen(true);
  };
  
  const handleClose = () => {
    setIsFormOpen(false);
    setEditingExperience(null);
  };

  return (
    <div className="p-5 md:p-6 lg:p-8 responsive-container">
      <div className="mb-6 lg:mb-8">
        <h2 className="text-lg md:text-xl font-semibold mb-1">이력 관리</h2>
        <p className="text-gray-500 text-sm md:text-base">경험을 입력하면 AI가 자동으로 분석해줍니다</p>
      </div>

      <Button 
        onClick={() => setIsFormOpen(true)}
        variant="ghost" 
        className="flex items-center justify-between w-full p-5 mb-5 bg-white rounded-xl shadow-card hover:shadow-elevated transition-shadow duration-200"
      >
        <div className="text-left">
          <h3 className="text-base font-medium">새 경험 추가하기</h3>
          <p className="text-sm text-gray-500 mt-1">공모전, 인턴, 대외활동 등</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
          <Plus className="w-5 h-5" />
        </div>
      </Button>

      <div className="relative">
        <div className="border-l-2 border-primary absolute h-full left-3 top-0 z-0 md:left-4"></div>
        
        <div className="md:grid md:grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {experiences.map((experience, index) => (
              <motion.div 
                key={experience.id} 
                className="relative z-10 mb-6 pl-10 md:pl-12 md:mb-8 lg:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="absolute left-0 top-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-xs md:text-sm">{index + 1}</span>
                </div>
                <div
                    className="bg-white p-5 md:p-6 rounded-xl shadow-card hover:shadow-elevated transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-base md:text-lg">{experience.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {new Date(experience.startDate).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit'
                        })} -
                        {new Date(experience.endDate).toLocaleDateString('ko-KR', {year: 'numeric', month: '2-digit'})}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(experience)}
                            className="text-gray-400 hover:text-primary">
                      <Edit className="w-4 h-4 md:w-5 md:h-5"/>
                    </Button>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {experience.summary && (
                        <p className="text-sm md:text-base text-gray-800 whitespace-pre-line">{experience.summary}</p>
                    )}

                    {/* role이나 achievement를 보조 정보로 쓰고 싶다면 아래 유지 */}
                    {/* <p className="text-sm md:text-base">{experience.role}</p>
  {experience.achievement && (
    <p className="text-sm md:text-base mt-1 text-gray-700">{experience.achievement}</p>
  )} */}

                    <div className="flex flex-wrap gap-2 mt-3">
                      {experience.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-1 rounded-md bg-blue-100 text-primary text-xs md:text-sm">
        {tag}
      </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {isFormOpen && (
          <ExperienceForm
              isOpen={isFormOpen}
              onClose={handleClose}
              experienceToEdit={editingExperience}
          />
      )}
    </div>
  );
};

export default CareerLogger;
