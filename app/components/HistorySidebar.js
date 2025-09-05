export default function HistorySidebar({ history, onLoadEntry, isOpen, setIsOpen }) {
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

  return (
    <div className="space-y-4">
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
          {history.map((entry, index) => (
            <div
              key={entry.id}
              onClick={() => onLoadEntry(entry)}
              className="group relative bg-gradient-to-br from-surface to-surface-hover border border-border rounded-xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/20 hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
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
                <p className="text-sm text-foreground leading-relaxed group-hover:text-primary transition-colors">
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
              <div className="absolute inset-0 rounded-xl border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
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
