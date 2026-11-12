"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, RotateCw } from "lucide-react";
import { movementStudies, muscleNames, type BodyView, type Exercise, type MuscleGroup } from "@/lib/movement-study";

const AnatomyMap = dynamic(() => import("./anatomy-map"), {
  ssr: false,
  loading: () => <div className="pf-anatomy-loading" role="status">Loading anatomy illustration</div>,
});

class AnatomyBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <p className="pf-anatomy-loading" role="status">Illustration unavailable. The muscle guide and sources remain available.</p>
      : this.props.children;
  }
}

export function MovementStudy() {
  const [exercise, setExercise] = useState<Exercise>("squat");
  const [view, setView] = useState<BodyView>("front");
  const [selected, setSelected] = useState<MuscleGroup | null>("quads");
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const study = movementStudies[exercise];
  const muscle = study.muscles.find(item => item.group === selected);

  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: "200px" });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  function chooseExercise(next: Exercise) {
    setExercise(next);
    setSelected(movementStudies[next].muscles[0].group);
    setView(next === "deadlift" ? "back" : "front");
  }

  function chooseMuscle(group: MuscleGroup) {
    setSelected(group);
    const posterior: MuscleGroup[] = ["glutes", "hamstrings", "lower_back", "lats", "upper_back", "triceps"];
    setView(posterior.includes(group) ? "back" : "front");
  }

  return (
    <section className="pf-movement" ref={root} aria-label="Interactive movement study">
      <div className="pf-movement-heading">
        <span>Movement study</span>
        <span>Educational anatomy / interactive illustration</span>
      </div>
      <div className="pf-movement-toolbar">
        <div className="pf-anatomy-controls" role="group" aria-label="Anatomy view">
          {(["front", "back"] as const).map(side => (
            <button key={side} aria-pressed={view === side} onClick={() => setView(side)}>
              {side === "front" ? "Front" : "Back"}
            </button>
          ))}
        </div>
        <div className="pf-exercise-switch" role="group" aria-label="Choose exercise">
          {(Object.keys(movementStudies) as Exercise[]).map(key => (
            <button key={key} aria-pressed={exercise === key} onClick={() => chooseExercise(key)}>{movementStudies[key].label}</button>
          ))}
        </div>
      </div>
      <div className="pf-movement-layout">
        <div className="pf-anatomy-stage">
          <div className="pf-anatomy-body" role="img" aria-label={`${view === "front" ? "Front" : "Back"} anatomy illustration highlighting muscle groups involved in ${study.label.toLowerCase()}. Equivalent muscle selections are listed alongside.`}>
            {visible ? <AnatomyBoundary><AnatomyMap view={view} muscles={study.muscles} selected={selected} onSelect={chooseMuscle} /></AnatomyBoundary> : null}
          </div>
          <span className="pf-anatomy-caption"><RotateCw size={13} aria-hidden="true" /> {view === "front" ? "Anterior" : "Posterior"} view</span>
        </div>
        <div className="pf-movement-copy">
          <h3>Under the surface.</h3>
          <p>A small exploration of the movement behind my computer vision projects.</p>
          <div className="pf-movement-summary" aria-live="polite" aria-atomic="true">
            <span className="pf-movement-pattern">{study.pattern}</span>
            <p>{study.summary}</p>
          </div>
          <div className="pf-muscle-list" role="group" aria-label={`Muscles involved in ${study.label.toLowerCase()}`}>
            {study.muscles.map(item => (
              <button key={item.group} aria-pressed={selected === item.group} onClick={() => chooseMuscle(item.group)}>
                <span><i className={`pf-role-${item.role.toLowerCase()}`} aria-hidden="true" />{muscleNames[item.group]}</span><span>{item.role}</span>
              </button>
            ))}
          </div>
          <div className="pf-muscle-detail" aria-live="polite" aria-atomic="true">
            <strong>{muscle ? muscleNames[muscle.group] : "Muscle guide"}</strong>
            <p>{muscle?.note ?? "Select a muscle group to read its role."}</p>
          </div>
          <p className="pf-movement-boundary">A simplified guide, not measured activation. Technique and anatomy change muscle contribution. Unhighlighted muscles may also participate.</p>
          <div className="pf-movement-links">
            <a href={study.source} target="_blank" rel="noopener noreferrer">{study.sourceTitle}<ArrowUpRight size={13} /></a>
            <Link href="/work/squat-judge">Explore the project<ArrowUpRight size={13} /></Link>
          </div>
        </div>
      </div>
      <div className="pf-anatomy-credit"><a href="https://github.com/crmapache/js-rich-body-highlighter" target="_blank" rel="noopener noreferrer">Anatomy illustration &amp; mapping: js-rich-body-highlighter / MIT</a></div>
    </section>
  );
}
