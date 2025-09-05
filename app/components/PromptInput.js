export default function PromptInput({
  positivePrompt,
  setPositivePrompt,
  negativePrompt,
  setNegativePrompt,
  loraText,
  setLoraText,
  characterName,
  setCharacterName,
  apiKey,
  setApiKey,
  onHarmonize,
  onClear,
  isLoading,
  error
}) {
  return (
    <div className="space-y-6">
      {/* API Key */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          OpenRouter API Key
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-or-v1-..."
          className="w-full px-3 py-2 bg-surface border border-border rounded-md focus:border-primary focus:outline-none transition-colors duration-200"
        />
      </div>

      {/* Character/Scene Name */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Character Name <span className="text-secondary">(Optional)</span>
        </label>
        <input
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          placeholder="Name your character or scene"
          className="w-full px-3 py-2 bg-surface border border-border rounded-md focus:border-primary focus:outline-none transition-colors duration-200"
        />
      </div>

      {/* Positive Prompt */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Positive Prompt
        </label>
        <textarea
          value={positivePrompt}
          onChange={(e) => setPositivePrompt(e.target.value)}
          placeholder="Describe what you want to see in your image..."
          rows={4}
          className="w-full px-3 py-2 bg-surface border border-border rounded-md focus:border-primary focus:outline-none transition-colors duration-200 resize-y min-h-[120px]"
        />
      </div>

      {/* Negative Prompt */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Negative Prompt
        </label>
        <textarea
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          placeholder="Describe what you don't want to see..."
          rows={3}
          className="w-full px-3 py-2 bg-surface border border-border rounded-md focus:border-primary focus:outline-none transition-colors duration-200 resize-y min-h-[80px]"
        />
      </div>

      {/* LoRA Triggers */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          LoRA Description
        </label>
        <textarea
          value={loraText}
          onChange={(e) => setLoraText(e.target.value)}
          placeholder="Describe your LoRA and include trigger words"
          rows={3}
          className="w-full px-3 py-2 bg-surface border border-border rounded-md focus:border-primary focus:outline-none transition-colors duration-200 resize-y min-h-[80px]"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-md dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onHarmonize}
          disabled={isLoading}
          className="flex-1 py-2 px-4 bg-primary text-white border border-primary rounded-md font-medium hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Optimizing...</span>
            </div>
          ) : (
            'Optimize Prompt'
          )}
        </button>

        <button
          onClick={onClear}
          className="px-4 py-2 bg-surface text-foreground border border-border rounded-md font-medium hover:bg-surface-hover transition-colors duration-200"
        >
          Clear All
        </button>
      </div>
    </div>
  )
}
