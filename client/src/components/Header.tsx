import { BellIcon, UserCircle, MenuIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const isMobile = useIsMobile();
  
  return (
    <header className="px-5 py-4 bg-white sticky top-0 z-10 border-b border-gray-100">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        <div className="flex items-center">
          {isMobile && (
            <div className="mr-4 lg:hidden">
              <h1 className="text-lg font-bold text-primary">BAESH</h1>
            </div>
          )}
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-gray-600 bg-secondary rounded-full p-2 hover:bg-gray-200 transition-colors">
            <BellIcon className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
