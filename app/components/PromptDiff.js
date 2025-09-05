export default function PromptDiff({ originalPrompt, optimizedPrompt }) {
  // Simple diff algorithm - in a real app you'd use a proper diff library
  const createDiff = (original, optimized) => {
    const originalWords = original.split(/\s+/)
    const optimizedWords = optimized.split(/\s+/)

    const diff = []
    let i = 0, j = 0

    while (i < originalWords.length || j < optimizedWords.length) {
      if (i < originalWords.length && j < optimizedWords.length && originalWords[i] === optimizedWords[j]) {
        // Words match - no change
        diff.push({ text: originalWords[i], type: 'unchanged' })
        i++
        j++
      } else if (i < originalWords.length && optimizedWords.includes(originalWords[i])) {
        // Word exists in optimized but in different position - moved
        diff.push({ text: originalWords[i], type: 'removed' })
        i++
      } else if (j < optimizedWords.length) {
        // New word in optimized
        diff.push({ text: optimizedWords[j], type: 'added' })
        j++
      } else if (i < originalWords.length) {
        // Extra word in original
        diff.push({ text: originalWords[i], type: 'removed' })
        i++
      }
    }

    return diff
  }

  const diff = createDiff(originalPrompt, optimizedPrompt)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gradient">Prompt Changes</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <div>
          <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Original Prompt</h4>
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-300">{originalPrompt}</p>
          </div>
        </div>

        {/* Optimized */}
        <div>
          <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Optimized Prompt</h4>
          <div className="p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-300">{optimizedPrompt}</p>
          </div>
        </div>
      </div>

      {/* Inline Diff */}
      <div>
        <h4 className="text-sm font-medium mb-2">Inline Changes</h4>
        <div className="p-3 rounded-lg bg-surface border border-border font-mono text-sm">
          {diff.map((part, index) => (
            <span
              key={index}
              className={`${
                part.type === 'removed'
                  ? 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                  : part.type === 'added'
                  ? 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                  : 'text-foreground'
              } px-1 rounded`}
            >
              {part.text}{' '}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
