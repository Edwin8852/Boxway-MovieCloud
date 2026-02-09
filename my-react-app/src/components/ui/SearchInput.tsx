import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-[#2B2B2B]/40 group-focus-within:text-[#6B8E23] transition-colors" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/50 border border-[#1F1F1F]/10 h-10 pl-11 pr-4 text-sm text-[#2B2B2B] placeholder:text-[#2B2B2B]/30 focus:outline-none focus:ring-0 focus:border-[#6B8E23]/50 focus:bg-white transition-all duration-300 rounded-none shadow-sm"
      />
      <div className="absolute bottom-0 left-0 h-[2px] bg-[#6B8E23] w-0 group-focus-within:w-full transition-all duration-500" />
    </div>
  );
};

export default SearchInput;
