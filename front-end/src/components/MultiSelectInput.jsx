import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

const MultiSelectInput = ({ 
    label, 
    icon: Icon, 
    options = [], 
    selectedValues = [], 
    onChange, 
    placeholder = "แสดงทั้งหมด",
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (val) => {
        if (disabled) return;
        let newValues;
        if (selectedValues.includes(val)) {
            newValues = selectedValues.filter(v => v !== val);
        } else {
            newValues = [...selectedValues, val];
        }
        onChange(newValues); 
    };

    const clearAll = (e) => {
        e.stopPropagation();
        if (disabled) return;
        onChange([]);
    };

    return (
        <div className='flex flex-col gap-2 w-full relative' ref={containerRef}>
            {label && (
                <label className="text-[10px] font-bold text-[#1E293B] uppercase tracking-[0.2em] ml-1">
                    {label}
                </label>
            )}

            <div
                onClick={() => !disabled && setIsOpen(prev => !prev)}
                className={`
                    min-h-12 w-full bg-[#F8FAFC] border rounded-2xl px-4 py-2 
                    flex items-center gap-3 cursor-pointer transition-all shadow-sm
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${isOpen ? 'border-[#3B82F6] ring-4 ring-blue-50/50' : 'border-[#E2E8F0]'}
                `}
            >
                {Icon && (
                    <div className={`shrink-0 ${selectedValues.length > 0 ? 'text-[#3B82F6]' : 'text-slate-400'}`}>
                        <Icon size={16} />
                    </div>
                )}

                <div className="flex flex-nowrap h-8 gap-1.5 flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar py-1">
                    {selectedValues.length === 0 ? (
                        <span className="text-sm text-slate-400 self-center">{placeholder}</span>
                    ) : (
                        selectedValues.map(val => {
                            const option = options.find(opt => (opt.value || opt) === val);
                            const displayLabel = option?.label || option;
                            return (
                                <span 
                                    key={val} 
                                    className="bg-blue-50 text-[#3B82F6] text-[11px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-blue-100 whitespace-nowrap shrink-0 animate-in fade-in zoom-in"
                                >
                                    {displayLabel}
                                    <X 
                                        size={12} 
                                        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors cursor-pointer" 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            toggleOption(val); 
                                        }} 
                                    />
                                </span>
                            );
                        })
                    )}
                </div>

                <div className="flex items-center gap-2 text-slate-400 shrink-0 border-l border-slate-100 pl-2">
                    {selectedValues.length > 0 && !disabled && (
                        <X size={14} className="hover:text-red-500 transition-colors" onClick={clearAll} />
                    )}
                    <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#3B82F6]' : ''}`} />
                </div>
            </div>

            {isOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-[#E2E8F0] rounded-2xl shadow-xl z-50 py-2 max-h-64  overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2">
                    <div 
                        onClick={() => {
                            onChange([]); 
                            setIsOpen(false);
                        }}
                        className="px-4 py-2.5 hover:bg-blue-50/50 flex items-center justify-between cursor-pointer transition-colors group border-b border-slate-50 mb-1"
                    >
                        <span className={`text-sm transition-colors ${selectedValues.length === 0 ? 'text-[#3B82F6] font-bold' : 'text-slate-600 group-hover:text-slate-900'}`}>
                            แสดงทั้งหมด
                        </span>
                        {selectedValues.length === 0 && (
                            <div className="bg-[#3B82F6] rounded-md p-0.5 shadow-sm shadow-blue-200">
                                <Check size={12} className="text-white" />
                            </div>
                        )}
                    </div>
                    
                    {options.map((option) => {
                        const val = option.value !== undefined ? option.value : option;
                        const lab = option.label || option;
                        const isSelected = selectedValues.includes(val);
                        
                        return (
                            <div 
                                key={val}
                                onClick={() => toggleOption(val)}
                                className="px-4 py-2.5 hover:bg-blue-50/50 flex items-center justify-between cursor-pointer transition-colors group"
                            >
                                <span className={`text-sm transition-colors ${isSelected ? 'text-[#3B82F6] font-bold' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                    {lab}
                                </span>
                                {isSelected && (
                                    <div className="bg-[#3B82F6] rounded-md p-0.5 shadow-sm shadow-blue-200">
                                        <Check size={12} className="text-white" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MultiSelectInput;

