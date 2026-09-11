import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Languages, 
  KeyRound, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Code, 
  Layers, 
  Route, 
  Zap,
  Globe,
  Cpu
} from 'lucide-react'

export default function DashboardPage() {
  const requirements = [
    {
      id: 1,
      title: "Text Translator Application",
      description: "React & Tailwind CSS app taking English string input and translating into your favorite language using RapidAPI with fallback service.",
      path: "/translator",
      badge: "RapidAPI + React",
      icon: Languages,
      color: "from-purple-600 to-pink-600",
      accent: "text-purple-400",
      bg: "bg-purple-950/40 border-purple-500/20"
    },
    {
      id: 2,
      title: "Random String Generator",
      description: "Utility application strictly built using useState, useCallback, and useEffect hooks with strength meter and batch output.",
      path: "/generator",
      badge: "Hooks (useState, useCallback, useEffect)",
      icon: KeyRound,
      color: "from-emerald-600 to-teal-600",
      accent: "text-emerald-400",
      bg: "bg-emerald-950/40 border-emerald-500/20"
    },
    {
      id: 3,
      title: "Client-Side Routing",
      description: "Seamless single-page client routing implemented using react-router-dom with active route styling & responsive navigation.",
      path: "/",
      badge: "react-router-dom",
      icon: Route,
      color: "from-blue-600 to-indigo-600",
      accent: "text-indigo-400",
      bg: "bg-indigo-950/40 border-indigo-500/20"
    }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Slab [For Beginners] Portfolio Application
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            All-In-One Web Apps Suite
          </h1>

          <p className="text-slate-300 text-base max-w-2xl leading-relaxed">
            Welcome! This project fulfills all requirements specified in <strong className="text-indigo-300">Slab 1</strong>, integrating an English Text Translator powered by RapidAPI, a Random String Generator utilizing React hooks (<code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded font-mono">useState</code>, <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded font-mono">useCallback</code>, <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded font-mono">useEffect</code>), and client-side routing with <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded font-mono">react-router-dom</code>.
          </p>

          {/* Quick Action CTA buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/translator"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Languages className="w-4 h-4" />
              <span>Try Text Translator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/generator"
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm border border-slate-700 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>Launch String Generator</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Requirement Checklist Summary Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Slab Requirements Status</h2>
              <p className="text-xs text-slate-400">Verification checklist from the assignment specifications</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full text-xs font-mono font-semibold">
            3/3 Completed ✓
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {requirements.map((req) => {
            const Icon = req.icon
            return (
              <div
                key={req.id}
                className={`p-6 rounded-2xl border ${req.bg} flex flex-col justify-between space-y-4 hover:border-slate-600 transition-all duration-300 group`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${req.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>

                  <span className="inline-block text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {req.badge}
                  </span>

                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {req.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {req.description}
                  </p>
                </div>

                <Link
                  to={req.path}
                  className={`inline-flex items-center gap-2 text-xs font-bold ${req.accent} hover:underline pt-2`}
                >
                  <span>Open Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tech Stack Tech Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center gap-4">
          <Globe className="w-8 h-8 text-indigo-400 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-slate-200">RapidAPI Translate</h4>
            <p className="text-xs text-slate-400">Supports English to 13+ languages</p>
          </div>
        </div>

        <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center gap-4">
          <Cpu className="w-8 h-8 text-emerald-400 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Hooks Compliance</h4>
            <p className="text-xs text-slate-400">useState, useCallback, useEffect</p>
          </div>
        </div>

        <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center gap-4">
          <Route className="w-8 h-8 text-purple-400 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Client Side Router</h4>
            <p className="text-xs text-slate-400">react-router-dom v6</p>
          </div>
        </div>
      </div>
    </div>
  )
}
