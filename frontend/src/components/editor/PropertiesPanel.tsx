import { X, Copy, Trash2, ChevronDown, Plus, Settings } from 'lucide-react'
import * as Icons from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import { BlockProperty } from '@/types'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'

export default function PropertiesPanel() {
  const { selectedBlockId, getBlockById, updateBlock, removeBlock, duplicateBlock, selectBlock } =
    useEditorStore()

  if (!selectedBlockId) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-transparent">
        <div className="w-16 h-16 rounded-[24px] bg-white/2 border border-white/5 flex items-center justify-center mb-6 opacity-40">
          <Settings className="w-8 h-8 text-slate-500 animate-spin-slow" />
        </div>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-1">
          Status: Standby
        </h3>
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest max-w-[160px]">
          Select an active component to modify its properties.
        </p>
      </div>
    )
  }

  const block = getBlockById(selectedBlockId)
  if (!block) return null

  const definition = BLOCK_DEFINITIONS[block.type]
  if (!definition) return null

  const handlePropertyChange = (key: string, value: unknown) => {
    updateBlock(selectedBlockId, {
      data: {
        ...block.data,
        properties: {
          ...block.data.properties,
          [key]: value,
        },
      },
    })
  }

  return (
    <div className="h-full flex flex-col animate-in slide-in-from-right duration-500">
      <div className="p-5 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
            Configuration Module
          </h2>
          <button
            onClick={() => selectBlock(null)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-all text-slate-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center bg-black/40"
            style={{ color: definition.color }}
          >
            {(() => {
              const IconComp = (Icons[definition.icon as keyof typeof Icons] || Icons.Box) as any
              return <IconComp className="w-5 h-5" />
            })()}
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-tight">{definition.label}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">
              ID: {block.id.slice(0, 8)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        {definition.properties
          .filter(property => {
            if (property.showIf) {
              return property.showIf(block.data.properties)
            }
            return true
          })
          .map(property => (
            <PropertyField
              key={property.key}
              property={property}
              value={block.data.properties[property.key]}
              onChange={value => handlePropertyChange(property.key, value)}
            />
          ))}

        <div className="h-px bg-white/5 my-4" />

        <div className="grid grid-cols-2 gap-3 pb-8">
          <button
            onClick={() => duplicateBlock(selectedBlockId)}
            className="px-4 py-3 bg-[#1a1a1a] border border-white/5 text-slate-400 font-bold rounded-xl hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider shadow-sm group"
          >
            <Copy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            Clone
          </button>
          <button
            onClick={() => {
              removeBlock(selectedBlockId)
              selectBlock(null)
            }}
            className="px-4 py-3 bg-red-500/5 border border-red-500/10 text-red-400 font-bold rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider shadow-sm group"
          >
            <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
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
    'w-full px-4 py-2.5 bg-black/40 border border-white/5 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder:text-slate-700'

  return (
    <div className="space-y-2.5">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between pl-1 mb-2">
        <span>{property.label}</span>
        {property.required && (
          <span className="text-[8px] bg-red-500/10 text-red-500 border border-red-500/10 px-1.5 py-0.5 rounded-full font-bold tracking-wider">
            REQ
          </span>
        )}
      </label>

      {property.type === 'text' && (
        <input
          type="text"
          value={(value as string) || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={property.placeholder || 'Value...'}
          className="w-full px-4 py-3 bg-[#0a0a0a]/60 border border-white/5 rounded-xl text-xs text-slate-200 outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-slate-700"
        />
      )}

      {property.type === 'textarea' && (
        <textarea
          rows={4}
          value={(value as string) || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={property.placeholder || 'Enter text...'}
          className={cn(inputClasses, 'resize-none leading-relaxed min-h-[100px]')}
        />
      )}

      {property.type === 'color' && (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={(value as string) || '#10b981'}
            onChange={e => onChange(e.target.value)}
            className="w-10 h-9 p-0 bg-transparent border-0 cursor-pointer"
          />
          <input
            type="text"
            value={(value as string) || '#10b981'}
            onChange={e => onChange(e.target.value)}
            className={cn(inputClasses, 'flex-1 font-mono text-[10px] uppercase')}
            maxLength={7}
          />
        </div>
      )}

      {property.type === 'select' && (
        <CustomSelect
          value={(value as string) || ''}
          onChange={onChange as (v: string) => void}
          options={property.options || []}
          placeholder="Select..."
        />
      )}

      {property.type === 'boolean' && (
        <button
          onClick={() => onChange(!value)}
          className={cn(
            'w-full flex items-center justify-between p-3.5 rounded-xl border transition-all',
            value ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-black/40 border-white/5'
          )}
        >
          <span
            className={cn(
              'text-[10px] font-black uppercase tracking-widest',
              value ? 'text-emerald-400' : 'text-slate-600'
            )}
          >
            {value ? 'Active State' : 'Disabled State'}
          </span>
          <div
            className={cn(
              'w-8 h-4 rounded-full relative transition-all duration-300',
              value ? 'bg-emerald-500' : 'bg-slate-800'
            )}
          >
            <div
              className={cn(
                'absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all',
                value ? 'left-4.5' : 'left-0.5'
              )}
            />
          </div>
        </button>
      )}

      {property.type === 'options_list' && (
        <OptionsListBuilder
          value={(value as Option[]) || []}
          onChange={onChange as (v: Option[]) => void}
        />
      )}

      {property.helperText && (
        <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
          <p className="text-[10px] text-emerald-400 font-bold leading-relaxed opacity-70 italic">
            {String(property.helperText)}
          </p>
        </div>
      )}
    </div>
  )
}

interface Option {
  name: string
  description: string
  type: number
  required: boolean
}

function OptionsListBuilder({
  value,
  onChange,
}: {
  value: Option[]
  onChange: (v: Option[]) => void
}) {
  const addOption = () => {
    onChange([
      ...value,
      { name: `arg_${value.length + 1}`, description: '', type: 3, required: false },
    ])
  }

  const updateOption = (index: number, key: keyof Option, val: any) => {
    const newValue = [...value]
    newValue[index] = { ...newValue[index], [key]: val } as Option
    onChange(newValue)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          Parameters ({value.length})
        </span>
        <button
          onClick={addOption}
          className="p-1 px-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest shadow-emerald"
        >
          <Plus className="w-3 h-3" /> Append
        </button>
      </div>

      <div className="space-y-3">
        {value.map((opt, i) => (
          <div key={i} className="p-4 bg-white/2 border border-white/5 rounded-2xl space-y-4">
            <input
              type="text"
              value={opt.name}
              onChange={e => updateOption(i, 'name', e.target.value)}
              className="w-full bg-transparent text-[11px] font-black uppercase tracking-widest text-white outline-none placeholder:text-slate-800"
              placeholder="NAME"
            />
            <input
              type="text"
              value={opt.description}
              onChange={e => updateOption(i, 'description', e.target.value)}
              className="w-full h-8 px-3 bg-black/40 border border-white/5 rounded-lg text-[10px] text-slate-400 outline-none"
              placeholder="Param description"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  options: { label: string; value: string }[]
  placeholder: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedLabel = options.find(o => o.value === value)?.label

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-black/40 border border-white/5 rounded-xl text-white text-xs font-bold flex items-center justify-between hover:bg-black/60 transition-all text-left h-10"
      >
        <span
          className={
            value ? 'text-white' : 'text-slate-600 uppercase tracking-widest text-[9px] font-black'
          }
        >
          {selectedLabel || placeholder}
        </span>
        <ChevronDown
          className={cn('w-4 h-4 text-slate-600 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-1">
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors',
                  value === opt.value
                    ? 'bg-emerald-500 text-black'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
