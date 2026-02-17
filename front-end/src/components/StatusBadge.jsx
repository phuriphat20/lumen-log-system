import React from 'react';

const StatusBadge = ({ code }) => {
  const statusCode = Number(code);
  const getStatusStyles = (code) => {
    if (code >= 200 && code < 300) {
      return "bg-green-50 text-green-600 border-green-100";
    }
    if (code >= 400 && code < 500) {
      return "bg-amber-50 text-amber-600 border-amber-100";
    }
    if (code >= 500) {
      return "bg-red-50 text-red-600 border-red-100";
    }
    return "bg-slate-50 text-slate-600 border-slate-100";
  };

  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-tighter ${getStatusStyles(statusCode)}`}>
      {code || 'N/A'}
    </span>
  );
};

export default StatusBadge;