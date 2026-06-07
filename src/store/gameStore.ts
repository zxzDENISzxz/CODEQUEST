import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameStore {
  levelWins:     Record<number, boolean>
  levelCodes:    Record<number, string>
  levelStars:    Record<number, number>
  levelGenius:   Record<number, boolean>
  briefingsSeen: Record<number, boolean>
  setWin:          (index: number) => void
  setCode:         (index: number, code: string) => void
  setStars:        (index: number, stars: number) => void
  setGenius:       (index: number) => void
  setBriefingSeen: (index: number) => void
  reset: () => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      levelWins:     {},
      levelCodes:    {},
      levelStars:    {},
      levelGenius:   {},
      briefingsSeen: {},
      setWin: (index) =>
        set((state) => ({ levelWins: { ...state.levelWins, [index]: true } })),
      setCode: (index, code) =>
        set((state) => ({ levelCodes: { ...state.levelCodes, [index]: code } })),
      setStars: (index, stars) =>
        set((state) => ({
          levelStars: { ...state.levelStars, [index]: Math.max(state.levelStars[index] ?? 0, stars) },
        })),
      setGenius: (index) =>
        set((state) => ({ levelGenius: { ...state.levelGenius, [index]: true } })),
      setBriefingSeen: (index) =>
        set((state) => ({ briefingsSeen: { ...state.briefingsSeen, [index]: true } })),
      reset: () => set({ levelWins: {}, levelCodes: {}, levelStars: {}, levelGenius: {}, briefingsSeen: {} }),
    }),
    { name: 'spaceway-progress' }
  )
)
