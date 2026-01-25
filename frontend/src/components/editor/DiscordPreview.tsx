import { motion } from 'framer-motion'
import { Hash, MessageSquare } from 'lucide-react'

interface DiscordPreviewProps {
  content: string
  username?: string
  avatar?: string
}

export function DiscordPreview({ content, username = 'Discord Bot', avatar }: DiscordPreviewProps) {
  return (
    <div className="bg-[#313338] text-[#dbdee1] rounded-2xl overflow-hidden shadow-neo-sm border-2 border-black/20 font-sans">
      {/* Top Header Mock */}
      <div className="bg-[#313338] px-4 py-3 flex items-center justify-between border-b border-[#1e1f22]">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-[#80848e]" />
          <span className="font-bold text-white text-xs">preview-channel</span>
        </div>
      </div>

      {/* Message List */}
      <div className="p-5 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 group"
        >
          <div className="w-10 h-10 rounded-full bg-[#5865f2] shrink-0 flex items-center justify-center text-white font-black shadow-sm">
            {avatar ? (
              <img src={avatar} alt="avatar" className="w-full h-full rounded-full" />
            ) : (
              <MessageSquare className="w-5 h-5 opacity-80" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#f2f3f5] text-sm hover:underline cursor-pointer">
                {username}
              </span>
              <span className="bg-[#5865f2] text-[9px] text-white px-1.5 py-0.5 rounded-[3px] font-black uppercase tracking-tighter">
                BOT
              </span>
              <span className="text-[10px] text-[#949ba4] font-bold">12:00 PM</span>
            </div>
            <div className="text-[#dbdee1] text-sm mt-1 whitespace-pre-wrap leading-relaxed font-medium">
              {content || 'Message content will be displayed here during simulation...'}
            </div>

            {/* Embed Mock */}
            <div className="mt-3 pl-4 border-l-4 border-[#5865f2] bg-[#2b2d31] rounded-r-lg p-4 max-w-sm shadow-sm">
              <div className="text-[10px] text-[#b5bac1] font-black uppercase tracking-widest mb-2">
                System Metadata
              </div>
              <div className="text-[#f2f3f5] font-black text-sm mb-1">Response Success</div>
              <div className="text-xs text-[#dbdee1] font-medium leading-normal opacity-80">
                The visual logic chain has been verified and is yielding the expected output trace.
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Input Mock */}
      <div className="p-4 pt-0">
        <div className="bg-[#383a40] rounded-xl px-4 py-2.5 text-[#949ba4] text-xs font-bold flex items-center border border-white/5">
          Message #preview-channel
        </div>
      </div>
    </div>
  )
}
