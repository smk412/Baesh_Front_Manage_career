import React,{useEffect, useState} from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

const SelfIntor : React.FC =()=>{
  const { toast } = useToast();

  const [query,setQuery] = useState("");
  const [selfInfo,setSelfInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const MAX_LENGTH : number = 3000;

  const feedBack = useStore(state => state.selfIntrFeedBack);
  const sendFeedBacke = useStore(state => state.sendFeedBacke);


  const startAnalysis = async() =>{
    try{
      setIsLoading(true);
      if(selfInfo === ""){
        toast({
          title: "자기소개 작성 오류",
          description: "자기소개를 작성 해주세요",
          variant: "destructive",
        });
        return;
      }else if(selfInfo.length < 300){
        toast({
          title: "자기소개 작성 오류",
          description: "자기소개를 내용은 최소 300이상 입니다",
          variant: "destructive",
        });
        return;
      }

      await sendFeedBacke(query,selfInfo);
    }catch(e){
      console.log(e);
    }finally{
      setIsLoading(false);
    }
  }
  
    return(
        <div className="p-5 md:p-6 lg:p-8 responsive-container">
          <div className="mb-6 lg:mb-8">
            <h2 className="text-lg md:text-xl font-semibold mb-1">AI 자기소개서 피드백</h2>
            <p className="text-gray-500 text-sm md:text-base">자기소개서를 입력하면 AI가 전/후 비교 분석과 개선 제안을 드립니다.</p>
          </div>
          <div className='mb-6'>
            <Label htmlFor="query">자기소개서 질문(선택)</Label>
            <Input
              id="query"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder=""
            />
          </div>
          <div className='mb-6'>
            <Label htmlFor="selfInfo">자기소개서 작성(필수)</Label>
            <Textarea
              id="selfInfo"
              value={selfInfo}
              onChange={e => setSelfInfo(e.target.value)}
              placeholder=""
              className="min-h-[100px] max-h-[300px]"
              maxLength = {MAX_LENGTH} 
            />
            <Button onClick={startAnalysis}>분석 시작</Button>
          </div>
          

          {!isLoading&&feedBack != null  && (
              <div className='p-5 md:p-6 lg:p-8 responsive-container border'>
                <Label htmlFor="query">자기소개서 질문</Label>
                <p className="text-500 md:text-lg">{feedBack.subject}</p>
                <br/>
                <Label htmlFor="selfInfo">AI 첨삭 자기소개서</Label>
                <p>{feedBack.content}</p>
                <br/>
                <Label htmlFor="feedback">AI 피드백</Label>
                <p>{feedBack.feedback}</p>
              </div>
            )
          }

          {isLoading && (
            <div className="text-center py-4 max-w-4xl mx-auto">
              <div className="inline-block animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-t-2 border-b-2 border-primary"></div>
              <p className="text-gray-500 mt-2 md:text-lg">분석 중...</p>
            </div>
            )
          }

          {!isLoading && feedBack == null && (
              <div className='md-6 p-5 md:p-6 lg:p-8 responsive-container border'>
                <p className="text-gray-500 md:text-lg">분석 결과가 없습니다.</p>
                <p className="text-gray-500 text-sm md:text-base mt-1">자기소개서를 작성하여 AI분석 해보세요.</p>
              </div>
            )
          }
        </div>
    )
}
export default SelfIntor;