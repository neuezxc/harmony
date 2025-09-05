'use client'

import { useState, useEffect } from 'react'
import PromptInput from './components/PromptInput'
import PromptOutput from './components/PromptOutput'
import PromptDiff from './components/PromptDiff'
import HistorySidebar from './components/HistorySidebar'
import SettingsPanel from './components/SettingsPanel'

export default function Home() {
  const [positivePrompt, setPositivePrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [loraText, setLoraText] = useState('')
  const [characterName, setCharacterName] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [optimizedPrompt, setOptimizedPrompt] = useState('')
  const [optimizedNegative, setOptimizedNegative] = useState('')
  const [changesSummary, setChangesSummary] = useState('')
  const [originalPositivePrompt, setOriginalPositivePrompt] = useState('')
  const [originalNegativePrompt, setOriginalNegativePrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [activeTab, setActiveTab] = useState('results')
  const [darkMode, setDarkMode] = useState(false)
  const [defaultModel, setDefaultModel] = useState('z-ai/glm-4.5-air:free')
  const [searchTerm, setSearchTerm] = useState('')

  // Load from localStorage on mount
  useEffect(() => {
    const savedPositive = localStorage.getItem('positivePrompt')
    const savedNegative = localStorage.getItem('negativePrompt')
    const savedLora = localStorage.getItem('loraText')
    const savedCharacterName = localStorage.getItem('characterName')
    const savedApiKey = localStorage.getItem('apiKey')
    const savedHistory = localStorage.getItem('promptHistory')
    const savedDarkMode = localStorage.getItem('darkMode')
    const savedModel = localStorage.getItem('defaultModel')

    if (savedPositive) setPositivePrompt(savedPositive)
    if (savedNegative) setNegativePrompt(savedNegative)
    if (savedLora) setLoraText(savedLora)
    if (savedCharacterName) setCharacterName(savedCharacterName)
    if (savedApiKey) setApiKey(savedApiKey)
    if (savedHistory) setHistory(JSON.parse(savedHistory))
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode))
    if (savedModel) setDefaultModel(savedModel)
  }, [])

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem('positivePrompt', positivePrompt)
  }, [positivePrompt])

  useEffect(() => {
    localStorage.setItem('negativePrompt', negativePrompt)
  }, [negativePrompt])

  useEffect(() => {
    localStorage.setItem('loraText', loraText)
  }, [loraText])

  useEffect(() => {
    localStorage.setItem('characterName', characterName)
  }, [characterName])

  useEffect(() => {
    localStorage.setItem('apiKey', apiKey)
  }, [apiKey])

  useEffect(() => {
    localStorage.setItem('promptHistory', JSON.stringify(history))
  }, [history])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('defaultModel', defaultModel)
  }, [defaultModel])

  const harmonizePrompt = async () => {
    if (!apiKey) {
      setError('Please enter your OpenRouter API key in Settings')
      return
    }

    if (!apiKey.startsWith('sk-or-v1-')) {
      setError('Invalid API key format. OpenRouter keys should start with "sk-or-v1-"')
      return
    }

    if (!positivePrompt.trim()) {
      setError('Please enter a positive prompt')
      return
    }

    // Store original prompts for diff display
    setOriginalPositivePrompt(positivePrompt)
    setOriginalNegativePrompt(negativePrompt)

    setIsLoading(true)
    setError('')

    try {
      const systemPrompt = `You are "Prompt Harmonizer," a supportive AI assistant that helps users refine and optimize their prompts when working with LoRAs in anime image generation.

**Your Core Task:**
- The user provides:
  1. The LoRA(s) they are using (with trigger words).
  2. Their main prompt.
  3. An optional negative prompt.

- Your job is to:
  * INTEGRATE LoRA trigger words into the positive prompt to activate the LoRA model.
  * Identify any contradictions between the LoRA's inherent influence and the user's written prompt.
  * Remove or reword unnecessary, conflicting, or redundant tags that could cause failed generations.
  * Deliver a new, clean prompt that works harmoniously with the LoRA while preserving the user's intent.
- * Ensure **character consistency**: never change a character's appearance unless the LoRA explicitly enforces it.

**Guidelines:**
- ALWAYS add the LoRA trigger words to the positive prompt (e.g., if LoRA trigger is "breasts squeezed together", add it to the prompt).
- If the LoRA strongly enforces a pose, outfit, or theme, remove conflicting instructions from the user's prompt.
- Remove negative prompt elements that contradict the LoRA's purpose (e.g., remove "nsfw" restrictions if LoRA is breast-focused).
- Keep only the most essential, high-impact keywords.
- Do not over-polish or change the user's intent — just make it cleaner and LoRA-compatible.
- If a negative prompt is provided, check for contradictions there too.
- Always maintain clarity and conciseness in the final prompt.

**CRITICAL: Response Format**
You MUST respond with ONLY a valid JSON object. No explanations, no markdown, no additional text.

Format:
{
  "optimized_prompt": "your cleaned positive prompt with LoRA triggers integrated",
  "optimized_negative": "your optimized negative prompt with conflicts removed (or empty string if none provided)",
  "changes_summary": "brief summary of what was changed, added, or removed"
}`

      const userPrompt = `Original positive prompt: "${positivePrompt}"
${negativePrompt ? `Original negative prompt: "${negativePrompt}"` : ''}
${loraText ? `LoRA triggers: ${loraText}` : ''}

Please harmonize and optimize this prompt for better AI image generation results.`

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Prompt Harmonizer'
        },
        body: JSON.stringify({
          model: defaultModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenRouter API key and try again.')
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.')
        } else if (response.status === 402) {
          throw new Error('Insufficient credits. Please check your OpenRouter account balance.')
        } else {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`)
        }
      }

      const data = await response.json()

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response from API. Please try again.')
      }

      let result
      try {
        result = JSON.parse(data.choices[0].message.content)
      } catch (parseError) {
        // Try to extract JSON from a mixed response
        const content = data.choices[0].message.content
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            result = JSON.parse(jsonMatch[0])
          } catch (fallbackError) {
            throw new Error('Failed to parse API response. The model returned an invalid format.')
          }
        } else {
          throw new Error('Failed to parse API response. The model may have returned an unexpected format.')
        }
      }

      if (!result.optimized_prompt) {
        throw new Error('No optimized prompt received. Please try again.')
      }

      setOptimizedPrompt(result.optimized_prompt)
      setOptimizedNegative(result.optimized_negative || '')
      setChangesSummary(result.changes_summary || '')
      setActiveTab('results') // Switch to results tab when new optimization completes

      // Add to history
      const newEntry = {
        id: Date.now(),
        characterName,
        originalPositive: positivePrompt,
        originalNegative: negativePrompt,
        loraText,
        optimizedPrompt: result.optimized_prompt,
        optimizedNegative: result.optimized_negative || '',
        changesSummary: result.changes_summary || '',
        timestamp: new Date().toISOString()
      }
      setHistory(prev => [newEntry, ...prev.slice(0, 49)]) // Keep last 50 entries

    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const clearAll = () => {
    setPositivePrompt('')
    setNegativePrompt('')
    setLoraText('')
    setCharacterName('')
    setOptimizedPrompt('')
    setOptimizedNegative('')
    setChangesSummary('')
    setError('')
  }

  const loadFromHistory = (entry) => {
    setPositivePrompt(entry.originalPositive)
    setNegativePrompt(entry.originalNegative)
    setLoraText(entry.loraText)
    setCharacterName(entry.characterName || '')
    setOptimizedPrompt(entry.optimizedPrompt)
    setOptimizedNegative(entry.optimizedNegative)
    setChangesSummary(entry.changesSummary || '')
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Filter history based on search term
  const filteredHistory = history.filter((entry) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      entry.originalPositive.toLowerCase().includes(searchLower) ||
      entry.characterName?.toLowerCase().includes(searchLower) ||
      entry.loraText?.toLowerCase().includes(searchLower) ||
      entry.optimizedPrompt.toLowerCase().includes(searchLower) ||
      entry.changesSummary?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className={`min-h-screen bg-background ${darkMode ? 'dark' : ''}`}>
      {/* Top Navigation */}
      <nav className="bg-surface border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-foreground">
                Harmony
              </h1>
              <span className="text-secondary text-sm hidden sm:inline translate-x-[-10px]">
                LoRA integration
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowHistory(true)}
                className="px-3 py-2 bg-surface border border-border rounded-md hover:bg-surface-hover transition-colors duration-200 text-sm font-medium"
              >
                History
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="px-3 py-2 bg-surface border border-border rounded-md hover:bg-surface-hover transition-colors duration-200 text-sm font-medium"
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Input Section */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <PromptInput
              positivePrompt={positivePrompt}
              setPositivePrompt={setPositivePrompt}
              negativePrompt={negativePrompt}
              setNegativePrompt={setNegativePrompt}
              loraText={loraText}
              setLoraText={setLoraText}
              characterName={characterName}
              setCharacterName={setCharacterName}
              onHarmonize={harmonizePrompt}
              onClear={clearAll}
              isLoading={isLoading}
              error={error}
            />
          </div>

          {/* Output Section with Tabs */}
          {(optimizedPrompt || optimizedNegative) && (
            <div className="bg-surface border border-border rounded-lg overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b border-border">
                <button
                  onClick={() => setActiveTab('results')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'results'
                      ? 'text-primary border-b-2 border-primary bg-surface-hover'
                      : 'text-secondary hover:text-foreground hover:bg-surface-hover'
                  }`}
                >
                  Optimized Results
                </button>
                <button
                  onClick={() => setActiveTab('changes')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'changes'
                      ? 'text-primary border-b-2 border-primary bg-surface-hover'
                      : 'text-secondary hover:text-foreground hover:bg-surface-hover'
                  }`}
                >
                  Changes
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'results' && (
                  <PromptOutput
                    optimizedPrompt={optimizedPrompt}
                    optimizedNegative={optimizedNegative}
                    changesSummary={changesSummary}
                    onCopy={copyToClipboard}
                  />
                )}
                {activeTab === 'changes' && (
                  <PromptDiff
                    originalPrompt={originalPositivePrompt}
                    optimizedPrompt={optimizedPrompt}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="bg-gradient-to-br from-surface to-surface-hover border border-border/50 rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative p-8 border-b border-border/30 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  
                  <div>
                    <h2 className="text-2xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                      Settings
                    </h2>
                    <p className="text-secondary text-sm mt-1">
                      Customize your experience
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="absolute top-8 right-8 z-20 w-12 h-12 bg-surface/80 hover:bg-surface border border-border/50 rounded-full flex items-center justify-center text-secondary hover:text-foreground transition-all duration-200 hover:scale-110 shadow-lg"
                  style={{ margin: 0 }}
                >
                  <span className="text-xl font-bold">×</span>
                </button>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-8 right-8 w-16 h-16 bg-primary/5 rounded-full blur-xl"></div>
              <div className="absolute bottom-8 left-8 w-12 h-12 bg-accent/5 rounded-full blur-xl"></div>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(85vh-160px)] scrollbar-hide">
              <SettingsPanel
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                defaultModel={defaultModel}
                setDefaultModel={setDefaultModel}
                apiKey={apiKey}
                setApiKey={setApiKey}
                isOpen={true}
                setIsOpen={() => {}}
              />
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowHistory(false)}
        >
          <div
            className="bg-gradient-to-br from-surface to-surface-hover border border-border/50 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative p-8 border-b border-border/30 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                      Prompt History
                    </h2>
                    <p className="text-secondary text-sm mt-1">
                      {history.length} harmonized prompt{history.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="absolute top-8 right-8 z-20 w-12 h-12 bg-surface/80 hover:bg-surface border border-border/50 rounded-full flex items-center justify-center text-secondary hover:text-foreground transition-all duration-200 hover:scale-110 shadow-lg"
                  style={{ margin: 0 }}
                >
                  <span className="text-xl font-bold">×</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                
                <input
                  type="text"
                  placeholder="Search prompts, characters, or LoRA triggers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-5 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl focus:border-primary focus:outline-none transition-all duration-200 text-foreground placeholder-secondary"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary hover:text-foreground transition-colors"
                  >
                    <span className="text-sm">✕</span>
                  </button>
                )}
              </div>

              {/* Decorative elements */}
              <div className="absolute top-8 right-8 w-16 h-16 bg-primary/5 rounded-full blur-xl"></div>
              <div className="absolute bottom-8 left-8 w-12 h-12 bg-accent/5 rounded-full blur-xl"></div>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-160px)] scrollbar-hide">
              <HistorySidebar
                history={filteredHistory}
                onLoadEntry={(entry) => {
                  loadFromHistory(entry)
                  setShowHistory(false)
                }}
                isOpen={true}
                setIsOpen={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
