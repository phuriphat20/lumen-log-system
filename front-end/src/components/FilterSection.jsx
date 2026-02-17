import { useNavigate } from 'react-router-dom';
import MultiSelectInput from './MultiSelectInput';
import TextInput from './TextInput';
import { Activity, Filter, Search, RotateCcw, User, Hash, Database } from 'lucide-react';
import { useMemo, useCallback } from 'react';

const FillterSection = ({ 
    users = [], 
    onSearch, 
    filters, 
    setFilters,
    onReset,
    isAdmin,
    currentUserId
}) => {
    const userOptions = useMemo(() => {
        if (!users || !Array.isArray(users)) return [];
        return users
            .filter(u => u.isDel === false)
            .map(u => {
                const isMe = u._id === currentUserId; 
                return {
                    label: `${u.prefix || ''} ${u.firstname} ${u.lastname}${isMe ? ' (Me)' : ''}`.trim(),
                    value: u._id
                };
            });
    }, [users, currentUserId]);

    const actionOptions = [
        "labOrder", "labResult", "receive", "accept", "approve", "reapprove", 
        "unapprove", "unreceive", "rerun", "save", "listTransactions", 
        "getTransaction", "analyzerResult", "analyzerRequest"
    ];

    const handleChange = useCallback((field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    }, [setFilters]);

    return (
        <div className='bg-white border border-[#E2E8F0] mx-10 my-5 rounded-2xl shadow-sm relative z-50'>
            <div className="flex items-center gap-2 text-[#3B82F6] px-6 py-2 border-b border-slate-100">
                <Filter size={18} />
                <h3 className="font-bold uppercase tracking-widest text-xs">Advanced Filters</h3> 
            </div>

            <div className="p-6 flex flex-col lg:flex-row gap-5">
                <div className="grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4">
                    <MultiSelectInput 
                        label="Actions"
                        icon={Activity}
                        options={actionOptions}
                        selectedValues={filters.action}
                        onChange={(vals) => handleChange('action', vals)}
                        placeholder="All Actions"
                    />
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[#1E293B] uppercase tracking-widest ml-1">Start Date</label>
                        <input type="datetime-local" className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl mt-3 px-4 py-2.5 text-sm focus:border-blue-500 outline-none h-10"
                            value={filters.startTime} onChange={(e) => handleChange('startTime', e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[#1E293B] uppercase tracking-widest ml-1">End Date</label>
                        <input type="datetime-local" className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl mt-3 px-4 py-2.5 text-sm focus:border-blue-500 outline-none h-10"
                           value={filters.endTime} onChange={(e) => handleChange('endTime', e.target.value)} />
                    </div>
                    <div className={`${!isAdmin ? 'opacity-70' : ''}`}>
                        <MultiSelectInput 
                            label="User Selector"
                            icon={User}
                            options={userOptions}
                            selectedValues={filters.userId}
                            onChange={(vals) => isAdmin && handleChange('userId', vals)}
                            placeholder={isAdmin ? "All Users" : "Current User"} 
                            disabled={!isAdmin} 
                        />
                    </div>

                    <TextInput 
                        label="Lab Number"
                        icon={Database}
                        placeholder="All Labs"
                        value={filters.labNumber}
                        onChange={(e) => handleChange('labNumber', e.target.value)}
                    />
                    <TextInput 
                        label="Status Code"
                        icon={Hash}
                        placeholder="All Status"
                        value={filters.statusCode}
                        onChange={(e) => handleChange('statusCode', e.target.value)}
                    />
                    <TextInput 
                        label="Min Response (ms)"
                        type="number"
                        placeholder="0"
                        value={filters.minTimeMs}
                        onChange={(e) => handleChange('minTimeMs', e.target.value)}
                    />
                    <TextInput 
                        label="Max Response (ms)"
                        type="number"
                        placeholder="999999"
                        value={filters.maxTimeMs}
                        onChange={(e) => handleChange('maxTimeMs', e.target.value)}
                    />
                </div>

                <div className="lg:w-48 flex shrink-0 flex-col gap-3 justify-end">
                    <button 
                        onClick={() => onSearch(filters)} 
                        className="w-full h-10 bg-[#4686f3] gap-2 hover:bg-blue-600 text-white font-bold py-3 mb-10 rounded-xl shadow-lg shadow-blue-100 flex items-center justify-center transition-all active:scale-95"
                    >
                        <Search size={20} /> Apply Filters
                    </button>
                    <button 
                        onClick={onReset} 
                        className="w-full h-10 bg-[#344154] gap-2 hover:bg-slate-800 text-white font-bold py-3 rounded-xl flex items-center justify-center transition-all active:scale-95"
                    >
                        <RotateCcw size={20} /> Clear Filters
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FillterSection;