import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameStore {
  levelWins: Record<number, boolean>
  levelCodes: Record<number, string>
  setWin: (index: number) => void
  setCode: (index: number, code: string) => void
  reset: () => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      levelWins: {},
      levelCodes: {},
      setWin: (index) =>
        set((state) => ({
          levelWins: { ...state.levelWins, [index]: true },
        })),
      setCode: (index, code) =>
        set((state) => ({
          levelCodes: { ...state.levelCodes, [index]: code },
        })),
      reset: () => set({ levelWins: {}, levelCodes: {} }),
    }),
    {
      name: 'codequest-progress',
    }
  )
)