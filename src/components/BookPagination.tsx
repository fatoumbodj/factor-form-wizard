
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface BookPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageTitle?: string;
}

export const BookPagination: React.FC<BookPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageTitle
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg border px-6 py-3 flex items-center gap-4 z-50">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <BookOpen className="w-4 h-4" />
        <span>{currentPage + 1} / {totalPages}</span>
        {pageTitle && (
          <>
            <span>•</span>
            <span className="font-medium">{pageTitle}</span>
          </>
        )}
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
