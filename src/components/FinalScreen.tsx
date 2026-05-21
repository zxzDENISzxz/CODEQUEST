import { motion } from 'framer-motion'

interface Props {
  onContinue: () => void
}

// Детерминированное звёздное поле
const STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x: ((i * 137 + 31) % 100),
  y: ((i * 73 + 17) % 70),
  r: 0.4 + ((i * 11) % 3) * 0.45,
  delay: (i * 0.09) % 5,
  dur: 1.8 + (i % 5) * 0.6,
}))

function StarField() {
  return (
    <>
      {STARS.map(s => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r * 2, height: s.r * 2 }}
          animate={{ opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
        />
      ))}
    </>
  )
}

function PlanetAruma() {
  return (
    <svg width="580" height="580" viewBox="0 0 580 580" fill="none">
      {/* Внешнее свечение атмосферы */}
      <circle cx="290" cy="290" r="285" fill="#6d28d9" opacity="0.07"/>
      <circle cx="290" cy="290" r="272" fill="#7c3aed" opacity="0.10"/>
      <circle cx="290" cy="290" r="258" fill="#8b5cf6" opacity="0.08"/>

      {/* Основное тело планеты */}
      <circle cx="290" cy="290" r="245" fill="#1a0533"/>
      <circle cx="290" cy="290" r="245" fill="#2d1b69"/>

      {/* Континенты */}
      <ellipse cx="230" cy="225" rx="90" ry="62" fill="#4c1d95" opacity="0.9" transform="rotate(-15 230 225)"/>
      <ellipse cx="360" cy="295" rx="80" ry="55" fill="#5b21b6" opacity="0.8" transform="rotate(10 360 295)"/>
      <ellipse cx="185" cy="340" rx="52" ry="36" fill="#4c1d95" opacity="0.75" transform="rotate(-5 185 340)"/>
      <ellipse cx="390" cy="200" rx="46" ry="32" fill="#6d28d9" opacity="0.65" transform="rotate(20 390 200)"/>
      <ellipse cx="280" cy="390" rx="63" ry="40" fill="#5b21b6" opacity="0.6" transform="rotate(-10 280 390)"/>

      {/* Горные хребты */}
      <ellipse cx="225" cy="218" rx="40" ry="17" fill="#7c3aed" opacity="0.4" transform="rotate(-20 225 218)"/>
      <ellipse cx="362" cy="290" rx="34" ry="14" fill="#8b5cf6" opacity="0.35" transform="rotate(15 362 290)"/>

      {/* Облачные полосы */}
      <ellipse cx="265" cy="175" rx="105" ry="14" fill="white" opacity="0.055" transform="rotate(-22 265 175)"/>
      <ellipse cx="320" cy="368" rx="92" ry="11" fill="white" opacity="0.048" transform="rotate(12 320 368)"/>
      <ellipse cx="195" cy="290" rx="70" ry="10" fill="white" opacity="0.045" transform="rotate(-8 195 290)"/>

      {/* Огни городов */}
      <circle cx="238" cy="232" r="3.5" fill="#fef08a" opacity="0.72"/>
      <circle cx="251" cy="239" r="2.5" fill="#fef08a" opacity="0.62"/>
      <circle cx="228" cy="244" r="2.5" fill="#fed7aa" opacity="0.55"/>
      <circle cx="368" cy="298" r="3" fill="#fef08a" opacity="0.68"/>
      <circle cx="377" cy="307" r="2" fill="#fef08a" opacity="0.58"/>
      <circle cx="190" cy="344" r="2.5" fill="#fed7aa" opacity="0.52"/>
      <circle cx="284" cy="394" r="2" fill="#fef08a" opacity="0.5"/>

      {/* Полярная шапка */}
      <ellipse cx="290" cy="78" rx="57" ry="25" fill="#e0e7ff" opacity="0.28"/>
      <ellipse cx="290" cy="68" rx="34" ry="15" fill="white" opacity="0.22"/>

      {/* Атмосферный ободок */}
      <circle cx="290" cy="290" r="245" fill="none" stroke="#a78bfa" strokeWidth="4.5" opacity="0.38"/>
      <circle cx="290" cy="290" r="249" fill="none" stroke="#c4b5fd" strokeWidth="2" opacity="0.16"/>

      {/* Блик освещённой стороны */}
      <ellipse cx="215" cy="195" rx="80" ry="58" fill="white" opacity="0.025"/>
    </svg>
  )
}

function ShipSVG() {
  return (
    <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
      <polygon points="36,20 8,10 8,30" fill="#93c5fd"/>
      <polygon points="12,10 6,4 8,10" fill="#60a5fa"/>
      <polygon points="12,30 6,36 8,30" fill="#60a5fa"/>
      <ellipse cx="19" cy="20" rx="7" ry="5" fill="#1e40af"/>
      <circle cx="21" cy="20" r="3.5" fill="#0ea5e9"/>
      <circle cx="21" cy="20" r="2" fill="#bae6fd"/>
      <rect x="4" y="15" width="5" height="10" rx="2" fill="#475569"/>
      <ellipse cx="3" cy="20" rx="2.5" ry="4" fill="#fbbf24" opacity="0.85"/>
      <ellipse cx="2" cy="20" rx="1.5" ry="2.5" fill="#fef08a" opacity="0.7"/>
    </svg>
  )
}

