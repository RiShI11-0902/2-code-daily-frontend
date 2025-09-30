import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const questionPackStore = (set) => ({
  answers: [], // { questionId, userAnswer }

  // Add or update answer
  saveAnswer: (data) =>
    set((state) => {
      const exists = state.answers.findIndex((a) => a.questionId === data.questionId);
      if (exists >= 0) {
        const updated = [...state.answers];
        updated[exists] = data;
        return { answers: updated };
      }
      return { answers: [...state.answers, data] };
    }),

  // Clear all answers
  clearAnswers: () => set({ answers: [] }),
});

const useQuestionStore = create(
  devtools(
    persist(questionPackStore, {
      name: "answers", // localStorage key for answers
      partialize: (state) => ({ answers: state.answers }), // persist only answers
    })
  )
);

export default useQuestionStore;
