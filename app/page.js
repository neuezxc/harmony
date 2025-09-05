'use client'

import { useState, useEffect } from 'react'
import PromptInput from './components/PromptInput'
import PromptOutput from './components/PromptOutput'
import HistorySidebar from './components/HistorySidebar'
import SettingsPanel from './components/SettingsPanel'

export default function Home() {
  const [positivePrompt, setPositivePrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [loraText, setLoraText] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [optimizedPrompt, setOptimizedPrompt] = useState('')
  const [optimizedNegative, setOptimizedNegative] = useState('')
  const [changesSummary, setChangesSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [defaultModel, setDefaultModel] = useState('z-ai/glm-4.5-air:free')

  // Load from localStorage on mount
  useEffect(() => {
    const savedPositive = localStorage.getItem('positivePrompt')
    const savedNegative = localStorage.getItem('negativePrompt')
    const savedLora = localStorage.getItem('loraText')
    const savedApiKey = localStorage.getItem('apiKey')
    const savedHistory = localStorage.getItem('promptHistory')
    const savedDarkMode = localStorage.getItem('darkMode')
    const savedModel = localStorage.getItem('defaultModel')

    if (savedPositive) setPositivePrompt(savedPositive)
    if (savedNegative) setNegativePrompt(savedNegative)
    if (savedLora) setLoraText(savedLora)
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
      setError('Please enter your OpenRouter API key')
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

      // Add to history
      const newEntry = {
        id: Date.now(),
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
    setOptimizedPrompt('')
    setOptimizedNegative('')
    setChangesSummary('')
    setError('')
  }

  const loadFromHistory = (entry) => {
    setPositivePrompt(entry.originalPositive)
    setNegativePrompt(entry.originalNegative)
    setLoraText(entry.loraText)
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

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'dark' : ''}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            Prompt Harmonizer
          </h1>
          <p className="text-lg text-secondary">
            Optimize your AI prompts with LoRA magic
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Input Section */}
            <div className="card p-6">
              <PromptInput
                positivePrompt={positivePrompt}
                setPositivePrompt={setPositivePrompt}
                negativePrompt={negativePrompt}
                setNegativePrompt={setNegativePrompt}
                loraText={loraText}
                setLoraText={setLoraText}
                apiKey={apiKey}
                setApiKey={setApiKey}
                onHarmonize={harmonizePrompt}
                onClear={clearAll}
                isLoading={isLoading}
                error={error}
              />
            </div>

            {/* Output Section */}
            {(optimizedPrompt || optimizedNegative) && (
              <div className="card p-6">
                <PromptOutput
                  optimizedPrompt={optimizedPrompt}
                  optimizedNegative={optimizedNegative}
                  changesSummary={changesSummary}
                  onCopy={copyToClipboard}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <SettingsPanel
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              defaultModel={defaultModel}
              setDefaultModel={setDefaultModel}
              isOpen={showSettings}
              setIsOpen={setShowSettings}
            />

            {/* History */}
            <HistorySidebar
              history={history}
              onLoadEntry={loadFromHistory}
              isOpen={showHistory}
              setIsOpen={setShowHistory}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
