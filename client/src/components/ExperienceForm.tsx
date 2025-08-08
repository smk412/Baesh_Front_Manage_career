import React, { useState, useEffect } from 'react';
import { useStore, Experience } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ExperienceFormProps {
  isOpen: boolean;
  onClose: () => void;
  experienceToEdit: Experience | null;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         experienceToEdit,
                                                       }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [achievement, setAchievement] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [summary, setSummary] = useState('');

  const addExperience = useStore(state => state.addExperience);
  const updateExperience = useStore(state => state.updateExperience);
  const deleteExperience = useStore(state => state.deleteExperience);

  useEffect(() => {
    if (experienceToEdit) {
      setTitle(experienceToEdit.title);
      setRole(experienceToEdit.role);
      setStartDate(experienceToEdit.startDate);
      setEndDate(experienceToEdit.endDate);
      setAchievement(experienceToEdit.achievement || '');
      setTags(experienceToEdit.tags);
      setSummary(experienceToEdit.summary || '');
    }
  }, [experienceToEdit]);

  const handleSubmit = async () => {
    if (!title.trim() || !role.trim() || !startDate || !endDate) return;

    const formattedExperience = {
      title,
      role,
      startDate,
      endDate,
      achievement: achievement || undefined,
      tags,
    };

    let newExp;
    if (experienceToEdit) {
      newExp = await updateExperience({ ...formattedExperience, id: experienceToEdit.id });
    } else {
      newExp = await addExperience(formattedExperience);
    }

    if (newExp?.summary) {
      setSummary(newExp.summary);
    }

    onClose();
  };

  const handleDelete = async () => {
    if (experienceToEdit) {
      await deleteExperience(experienceToEdit.id);
      onClose();
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {experienceToEdit ? '경험 수정하기' : '새 경험 추가하기'}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <motion.div
                key={`step-${currentStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
            >
              {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">무엇을 하셨나요?</Label>
                      <Input
                          id="title"
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          placeholder="예: UX 디자인 공모전 참가"
                          className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">어떤 역할을 맡으셨나요?</Label>
                      <Input
                          id="role"
                          value={role}
                          onChange={e => setRole(e.target.value)}
                          placeholder="예: 디자인 리드 역할"
                          className="mt-2"
                      />
                    </div>
                  </div>
              )}

              {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="startDate">시작 날짜</Label>
                      <Input
                          id="startDate"
                          type="date"
                          value={startDate}
                          onChange={e => setStartDate(e.target.value)}
                          className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">종료 날짜</Label>
                      <Input
                          id="endDate"
                          type="date"
                          value={endDate}
                          onChange={e => setEndDate(e.target.value)}
                          className="mt-2"
                      />
                    </div>
                  </div>
              )}

              {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="achievement">이루어낸 성과가 있다면 알려주세요 (선택)</Label>
                      <Textarea
                          id="achievement"
                          value={achievement}
                          onChange={e => setAchievement(e.target.value)}
                          placeholder="예: 팀 프로젝트에서 최우수상 수상"
                          className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">관련 태그를 입력해주세요</Label>
                      <div className="flex mt-2">
                        <Input
                            id="tags"
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            placeholder="예: UX 디자인"
                            className="flex-1"
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag();
                              }
                            }}
                        />
                        <Button
                            type="button"
                            onClick={handleAddTag}
                            className="ml-2"
                        >
                          추가
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {tags.map((tag, index) => (
                            <div
                                key={index}
                                className="px-2 py-1 rounded-md bg-blue-100 text-primary text-xs flex items-center"
                            >
                              {tag}
                              <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="w-4 h-4 ml-1 p-0 text-primary"
                                  onClick={() => handleRemoveTag(tag)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                        ))}
                      </div>
                    </div>
                  </div>
              )}
            </motion.div>
          </div>

          <DialogFooter className="flex sm:justify-between">
            {experienceToEdit && (
                <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    className="sm:mr-auto"
                >
                  삭제
                </Button>
            )}
            <div className="flex justify-between sm:justify-end gap-2 w-full sm:w-auto">
              {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    이전
                  </Button>
              )}
              {currentStep < 3 ? (
                  <Button type="button" onClick={nextStep}>
                    다음
                  </Button>
              ) : (
                  <Button type="button" onClick={handleSubmit}>
                    {experienceToEdit ? '수정 완료' : '추가하기'}
                  </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
};

export default ExperienceForm;
