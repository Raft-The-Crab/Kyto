import { motion } from 'framer-motion'

export function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Orb 1: Indigo/Purple */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
      />

      {/* Orb 2: Cyan/Blue */}
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen"
      />

      {/* Orb 3: Pink/Rose */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
        className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-rose-500/10 dark:bg-rose-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"
      />
    </div>
  )
}
