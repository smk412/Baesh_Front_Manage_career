import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Mock data for demo purposes
const searchSuggestions = [
  'UX 디자이너', '프론트엔드 개발자', '제품 관리자', '서울 스타트업', '리모트 가능'
];

const InternalSNSConnector: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchInput.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/search-profiles?query=${encodeURIComponent(searchInput)}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session management
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Failed to search profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchInput(suggestion);
    // Optionally, trigger search automatically
  };

  return (
    <div className="p-5 md:p-6 lg:p-8 responsive-container">
      <div className="mb-6 lg:mb-8 max-w-4xl mx-auto">
        <h2 className="text-lg md:text-xl font-semibold mb-3">전문가 찾기</h2>
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Input
              type="text"
              placeholder="직무, 기술, 지역으로 검색 (예: UX 디자이너 서울)"
              className="w-full py-3 px-4 pr-10 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-sm md:text-base"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </div>

      {searchResults.length > 0 && (
        <div className="mb-6 max-w-4xl mx-auto">
          <h3 className="font-medium text-gray-700 mb-3 md:text-lg">탐색 결과</h3>
          <motion.div layout className="md:grid md:grid-cols-1 lg:grid-cols-2 gap-4">
            {searchResults.map((result, index) => (
              <motion.div 
                key={result.id}
                className="bg-white rounded-xl shadow-elevated p-5 md:p-6 mb-5 lg:mb-0"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-start">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 mr-4 flex-shrink-0 overflow-hidden">
                    {result.imgUrl ? (
                      <img 
                        src={result.imgUrl} 
                        alt={`${result.name} profile`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl md:text-2xl">
                        <span>{result.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg md:text-xl">{result.name}</h3>
                      <span className={`
                        text-xs md:text-sm px-2 py-1 rounded-full
                        ${result.matchCount/result.meTagCount * 100 > 80.0
                          ? 'bg-green-100 text-success' 
                          : 'bg-blue-100 text-primary'}
                      `}>
                        {(result.matchCount/result.meTagCount*100).toFixed(0)}% 일치
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {result.matchedTags.map((Tag:String, i:number) => (
                        <span key={i} className="px-2 py-1 rounded-md bg-blue-50 text-primary text-xs md:text-sm">
                          {Tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm md:text-base text-gray-600">{result.title}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      <div className="mb-6 max-w-4xl mx-auto">
        <h3 className="font-medium text-gray-700 mb-3 md:text-lg">추천 탐색어</h3>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {searchSuggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm md:text-base border-none hover:bg-gray-200 transition-colors"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
      
      {isLoading && (
        <div className="text-center py-4 max-w-4xl mx-auto">
          <div className="inline-block animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-500 mt-2 md:text-lg">검색 중...</p>
        </div>
      )}
      
      {!isLoading && searchResults.length === 0 && searchInput && (
        <div className="text-center py-4 max-w-4xl mx-auto">
          <p className="text-gray-500 md:text-lg">검색 결과가 없습니다.</p>
          <p className="text-gray-500 text-sm md:text-base mt-1">다른 키워드로 검색해보세요.</p>
        </div>
      )}
    </div>
  );
};

export default InternalSNSConnector;
