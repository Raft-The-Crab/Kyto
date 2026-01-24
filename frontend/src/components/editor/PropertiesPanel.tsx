import { X, Copy, Trash2, Tag, HelpCircle, Variable, Box } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import { BlockProperty } from '@/types'
import { cn } from '@/lib/utils'

export function PropertiesPanel() {
  const { selectedBlockId, getBlockById, updateBlock, removeBlock, duplicateBlock } =
    useEditorStore()

  if (!selectedBlockId) {
    return (
      <div className="h-full bg-white flex flex-col">
         <div className="p-5 border-b-2 border-slate-100">
           <h2 className="text-xl font-black text-slate-900">Properties</h2>
         </div>
         <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-60">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 transform rotate-3">
                <Box className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">No Selection</h3>
            <p className="text-sm text-slate-500 font-medium">Click on a block on the canvas to configure its settings.</p>
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

  const handleLabelChange = (label: string) => {
    updateBlock(selectedBlockId, { label })
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="p-5 border-b-2 border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-slate-900">Settings</h2>
          <button
            onClick={() => useEditorStore.getState().selectBlock(null)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className="px-4 py-3 rounded-xl border-2 border-slate-100 flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: definition.color }} />
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Block Type</p>
            <p className="text-slate-900 font-bold leading-none mt-0.5">{definition.label}</p>
          </div>
        </div>
      </div>

      {/* Properties Form */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Label Field */}
        <div className="space-y-3">
           <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
             <Tag className="w-4 h-4 text-indigo-500" />
             Internal Label
           </label>
           <input
             type="text"
             value={block.data.label}
             onChange={e => handleLabelChange(e.target.value)}
             className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
           />
        </div>

        <div className="h-px bg-slate-100" />

        {/* Dynamic Properties */}
        {definition.properties.map(property => (
          <PropertyField
            key={property.key}
            property={property}
            value={block.data.properties[property.key]}
            onChange={value => handlePropertyChange(property.key, value)}
          />
        ))}

        {/* Action Buttons */}
        <div className="pt-2 grid grid-cols-2 gap-3">
             <button
              onClick={() => duplicateBlock(selectedBlockId)}
              className="px-4 py-2.5 bg-slate-100 border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Copy className="w-4 h-4" />
              Clone
            </button>
            <button
              onClick={() => removeBlock(selectedBlockId)}
              className="px-4 py-2.5 bg-red-50 border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-white hover:border-red-200 hover:shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
        </div>
      </div>
    </div>
  )
}

function PropertyField({ property, value, onChange }: { property: BlockProperty, value: unknown, onChange: (v: unknown) => void }) {
    const inputClasses = "w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-400"
    
    return (
        <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>{property.label}</span>
                {property.required && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase">Req</span>}
            </label>
            
            {property.type === 'text' && (
                <input type="text" value={value as string || ''} onChange={e => onChange(e.target.value)} placeholder={property.placeholder} className={inputClasses} />
            )}
            
            {property.type === 'textarea' && (
                <textarea rows={3} value={value as string || ''} onChange={e => onChange(e.target.value)} placeholder={property.placeholder} className={cn(inputClasses, "resize-none")} />
            )}

            {property.type === 'number' && (
                <input type="number" value={value as number || ''} onChange={e => onChange(Number(e.target.value))} placeholder={property.placeholder} className={inputClasses} />
            )}

            {property.type === 'select' && (
                 <div className="relative">
                    <select value={value as string || ''} onChange={e => onChange(e.target.value)} className={cn(inputClasses, "appearance-none cursor-pointer")}>
                        {property.options?.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                 </div>
            )}
            
            {property.type === 'boolean' && (
                <label className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-indigo-600 hover:bg-indigo-50/10 transition-all group">
                    <div className={cn("w-5 h-5 rounded border-2 flex items-center justify-center transition-all", value ? "bg-indigo-600 border-indigo-600" : "border-slate-300 bg-white")}>
                         {value && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <input type="checkbox" checked={value as boolean || false} onChange={e => onChange(e.target.checked)} className="hidden" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-900">{value ? "Enabled" : "Disabled"}</span>
                </label>
            )}

             {property.helperText && (
                <p className="text-xs text-slate-500 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-indigo-500 font-bold mr-1">ℹ️ Hint:</span>
                    {property.helperText}
                </p>
            )}
        </div>
    )
}
