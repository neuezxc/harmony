export default function HistorySidebar({ history, onLoadEntry, isOpen, setIsOpen }) {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="card p-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left transition-colors duration-200 hover:bg-surface-hover p-2 rounded-lg cursor-pointer"
      >
        <h3 className="text-lg font-semibold text-gradient">
          History
        </h3>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="mt-4">
          {history.length === 0 ? (
            <div className="text-center py-8 text-secondary">
              <div className="text-sm">No history yet</div>
              <div className="text-xs opacity-70">Your harmonized prompts will appear here</div>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
              {history.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => onLoadEntry(entry)}
                  className="w-full p-3 rounded-lg card-hover transition-colors duration-200 text-left cursor-pointer"
                >
                  <div className="text-xs text-secondary mb-1">
                    {formatDate(entry.timestamp)}
                  </div>
                  {entry.characterName && (
                    <div className="text-sm font-semibold text-accent mb-1">
                      🎭 {entry.characterName}
                    </div>
                  )}
                  <div className="font-medium text-sm mb-1 hover:text-primary transition-colors">
                    {truncateText(entry.originalPositive)}
                  </div>
                  {entry.loraText && (
                    <div className="text-xs font-mono bg-surface border border-border p-1 rounded opacity-60">
                      {truncateText(entry.loraText, 30)}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
              <div className="text-xs text-green-700 dark:text-green-300">
                <strong>Tip:</strong> Click any entry to load it back into the form for further refinement.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
