import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import FilterSection from "../components/FilterSection";
import LogTable from "../components/LogTable";

const ACTION_PRIORITY = [
    "labOrder", "labResult", "receive", "accept", "approve", "reapprove",
    "unapprove", "unreceive", "rerun", "save", "listTransactions",
    "getTransaction", "analyzerResult", "analyzerRequest"
]

const DashboardPage = () => {
    const [logs, setLogs] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        limit: 50,
    });
    const navigate = useNavigate();

    const getTodayWithTime = useCallback((hours, minutes) => {
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date - offset).toISOString().slice(0, 16);
    }, []);

    const isAdmin = useMemo(() => {
        const level = localStorage.getItem("userLevel");

        return level?.toLowerCase() === "admin";
    }, []);
    const currentUserId = useMemo(() => localStorage.getItem("userId"), []);

    const [filters, setFilters] = useState({
        action: [],
        startTime: getTodayWithTime(0, 0),
        endTime: getTodayWithTime(23, 59),
        userId: isAdmin ? [] : currentUserId ? [currentUserId] : [],
        labNumber: "",
        statusCode: "",
        minTimeMs: 0,
        maxTimeMs: 999999,
    });

    const sortedLogs = useMemo(() => {
        if (!logs || logs.length === 0 || !filters.sortBy || !filters.order) {
            return logs;
        }
        const isAsc = filters.order === "asc";

        return [...logs].sort((a, b) => {

            if (filters.sortBy === "action") {
                const idxA = ACTION_PRIORITY.indexOf(a.action);
                const idxB = ACTION_PRIORITY.indexOf(b.action);
                const wA = idxA === -1 ? 999 : idxA;
                const wB = idxB === -1 ? 999 : idxB;
                return isAsc ? wA - wB : wB - wA;
            }

            if (filters.sortBy === "response.timeMs") {
                const numA = Number(a.response?.timeMs) || 0;
                const numB = Number(b.response?.timeMs) || 0;
                return isAsc ? numA - numB : numB - numA;
            }

            if (filters.sortBy === "timestamp") {
                const tA = new Date(a.timestamp?.$date || a.timestamp).getTime();
                const tB = new Date(b.timestamp?.$date || b.timestamp).getTime();
                return isAsc ? tA - tB : tB - tA;
            }

            return 0;
        });
    }, [logs, filters.sortBy, filters.order]);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await API.fetchUsers();
            console.log("All Users Data:", res.data);
            setUsers(res.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch users");
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login", { replace: true });
        } else {
            fetchUsers();
            handleSearch(filters);
        }
    }, [navigate, fetchUsers]);

    const handleSearch = useCallback(async (currentFilters) => {
        try {
            setLoading(true);
            const res = await API.searchLogs(currentFilters);

            setLogs(res.data.logs || []);
            setTotalResults(res.data.total || 0);
            setPagination({
                page: currentFilters.page || 1,
                totalPages: res.data.totalPages || 1,
                limit: currentFilters.limit || 50,
            });
        } catch (err) {
            console.error(err);
            setError("Failed to fetch logs");
        } finally {
            setLoading(false);
        }
    }, []);

    const handlePageChange = (newPage) => {
        const updatedFilters = { ...filters, page: newPage };
        setFilters(updatedFilters);
        handleSearch(updatedFilters);
    };

    const handleSortChange = (field, order) => {
        const updatedFilters = {
            ...filters,
            sortBy: field,
            order: order || "",
            page: 1,
        };
        setFilters(updatedFilters);
        if (field !== 'action') {
            handleSearch(updatedFilters);
        }
    };

    const handleReset = useCallback(() => {
        setFilters({
            action: [],
            startTime: getTodayWithTime(0, 0),
            endTime: getTodayWithTime(23, 59),
            userId: isAdmin ? [] : currentUserId ? [currentUserId] : [],
            labNumber: "",
            statusCode: "",
            minTimeMs: 0,
            maxTimeMs: 999999,
        });
    }, [getTodayWithTime, isAdmin, currentUserId]);

    return (
        <div className="min-h-screen bg-[#e9edf1] font-sans text-[#1E293B]">
            <Navbar />
            <FilterSection
                users={users}
                onSearch={handleSearch}
                filters={filters}
                setFilters={setFilters}
                onReset={handleReset}
                isAdmin={isAdmin}
                currentUserId={currentUserId}
            />
            <LogTable
                logs={sortedLogs}
                loading={loading}
                totalResults={totalResults}
                onSort={handleSortChange}
                sortBy={filters.sortBy}
                order={filters.order}
                pagination={{ page: filters.page, limit: filters.limit, totalPages: Math.ceil(totalResults / (filters.limit || 50)) }}

                onPageChange={(p) => { const u = { ...filters, page: p }; setFilters(u); handleSearch(u); }}

                onLimitChange={(l) => { const u = { ...filters, limit: l, page: 1 }; setFilters(u); handleSearch(u); }}
            />
        </div>
    );
};

export default DashboardPage;
