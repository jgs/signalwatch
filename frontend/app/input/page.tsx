import type { Metadata } from "next";
import { InputExperience } from "@/components/portfolio/input/input-experience";
import "./input.css";

export const metadata: Metadata = {
  title: "You're the input / Experiment",
  description: "Explore Anxo Fandino's projects using hand gestures or mouse and keyboard. Camera tracking runs in your browser.",
};

export default function InputExperimentPage() { return <InputExperience />; }
