export const profile = {
  name: "Anxo Fandi\u00f1o", email: "jgsops@proton.me",
  github: "https://github.com/jgs",
  linkedin: "https://www.linkedin.com/in/anxo-fandi%C3%B1o-65094a217/",
  twitter: "https://x.com/jgsops",
};

export const projects = [
  {
    slug: "squat-judge", number: "01", name: "Squat Judge", category: "Human movement / Computer vision",
    summary: "Looking at movement. Understanding the mechanics.",
    description: "A final project exploring squat analysis through pose estimation, joint angles, and sequence classification.",
    stack: ["Python", "YOLOv8 Pose", "TensorFlow / LSTM", "Streamlit"],
    repo: "https://github.com/jgs/Squat-Judge", image: null, poster: null, imageAlt: "",
    mediaLabel: "Project architecture / illustrated overview",
    question: "How can a camera help make the mechanics of a squat easier to inspect?",
    approach: "The repository combines pose estimation with joint-angle geometry and a sequence model. A Streamlit interface brings the analysis together, with a separate live demo and voice controls documented in the project.",
    boundary: "An experimental assistive project. Performance has not been independently validated here, and the analysis does not replace professional assessment.",
    steps: ["Video / webcam", "Pose estimation", "Sequence classification", "Visual / audio feedback"], action: null,
  },
  {
    slug: "barpath-ai", number: "02", name: "BarPath AI", category: "Computer vision / Video analysis",
    summary: "Every lift leaves a path.",
    description: "Tracking barbell trajectories from training footage, with annotated video exports for review.",
    stack: ["Python", "OpenCV", "Streamlit", "Video processing"],
    repo: "https://github.com/jgs/barpath-ai",
    image: "https://raw.githubusercontent.com/jgs/barpath-ai/main/assets/demo/squat-demo.gif",
    poster: "/portfolio/barpath-poster.png",
    imageAlt: "Squat tracking demonstration published in the BarPath AI repository",
    mediaLabel: "Recorded project demo / from the repository",
    question: "What can the path of a barbell tell us about a lift?",
    approach: "Video frames pass through an OpenCV detector and centroid smoothing before the app draws the bar path. The repository also documents repetition counting, pixel-based velocity, and an optional adapter for custom YOLO weights.",
    boundary: "The default detector is an OpenCV baseline. Velocity is measured in pixels per second; calibrated physical velocity is listed as future work in the repository.",
    steps: ["Training footage", "Barbell detection", "Trajectory smoothing", "Annotated export"], action: null,
  },
  {
    slug: "signalwatch", number: "03", name: "SIGNALWATCH", category: "Systems / Observability",
    summary: "Making system behavior inspectable.",
    description: "Source monitoring, runtime visibility, and a browser-based perception lab, brought together in one operational interface.",
    stack: ["Next.js", "FastAPI", "WebSockets", "TensorFlow.js"],
    repo: "https://github.com/jgs/signalwatch",
    image: "/visual-context/ai-infrastructure-context.png",
    poster: null,
    imageAlt: "Generated infrastructure illustration used by the SIGNALWATCH project",
    mediaLabel: "Project artwork / generated visual context",
    question: "How do we make the evidence behind an intelligent system easier to inspect?",
    approach: "The frontend separates source-backed updates from runtime events. The perception lab runs COCO-SSD in the browser and records actual outputs under input degradation. Source trails and explicit unavailable states form the core of the project.",
    boundary: "Live data depends on the configured backend and collectors. The lab depends on the browser model loading successfully. Illustrative artwork is not a system measurement.",
    steps: ["Source ingestion", "Runtime events", "Evidence ledger", "Perception lab"],
    action: { href: "/signalwatch", label: "Explore SIGNALWATCH" },
  },
] as const;

export type PortfolioProject = (typeof projects)[number];
