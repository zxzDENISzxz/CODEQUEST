import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameStore {
  levelWins: Record<number, boolean>
  levelCodes: Record<number, string>
  levelStars: Record<number, number>
  briefingsSeen: Record<number, boolean>
  setWin: (index: number) => void
  setCode: (index: number, code: string) => void
  setStars: (index: number, stars: number) => void
  setBriefingSeen: (index: number) => void
  reset: () => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      levelWins: {},
      levelCodes: {},
      levelStars: {},
      briefingsSeen: {},
      setWin: (index) =>
        set((state) => ({
          levelWins: { ...state.levelWins, [index]: true },
        })),
      setCode: (index, code) =>
        set((state) => ({
          levelCodes: { ...state.levelCodes, [index]: code },
        })),
      setStars: (index, stars) =>
        set((state) => ({
          levelStars: {
            ...state.levelStars,
            [index]: Math.max(state.levelStars[index] ?? 0, stars),
          },
        })),
      setBriefingSeen: (index) =>
        set((state) => ({
          briefingsSeen: { ...state.briefingsSeen, [index]: true },
        })),
      reset: () => set({ levelWins: {}, levelCodes: {}, levelStars: {}, briefingsSeen: {} }),
    }),
    {
      name: 'spaceway-progress',
    }
  )
)
