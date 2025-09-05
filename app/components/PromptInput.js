export default function PromptInput({
  positivePrompt,
  setPositivePrompt,
  negativePrompt,
  setNegativePrompt,
  loraText,
  setLoraText,
  apiKey,
  setApiKey,
  onHarmonize,
  onClear,
  isLoading,
  error
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gradient mb-4">Harmonize Your Prompt</h2>

      {/* API Key */}
      <div>
        <label className="text-sm font-medium mb-2">
          OpenRouter API Key
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-or-v1-..."
          className="w-full p-3 rounded-lg bg-surface border border-border focus:border-primary focus:outline-none transition-colors duration-200"
        />
      </div>

      {/* Positive Prompt */}
      <div>
        <label className="text-sm font-medium mb-2">
          Positive Prompt
        </label>
        <textarea
          value={positivePrompt}
          onChange={(e) => setPositivePrompt(e.target.value)}
          placeholder="Describe what you want to see in your image... e.g., 'A beautiful sunset over mountains with vibrant colors'"
          rows={4}
          className="w-full p-3 rounded-lg bg-surface border border-border focus:border-primary focus:outline-none transition-colors duration-200 resize-none"
        />
      </div>

      {/* Negative Prompt */}
      <div>
        <label className="text-sm font-medium mb-2">
          Negative Prompt (Optional)
        </label>
        <textarea
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          placeholder="Describe what you DON'T want to see... e.g., 'blurry, low quality, distorted'"
          rows={3}
          className="w-full p-3 rounded-lg bg-surface border border-border focus:border-primary focus:outline-none transition-colors duration-200 resize-none"
        />
      </div>

      {/* LoRA Triggers */}
      <div>
        <label className="text-sm font-medium mb-2">
          Describe Your LoRA (Optional)
        </label>
        <textarea
          value={loraText}
          onChange={(e) => setLoraText(e.target.value)}
          placeholder="Describe your LoRA and include trigger words."
          rows={4}
          className="w-full p-3 rounded-lg bg-surface border border-border focus:border-primary focus:outline-none transition-colors duration-200 resize-none"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onHarmonize}
          disabled={isLoading}
          className="flex-1 py-3 px-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-200 cursor-pointer relative overflow-hidden"
        >
          {isLoading ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="animate-pulse">Optimizing...</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            </>
          ) : (
            'Optimize Prompt'
          )}
        </button>

        <button
          onClick={onClear}
          className="px-6 py-3 btn-secondary rounded-lg font-medium transition-colors duration-200 cursor-pointer"
        >
          Clear All
        </button>
      </div>
    </div>
  )
}
