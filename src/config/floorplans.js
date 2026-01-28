// Helper to generate consistent unit data across floors
function generateFloor(floorNum, name, buildingCoords) {
  const [y1, x1, y2, x2] = buildingCoords;

  return {
    id: `floor-${floorNum}`,
    name: name,
    // Hotspot on the building.jpg
    polygon: [
      [y1, x1],
      [y1, x2],
      [y2, x2],
      [y2, x1],
    ],
    config: {
      width: 2273,
      height: 1146,
      url: "/assets/floorplan.svg",
    },
    units: [
      {
        id: floorNum * 100 + 1,
        title: `Unit ${floorNum}01`,
        type: "Corner Suite",
        available: true,
        sqft: 1136,
        beds: 3,
        baths: 2,
        polygon: [
          [843, 181],
          [843, 405],
          [575, 405],
          [575, 181],
        ],
        description: `Premium corner unit on the ${name} with expansive views.`,
        img: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=600&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=90",
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=90",
        ],
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
          [548, 1366],
          [548, 1593],
          [300, 1593],
          [300, 1366],
        ],
        description: "Modern open-concept living in the heart of the building.",
        img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=90",
        ],
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
          [422, 770],
          [422, 900],
          [300, 900],
          [300, 770],
        ],
        description: "Efficient studio layout with high-end finishes.",
        img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=90",
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=90",
        ],
      },
    ],
  };
}

export const BUILDING_CONFIG = {
  width: 3840,
  height: 2160,
  url: "/assets/building.jpg", // The image provided in the root
  floors: [
    generateFloor(2, "2nd Floor", [400, 500, 600, 1500]),
    generateFloor(3, "3rd Floor", [600, 500, 800, 1500]),
    generateFloor(4, "4th Floor", [800, 500, 1000, 1500]),
    generateFloor(5, "5th Floor", [1000, 500, 1200, 1500]),
  ],
};
