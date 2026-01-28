const getUnsplashUrl = (id, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=90`;

const GALLERY_SET_A = [
  getUnsplashUrl("1502672260266-1c1ef2d93688"),
  getUnsplashUrl("1484154218962-a197022b5858"),
  getUnsplashUrl("1522770179533-24471fcdba45"),
  getUnsplashUrl("1493809842364-78817add7ffb"),
];

const GALLERY_SET_B = [
  getUnsplashUrl("1560448204-e02f11c3d0e2"),
  getUnsplashUrl("1512918728675-ed5a9ecdebfd"),
  getUnsplashUrl("1502005229762-cf1b2da7c5d6"),
  getUnsplashUrl("1522708323590-d24dbb6b0267"),
];

const createUnits = (floorNum) => [
  {
    id: floorNum * 100 + 1,
    title: `Unit ${floorNum}01`,
    type: "Corner Suite",
    available: true,
    sqft: 1136,
    beds: 3,
    baths: 2,
    polygon: [
      [577, 181],
      [844, 181],
      [844, 405],
      [577, 405],
    ],
    description: `Premium corner unit on the ${floorNum} floor.`,
    img: getUnsplashUrl("1502672260266-1c1ef2d93688", 600),
    gallery: GALLERY_SET_A,
  },
  {
    id: floorNum * 100 + 2,
    title: `Unit ${floorNum}02`,
    type: "Standard Suite",
    available: floorNum % 2 === 0,
    sqft: 950,
    beds: 2,
    baths: 1,
    polygon: [
      [292, 652],
      [546, 652],
      [546, 883],
      [292, 883],
    ],
    description: "Modern open-concept living space.",
    img: getUnsplashUrl("1560448204-e02f11c3d0e2", 600),
    gallery: GALLERY_SET_B,
  },
  {
    id: floorNum * 100 + 6,
    title: `Unit ${floorNum}06`,
    type: "Studio",
    available: true,
    sqft: 650,
    beds: 1,
    baths: 1,
    polygon: [
      [598, 1526],
      [846, 1526],
      [846, 1832],
      [598, 1832],
    ],
    description: "Efficient layout with high-end finishes.",
    img: getUnsplashUrl("1493809842364-78817add7ffb", 600),
    gallery: GALLERY_SET_A,
  },
];

export const BUILDING_CONFIG = {
  width: 3840,
  height: 2160,
  url: "/assets/building.jpg",
  floors: [
    {
      id: "floor-1",
      name: "1st Floor",
      polygon: [
        [300, 808],
        [514, 808],
        [529, 3132],
        [300, 3132],
      ],
      config: { width: 2273, height: 1146, url: "/assets/floorplan.svg" },
      vrTours: [
        {
          id: "vt1-1",
          label: "Suite 210",
          position: [560, 1200],
          url: "https://www.solutioneers.dev/tours/1804/210/index.html",
        },
        {
          id: "vt1-2",
          label: "Suite 216",
          position: [400, 1000],
          url: "https://www.solutioneers.dev/tours/1804/216/index.html",
        },
      ],
      units: createUnits(1),
    },
    {
      id: "floor-2",
      name: "2nd Floor",
      polygon: [
        [514, 808],
        [627, 807],
        [732, 3134],
        [529, 3132],
      ],
      config: { width: 2273, height: 1146, url: "/assets/floorplan.svg" },
      vrTours: [
        {
          id: "vt2-1",
          label: "Suite 219",
          position: [560, 1100],
          url: "https://www.solutioneers.dev/tours/1804/219/index.html",
        },
        {
          id: "vt2-2",
          label: "Suite 222",
          position: [400, 1300],
          url: "https://www.solutioneers.dev/tours/1804/222/index.html",
        },
      ],
      units: createUnits(2),
    },
    {
      id: "floor-3",
      name: "3rd Floor",
      polygon: [
        [732, 808],
        [627, 807],
        [732, 3134],
        [921, 3134],
      ],
      config: { width: 2273, height: 1146, url: "/assets/floorplan.svg" },
      vrTours: [
        {
          id: "vt3-1",
          label: "Suite 226",
          position: [560, 950],
          url: "https://www.solutioneers.dev/tours/1804/226/index.html",
        },
        {
          id: "vt3-2",
          label: "1 Bedroom Suite",
          position: [400, 1500],
          url: "https://www.solutioneers.dev/tours/1814/1_bdrm_suite/index.html",
        },
      ],
      units: createUnits(3),
    },
    {
      id: "floor-4",
      name: "4th Floor",
      polygon: [
        [836, 807],
        [732, 808],
        [921, 3134],
        [1113, 3135],
      ],
      config: { width: 2273, height: 1146, url: "/assets/floorplan.svg" },
      vrTours: [
        {
          id: "vt4-1",
          label: "Suite 210",
          position: [560, 1150],
          url: "https://www.solutioneers.dev/tours/1804/210/index.html",
        },
      ],
      units: createUnits(4),
    },
    {
      id: "floor-5",
      name: "5th Floor",
      polygon: [
        [943, 808],
        [836, 807],
        [1113, 3135],
        [1191, 3149],
        [1202, 3148],
        [1198, 3114],
        [1299, 3117],
      ],
      config: { width: 2273, height: 1146, url: "/assets/floorplan.svg" },
      vrTours: [
        {
          id: "vt5-1",
          label: "Suite 219",
          position: [560, 1250],
          url: "https://www.solutioneers.dev/tours/1804/219/index.html",
        },
      ],
      units: createUnits(5),
    },
    {
      id: "floor-6",
      name: "6th Floor",
      polygon: [
        [943, 808],
        [956, 808],
        [967, 877],
        [1055, 875],
        [1424, 2947],
        [1351, 2957],
        [1378, 3119],
        [1299, 3117],
      ],
      config: { width: 2273, height: 1146, url: "/assets/floorplan.svg" },
      vrTours: [
        {
          id: "vt6-1",
          label: "Suite 222",
          position: [560, 1050],
          url: "https://www.solutioneers.dev/tours/1804/222/index.html",
        },
      ],
      units: createUnits(6),
    },
    {
      id: "floor-7",
      name: "7th Floor",
      polygon: [
        [1075, 876],
        [1055, 875],
        [1419, 2918],
        [1658, 2882],
        [1490, 2168],
        [1204, 948],
        [1197, 947],
        [1191, 957],
        [1125, 958],
        [1111, 900],
        [1079, 900],
      ],
      config: { width: 2273, height: 1146, url: "/assets/floorplan.svg" },
      vrTours: [
        {
          id: "vt7-1",
          label: "1 Bedroom Suite",
          position: [560, 1100],
          url: "https://www.solutioneers.dev/tours/1814/1_bdrm_suite/index.html",
        },
      ],
      units: createUnits(7),
    },
  ],
};
