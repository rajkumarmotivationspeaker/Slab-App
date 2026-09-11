import React from 'react'
import { Sparkles, Code2, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 text-slate-400 text-xs py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <span className="font-semibold text-slate-300">Slab Application</span>
          <span className="text-slate-600">•</span>
          <span>React + Tailwind CSS + RapidAPI + react-router-dom</span>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <span className="flex items-center gap-1">
            Built with TechHexa<Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20 inline" /> for Web Developers
          </span>
        </div>
      </div>
    </footer>
  )
}
