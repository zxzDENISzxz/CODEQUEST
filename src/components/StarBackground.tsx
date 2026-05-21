import { motion } from 'framer-motion'

const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: ((i * 137 + 31) % 100),
  y: ((i * 73  + 17) % 100),
  r: 0.3 + ((i * 11) % 3) * 0.38,
  dur: 1.4 + (i % 6) * 0.55,
  delay: (i * 0.13) % 5.5,
  bright: i % 9 === 0,
}))

export function StarBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {STARS.map(s => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r * 2, height: s.r * 2 }}
          animate={s.bright
            ? { opacity: [0.2, 1, 0.2], scale: [1, 1.6, 1] }
            : { opacity: [0.1, 0.75, 0.1] }
          }
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