export function FinalScreen({ onContinue }: Props) {
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden flex flex-col"
      style={{ background: '#03001a' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Звёзды */}
      <StarField />

      {/* Планета Арума — позиционирована от центра экрана (та же СК, что и корабль) */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ top: '50%', marginTop: 240 }}
        initial={{ y: 90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 2.2, ease: 'easeOut', delay: 0.4 }}
      >
        <PlanetAruma />
      </motion.div>

      {/*
        Корабль: 9 ключевых точек для плавной параболической дуги.
        Планета (top: 50% + 240px, SVG-круг начинается в y=45) →
        поверхность планеты = center + 285px.
        Нос корабля при rotate≈88° выступает ~19px вниз от pivot →
        посадка при y ≈ 266.
      */}
      {/*
        Корабль вращается 0°→270° (по часовой) — нос описывает дугу вперёд-вниз-назад-вверх.
        В финале: нос смотрит вверх, двигатель вниз (к планете).
        Двигатель при 270° смещён на +16px вниз от пивота → посадка при y≈269.
      */}
      <motion.div
        className="absolute left-1/2 top-1/2 pointer-events-none"
        style={{ marginLeft: -24, marginTop: -24 }}
        animate={{
          x:       [185, 168, 142, 106,  65,  28,   8,   0,   0],
          y:       [-215,-185,-140, -72,  22, 118, 220, 269, 262],
          rotate:  [   0,  15,  40,  90, 160, 220, 258, 270, 270],
          opacity: [   0,   1,   1,   1,   1,   1,   1,   1,   1],
          scale:   [   1,   1,   1,   1,   1,   1,   1, 0.87,   1],
        }}
        transition={{
          duration: 6,
          times:   [0, 0.08, 0.20, 0.35, 0.50, 0.65, 0.80, 0.91, 1],
          delay: 1,
          ease: 'linear',
        }}
      >
        {/* Тяга — вращается вместе с кораблём, при 270° направлена вниз к планете */}
        <motion.div
          className="absolute rounded-full blur-md pointer-events-none"
          style={{
            width: 44, height: 44,
            background: 'radial-gradient(circle, rgba(251,146,60,0.95) 0%, rgba(253,224,71,0.35) 50%, transparent 72%)',
            left: -26, top: 2,
          }}
          animate={{
            opacity: [0, 0, 0, 0.1, 0.45, 0.9, 1.0, 0.5, 0],
            scale:   [0, 0, 0, 0.2, 0.6,  1.2, 1.7, 0.9, 0],
          }}
          transition={{
            duration: 6,
            times:   [0, 0.08, 0.20, 0.35, 0.50, 0.65, 0.80, 0.91, 1],
            delay: 1,
            ease: 'linear',
          }}
        />
        <ShipSVG />
      </motion.div>

      {/* Текстовая часть — появляется после посадки */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
           style={{ paddingBottom: 200 }}>

        {/* Название планеты */}
        <motion.h1
          className="text-6xl font-black tracking-[0.2em]"
          style={{ color: '#a78bfa', textShadow: '0 0 50px rgba(124,58,237,0.8), 0 0 100px rgba(124,58,237,0.3)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 7.8, duration: 1.4, ease: 'easeOut' }}
        >
          АРУМА
        </motion.h1>

        {/* Разделитель */}
        <motion.div
          className="mt-5 mb-5 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 8.8, duration: 1 }}
        >
          <div className="h-px w-16 bg-indigo-600"/>
          <span className="text-indigo-500 text-xs tracking-widest">✦</span>
          <div className="h-px w-16 bg-indigo-600"/>
        </motion.div>

        {/* Основной текст */}
        <motion.p
          className="text-indigo-200 text-xl text-center leading-relaxed"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 9.5, duration: 1 }}
        >
          Восемь секторов позади.
        </motion.p>

        <motion.p
          className="text-indigo-200 text-xl text-center leading-relaxed"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 10.3, duration: 1 }}
        >
          Зикс вернулся домой.
        </motion.p>

        {/* БИПП */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 11.2, duration: 1.2 }}
        >
          <p className="text-indigo-400 text-base italic">«...добрались.»</p>
          <p className="text-indigo-600 text-sm tracking-widest">— БИПП</p>
        </motion.div>

        {/* Кнопка */}
        <motion.button
          className="pointer-events-auto mt-10 px-8 py-3 rounded-xl font-bold text-base text-white transition-colors"
          style={{ backgroundColor: '#5b21b6' }}
          whileHover={{ backgroundColor: '#7c3aed' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 13, duration: 0.9 }}
          onClick={onContinue}
        >
          ← На карту секторов
        </motion.button>
      </div>
    </motion.div>
  )
}
