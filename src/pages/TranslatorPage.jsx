import React, { useState } from 'react'
import { 
  Languages, 
  ArrowRightLeft, 
  Copy, 
  Check, 
  Volume2, 
  Key, 
  Sparkles, 
  History, 
  Trash2, 
  Globe2, 
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react'

// Popular target languages for translation
const TARGET_LANGUAGES = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' }
]

const SAMPLE_ENGLISH_PHRASES = [
  "Hello! Welcome to our web application.",
  "Learning React and Tailwind CSS is fun and powerful.",
  "Where is the nearest coffee shop?",
  "Thank you so much for your kind help!"
]

export default function TranslatorPage() {
  const [sourceText, setSourceText] = useState('')
  const [targetLang, setTargetLang] = useState('es')
  const [translatedText, setTranslatedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [rapidApiKey, setRapidApiKey] = useState('')
  const [apiHost, setApiHost] = useState('google-translate1.p.rapidapi.com')
  const [showApiConfig, setShowApiConfig] = useState(false)
  const [copiedInput, setCopiedInput] = useState(false)
  const [copiedOutput, setCopiedOutput] = useState(false)
  const [history, setHistory] = useState([])
  const [statusMessage, setStatusMessage] = useState(null) // { type: 'success' | 'info' | 'error', text: string }

  // Perform translation call
  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter English text to translate.' })
      return
    }

    setIsLoading(true)
    setStatusMessage(null)

    try {
      let resultText = ''

      // If user supplied a RapidAPI Key, use RapidAPI endpoint
      if (rapidApiKey.trim()) {
        try {
          const options = {
            method: 'POST',
            headers: {
              'x-rapidapi-key': rapidApiKey.trim(),
              'x-rapidapi-host': apiHost.trim(),
              'content-type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              q: sourceText,
              target: targetLang,
              source: 'en'
            })
          }

          const response = await fetch(`https://${apiHost.trim()}/language/translate/v2`, options)
          if (response.ok) {
            const data = await response.json()
            resultText = data?.data?.translations?.[0]?.translatedText || data?.translatedText || ''
            setStatusMessage({ type: 'success', text: 'Translated via RapidAPI!' })
          } else {
            throw new Error(`RapidAPI Error (${response.status})`)
          }
        } catch (rapidErr) {
          console.warn("RapidAPI request failed, switching to fallback API:", rapidErr.message)
          setStatusMessage({ 
            type: 'info', 
            text: `RapidAPI call encountered issue (${rapidErr.message}). Using built-in fallback service.` 
          })
          resultText = await fetchFallbackTranslation(sourceText, targetLang)
        }
      } else {
        // Built-in API fallback (MyMemory API)
        resultText = await fetchFallbackTranslation(sourceText, targetLang)
        setStatusMessage({ type: 'info', text: 'Translated using default translation engine. Add a RapidAPI key to use RapidAPI.' })
      }

      setTranslatedText(resultText)

      // Add to history
      if (resultText) {
        const langObj = TARGET_LANGUAGES.find(l => l.code === targetLang)
        setHistory(prev => [
          {
            id: Date.now(),
            source: sourceText,
            target: resultText,
            lang: langObj?.name || targetLang,
            flag: langObj?.flag || '🌐',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          ...prev.slice(0, 9) // Keep last 10
        ])
      }
    } catch (err) {
      console.error(err)
      setStatusMessage({ type: 'error', text: 'Translation failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Fallback free translation API (MyMemory)
  const fetchFallbackTranslation = async (text, lang) => {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`
    const res = await fetch(url)
    const data = await res.json()
    if (data && data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText
    }
    return `[Translation Error for "${lang}"]`
  }

  // Speech synthesizer
  const speakText = (text, langCode = 'en') => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = langCode
    window.speechSynthesis.speak(utterance)
  }

  // Copy to clipboard helper
  const copyToClipboard = (text, isInput = false) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    if (isInput) {
      setCopiedInput(true)
      setTimeout(() => setCopiedInput(false), 2000)
    } else {
      setCopiedOutput(true)
      setTimeout(() => setCopiedOutput(false), 2000)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/20 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Languages className="w-3.5 h-3.5" />
              Slab 1 Requirement #1
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              English Text Translator
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Convert English strings into your favorite language using RapidAPI & modern React state management.
            </p>
          </div>

          <button
            onClick={() => setShowApiConfig(!showApiConfig)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 text-sm font-medium border border-slate-700 transition-all hover:border-slate-600 shadow-md self-start md:self-auto"
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>RapidAPI Settings</span>
            {rapidApiKey && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      {/* RapidAPI Key Modal / Dropdown */}
      {showApiConfig && (
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
              <Key className="w-4 h-4" />
              RapidAPI API Key Configuration
            </div>
            <span className="text-xs text-slate-400">Optional (Built-in fallback active)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">RapidAPI Key (`x-rapidapi-key`)</label>
              <input
                type="password"
                placeholder="Enter your RapidAPI Key here..."
                value={rapidApiKey}
                onChange={(e) => setRapidApiKey(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">RapidAPI Host (`x-rapidapi-host`)</label>
              <input
                type="text"
                placeholder="google-translate1.p.rapidapi.com"
                value={apiHost}
                onChange={(e) => setApiHost(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            Leave empty to automatically use the free default translation fallback engine!
          </p>
        </div>
      )}

      {/* Status Notice Banner */}
      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
          statusMessage.type === 'success' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50' :
          statusMessage.type === 'info' ? 'bg-indigo-950/40 text-indigo-300 border-indigo-800/50' :
          'bg-rose-950/40 text-rose-300 border-rose-800/50'
        }`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Translation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Text Box (English) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700/80 transition-colors shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇺🇸</span>
              <span className="text-sm font-semibold text-slate-200">English (Source)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => speakText(sourceText, 'en')}
                disabled={!sourceText}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 transition-colors"
                title="Listen (Speech)"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => copyToClipboard(sourceText, true)}
                disabled={!sourceText}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 transition-colors"
                title="Copy text"
              >
                {copiedInput ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              {sourceText && (
                <button
                  onClick={() => { setSourceText(''); setTranslatedText('') }}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Clear input"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Type or paste your English text here..."
            rows={6}
            className="w-full bg-transparent border-0 text-slate-100 placeholder-slate-500 text-sm focus:outline-none resize-none leading-relaxed font-sans"
          />

          {/* Preset Buttons & Character Count */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-500 font-medium mr-1">Presets:</span>
              {SAMPLE_ENGLISH_PHRASES.slice(0, 2).map((phrase, i) => (
                <button
                  key={i}
                  onClick={() => setSourceText(phrase)}
                  className="text-[11px] px-2 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-800 text-slate-300 transition-colors truncate max-w-[150px]"
                >
                  "{phrase.slice(0, 18)}..."
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {sourceText.length} chars
            </span>
          </div>
        </div>

        {/* Target Text Box */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700/80 transition-colors shadow-lg relative">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            {/* Target Language Dropdown */}
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-indigo-400" />
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-indigo-500"
              >
                {TARGET_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => speakText(translatedText, targetLang)}
                disabled={!translatedText}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 transition-colors"
                title="Listen (Speech)"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => copyToClipboard(translatedText, false)}
                disabled={!translatedText}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 transition-colors"
                title="Copy translated text"
              >
                {copiedOutput ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="min-h-[140px] flex items-start">
            {isLoading ? (
              <div className="w-full flex flex-col items-center justify-center py-10 gap-3 text-indigo-400">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-xs font-medium">Translating string...</span>
              </div>
            ) : translatedText ? (
              <p className="text-slate-100 text-sm leading-relaxed font-sans w-full">
                {translatedText}
              </p>
            ) : (
              <span className="text-slate-500 text-sm italic">
                Translation output will appear here after clicking translate...
              </span>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              Target: {TARGET_LANGUAGES.find(l => l.code === targetLang)?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Action Translate Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleTranslate}
          disabled={isLoading || !sourceText.trim()}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-base shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
        >
          <Sparkles className="w-5 h-5 text-indigo-200 group-hover:rotate-12 transition-transform" />
          <span>{isLoading ? 'Translating Text...' : 'Translate to Favorite Language'}</span>
          <ArrowRightLeft className="w-5 h-5 opacity-70" />
        </button>
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
              <History className="w-4 h-4 text-indigo-400" />
              Translation History
            </div>
            <button
              onClick={() => setHistory([])}
              className="text-xs text-rose-400 hover:underline flex items-center gap-1"
            >
              Clear Log
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {history.map((item) => (
              <div key={item.id} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-medium">{item.flag} {item.lang}</span>
                  <span className="font-mono text-[10px] opacity-70">{item.timestamp}</span>
                </div>
                <p className="text-slate-300 line-clamp-1">En: "{item.source}"</p>
                <p className="text-indigo-300 font-medium line-clamp-1">Result: "{item.target}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
