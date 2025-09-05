import { useState } from 'react'

export default function HistorySidebar({ history, onLoadEntry, onDeleteEntries, isOpen, setIsOpen }) {
  const [selectedEntries, setSelectedEntries] = useState(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const truncateText = (text, maxLength = 80) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const handleEntryClick = (entry) => {
    if (isSelectionMode) {
      toggleSelection(entry.id)
    } else {
      onLoadEntry(entry)
    }
  }

  const toggleSelection = (entryId) => {
    const newSelected = new Set(selectedEntries)
    if (newSelected.has(entryId)) {
      newSelected.delete(entryId)
    } else {
      newSelected.add(entryId)
    }
    setSelectedEntries(newSelected)
  }

  const handleDeleteSelected = () => {
    if (selectedEntries.size > 0 && onDeleteEntries) {
      onDeleteEntries(Array.from(selectedEntries))
      setSelectedEntries(new Set())
      setIsSelectionMode(false)
    }
  }

  const handleSelectAll = () => {
    if (selectedEntries.size === history.length) {
      setSelectedEntries(new Set())
    } else {
      setSelectedEntries(new Set(history.map(entry => entry.id)))
    }
  }

  const exitSelectionMode = () => {
    setIsSelectionMode(false)
    setSelectedEntries(new Set())
  }

  return (
    <div className="space-y-4">
      {/* Selection Mode Controls */}
      {history.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {!isSelectionMode ? (
              <button
                onClick={() => setIsSelectionMode(true)}
                className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors duration-200 text-sm font-medium flex items-center space-x-2"
              >
                <span>Select Multiple</span>
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSelectAll}
                  className="px-3 py-2 bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors duration-200 text-sm font-medium"
                >
                  {selectedEntries.size === history.length ? 'Deselect All' : 'Select All'}
                </button>
                <button
                  onClick={exitSelectionMode}
                  className="px-3 py-2 bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors duration-200 text-sm font-medium"
                >
                  Cancel
                </button>
                {selectedEntries.size > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors duration-200 text-sm font-medium flex items-center space-x-2"
                  >
                    <span>Delete ({selectedEntries.size})</span>
                  </button>
                )}
              </div>
            )}
          </div>
          {isSelectionMode && (
            <div className="text-sm text-secondary">
              {selectedEntries.size} selected
            </div>
          )}
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
          <p className="text-secondary text-sm max-w-sm mx-auto">
            Try adjusting your search terms or clear the search to see all prompts.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {history.map((entry, index) => {
            const isSelected = selectedEntries.has(entry.id)
            return (
              <div
                key={entry.id}
                onClick={() => handleEntryClick(entry)}
                className={`group relative bg-gradient-to-br from-surface to-surface-hover border rounded-xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] animate-fade-in ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                    : 'border-border hover:border-primary/20'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Selection Checkbox */}
                {isSelectionMode && (
                  <div className="absolute top-3 right-3 z-10">
                    <div
                      className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-primary border-primary'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {isSelected && <span className="text-white text-xs">✓</span>}
                    </div>
                  </div>
                )}

                {/* Header with date and character */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full opacity-60"></div>
                    <span className="text-xs text-secondary font-medium">
                      {formatDate(entry.timestamp)}
                    </span>
                  </div>
                  {entry.characterName && (
                    <div className="px-2 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                      {entry.characterName}
                    </div>
                  )}
                </div>

                {/* Main prompt text */}
                <div className="mb-3">
                  <p className={`text-sm leading-relaxed transition-colors ${
                    isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'
                  }`}>
                    {truncateText(entry.originalPositive)}
                  </p>
                </div>

                {/* LoRA triggers */}
                {entry.loraText && (
                  <div className="mb-3">
                    <div className="inline-flex items-center px-3 py-1 bg-primary/5 border border-primary/20 rounded-lg">
                      <span className="text-xs font-mono text-primary">
                        {truncateText(entry.loraText, 40)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Changes summary */}
                {entry.changesSummary && (
                  <div className="pt-3 border-t border-border/50">
                    <p className="text-xs text-secondary italic">
                      {truncateText(entry.changesSummary, 60)}
                    </p>
                  </div>
                )}

                {/* Hover indicator */}
                {!isSelectionMode && (
                  <div className="absolute inset-0 rounded-xl border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {history.length > 0 && !isSelectionMode && (
        <div className="mt-8 p-4 bg-gradient-to-r from-accent/5 to-primary/5 border border-accent/20 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <span className="text-accent text-sm">💡</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Quick Tip</p>
              <p className="text-xs text-secondary">
                Click any card to load it back into the form for further refinement
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
