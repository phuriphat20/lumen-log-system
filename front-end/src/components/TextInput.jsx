import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from '../utils/cn';

const TextInput = ({
  label,
  icon: Icon,
  placeholder,
  type = "text",
  value,
  onChange,
  required = false,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`space-y-2 w-full text-left ${className}`}>
        {label && (
            <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-widest ml-1">
                {label}
            </label>
        )}

        <div className="relative">
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <Icon size={20} />
                </div>
            )}
            <input 
                type={inputType}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`
                    w-full py-3 rounded-xl transition-all duration-200
                    bg-[#F8FAFC] border border-[#E2E8F0]
                    text-[#1E293B] placeholder:text-slate-300
                    focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#3B82F6]
                    ${Icon ? "pl-11" : "pl-4"}
                    ${type === "password" ? "pr-11" : "pr-4"}
                `}         
            />
            {type === 'password' && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#3B82F6] transition-colors"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            )}
 
        </div>
    </div>
  );
};

export default TextInput;
