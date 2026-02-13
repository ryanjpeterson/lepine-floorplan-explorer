import React from "react";
import { ReactSVG } from "react-svg";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Unit, FloorConfig } from "../types/building";

interface UnitMapProps {
  config: FloorConfig;
  units: Unit[];
  activeId: string | undefined;
  onSelect: (unit: Unit) => void;
}

export default function UnitMap({
  config,
  units,
  activeId,
  onSelect,
}: UnitMapProps) {
  // Constants for your 2560x1280 resolution
  const SVG_WIDTH = 2560;
  const SVG_HEIGHT = 1280;

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      <TransformWrapper
        initialScale={1}
        minScale={0.1} // Allows zooming out far enough to see everything
        maxScale={4}
        centerOnInit={true}
        centerZoomedOut={true}
        limitToBounds={false} // Prevents "clipping" when panning near edges
        doubleClick={{ disabled: true }} // Prevents accidental zooms
      >
        {({ zoomIn, zoomOut, resetTransform }: any) => (
          <>
            {/* Control Overlay */}
            <div className="absolute bottom-8 right-8 z-50 flex flex-col gap-2">
              <button onClick={() => zoomIn()} className="w-10 h-10 bg-slate-800/90 backdrop-blur text-white rounded-lg border border-slate-700 hover:bg-slate-700 transition-all font-bold shadow-xl">+</button>
              <button onClick={() => zoomOut()} className="w-10 h-10 bg-slate-800/90 backdrop-blur text-white rounded-lg border border-slate-700 hover:bg-slate-700 transition-all font-bold shadow-xl">−</button>
              <button onClick={() => resetTransform()} className="w-10 h-10 bg-slate-800/90 backdrop-blur text-white rounded-lg border border-slate-700 hover:bg-slate-700 transition-all shadow-xl">⟲</button>
            </div>

            <TransformComponent 
              wrapperClass="!w-full !h-full" 
              contentClass="flex items-center justify-center"
            >
              {/* This inner div ensures the SVG retains its 2:1 aspect ratio without clipping */}
              <div className="p-20" style={{ width: SVG_WIDTH, height: SVG_HEIGHT }}>
                <ReactSVG
                  src={config.url}
                  className="floorplan-svg-root"
                  beforeInjection={(svg) => {
                    // Set explicit sizing for the 2560x1280 space
                    svg.setAttribute('width', '100%');
                    svg.setAttribute('height', '100%');
                    svg.setAttribute('viewBox', `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`);
                    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                    
                    units.forEach(unit => {
                      const element = svg.querySelector(
                        `[id="${unit.id}"], [data-name="${unit.id}"], [id="_${unit.id}"]`
                      );
                      
                      if (element) {
                        element.classList.add('unit-interactive');
                        if (unit.id === activeId) element.classList.add('unit-active');
                        
                        element.addEventListener('click', (e) => {
                          e.stopPropagation();
                          onSelect(unit);
                        });
                      }
                    });
                  }}
                />
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}