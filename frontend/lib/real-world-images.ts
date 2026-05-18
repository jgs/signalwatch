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
    title: "Low-light indoor route",
    context: "Lighting changes can make vision systems less reliable even when the scene is ordinary.",
    condition: "low light",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Hallway_in_low-light.jpg?width=900",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Hallway_in_low-light.jpg",
    sourceLabel: "Wikimedia Commons / Hallway in low-light",
  },
  {
    id: "cctv-camera",
    title: "Real monitoring camera",
    context: "Operational AI systems often depend on imperfect camera feeds and deployment conditions.",
    condition: "camera placement",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Outdoor_cctv_(Unsplash).jpg?width=900",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Outdoor_cctv_(Unsplash).jpg",
    sourceLabel: "Wikimedia Commons / Outdoor CCTV",
  },
  {
    id: "motion-blur",
    title: "Motion blur in a real scene",
    context: "Movement can hide object boundaries and create unstable detections across frames.",
    condition: "motion blur",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Motion_blur_(1325070316).jpg?width=900",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Motion_blur_(1325070316).jpg",
    sourceLabel: "Wikimedia Commons / Motion blur",
  },
  {
    id: "control-room",
    title: "Human monitoring context",
    context: "Observability tools are useful because humans need clear evidence, not hidden model state.",
    condition: "monitoring",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Ian_Berry_install_CCTV_Control_Room.jpg?width=900",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ian_Berry_install_CCTV_Control_Room.jpg",
    sourceLabel: "Wikimedia Commons / CCTV control room",
  },
  {
    id: "thermal-camera",
    title: "Specialized sensing hardware",
    context: "Different sensors expose different failure surfaces, calibration needs, and operational blind spots.",
    condition: "sensor boundary",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Thermal_camera.jpg?width=900",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Thermal_camera.jpg",
    sourceLabel: "Wikimedia Commons / Thermal camera",
  },
  {
    id: "camera-cluster",
    title: "Multiple camera deployment",
    context: "Coverage, angle, mounting, and maintenance shape what an observability system can actually know.",
    condition: "coverage",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/CCTV_Security_cameras.jpg?width=900",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:CCTV_Security_cameras.jpg",
    sourceLabel: "Wikimedia Commons / CCTV security cameras",
  },
];
