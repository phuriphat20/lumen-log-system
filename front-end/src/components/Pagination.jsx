import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ 
    currentPage = 1, 
    totalPages = 1, 
    totalResults = 0, 
    limit = 50, 
    onPageChange,
    onLimitChange 
}) => {
    const curr = Number(currentPage) || 1;
    const totalP = Number(totalPages) || 1;
    const totalR = Number(totalResults) || 0;

    const startEntry = totalR > 0 ? (curr - 1) * limit + 1 : 0;
    const endEntry = Math.min(curr * limit, totalR);

    return (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-6">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Showing <span className="text-slate-600">{startEntry}</span> to <span className="text-slate-600">{endEntry}</span> of <span className="text-[#3B82F6]">{totalR}</span> entries
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Show:</span>
                    <select 
                        value={limit}
                        onChange={(e) => onLimitChange(Number(e.target.value))}
                        className="bg-white border border-slate-200 rounded px-2 py-1 text-[10px] font-bold text-slate-600 outline-none focus:border-blue-400"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={200}>200</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-1 items-center">
                <button 
                    onClick={() => onPageChange(1)}
                    disabled={curr <= 1}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-20 active:scale-90 transition-all"
                >
                    <ChevronsLeft size={14}/>
                </button>
                <button 
                    onClick={() => onPageChange(curr - 1)}
                    disabled={curr <= 1}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-20 active:scale-90 transition-all"
                >
                    <ChevronLeft size={14}/>
                </button>

                <div className="px-4 py-2 text-xs font-black text-[#3B82F6] bg-white border border-blue-100 rounded-lg shadow-sm min-w-11.25 text-center">
                    {curr} <span className="text-slate-300 font-normal">/</span> {totalP}
                </div>

                <button 
                    onClick={() => onPageChange(curr + 1)}
                    disabled={curr >= totalP}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-20 active:scale-90 transition-all"
                >
                    <ChevronRight size={14}/>
                </button>
                <button 
                    onClick={() => onPageChange(totalP)}
                    disabled={curr >= totalP}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-20 active:scale-90 transition-all"
                >
                    <ChevronsRight size={14}/>
                </button>
            </div>
        </div>
    );
};

export default Pagination;