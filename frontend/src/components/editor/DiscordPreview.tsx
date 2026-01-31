import { motion } from 'framer-motion'
import { Hash, MessageSquare } from 'lucide-react'

interface DiscordPreviewProps {
  content: string
  username?: string
  avatar?: string
  className?: string
}

import { cn } from '@/lib/utils'

export function DiscordPreview({
  content,
  username = 'Discord Bot',
  avatar,
  className,
}: DiscordPreviewProps) {
  return (
    <div
      className={cn(
        'bg-[#313338] text-[#dbdee1] rounded-3xl overflow-hidden shadow-2xl border border-white/5 font-sans h-full flex flex-col',
        className
      )}
    >
      {/* Top Header Mock */}
      <div className="bg-[#313338] px-5 py-4 flex items-center justify-between border-b border-[#1e1f22]">
        <div className="flex items-center gap-3">
          <Hash className="w-4 h-4 text-[#80848e]" />
          <span className="font-bold text-white text-[13px]">simulation-terminal</span>
        </div>
      </div>

      {/* Message List */}
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 group"
        >
          <div className="w-10 h-10 rounded-full bg-[#5865f2] shrink-0 flex items-center justify-center text-white shadow-lg overflow-hidden">
            {avatar ? (
              <img src={avatar} alt="User avatar" className="w-full h-full object-cover" />
            ) : (
              <MessageSquare className="w-5 h-5 opacity-80" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-[#f2f3f5] text-sm hover:underline cursor-pointer">
                {username}
              </span>
              <span className="bg-[#5865f2] text-[9px] text-white px-1.5 py-0.5 rounded-[3px] font-black uppercase tracking-tighter">
                BOT
              </span>
              <span className="text-[10px] text-[#949ba4] font-medium opacity-60">
                Today at 12:00 PM
              </span>
            </div>
            <div className="text-[#dbdee1] text-[13px] leading-relaxed font-medium">
              {content || 'Awaiting response trace...'}
            </div>

            {/* Response Trace Embed */}
            <div className="mt-4 pl-4 border-l-4 border-emerald-500 bg-white/2 rounded-r-2xl p-4 max-w-sm backdrop-blur-md">
              <div className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Execution Success
              </div>
              <div className="text-[#f2f3f5] font-bold text-sm mb-1">Visual Logic Validated</div>
              <div className="text-[11px] text-[#949ba4] font-medium leading-relaxed opacity-80">
                The visual logic chain has been verified. No cyclic dependencies detected in current
                trace.
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Input Mock */}
      <div className="p-5 pt-0">
        <div className="bg-[#383a40] rounded-2xl px-5 py-3 text-[#949ba4] text-[13px] font-medium flex items-center border border-white/5">
          Message #simulation-terminal
        </div>
      </div>
    </div>
  )
}
