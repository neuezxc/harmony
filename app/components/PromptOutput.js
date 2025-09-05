import { useState } from 'react'

export default function PromptOutput({ optimizedPrompt, optimizedNegative, changesSummary, onCopy }) {
  const [copiedPositive, setCopiedPositive] = useState(false)
  const [copiedNegative, setCopiedNegative] = useState(false)

  const handleCopy = async (text, type) => {
    await onCopy(text)
    if (type === 'positive') {
      setCopiedPositive(true)
      setTimeout(() => setCopiedPositive(false), 2000)
    } else {
      setCopiedNegative(true)
      setTimeout(() => setCopiedNegative(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">Optimized Results</h2>
      {changesSummary && (
        <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-md dark:bg-green-900/20 dark:border-green-800">
          <h3 className="font-medium text-green-700 dark:text-green-300 mb-2">
            Changes Made:
          </h3>
          <p className="text-sm text-green-600 dark:text-green-400">
            {changesSummary}
          </p>
        </div>
      )}


      {/* Optimized Positive Prompt */}
      {optimizedPrompt && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">
              Optimized Positive Prompt
            </label>
            <button
              onClick={() => handleCopy(optimizedPrompt, 'positive')}
              className="px-3 py-1 btn-secondary rounded-md text-sm transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
            >
              {copiedPositive ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="relative">
            <pre className="px-3 py-2 bg-surface border border-border rounded-md font-mono text-sm overflow-x-auto whitespace-pre-wrap transition-colors duration-200">
              {optimizedPrompt}
            </pre>
            
          </div>
        </div>
      )}

      {/* Optimized Negative Prompt */}
      {optimizedNegative && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">
              Optimized Negative Prompt
            </label>
            <button
              onClick={() => handleCopy(optimizedNegative, 'negative')}
              className="px-3 py-1 btn-secondary rounded-md text-sm transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
            >
              {copiedNegative ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="relative">
            <pre className="px-3 py-2 bg-surface border border-border rounded-md font-mono text-sm overflow-x-auto whitespace-pre-wrap transition-colors duration-200">
              {optimizedNegative}
            </pre>
            
          </div>
        </div>
      )}

      {/* Changes Summary */}
      {/* Usage Tips */}
      
    </div>
  )
}
