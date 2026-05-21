import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameStore {
  levelWins: Record<number, boolean>
  levelCodes: Record<number, string>
  levelStars: Record<number, number>
  setWin: (index: number) => void
  setCode: (index: number, code: string) => void
  setStars: (index: number, stars: number) => void
  reset: () => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      levelWins: {},
      levelCodes: {},
      levelStars: {},
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
      reset: () => set({ levelWins: {}, levelCodes: {}, levelStars: {} }),
    }),
    {
      name: 'codequest-progress',
    }
  )
)
