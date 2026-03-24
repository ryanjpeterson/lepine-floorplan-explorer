/* src/screens/BuildingGallery.tsx */
import React, { useState, useMemo } from "react";
import { useBuilding } from "../context/BuildingContext";
import GalleryModal from "../components/GalleryModal";
import PageShell from "../components/layout/PageShell";
import HomeButton from "../components/navigation/HomeButton";
import ViewToggles from "../components/navigation/ViewToggles";
import { GalleryItem } from "../types/building";

// Define the structure of the refactored buildingGallery JSON
interface CategorizedGallery {
  [key: string]: GalleryItem[];
}

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'exterior', label: 'Exterior' },
  { id: 'unit', label: 'Units' },
  { id: 'lobby', label: 'Lobby' },
  { id: 'rendering', label: 'Renderings' },
  { id: 'amenities', label: 'Amenities' }
];

export default function BuildingGallery() {
  // Cast buildingGallery to our new interface to allow string indexing
  const { buildingGallery, amenitiesData } = useBuilding() as { 
    buildingGallery: CategorizedGallery; 
    amenitiesData: GalleryItem[] 
  };
  
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("exterior");

  // Determine which items to show based on the active category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') {
      // Flatten all categories from the JSON and append amenities
      const allBuildingItems = Object.values(buildingGallery).flat();
      return [...allBuildingItems, ...amenitiesData];
    }
    
    if (activeCategory === 'amenities') {
      return amenitiesData;
    }

    // Access the specific category using the state string
    return buildingGallery[activeCategory] || [];
  }, [activeCategory, buildingGallery, amenitiesData]);

  // Extract images for the modal based ONLY on the filtered items
  const images = useMemo(() => filteredItems.map((item: GalleryItem) => item.image), [filteredItems]);

  const GalleryCard = ({ item, index }: { item: GalleryItem; index: number }) => (
    <div 
      onClick={() => setSelectedImageIndex(index)}
      className="group relative aspect-square lg:aspect-video bg-slate-200 rounded-lg lg:rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
    >
      <img 
        src={item.image} 
        alt={item.label || item.id} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* <div className="absolute inset-0 bg-gradient-to-t from-[#102a43]/80 via-transparent to-transparent opacity-100 flex flex-col justify-end p-3 lg:p-6">
        <p className="text-white font-bold text-sm lg:text-lg">
          {item.label || item.id}
        </p>
      </div> */}
    </div>
  );

  return (
   <>
     <PageShell
      headerLeft={<HomeButton />}
      headerRight={<ViewToggles />}
    >
      <div className="w-full h-full overflow-y-auto p-4 lg:p-8 bg-white/30 backdrop-blur-sm no-scrollbar">
        <div className="max-w-[2400px] mx-auto space-y-6">
          
          {/* Category Toggle Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-2 overflow-x-auto no-scrollbar pb-2 lg:justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                  activeCategory === cat.id 
                    ? "bg-[#102a43] text-white border-[#102a43]" 
                    : "bg-white text-[#102a43] border-slate-200 hover:border-[#102a43]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* iOS Style Grid: 3 columns on mobile, auto-fill on desktop */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fill,minmax(min(100%,400px),1fr))] gap-2 lg:gap-4">
            {filteredItems.map((item: GalleryItem, index: number) => (
              <GalleryCard key={`${item.id}-${index}`} item={item} index={index} />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20 text-slate-500 font-medium">
              No photos available in this category.
            </div>
          )}
        </div>
      </div>
    </PageShell>

    <GalleryModal 
        isOpen={selectedImageIndex !== null}
        images={images}
        initialIndex={selectedImageIndex ?? 0}
        onClose={() => setSelectedImageIndex(null)}
    />
   </>
  );
}