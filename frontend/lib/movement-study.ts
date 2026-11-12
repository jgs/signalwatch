export type Exercise = "squat" | "deadlift" | "bench";
export type BodyView = "front" | "back";
export type MuscleGroup = "quads" | "glutes" | "hamstrings" | "abs" | "obliques" | "lower_back" | "lats" | "upper_back" | "forearms" | "chest" | "triceps" | "shoulders";
export type MuscleRole = { group: MuscleGroup; role: "Movement" | "Support"; note: string; frontOnly?: boolean };

export const muscleNames: Record<MuscleGroup, string> = {
  quads: "Quadriceps", glutes: "Glutes", hamstrings: "Hamstrings",
  abs: "Abdominals", obliques: "Obliques", lower_back: "Spinal erectors",
  lats: "Latissimus dorsi", upper_back: "Upper back", forearms: "Forearms",
  chest: "Pectorals", triceps: "Triceps", shoulders: "Anterior deltoids",
};

export const movementStudies: Record<Exercise, {
  label: string; pattern: string; summary: string; source: string; sourceTitle: string; muscles: MuscleRole[];
}> = {
  squat: {
    label: "Squat", pattern: "Knee + hip extension",
    summary: "The quadriceps extend the knees; the glutes help extend the hips. Other muscles contribute to movement and stability.",
    source: "https://www.nasm.org/resource-center/blog/training/biomechanics-of-the-squat",
    sourceTitle: "NASM / Squat biomechanics",
    muscles: [
      { group: "quads", role: "Movement", note: "Extend the knees as the body rises." },
      { group: "glutes", role: "Movement", note: "Contribute to hip extension during the ascent." },
      { group: "hamstrings", role: "Movement", note: "Assist hip extension; their contribution depends on the movement." },
      { group: "abs", role: "Support", note: "Part of the trunk musculature that helps maintain spinal stability." },
      { group: "obliques", role: "Support", note: "Help resist unwanted trunk movement under load." },
      { group: "lower_back", role: "Support", note: "Spinal erectors contribute to trunk stability." },
    ],
  },
  deadlift: {
    label: "Deadlift", pattern: "Hip hinge + knee extension",
    summary: "Glutes and hamstrings contribute to hip extension, while the quadriceps assist the lift from the floor. The back and grip also provide support.",
    source: "https://www.nasm.org/resource-center/exercise-library/barbell-deadlift",
    sourceTitle: "NASM / Barbell deadlift",
    muscles: [
      { group: "glutes", role: "Movement", note: "Contribute to extending the hips during the lift." },
      { group: "hamstrings", role: "Movement", note: "Assist hip extension and control of the movement." },
      { group: "quads", role: "Movement", note: "Assist knee extension, including the pull from the floor." },
      { group: "lower_back", role: "Support", note: "Spinal erectors help maintain trunk position." },
      { group: "lats", role: "Support", note: "Contribute to controlling the bar and upper-body position." },
      { group: "upper_back", role: "Support", note: "The trapezius and other upper-back muscles support the loaded position." },
      { group: "forearms", role: "Support", note: "Grip musculature helps maintain the hold on the bar." },
    ],
  },
  bench: {
    label: "Bench press", pattern: "Press + elbow extension",
    summary: "The pectorals contribute to the pressing motion and the triceps extend the elbows. Anterior deltoids and trunk musculature also contribute.",
    source: "https://www.nasm.org/resource-center/exercise-library/barbell-bench-press",
    sourceTitle: "NASM / Barbell bench press",
    muscles: [
      { group: "chest", role: "Movement", note: "Pectoralis major contributes to bringing the upper arms across the torso." },
      { group: "triceps", role: "Movement", note: "Extend the elbows during the press." },
      { group: "shoulders", role: "Movement", frontOnly: true, note: "The anterior deltoids assist the pressing motion. Only the front shoulder region is highlighted." },
      { group: "abs", role: "Support", note: "Core musculature contributes to stability during the press." },
    ],
  },
};
