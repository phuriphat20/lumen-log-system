import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as API from '../services/api';
import TextInput from '../components/TextInput';
import { User, Lock, Loader2 } from 'lucide-react';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        navigate('/dashboard', { replace: true });
    }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!username.trim() || !password.trim()) {
            setError('Please enter both username and password');
            setLoading(false);
            return;
        }

        setError('');
        setLoading(true);

        try{
            const res = await API.login(username, password);

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userLevel', res.data.level); 
            localStorage.setItem('username', username);

            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Authentication failed. Please check your credentials.');
            
        }finally {
            setLoading(false);
        }
    }
   

       return (
        <div className=' bg-[#e9edf1] min-h-screen flex items-center justify-center p-5'>
            <div className='bg-[#ffffff] max-w-md w-full p-10 rounded-3xl shadow-md '>
                <div className='flex flex-col items-center mb-5'>
                    <div className='bg-[#2e6ed5] w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-2xl'>
                        <span className='text-white text-3xl font-bold'>L</span>
                    </div> 
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">LUMEN Log System</h2>
                    <p className="text-slate-400 text-sm mt-1">Management Console</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl border border-red-100 mb-4 text-center animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-6 mb-5'>
                    <TextInput 
                        label="Username"
                        icon={User}
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <TextInput 
                        label="Password"
                        icon={Lock}
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className='w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-100 mt-4 flex items-center justify-center active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed'
                    >
                        {loading ? (
                            <Loader2 className="animate-spin w-6 h-6" />
                        ) : (
                            "Sign In"
                        )}
                    </button>

                </form>
                <div className="mt-10 text-center">
                    <p className="text-[10px] text-slate-300 uppercase tracking-[0.2em] font-bold">
                        &copy; AUTHORIZED ACCESS ONLY
                    </p>
                </div>

            </div>

        </div>

    );
};

export default LoginPage;