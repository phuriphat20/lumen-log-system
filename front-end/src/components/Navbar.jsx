import React from 'react';
import { LogOut, User as UserIcon } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'นาย ทดสอบ ระบบ';
    const userLevel = localStorage.getItem('userLevel') || 'Admin';

    const initial = username ? username.charAt(0) : 'U';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userLevel');
        localStorage.removeItem('userId');

        navigate('/login' , { replace: true });
    };

    return (
        <nav className="bg-[#ffffff] border-b border-[#E2E8F0] px-8 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm shadow-slate-100/50">
            <div className="flex items-center gap-3">
                <div className='bg-[#2e6ed5] w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100'>
                   <span className='text-white text-3xl font-bold'>L</span>
                </div> 
                <div className="flex flex-col my-3">
                    <span className="font-bold text-[#1E293B] text-lg leading-none tracking-tight">LUMEN</span>
                    <span className="text-[#3B82F6] text-[10px] font-black uppercase tracking-[0.2em]">Log System</span>
                </div>
            </div> 

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#3674d8] to-[#5691f1] flex items-center justify-center border-2 border-white/10 shadow-inner">
                        <span className="text-white font-bold text-sm">{initial}</span>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-[#1E293B] leading-none">{username}</p>

                    </div>                    
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-[#3B82F6] text-[10px] font-bold rounded-md uppercase border border-blue-100">
                        {userLevel}
                    </span>
                </div>
                <div className="h-8 w-0.5 bg-[#9d9d9d] mx-2"></div>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-xs"
                >
                    Logout
                    <LogOut size={18} />
                </button>
            </div>
        </nav>
    );
}

export default Navbar;