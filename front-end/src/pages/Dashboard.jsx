import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import FilterSection from "../components/FilterSection";
import LogTable from "../components/LogTable";

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
    handleSearch(updatedFilters);
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
        logs={logs}
        loading={loading}
        totalResults={totalResults}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSort={handleSortChange}
      />
    </div>
  );
};

export default DashboardPage;
