const LORA_PROFILES = [
  {
    name: 'Anime Style',
    description: 'Perfect for anime-inspired artwork',
    triggers: '<lora:anime_style_v1:0.8>, <lora:detailed_eyes:0.6>'
  },
  {
    name: 'Realistic Portrait',
    description: 'High-quality realistic character portraits',
    triggers: '<lora:realistic_portrait:1.0>, <lora:sharp_focus:0.7>'
  },
  {
    name: 'Fantasy Art',
    description: 'Magical and fantastical scenes',
    triggers: '<lora:fantasy_art:0.9>, <lora:ethereal_glow:0.5>'
  },
  {
    name: 'Cyberpunk',
    description: 'Futuristic cyberpunk aesthetics',
    triggers: '<lora:cyberpunk_city:0.8>, <lora:neon_lights:0.6>'
  },
  {
    name: 'Watercolor',
    description: 'Soft watercolor painting style',
    triggers: '<lora:watercolor_style:0.7>, <lora:soft_brush:0.5>'
  },
  {
    name: 'Studio Ghibli',
    description: 'Whimsical animated film style',
    triggers: '<lora:ghibli_style:0.8>, <lora:whimsical:0.6>'
  }
]

export default function LoRAProfiles({ onSelectProfile }) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gradient mb-4">LoRA Profiles</h3>
      <p className="text-sm text-secondary mb-4">
        Quick-start with pre-configured LoRA combinations for different styles
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {LORA_PROFILES.map((profile, index) => (
          <button
            key={index}
            onClick={() => onSelectProfile(profile.triggers)}
            className="p-4 rounded-lg card-hover transition-all duration-200 text-left group"
          >
            <div className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
              {profile.name}
            </div>
            <div className="text-xs text-secondary mb-2">
              {profile.description}
            </div>
            <div className="text-xs font-mono bg-surface border border-border p-2 rounded">
              {profile.triggers}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
        <div className="text-xs text-yellow-700 dark:text-yellow-300">
          <strong>Tip:</strong> You can combine multiple profiles by copying their triggers and adjusting weights as needed.
        </div>
      </div>
    </div>
  )
}
