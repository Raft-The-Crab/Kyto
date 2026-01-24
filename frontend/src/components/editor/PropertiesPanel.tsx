import { X, Copy, Trash2, Tag, HelpCircle } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import { BlockProperty } from '@/types'
import { cn } from '@/lib/utils'

export function PropertiesPanel() {
  const { selectedBlockId, getBlockById, updateBlock, removeBlock, duplicateBlock } =
    useEditorStore()

  if (!selectedBlockId) {
    return (
      <aside className="w-80 bg-slate-900 border-l border-slate-800 overflow-y-auto">
        <div className="p-6 text-center">
          <Tag className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No block selected</p>
          <p className="text-slate-600 text-xs mt-1">Select a block to edit its properties</p>
        </div>
      </aside>
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

  const handleLabelChange = (label: string) => {
    updateBlock(selectedBlockId, { label })
  }

  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold text-lg">Block Settings</h2>
          <button
            onClick={() => useEditorStore.getState().selectBlock(null)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className="px-3 py-2 rounded-lg border border-slate-700"
          style={{ backgroundColor: `${definition.color}10` }}
        >
          <p className="text-slate-400 text-xs mb-1">Block Type</p>
          <p className="text-white font-semibold text-sm">{definition.label}</p>
        </div>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Block Label */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Block Label
          </label>
          <input
            type="text"
            value={block.data.label}
            onChange={e => handleLabelChange(e.target.value)}
            placeholder="Enter block label..."
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
          />
          <p className="text-slate-500 text-xs mt-1">
            Add an optional label to this block. This can be used to make the block appear in the
            command tree more readable.
          </p>
        </div>

        {/* Dynamic Properties */}
        {definition.properties.map(property => (
          <PropertyField
            key={property.key}
            property={property}
            value={block.data.properties[property.key]}
            onChange={value => handlePropertyChange(property.key, value)}
          />
        ))}

        {/* Helper Text Section */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-300">Helper Text</h3>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed mb-3">
            Add an optional helper text to this block. This will display as a tooltip hint to the
            user in this block in the builder.
          </p>
          <button className="w-full px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-semibold rounded-lg text-sm transition-all flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Add Helper Text
          </button>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={() => duplicateBlock(selectedBlockId)}
          className="w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Duplicate Block
        </button>

        <button
          onClick={() => removeBlock(selectedBlockId)}
          className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Block
        </button>
      </div>
    </aside>
  )
}

interface PropertyFieldProps {
  property: BlockProperty
  value: unknown
  onChange: (value: unknown) => void
}

function PropertyField({ property, value, onChange }: PropertyFieldProps) {
  const renderInput = () => {
    switch (property.type) {
      case 'text':
        return (
          <input
            type="text"
            value={(value as string) ?? ''}
            onChange={e => onChange(e.target.value)}
            placeholder={property.placeholder}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        )

      case 'textarea':
        return (
          <textarea
            value={(value as string) ?? ''}
            onChange={e => onChange(e.target.value)}
            placeholder={property.placeholder}
            rows={4}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={(value as number) ?? ''}
            onChange={e => onChange(Number(e.target.value))}
            placeholder={property.placeholder}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        )

      case 'boolean':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={(value as boolean) ?? false}
                onChange={e => onChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 rounded-full peer-checked:bg-indigo-600 transition-all"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
            </div>
            <span className="text-sm text-slate-300">
              {(value as boolean) ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        )

      case 'select':
        return (
          <select
            value={(value as string) ?? ''}
            onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
          >
            {property.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'color':
        return (
          <div className="flex gap-2">
            <input
              type="color"
              value={(value as string) ?? '#3b82f6'}
              onChange={e => onChange(e.target.value)}
              className="w-12 h-10 bg-slate-800 border border-slate-700 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={(value as string) ?? '#3b82f6'}
              onChange={e => onChange(e.target.value)}
              placeholder="#3b82f6"
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-2">
        {property.label}
        {property.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {renderInput()}
      {property.helperText && (
        <p className="text-slate-500 text-xs mt-1 leading-relaxed">{property.helperText}</p>
      )}
    </div>
  )
}
