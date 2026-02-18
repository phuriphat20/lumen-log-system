import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import FilterSection from "../components/FilterSection";
import LogTable from "../components/LogTable";
import { exportToExcel, exportToPDF } from "../utils/exportHelper";

const ACTION_PRIORITY = [
    "labOrder", "labResult", "receive", "accept", "approve", "reapprove",
    "unapprove", "unreceive", "rerun", "save", "listTransactions",
    "getTransaction", "analyzerResult", "analyzerRequest"
]

const DashboardPage = () => {
    const [logs, setLogs] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isAdmin = useMemo(() => {
        const level = localStorage.getItem("userLevel");
        return level?.toLowerCase() === "admin";
    }, []);
    const currentUserId = useMemo(() => localStorage.getItem("userId"), []);

    const getDefaultFilters = useCallback(() => {
        const date = new Date();
        date.setHours(23, 59, 0, 0);
        const offset = date.getTimezoneOffset() * 60000;
        const todayEnd = new Date(date - offset).toISOString().slice(0, 16);

        return {
            action: [],
            startTime: "2024-01-01T00:00",
            endTime: todayEnd,
            userId: isAdmin ? [] : (currentUserId ? [currentUserId] : []),
            labNumber: "",
            statusCode: "",
            minTimeMs: "",
            maxTimeMs: "",
            page: 1,
            limit: 50,
            sortBy: "",
            order: ""
        };
    }, [isAdmin, currentUserId]);

    const [filters, setFilters] = useState(() => {
        try {
            const savedFilters = localStorage.getItem("dashboard_filters");
            if (savedFilters) {
                return JSON.parse(savedFilters);
            }
        } catch (error) {
            console.error(error);
        }
        return getDefaultFilters();
    });

    useEffect(() => {
        localStorage.setItem("dashboard_filters", JSON.stringify(filters));
    }, [filters]);

    const sortedLogs = useMemo(() => {
        if (!logs.length || !filters.sortBy || !filters.order) return logs;

        return [...logs].sort((a, b) => {
            const isAsc = filters.order === "asc";
            const field = filters.sortBy;

            if (field === "action") {
                const idxA = ACTION_PRIORITY.indexOf(a.action);
                const idxB = ACTION_PRIORITY.indexOf(b.action);
                return isAsc ? idxA - idxB : idxB - idxA;
            }

            if (field === "response.timeMs") {
                const numA = Number(a.response?.timeMs) || 0;
                const numB = Number(b.response?.timeMs) || 0;
                return isAsc ? numA - numB : numB - numA;
            }

            if (field === "timestamp") {
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
            setUsers(res.data || []);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const handleSearch = useCallback(async (currentFilters) => {
        try {
            setLoading(true);

            const apiParams = {
                ...currentFilters,
                action: Array.isArray(currentFilters.action)
                    ? currentFilters.action.join(',')
                    : currentFilters.action,
                userId: Array.isArray(currentFilters.userId)
                    ? currentFilters.userId.join(',')
                    : currentFilters.userId,
                startDate: currentFilters.startDate || currentFilters.startTime,
                endDate: currentFilters.endDate || currentFilters.endTime,
                minTime: currentFilters.minTime || currentFilters.minTimeMs,
                maxTime: currentFilters.maxTime || currentFilters.maxTimeMs,
                labnumber: currentFilters.labNumber,
                page: currentFilters.page || 1,
                limit: currentFilters.limit || 50
            };

            const res = await API.searchLogs(apiParams);
            setLogs(res.data.logs || []);
            setTotalResults(res.data.total || 0);

        } catch (err) {
            console.error("Search Error:", err);
        } finally {
            setLoading(false);
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

    const handlePageChange = (newPage) => {
        const updatedFilters = { ...filters, page: newPage };
        setFilters(updatedFilters);
        handleSearch(updatedFilters);
    };

    const handleLimitChange = (newLimit) => {
        const updatedFilters = { ...filters, limit: newLimit, page: 1 };
        setFilters(updatedFilters);
        handleSearch(updatedFilters);
    };

    const handleSortChange = (field, order) => {
        const updatedFilters = {
            ...filters,
            sortBy: order ? field : "",
            order: order || "",
            page: 1,
        };
        setFilters(updatedFilters);
        if (field !== 'action') {
            handleSearch(updatedFilters);
        }
    };

    const handleReset = useCallback(() => {
        const defaultFilters = getDefaultFilters();
        setFilters(defaultFilters);
        handleSearch(defaultFilters);
    }, [getDefaultFilters, handleSearch]);

    const handleExport = useCallback(async (type) => {
        try {
            setLoading(true);

            const exportParams = {
                ...filters,
                action: Array.isArray(filters.action) ? filters.action.join(',') : filters.action,
                userId: Array.isArray(filters.userId) ? filters.userId.join(',') : filters.userId,
                startDate: filters.startDate || filters.startTime,
                endDate: filters.endDate || filters.endTime,
                minTime: filters.minTime || filters.minTimeMs,
                maxTime: filters.maxTime || filters.maxTimeMs,
                labnumber: filters.labNumber,
                page: 1,
                limit: 1000000
            };
            const res = await API.searchLogs(exportParams);
            const allLogs = res.data.logs || [];

            if (allLogs.length === 0) {
                alert("No data to export with current filters.");
                return;
            }

            if (type === 'excel') {
                exportToExcel(allLogs, 'Log_Report');
            } else if (type === 'pdf') {
                exportToPDF(allLogs, 'Log_Report');
            }
        } catch (err) {
            console.error("Export Error:", err);
            alert("Failed to export data. Please try again.");
        } finally {
            setLoading(false);
        }

    }, [filters]);

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
                pagination={{
                    page: filters.page,
                    limit: filters.limit,
                    totalPages: Math.ceil(totalResults / (filters.limit || 50))
                }}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                onExportExcel={() => handleExport('excel')}
                onExportPDF={() => handleExport('pdf')}
            />
        </div>
    );
};

export default DashboardPage;