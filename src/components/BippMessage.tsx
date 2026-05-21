import { motion } from 'framer-motion'

interface Props {
  hint: string
}

function BippSVG() {
  return (
    <svg width="48" height="56" viewBox="0 0 48 56" fill="none">
      {/* Стержень антенны */}
      <rect x="22" y="3" width="3" height="11" rx="1.5" fill="#475569"/>

      {/* Мигающий огонёк антенны */}
      <motion.circle
        cx="23.5" cy="3" r="4.5" fill="#fbbf24"
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <circle cx="23.5" cy="3" r="2.5" fill="#fef08a" opacity="0.9"/>

      {/* Корпус головы */}
      <rect x="5" y="13" width="38" height="28" rx="6" fill="#1e293b"/>
      <rect x="5" y="13" width="38" height="28" rx="6" fill="none" stroke="#334155" strokeWidth="1.5"/>

      {/* Экран-лицо */}
      <rect x="9" y="17" width="30" height="20" rx="3.5" fill="#0f172a"/>

      {/* Левый глаз — моргает */}
      <motion.g
        animate={{ opacity: [1, 1, 0.05, 1, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.44, 0.5, 0.56, 1], delay: 0.8 }}
      >
        <circle cx="18" cy="25" r="4.5" fill="#1e40af"/>
        <circle cx="18" cy="25" r="2.8" fill="#3b82f6"/>
        <circle cx="18" cy="25" r="1.4" fill="#bae6fd"/>
        <circle cx="16.8" cy="23.8" r="0.8" fill="white" opacity="0.7"/>
      </motion.g>

      {/* Правый глаз — моргает чуть позже */}
      <motion.g
        animate={{ opacity: [1, 1, 0.05, 1, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.44, 0.5, 0.56, 1], delay: 0.9 }}
      >
        <circle cx="30" cy="25" r="4.5" fill="#1e40af"/>
        <circle cx="30" cy="25" r="2.8" fill="#3b82f6"/>
        <circle cx="30" cy="25" r="1.4" fill="#bae6fd"/>
        <circle cx="28.8" cy="23.8" r="0.8" fill="white" opacity="0.7"/>
      </motion.g>

      {/* Решётка-динамик */}
      <rect x="15" y="31" width="18" height="4.5" rx="1.5" fill="#0f172a"/>
      <line x1="18" y1="31" x2="18" y2="35.5" stroke="#1e293b" strokeWidth="1.2"/>
      <line x1="21" y1="31" x2="21" y2="35.5" stroke="#1e293b" strokeWidth="1.2"/>
      <line x1="24" y1="31" x2="24" y2="35.5" stroke="#1e293b" strokeWidth="1.2"/>
      <line x1="27" y1="31" x2="27" y2="35.5" stroke="#1e293b" strokeWidth="1.2"/>
      <line x1="30" y1="31" x2="30" y2="35.5" stroke="#1e293b" strokeWidth="1.2"/>

      {/* Боковые уши */}
      <rect x="1" y="19" width="4" height="10" rx="2" fill="#334155"/>
      <rect x="43" y="19" width="4" height="10" rx="2" fill="#334155"/>

      {/* Зелёный индикатор статуса */}
      <motion.circle
        cx="3" cy="24" r="1.8" fill="#22c55e"
        animate={{ opacity: [1, 0.25, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      />

      {/* Нижняя подставка */}
      <rect x="15" y="41" width="18" height="10" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
      <rect x="18" y="44" width="5" height="3" rx="1" fill="#334155"/>
      <rect x="25" y="44" width="5" height="3" rx="1" fill="#334155"/>

      {/* Синяя полоска снизу корпуса */}
      <rect x="9" y="38" width="30" height="2.5" rx="1.2" fill="#3b82f6" opacity="0.3"/>
    </svg>
  )
}

export function BippMessage({ hint }: Props) {
  return (
    <div className="flex items-start gap-3">

      {/* БИПП — плавно покачивается */}
      <motion.div
        className="flex-shrink-0"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <BippSVG />
      </motion.div>

      {/* Сообщение-пузырь */}
      <div className="relative flex-1 mt-1">
        {/* Хвостик, указывающий на БИПП */}
        <div
          className="absolute -left-2 top-3.5"
          style={{
            width: 0,
            height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderRight: '9px solid #1e3a5f',
          }}
        />

        <div className="bg-indigo-900/60 border border-indigo-500/40 rounded-2xl rounded-tl-sm px-4 py-3">
          {/* Заголовок */}
          <div className="flex items-center gap-1.5 mb-2">
            <motion.span
              className="inline-block w-2 h-2 rounded-full bg-green-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="text-xs font-bold text-blue-400 tracking-widest">БИПП</span>
          </div>

          {/* Текст подсказки */}
          <p className="text-indigo-200 text-sm whitespace-pre-wrap leading-relaxed">
            {hint}
          </p>
        </div>
      </div>

    </div>
  )
}
