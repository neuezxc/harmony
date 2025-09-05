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
      <h2 className="text-2xl font-semibold text-gradient">Optimized Results</h2>

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
            <pre className="p-4 rounded-lg bg-surface border border-border font-mono text-sm overflow-x-auto whitespace-pre-wrap transition-colors duration-200">
              {optimizedPrompt}
            </pre>
            <div className="absolute top-2 right-2 opacity-50 text-xs text-secondary">
              Enhanced for better AI generation
            </div>
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
            <pre className="p-4 rounded-lg bg-surface border border-border font-mono text-sm overflow-x-auto whitespace-pre-wrap transition-colors duration-200">
              {optimizedNegative}
            </pre>
            <div className="absolute top-2 right-2 opacity-50 text-xs text-secondary">
              Refined to avoid unwanted elements
            </div>
          </div>
        </div>
      )}

      {/* Changes Summary */}
      {changesSummary && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <h3 className="font-medium text-green-700 dark:text-green-300 mb-2">
            Changes Made:
          </h3>
          <p className="text-sm text-green-600 dark:text-green-400">
            {changesSummary}
          </p>
        </div>
      )}

      {/* Usage Tips */}
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
        <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
          Pro Tips:
        </h3>
        <ul className="text-sm space-y-1 text-blue-600 dark:text-blue-400">
          <li>• Use the optimized prompts in your favorite AI image generator</li>
          <li>• Copy individual prompts or combine them as needed</li>
          <li>• Experiment with different weights in LoRA triggers</li>
          <li>• Save your favorites to history for quick access</li>
        </ul>
      </div>
    </div>
  )
}
