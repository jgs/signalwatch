export type RealWorldImage = {
  id: string;
  title: string;
  context: string;
  condition: string;
  imageUrl: string;
  sourceUrl: string;
  sourceLabel: string;
};

export const REAL_WORLD_IMAGES: RealWorldImage[] = [
  {
    id: "low-light-hallway",
    title: "Low-light route trace",
    context: "Lighting changes can make vision systems less reliable even when the scene is ordinary.",
    condition: "low light",
    imageUrl: "/visual-context/low-light-hallway.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Hallway_in_low-light.jpg",
    sourceLabel: "Wikimedia Commons derivative / SIGNALWATCH grade",
  },
  {
    id: "cctv-camera",
    title: "Camera placement boundary",
    context: "Operational AI systems often depend on imperfect camera feeds and deployment conditions.",
    condition: "camera placement",
    imageUrl: "/visual-context/outdoor-cctv.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Outdoor_cctv_(Unsplash).jpg",
    sourceLabel: "Wikimedia Commons derivative / SIGNALWATCH grade",
  },
  {
    id: "motion-blur",
    title: "Temporal motion trace",
    context: "Movement can hide object boundaries and create unstable detections across frames.",
    condition: "motion blur",
    imageUrl: "/visual-context/motion-blur.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Motion_blur_(1325070316).jpg",
    sourceLabel: "Wikimedia Commons derivative / SIGNALWATCH grade",
  },
  {
    id: "control-room",
    title: "Human monitoring context",
    context: "Observability tools are useful because humans need clear evidence, not hidden model state.",
    condition: "monitoring",
    imageUrl: "/visual-context/cctv-control-room.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ian_Berry_install_CCTV_Control_Room.jpg",
    sourceLabel: "Wikimedia Commons derivative / SIGNALWATCH grade",
  },
  {
    id: "thermal-camera",
    title: "Sensor calibration boundary",
    context: "Different sensors expose different failure surfaces, calibration needs, and operational blind spots.",
    condition: "sensor boundary",
    imageUrl: "/visual-context/thermal-camera.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Thermal_camera.jpg",
    sourceLabel: "Wikimedia Commons derivative / SIGNALWATCH grade",
  },
  {
    id: "camera-cluster",
    title: "Coverage mesh deployment",
    context: "Coverage, angle, mounting, and maintenance shape what an observability system can actually know.",
    condition: "coverage",
    imageUrl: "/visual-context/cctv-security-cameras.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:CCTV_Security_cameras.jpg",
    sourceLabel: "Wikimedia Commons derivative / SIGNALWATCH grade",
  },
];
