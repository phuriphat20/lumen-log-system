import React, { useState } from "react";
import {
    FileText,
    FileSpreadsheet,
    MoreVertical,
    ChevronDown,
    ChevronUp,
    ArrowUpDown,
    Info,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import Pagination from "./Pagination";

const LogTable = ({
    logs = [],
    loading,
    totalResults = 0,
    pagination = { page: 1, totalPages: 1, limit: 50 },
    onPageChange,
    onSort,
    onLimitChange,
    sortBy,
    order
}) => {
    const { page: currentPage, totalPages, limit } = pagination;
    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const handleSortClick = (field) => {
        let nextOrder = "";

        if (sortBy === field) {
            if (order === "") nextOrder = "asc";
            else if (order === "asc") nextOrder = "desc";
            else nextOrder = "";
        } else {
            nextOrder = "asc";
        }

        onSort(field, nextOrder);
    };

    const formatTimestamp = (dateString) => {
        if (!dateString) return "-";
        const rawDate = dateString?.$date ? dateString.$date : dateString;
        const date = new Date(rawDate);
        if (isNaN(date.getTime())) return "-";
        const pad = (n) => String(n).padStart(2, "0");
        return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
    };

    const SkeletonRow = () => (
        <tr className="animate-pulse border-t border-slate-50">
            {[...Array(8)].map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <div className="h-3 bg-slate-100 rounded w-full"></div>
                </td>
            ))}
        </tr>
    );

    const SortableHeader = ({ title, field, width = "" }) => {
        const isCurrentField = sortBy === field;
        const currentOrder = isCurrentField ? order : "";

        return (
            <th className={`relative group ${width} px-4 py-4`}>
                <div className="flex items-center gap-5 pl-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isCurrentField && currentOrder ? 'text-blue-500' : 'text-slate-400'}`}>
                        {title}
                    </span>
                    <div className="relative inline-block text-left">
                        <button
                            onClick={() => handleSortClick(field)}
                            className="p-1 hover:bg-slate-200 rounded-md transition-colors"
                        >
                            {currentOrder === 'asc' && <ChevronUp size={12} className="text-blue-500" />}
                            {currentOrder === 'desc' && <ChevronDown size={12} className="text-blue-500" />}
                            {!currentOrder && <MoreVertical size={12} className="text-slate-400" />}
                        </button>

                        <div className="hidden group-hover:block absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1">
                            <button onClick={() => onSort(field, "asc")} className="w-full px-3 py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                                {currentOrder === 'asc' && <span className="text-blue-500">●</span>} ASCENDING
                            </button>
                            <button onClick={() => onSort(field, "desc")} className="w-full px-3 py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                                {currentOrder === 'desc' && <span className="text-blue-500">●</span>} DESCENDING
                            </button>
                            <button onClick={() => onSort(field, "")} className="w-full px-3 py-2 text-[10px] font-bold text-slate-400 hover:bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                                <ArrowUpDown size={12} /> DEFAULT
                            </button>
                        </div>
                    </div>
                </div>
            </th>
        );
    };

    return (
        <div className="bg-white border border-[#E2E8F0] mx-10 my-5 rounded-2xl shadow-sm relative z-10 overflow-visible">

            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-5">
                    <div className="bg-[#3B82F6] p-2 rounded-lg text-white shadow-lg shadow-blue-100">
                        <FileText size={18} />
                    </div>
                    <h2 className="font-bold text-[#1E293B] text-m tracking-tight uppercase">System Activity Logs</h2>
                    <span className="bg-blue-50 border border-blue-100 text-[#3B82F6] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                        {!loading ? totalResults.toLocaleString() : "..."} RESULTS
                    </span>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95">
                        <FileText size={14} className="text-red-500" /> Export PDF
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95">
                        <FileSpreadsheet size={14} className="text-green-500" /> Export Excel
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <SortableHeader title="Timestamp" field="timestamp" width="w-40" />
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-48 text-center">User</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24 text-center">Method</th>
                            <th className="pl-20 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-52">Endpoint</th>
                            <SortableHeader title="Action" field="action" width="w-32" />
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Lab Number</th>
                            <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest w-28">Status</th>
                            <th className="pl-5 py-4 text-left pr-10 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">Massage</th>
                            <SortableHeader title="Time (ms)" field="response.timeMs" width="w-38" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <>
                                <SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow />
                            </>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center py-20 text-slate-400 text-xs italic font-medium uppercase tracking-widest">
                                    No activity logs found for the current filters.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <React.Fragment key={log._id?.$oid || log._id}>
                                    <tr onClick={() => toggleRow(log._id)} className={`cursor-pointer transition-all hover:bg-blue-50/30 ${expandedRow === log._id ? "bg-blue-50/40" : ""}`}>
                                        <td className="pl-5  py-4 text-[11px] text-slate-500 font-medium whitespace-nowrap ">{formatTimestamp(log.timestamp)}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-700 truncate text-center">{`${log.userId?.prefix || ""} ${log.userId?.firstname || ""} ${log.userId?.lastname || ""}`.trim()}</td>
                                        <td className="px-6 py-4 text-center text-[10px] font-black text-blue-600 uppercase">{log.request?.method || "-"}</td>
                                        <td className="pl-14 py-4 text-[11px] text-slate-400 font-mono truncate">{log.request?.endpoint || "-"}</td>
                                        <td className=" py-4 text-center"><span className="bg-white border border-slate-200 text-[#3B82F6] px-2 py-0.5 rounded text-[10px] font-black uppercase">{log.action}</span></td>
                                        <td className="px-6 py-4 text-[10px] text-slate-400 font-bold truncate text-center">{log.labnumber?.join(",") || "-"}</td>
                                        <td className="px-6 py-4 text-center"><StatusBadge code={log.response?.statusCode} /></td>
                                        <td className=" py-4 text-left text-xs font-mono font-bold text-slate-600 truncate ">{log.response?.message || "Success"}</td>
                                        <td className="pl-14 py-4 text-left pr-10 text-xs font-mono font-bold text-slate-600">{log.response?.timeMs?.toLocaleString() || 0}</td>
                                    </tr>
                                    {expandedRow === log._id && (
                                        <tr className="bg-slate-50/80 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <td colSpan="8" className="px-10 py-6 border-l-4 border-[#3B82F6]">
                                                <div className="grid grid-cols-2 gap-8">
                                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                                        <h4 className="text-[10px] font-black text-blue-500 uppercase mb-3 tracking-widest flex items-center gap-1"><Info size={12} /> Transaction Details</h4>
                                                        <div className="space-y-2">
                                                            <p className="text-xs text-slate-600"><span className="font-bold text-slate-400 mr-2">Endpoint:</span> {log.request?.endpoint || "-"}</p>
                                                            <p className="text-xs text-slate-600 leading-relaxed"><span className="font-bold text-slate-400 mr-2">Labs:</span> {log.labnumber?.join(", ") || "-"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                                        <h4 className="text-[10px] font-black text-emerald-500 uppercase mb-3 tracking-widest flex items-center gap-1"><Info size={12} /> Server Response</h4>
                                                        <p className="text-xs text-slate-700 leading-relaxed font-medium italic">"{log.response?.message || "Success"}"</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalResults}
                limit={limit}
                onPageChange={onPageChange}
                onLimitChange={onLimitChange}
            />
        </div>
    );
};

export default LogTable;