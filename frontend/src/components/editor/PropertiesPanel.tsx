import { X, Copy, Trash2, Tag, Box, Info } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import { BlockProperty } from '@/types'
import { cn } from '@/lib/utils'

export function PropertiesPanel() {
  const { selectedBlockId, getBlockById, updateBlock, removeBlock, duplicateBlock, selectBlock } =
    useEditorStore()

  if (!selectedBlockId) {
    return (
      <div className="h-full bg-white dark:bg-slate-950 flex flex-col transition-colors">
        <div className="p-5 border-b-2 border-black/10 dark:border-slate-800">
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Inspector
          </h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-60">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-4 transform rotate-3">
            <Box className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">No Selection</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-[180px]">
            Click on a block on the canvas to configure settings.
          </p>
        </div>
      </div>
    )
  }

  const block = getBlockById(selectedBlockId)
  if (!block) return null

  const definition = BLOCK_DEFINITIONS[block.type]
  if (!definition) return null

  const handlePropertyChange = (key: string, value: unknown) => {
    updateBlock(selectedBlockId, {
      properties: {
        ...block.data.properties,
        [key]: value,
      },
    })
  }

  return (
    <div className="h-full bg-white dark:bg-slate-950 flex flex-col transition-colors border-l-2 border-black/10 dark:border-slate-800">
      {/* Header */}
      <div className="p-5 border-b-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Configuration
          </h2>
          <button
            onClick={() => selectBlock(null)}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-3 rounded-xl border-2 border-black/10 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900 shadow-neo-sm">
          <div
            className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px] shadow-current transition-all"
            style={{ backgroundColor: definition.color, color: definition.color }}
          />
          <p className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest">
            {definition.label}
          </p>
        </div>
      </div>

      {/* Properties Form */}
      <div className="flex-1 overflow-y-auto p-5 space-y-8 no-scrollbar">
        {/* Dynamic Properties */}
        {definition.properties.map(property => (
          <PropertyField
            key={property.key}
            property={property}
            value={block.data.properties[property.key]}
            onChange={value => handlePropertyChange(property.key, value)}
          />
        ))}

        <div className="h-px bg-slate-100 dark:bg-slate-800" />

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pb-8">
          <button
            onClick={() => duplicateBlock(selectedBlockId)}
            className="px-4 py-3 bg-white dark:bg-slate-900 border-2 border-black/10 dark:border-slate-700 text-slate-900 dark:text-white font-black rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 shadow-neo-sm hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 text-xs"
          >
            <Copy className="w-3.5 h-3.5" />
            Clone
          </button>
          <button
            onClick={() => {
              removeBlock(selectedBlockId)
              selectBlock(null)
            }}
            className="px-4 py-3 bg-red-500 text-white font-black rounded-xl hover:bg-red-600 shadow-neo-sm hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 text-xs border-2 border-black/20 dark:border-slate-950"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function PropertyField({
  property,
  value,
  onChange,
}: {
  property: BlockProperty
  value: unknown
  onChange: (v: unknown) => void
}) {
  const inputClasses =
    'w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:text-slate-400'

  return (
    <div className="space-y-3">
      <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center justify-between">
        <span>{property.label}</span>
        {property.required && (
          <span className="text-[8px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-black tracking-widest">
            REQUIRED
          </span>
        )}
      </label>

      {property.type === 'text' && (
        <input
          type="text"
          value={(value as string) || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={property.placeholder}
          className={inputClasses}
        />
      )}

      {property.type === 'textarea' && (
        <textarea
          rows={4}
          value={(value as string) || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={property.placeholder}
          className={cn(inputClasses, 'resize-none')}
        />
      )}

      {property.type === 'color' && (
        <div className="flex gap-3">
          <input
            type="color"
            value={(value as string) || '#3b82f6'}
            onChange={e => onChange(e.target.value)}
            className="w-12 h-12 rounded-xl bg-transparent border-2 border-slate-200 dark:border-slate-800 cursor-pointer p-1"
          />
          <input
            type="text"
            value={(value as string) || '#3b82f6'}
            onChange={e => onChange(e.target.value)}
            className={cn(inputClasses, 'flex-1 uppercase font-mono')}
          />
        </div>
      )}

      {property.type === 'number' && (
        <input
          type="number"
          value={value !== undefined ? String(value) : ''}
          onChange={e => {
            const val = e.target.value === '' ? undefined : Number(e.target.value)
            onChange(val)
          }}
          className={inputClasses}
        />
      )}

      {property.type === 'select' && (
        <div className="relative">
          <select
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            className={cn(inputClasses, 'appearance-none cursor-pointer')}
          >
            {property.options?.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      )}

      {property.type === 'boolean' && (
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Active / Enabled
          </span>
          <button
            onClick={() => onChange(!value)}
            className={cn(
              'w-12 h-6 rounded-full relative transition-all border-2 border-slate-900',
              value ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            )}
          >
            <div
              className={cn(
                'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm',
                value ? 'left-6' : 'left-0.5'
              )}
            />
          </button>
        </div>
      )}

      {property.helperText && (
        <div className="flex gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border-2 border-indigo-100 dark:border-indigo-800/30">
          <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold leading-relaxed">
            {String(property.helperText)}
          </p>
        </div>
      )}
    </div>
  )
}
