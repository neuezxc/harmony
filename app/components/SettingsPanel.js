export default function SettingsPanel({
  darkMode,
  setDarkMode,
  defaultModel,
  setDefaultModel,
  isOpen,
  setIsOpen
}) {
  const models = [
    {id: "deepseek/deepseek-chat-v3.1:free", name: "DeepSeek: DeepSeek V3.1 (free)", description: "deep"},
    { id: 'z-ai/glm-4.5-air:free', name: 'GLM-4.5 Air (Free)', description: 'Fast and reliable' },
    { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', description: 'Balanced performance' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', description: 'Compact and efficient' },
    { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', description: 'Open source option' }
  ]

  return (
    <div className="card p-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left transition-colors duration-200 hover:bg-surface-hover px-3 py-2 rounded-md cursor-pointer"
      >
        <h3 className="text-lg font-semibold text-foreground">
          Settings
        </h3>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-surface-hover transition-colors">
            <label className="text-sm font-medium text-foreground">
              Dark Mode
            </label>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 cursor-pointer ${
                darkMode ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Model Selection */}
          <div className="px-3 py-2 rounded-md hover:bg-surface-hover transition-colors">
            <label className="block text-sm font-medium text-foreground mb-2">
              Default Model
            </label>
            <select
              value={defaultModel}
              onChange={(e) => setDefaultModel(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-md focus:border-primary focus:outline-none transition-colors duration-200"
            >
              {models.map((model) => (
                <option key={model.id} value={model.id} className="bg-surface">
                  {model.name} - {model.description}
                </option>
              ))}
            </select>
          </div>

          {/* Info */}
          <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-900/20 dark:border-blue-800">
            <div className="text-xs text-blue-700 dark:text-blue-300">
              <strong>Models:</strong> Different models may give slightly different optimization results. Experiment to find your favorite!
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
