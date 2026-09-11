import React, { useState, useCallback, useEffect } from 'react'
import { 
  KeyRound, 
  Copy, 
  Check, 
  RefreshCw, 
  Sliders, 
  ShieldCheck, 
  Sparkles, 
  History, 
  FileCode,
  Layers,
  Zap,
  Info
} from 'lucide-react'

const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  similar: 'iI1lLo0O8'
}

export default function GeneratorPage() {
  // 1. useState Hooks
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [generatedString, setGeneratedString] = useState('')
  const [batchCount, setBatchCount] = useState(1)
  const [batchStrings, setBatchStrings] = useState([])
  const [history, setHistory] = useState([])
  const [copied, setCopied] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [hookCallCount, setHookCallCount] = useState(0)

  // 2. useCallback Hook: Memoized Random String Generator
  const generateRandomString = useCallback(() => {
    let validChars = ''
    if (includeUppercase) validChars += CHARSETS.uppercase
    if (includeLowercase) validChars += CHARSETS.lowercase
    if (includeNumbers) validChars += CHARSETS.numbers
    if (includeSymbols) validChars += CHARSETS.symbols

    if (excludeSimilar && validChars.length > 0) {
      const regex = new RegExp(`[${CHARSETS.similar}]`, 'g')
      validChars = validChars.replace(regex, '')
    }

    if (!validChars) {
      setGeneratedString('Please select at least one character type')
      setBatchStrings([])
      return
    }

    const generateSingle = () => {
      let result = ''
      const array = new Uint32Array(length)
      crypto.getRandomValues(array)
      for (let i = 0; i < length; i++) {
        result += validChars[array[i] % validChars.length]
      }
      return result
    }

    // Single result
    const primaryResult = generateSingle()
    setGeneratedString(primaryResult)

    // Batch results if count > 1
    if (batchCount > 1) {
      const list = Array.from({ length: batchCount }, () => generateSingle())
      setBatchStrings(list)
    } else {
      setBatchStrings([])
    }

    // Record history
    setHistory(prev => [
      { id: Date.now(), text: primaryResult, len: length, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 7)
    ])

    // Track hook execution count for demonstration
    setHookCallCount(prev => prev + 1)
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar, batchCount])

  // 3. useCallback Hook: Memoized Copy to Clipboard
  const copyToClipboard = useCallback((text, index = null) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    if (index !== null) {
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } else {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  // 4. useEffect Hook: Auto-generate string whenever parameters or dependencies change
  useEffect(() => {
    generateRandomString()
  }, [generateRandomString])

  // Calculate entropy strength
  const getStrengthInfo = () => {
    let poolSize = 0
    if (includeUppercase) poolSize += 26
    if (includeLowercase) poolSize += 26
    if (includeNumbers) poolSize += 10
    if (includeSymbols) poolSize += 28

    const entropy = Math.round(length * Math.log2(poolSize || 1))
    if (poolSize === 0) return { label: 'Empty', color: 'bg-slate-700', text: 'text-slate-400', percent: 0 }
    if (entropy < 40) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400', percent: 25 }
    if (entropy < 65) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-400', percent: 50 }
    if (entropy < 90) return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400', percent: 75 }
    return { label: 'Very Strong', color: 'bg-cyan-400', text: 'text-cyan-300', percent: 100 }
  }

  const strength = getStrengthInfo()

  // Preset Handlers
  const applyPreset = (type) => {
    if (type === 'password') {
      setLength(18)
      setIncludeUppercase(true)
      setIncludeLowercase(true)
      setIncludeNumbers(true)
      setIncludeSymbols(true)
      setExcludeSimilar(true)
    } else if (type === 'apiKey') {
      setLength(32)
      setIncludeUppercase(true)
      setIncludeLowercase(true)
      setIncludeNumbers(true)
      setIncludeSymbols(false)
      setExcludeSimilar(false)
    } else if (type === 'pin') {
      setLength(6)
      setIncludeUppercase(false)
      setIncludeLowercase(false)
      setIncludeNumbers(true)
      setIncludeSymbols(false)
      setExcludeSimilar(false)
    } else if (type === 'hex') {
      setLength(24)
      setIncludeUppercase(true)
      setIncludeLowercase(false)
      setIncludeNumbers(true)
      setIncludeSymbols(false)
      setExcludeSimilar(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/20 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <KeyRound className="w-3.5 h-3.5" />
              Slab 1 Requirement #2
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Random String Generator
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Generates secure random strings powered explicitly by React <code className="text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded font-mono">useState</code>, <code className="text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded font-mono">useCallback</code>, & <code className="text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded font-mono">useEffect</code>.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs font-mono">
            <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="text-slate-400">Hook Triggers:</span>
            <span className="text-emerald-400 font-bold">{hookCallCount} executions</span>
          </div>
        </div>
      </div>

      {/* Main Display Output Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className={`w-5 h-5 ${strength.text}`} />
            <span className="text-xs font-semibold text-slate-300">Security Strength:</span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${strength.text} bg-slate-800 border border-slate-700`}>
              {strength.label}
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400">Presets:</span>
            <button
              onClick={() => applyPreset('password')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Password
            </button>
            <button
              onClick={() => applyPreset('apiKey')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              API Key
            </button>
            <button
              onClick={() => applyPreset('pin')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              6-Digit PIN
            </button>
          </div>
        </div>

        {/* Big String Box */}
        <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 flex items-center justify-between gap-4 overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <p className="font-mono text-lg sm:text-2xl text-emerald-400 break-all select-all tracking-wider font-semibold">
            {generatedString}
          </p>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => copyToClipboard(generatedString)}
              className="p-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all active:scale-95 shadow-md flex items-center gap-2"
              title="Copy to Clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span className="text-xs font-bold hidden sm:inline">Copy</span>
                </>
              )}
            </button>
            <button
              onClick={generateRandomString}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:rotate-180 duration-300 shadow-md"
              title="Regenerate String"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Strength Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className={`h-full ${strength.color} transition-all duration-500 rounded-full`}
              style={{ width: `${strength.percent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Controls & Parameters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sliders & Settings */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-slate-200 font-semibold text-base">
            <Sliders className="w-5 h-5 text-emerald-400" />
            Generator Controls & Character Sets
          </div>

          {/* Length Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <label className="text-slate-300 font-medium">String Length</label>
              <span className="font-mono text-emerald-400 font-bold bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                {length} characters
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>4 chars</span>
              <span>16</span>
              <span>32</span>
              <span>64 chars</span>
            </div>
          </div>

          {/* Checkboxes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Uppercase */}
            <label className="flex items-center justify-between p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors">
              <div className="space-y-0.5">
                <span className="text-sm font-medium text-slate-200">Uppercase (A-Z)</span>
                <p className="text-xs text-slate-500 font-mono">ABCDEF...</p>
              </div>
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="w-5 h-5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950 accent-emerald-500 cursor-pointer"
              />
            </label>

            {/* Lowercase */}
            <label className="flex items-center justify-between p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors">
              <div className="space-y-0.5">
                <span className="text-sm font-medium text-slate-200">Lowercase (a-z)</span>
                <p className="text-xs text-slate-500 font-mono">abcdef...</p>
              </div>
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="w-5 h-5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950 accent-emerald-500 cursor-pointer"
              />
            </label>

            {/* Numbers */}
            <label className="flex items-center justify-between p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors">
              <div className="space-y-0.5">
                <span className="text-sm font-medium text-slate-200">Numbers (0-9)</span>
                <p className="text-xs text-slate-500 font-mono">0123456789</p>
              </div>
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-5 h-5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950 accent-emerald-500 cursor-pointer"
              />
            </label>

            {/* Symbols */}
            <label className="flex items-center justify-between p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors">
              <div className="space-y-0.5">
                <span className="text-sm font-medium text-slate-200">Symbols (!@#$)</span>
                <p className="text-xs text-slate-500 font-mono">!@#$%^&*</p>
              </div>
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-5 h-5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950 accent-emerald-500 cursor-pointer"
              />
            </label>
          </div>

          {/* Advanced Option: Exclude Similar */}
          <div className="pt-2">
            <label className="flex items-center justify-between p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors">
              <div className="space-y-0.5">
                <span className="text-sm font-medium text-slate-200">Exclude Look-Alike Characters</span>
                <p className="text-xs text-slate-500 font-mono">Excludes i, I, 1, l, L, o, O, 0</p>
              </div>
              <input
                type="checkbox"
                checked={excludeSimilar}
                onChange={(e) => setExcludeSimilar(e.target.checked)}
                className="w-5 h-5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950 accent-emerald-500 cursor-pointer"
              />
            </label>
          </div>

          {/* Batch Generation Control */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Batch Generation Output:
            </span>
            <div className="flex items-center gap-2">
              {[1, 5, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setBatchCount(num)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-medium transition-all ${
                    batchCount === num
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {num} {num === 1 ? 'String' : 'Strings'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Code Hooks Architecture Explainer & History */}
        <div className="space-y-6">
          {/* React Hooks Implementation Box */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm border-b border-slate-800 pb-3">
              <FileCode className="w-4 h-4 text-indigo-400" />
              Required React Hooks Check
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-mono text-emerald-400 font-semibold">1. useState</span>
                <p className="text-slate-400">Stores string criteria, character sets, length state & generated outputs.</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-mono text-cyan-400 font-semibold">2. useCallback</span>
                <p className="text-slate-400">Memoizes <code className="text-slate-300">generateRandomString()</code> & <code className="text-slate-300">copyToClipboard()</code> to prevent unnecessary re-creations.</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-mono text-purple-400 font-semibold">3. useEffect</span>
                <p className="text-slate-400">Triggers string re-generation automatically whenever options change or on mount.</p>
              </div>
            </div>
          </div>

          {/* Recent History */}
          {history.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-sm text-slate-200 font-semibold">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-400" />
                  Recent History
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Last 8</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {history.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => copyToClipboard(item.text, idx)}
                    className="p-2.5 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono cursor-pointer transition-colors group"
                  >
                    <span className="text-slate-300 truncate max-w-[170px]">{item.text}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-500">{item.len}ch</span>
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Batch Results List */}
      {batchStrings.length > 1 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Batch Output ({batchStrings.length} generated strings)
            </span>
            <button
              onClick={() => copyToClipboard(batchStrings.join('\n'))}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
            >
              Copy All ({batchStrings.length})
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {batchStrings.map((str, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between font-mono text-xs text-emerald-300 group hover:border-emerald-500/40 transition-colors"
              >
                <span className="truncate mr-2">{str}</span>
                <button
                  onClick={() => copyToClipboard(str, idx)}
                  className="p-1 rounded bg-slate-900 text-slate-400 group-hover:text-white"
                >
                  {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
