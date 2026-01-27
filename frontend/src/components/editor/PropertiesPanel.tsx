import { X, Copy, Trash2, ChevronDown, Check, Plus } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { useProjectStore } from '@/store/projectStore'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import { BlockProperty } from '@/types'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'

export function PropertiesPanel() {
  const { selectedBlockId, getBlockById, updateBlock, removeBlock, duplicateBlock, selectBlock } =
    useEditorStore()

  if (!selectedBlockId) {
    return (
      <div className="h-full bg-white dark:bg-[#08080c] flex flex-col transition-colors border-l border-white/5">
        <div className="p-5 border-b border-white/5">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider">Properties</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40">
          <h3 className="font-bold text-white text-lg mb-1">No Selection</h3>
          <p className="text-sm text-slate-500 font-medium max-w-45">
            Select a block to edit its configuration.
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
    <div className="h-full bg-white dark:bg-[#08080c] flex flex-col transition-colors border-l border-white/5 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-5 border-b border-white/5 bg-white/5 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider">
            Configuration
          </h2>
          <button
            onClick={() => selectBlock(null)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-all text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 py-3 rounded-xl border border-white/10 flex items-center gap-3 bg-black/20 shadow-inner">
          <div
            className="w-3 h-3 rounded-full shadow-[0_0_12px] shadow-current transition-all"
            style={{ backgroundColor: definition.color, color: definition.color }}
          />
          <p className="text-white font-bold text-sm tracking-wide">{definition.label}</p>
        </div>
      </div>

      {/* Properties Form */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        {/* Dynamic Properties */}
        {definition.properties.map(property => (
          <PropertyField
            key={property.key}
            property={property}
            value={block.data.properties[property.key]}
            onChange={value => handlePropertyChange(property.key, value)}
          />
        ))}

        <div className="h-px bg-white/5 my-6" />

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pb-8">
          <button
            onClick={() => duplicateBlock(selectedBlockId)}
            className="px-4 py-3 bg-white/5 border border-white/10 text-slate-300 font-bold rounded-xl hover:bg-white/10 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2 text-xs"
          >
            <Copy className="w-3.5 h-3.5" />
            Duplicate
          </button>
          <button
            onClick={() => {
              removeBlock(selectedBlockId)
              selectBlock(null)
            }}
            className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded-xl hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30 transition-all flex items-center justify-center gap-2 text-xs"
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
    'w-full px-4 py-3.5 bg-black/20 border border-white/5 rounded-xl text-white text-sm font-medium focus:outline-none focus:border-indigo-500/50 focus:bg-black/40 transition-all placeholder:text-slate-600 custom-input'

  // File input
  if (property.type === 'file') {
    return (
      <div className="space-y-2.5">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between pl-1">
          <span>{property.label}</span>
          {property.required && (
            <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded font-black tracking-widest">
              REQ
            </span>
          )}
        </label>
        <input
          type="file"
          accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar,.7z,.csv,.json,.mp3,.mp4,.wav,.ogg,.webm,.xlsx,.xls,.ppt,.pptx"
          className={inputClasses}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (file) {
              if (file.size > 25 * 1024 * 1024) {
                alert('File too large. Max 25MB allowed.')
                return
              }
              onChange(file)
            } else {
              onChange(undefined)
            }
          }}
        />
        {property.helperText && (
          <div className="flex gap-2 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
            <p className="text-[10px] text-indigo-300 font-medium leading-relaxed opacity-80">
              {String(property.helperText)}
            </p>
          </div>
        )}
        {value &&
          typeof value === 'object' &&
          (value as any).type &&
          (value as any).type.startsWith('image') && (
            <div className="mt-2 flex items-center gap-2">
              <img
                src={URL.createObjectURL(value as File)}
                alt="Preview"
                className="max-h-32 rounded-lg border border-white/10"
              />
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                onClick={() => onChange(undefined)}
              >
                Remove
              </button>
            </div>
          )}
        {value &&
          typeof value === 'object' &&
          (value as any).name &&
          !((value as any).type && (value as any).type.startsWith('image')) && (
            <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
              <span>
                Selected: {(value as any).name} (
                {(((value as any).size || 0) / 1024 / 1024).toFixed(2)} MB,{' '}
                {(value as any).type || 'unknown'})
              </span>
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                onClick={() => onChange(undefined)}
              >
                Remove
              </button>
            </div>
          )}
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between pl-1">
        <span>{property.label}</span>
        {property.required && (
          <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded font-black tracking-widest">
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
          className={inputClasses}
        />
      )}

      {property.type === 'textarea' && (
        <textarea
          rows={4}
          value={(value as string) || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={property.placeholder || 'Enter text...'}
          className={cn(inputClasses, 'resize-none leading-relaxed')}
        />
      )}

      {property.type === 'color' && (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={(value as string) || '#3b82f6'}
            onChange={e => onChange(e.target.value)}
            className="w-12 h-10 p-0 border-0 bg-transparent"
          />
          <input
            type="text"
            value={(value as string) || '#3b82f6'}
            onChange={e => onChange(e.target.value)}
            className={cn(inputClasses, 'flex-1 uppercase font-mono')}
            maxLength={9}
            spellCheck={false}
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
        <CustomSelect
          value={(value as string) || ''}
          onChange={onChange as (v: string) => void}
          options={property.options || []}
          placeholder="Select option..."
        />
      )}

      {property.type === 'module_select' && <ModuleSelectField value={value} onChange={onChange} />}

      {property.type === 'boolean' && (
        <button
          onClick={() => onChange(!value)}
          className={cn(
            'w-full flex items-center justify-between p-4 rounded-xl border transition-all group',
            value
              ? 'bg-indigo-500/10 border-indigo-500/30'
              : 'bg-black/20 border-white/5 hover:bg-black/30'
          )}
        >
          <span
            className={cn(
              'text-sm font-bold transition-colors',
              value ? 'text-indigo-300' : 'text-slate-400'
            )}
          >
            {value ? 'Active' : 'Inactive'}
          </span>
          <div
            className={cn(
              'w-10 h-5 rounded-full relative transition-all duration-300',
              value ? 'bg-indigo-500' : 'bg-slate-700'
            )}
          >
            <div
              className={cn(
                'absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm',
                value ? 'left-6' : 'left-1'
              )}
            />
          </div>
        </button>
      )}

      {property.type === 'options_list' && (
        <OptionsListBuilder
          value={(value as any[]) || []}
          onChange={onChange as (v: any[]) => void}
        />
      )}

      {property.helperText && (
        <div className="flex gap-2 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
          <p className="text-[10px] text-indigo-300 font-medium leading-relaxed opacity-80">
            {String(property.helperText)}
          </p>
        </div>
      )}
    </div>
  )
}

function OptionsListBuilder({ value, onChange }: { value: any[]; onChange: (v: any[]) => void }) {
  const addOption = () => {
    onChange([
      ...value,
      {
        name: `option_${value.length + 1}`,
        description: 'Description',
        type: 3, // String
        required: false,
      },
    ])
  }

  const updateOption = (index: number, key: string, val: any) => {
    const newValue = [...value]
    newValue[index] = { ...newValue[index], [key]: val }
    onChange(newValue)
  }

  const removeOption = (index: number) => {
    const newValue = [...value]
    newValue.splice(index, 1)
    onChange(newValue)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400">Arguments ({value.length})</span>
        <button
          onClick={addOption}
          className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500 hover:text-white transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2">
        {value.map((opt, i) => (
          <div key={i} className="p-3 bg-black/20 border border-white/5 rounded-xl space-y-3 group">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={opt.name}
                onChange={e => updateOption(i, 'name', e.target.value)}
                className="flex-1 bg-transparent text-xs font-bold text-white focus:outline-none border-b border-transparent focus:border-indigo-500 px-1"
                placeholder="Name"
              />
              <button
                onClick={() => removeOption(i)}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <input
              type="text"
              value={opt.description}
              onChange={e => updateOption(i, 'description', e.target.value)}
              className="w-full bg-white/5 rounded-lg px-2 py-1.5 text-[10px] text-slate-300 focus:outline-none focus:bg-white/10"
              placeholder="Description..."
            />

            <div className="flex gap-2">
              <select
                value={opt.type}
                onChange={e => updateOption(i, 'type', Number(e.target.value))}
                className="flex-1 bg-black/40 text-[10px] text-slate-300 rounded-lg px-2 py-1 border border-white/5 outline-none"
              >
                <option value={3}>String</option>
                <option value={4}>Integer</option>
                <option value={5}>Boolean</option>
                <option value={6}>User</option>
                <option value={7}>Channel</option>
                <option value={8}>Role</option>
              </select>

              <button
                onClick={() => updateOption(i, 'required', !opt.required)}
                className={cn(
                  'px-2 py-1 rounded-lg text-[10px] font-bold border transition-all',
                  opt.required
                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                    : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10'
                )}
              >
                REQ
              </button>
            </div>
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
        className="w-full px-4 py-3.5 bg-black/20 border border-white/5 rounded-xl text-white text-sm font-medium flex items-center justify-between hover:bg-black/30 hover:border-white/10 transition-all text-left"
      >
        <span className={value ? 'text-white' : 'text-slate-500'}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown
          className={cn('w-4 h-4 text-slate-500 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1f] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors',
                  value === opt.value
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                )}
              >
                {opt.label}
                {value === opt.value && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ModuleSelectField({
  value,
  onChange,
}: {
  value: unknown
  onChange: (v: unknown) => void
}) {
  const { modules } = useProjectStore()
  const options = modules.map(m => ({ label: m.name, value: m.id }))

  if (options.length === 0) {
    return (
      <div className="w-full px-4 py-3.5 bg-red-500/5 border border-red-500/10 rounded-xl text-red-400 text-sm font-medium text-center">
        No modules available
      </div>
    )
  }

  return (
    <CustomSelect
      value={value as string}
      onChange={onChange as (v: string) => void}
      options={options}
      placeholder="Select module..."
    />
  )
}
