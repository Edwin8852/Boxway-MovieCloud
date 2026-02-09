import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  isLoading?: boolean;
  // Pagination Props
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalRecords?: number;
}

function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No data available',
  isLoading = false,
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-white border border-[#C7BFB4]/30 overflow-hidden shadow-sm">
        <div className="p-12 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 bg-muted animate-pulse rounded flex-1" />
              <div className="h-4 bg-muted animate-pulse rounded flex-1" />
              <div className="h-4 bg-muted animate-pulse rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white border border-[#C7BFB4]/30 overflow-hidden shadow-sm">
        <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
          <p className="font-medium">{emptyMessage}</p>
          <p className="text-xs">Try adjusting your filters or search.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#C7BFB4]/30 overflow-hidden shadow-sm rounded-xl flex flex-col">
      <div className="overflow-x-auto scrollbar-hide flex-1">
        <table className="min-w-full divide-y divide-[#C7BFB4]/20">
          <thead className="bg-[#F8F5F2]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-[10px] font-bold text-[#1F1F1F]/60 uppercase tracking-widest ${column.className || ''} ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#C7BFB4]/10">
            {data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={`group transition-all duration-300 ${onRowClick ? 'cursor-pointer hover:bg-[#F8F5F2]' : ''}`}
              >
                {columns.map((column) => (
                  <td
                    key={`${item.id}-${column.key}`}
                    className={`px-6 py-4 text-sm text-[#1F1F1F] whitespace-nowrap ${column.className || ''} ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`}
                  >
                    {column.render
                      ? column.render(item)
                      : (item as Record<string, unknown>)[column.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer - Integrated at Bottom of Card */}
      {onPageChange && (
        <div className="px-6 py-4 bg-[#F8F5F2] border-t border-[#C7BFB4]/30 flex items-center justify-between">
          <div className="text-[11px] font-bold text-[#1F1F1F]/40 uppercase tracking-widest">
            {totalRecords ? `Total ${totalRecords} Records` : 'Directory View'}
            {currentPage && totalPages && ` • Page ${currentPage} of ${totalPages}`}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, (currentPage || 1) - 1))}
              disabled={!currentPage || currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#C7BFB4]/30 text-[#1F1F1F] disabled:opacity-20 disabled:cursor-not-allowed hover:bg-[#F8F5F2] transition-all active:scale-[0.98] shadow-sm group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
              <span className="text-[10px] font-black uppercase tracking-widest">Prev</span>
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages || 1, (currentPage || 1) + 1))}
              disabled={!totalPages || currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#C7BFB4]/30 text-[#1F1F1F] disabled:opacity-20 disabled:cursor-not-allowed hover:bg-[#F8F5F2] transition-all active:scale-[0.98] shadow-sm group"
            >
              <span className="text-[10px] font-black uppercase tracking-widest">Next</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Scroll Indicator */}
      <div className="md:hidden p-3 border-t border-[#C7BFB4]/10 flex items-center justify-center gap-2 opacity-60 bg-[#F8F5F2]/30">
        <div className="w-1.5 h-1.5 rounded-full bg-[#CFAE70] animate-pulse" />
        <span className="text-[10px] font-black text-[#1F1F1F]/40 uppercase tracking-widest">Swipe for more</span>
      </div>
    </div>
  );
}

export default DataTable;
