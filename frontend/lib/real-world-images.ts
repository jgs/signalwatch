export type RealWorldImage = {
  id: string;
  title: string;
  context: string;
  imageUrl: string;
  sourceUrl: string;
  sourceLabel: string;
};

export const REAL_WORLD_IMAGES: RealWorldImage[] = [
  {
    id: "low-light-hallway",
    title: "Low-light indoor route",
    context: "Lighting changes can make vision systems less reliable even when the scene is ordinary.",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Hallway_in_low-light.jpg?width=900",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Hallway_in_low-light.jpg",
    sourceLabel: "Wikimedia Commons / Hallway in low-light",
  },
  {
    id: "cctv-camera",
    title: "Real monitoring camera",
    context: "Operational AI systems often depend on imperfect camera feeds and deployment conditions.",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Outdoor_cctv_(Unsplash).jpg?width=900",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Outdoor_cctv_(Unsplash).jpg",
    sourceLabel: "Wikimedia Commons / Outdoor CCTV",
  },
  {
    id: "motion-blur",
    title: "Motion blur in a real scene",
    context: "Movement can hide object boundaries and create unstable detections across frames.",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Via_dell%27Abbondanza_(Pompeii)_with_blurred_tourists,_2016.jpg?width=900",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Via_dell%27Abbondanza_(Pompeii)_with_blurred_tourists,_2016.jpg",
    sourceLabel: "Wikimedia Commons / blurred tourists in Pompeii",
  },
  {
    id: "control-room",
    title: "Human monitoring context",
    context: "Observability tools are useful because humans need clear evidence, not hidden model state.",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Ian_Berry_install_CCTV_Control_Room.jpg?width=900",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ian_Berry_install_CCTV_Control_Room.jpg",
    sourceLabel: "Wikimedia Commons / CCTV control room",
  },
];
