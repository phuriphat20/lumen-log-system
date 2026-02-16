import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import FilterSection from '../components/FilterSection';


const DashboardPage = () => {
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#e9edf1] font-sans text-[#1E293B]">
            <Navbar/>
            <FilterSection/>
        </div>
    );
}

export default DashboardPage;
