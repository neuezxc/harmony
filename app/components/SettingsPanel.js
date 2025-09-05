export default function SettingsPanel({
  darkMode,
  setDarkMode,
  defaultModel,
  setDefaultModel,
  apiKey,
  setApiKey,
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
    <div className="space-y-6">
      {/* API Key Input */}
      <div className="bg-gradient-to-br from-surface to-surface-hover border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          
          <div>
            <label className="block text-sm font-semibold text-foreground">
              OpenRouter API Key
            </label>
            <p className="text-xs text-secondary">Required for prompt optimization</p>
          </div>
        </div>
        <div className="relative">
          <input
            type={apiKey ? "password" : "text"}
            placeholder="sk-or-v1-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:border-primary focus:outline-none transition-all duration-200 font-mono text-sm"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <div className={`w-3 h-3 rounded-full transition-colors ${apiKey && apiKey.startsWith('sk-or-v1-') ? 'bg-accent' : 'bg-secondary'}`}></div>
          </div>
        </div>
        <p className="text-xs text-secondary mt-2">
          Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">OpenRouter</a>
        </p>
      </div>

      {/* Dark Mode Toggle */}
      

      {/* Model Selection */}
      <div className="bg-gradient-to-br from-surface to-surface-hover border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          
          <div>
            <label className="block text-sm font-semibold text-foreground">
              Default Model
            </label>
            <p className="text-xs text-secondary">Choose your AI model</p>
          </div>
        </div>
        <select
          value={defaultModel}
          onChange={(e) => setDefaultModel(e.target.value)}
          className="w-full px-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:border-primary focus:outline-none transition-all duration-200"
        >
          {models.map((model) => (
            <option key={model.id} value={model.id} className="bg-surface">
              {model.name} - {model.description}
            </option>
          ))}
        </select>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-accent/5 to-primary/5 border border-accent/20 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <span className="text-accent text-sm">💡</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Pro Tip</p>
            <p className="text-xs text-secondary">
              Different models may give slightly different optimization results. Experiment to find your favorite!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
