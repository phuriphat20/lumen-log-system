import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css' // แนะนำให้ปิดตัวนี้ไว้ก่อน เพื่อไม่ให้ Style เก่ามาตีกับ Tailwind ครับ

function App() {
  const [count, setCount] = useState(0)

  return (
    // ใช้ flex และ min-h-screen เพื่อจัดให้อยู่กึ่งกลางหน้าจอ
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 font-sans">
      
      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev" target="_blank" className="transition-transform hover:scale-110">
          <img src={viteLogo} className="w-24 h-24 drop-shadow-[0_0_2em_#646cffaa]" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="transition-transform hover:scale-110">
          <img src={reactLogo} className="w-24 h-24 drop-shadow-[0_0_2em_#61dafbaa]" alt="React logo" />
        </a>
      </div>

      <h1 className="text-5xl font-extrabold mb-6 bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        Vite + React
      </h1>

      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 text-center">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all rounded-lg font-semibold text-lg mb-4 cursor-pointer"
        >
          count is {count}
        </button>
        
        <p className="text-slate-400">
          Edit <code className="bg-slate-900 px-2 py-1 rounded text-pink-400">src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p className="mt-8 text-slate-500 italic">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App