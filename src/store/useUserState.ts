// src/store/useUserState.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CompletedLesson {
  id: string;
  score: number;
}

interface UserState {
  completedLessons: CompletedLesson[];
  learningTime: number; // in hours
  learningGoal: string;
  currentPageContext: string; // NEW: To track the user's current location/context
  actions: {
    completeLesson: (id: string, score: number, timeSpent: number) => void;
    setLearningGoal: (goal: string) => void;
    setCurrentPageContext: (context: string) => void; // NEW: Action to update context
    resetProgress: () => void;
  }
}

export const useUserState = create<UserState>()(
  persist(
    (set) => ({
      completedLessons: [
        { id: 'physics-101', score: 95 }
      ],
      learningTime: 2.5,
      learningGoal: "Master quantum physics",
      currentPageContext: "Homepage", // Default context
      actions: {
        completeLesson: (id: string, score: number, timeSpent: number) => {
          set(state => ({
            completedLessons: [
              ...state.completedLessons.filter(l => l.id !== id),
              { id, score }
            ],
            learningTime: state.learningTime + timeSpent,
          }))
        },
        setLearningGoal: (goal: string) => set({ learningGoal: goal }),
        setCurrentPageContext: (context: string) => set({ currentPageContext: context }), // NEW
        resetProgress: () => {
          set({
            completedLessons: [],
            learningTime: 0,
            learningGoal: "General Knowledge"
          })
        }
      }
    }),
    {
      name: 'sanjyoti-user-state',
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['actions'].includes(key))
        ),
    }
  )
)

export const useUserActions = () => useUserState((state) => state.actions)