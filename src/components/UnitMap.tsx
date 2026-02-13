import React, { useEffect } from "react";
import { ReactSVG } from "react-svg";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { Unit, FloorConfig } from "../types/building";

interface UnitMapProps {
  config: FloorConfig;
  units: Unit[];
  activeId: string | undefined;
  onSelect: (unit: Unit) => void;
}

/**
 * Internal component to handle auto-centering when the window resizes 
 * or the floor changes. Using centerView prevents the "jump" often 
 * associated with resetTransform when using a custom initial scale.
 */
const ResizeHandler = ({ config }: { config: FloorConfig }) => {
  const { centerView } = useControls();

  useEffect(() => {
    const handleResize = () => {
      const timeoutId = setTimeout(() => {
        // Keeps scale at 2 and re-centers based on current viewport
        centerView(2, 200); 
      }, 100);
      return () => clearTimeout(timeoutId);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); 

    return () => window.removeEventListener("resize", handleResize);
  }, [centerView, config.url]);

  return null;
};

export default function UnitMap({
  config,
  units,
  activeId,
  onSelect,
}: UnitMapProps) {
  // Dimensions pulled from building.json
  const { width: SVG_WIDTH, height: SVG_HEIGHT } = config;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <TransformWrapper
        key={config.url}
        initialScale={1}
        minScale={1}
        maxScale={4}
        centerOnInit={true}
        centerZoomedOut={true}
        limitToBounds={false}
        doubleClick={{ disabled: true }}
        alignmentAnimation={{ disabled: false, sizeX: 0.1, sizeY: 0.1 }}
      >
        {(utils) => (
          <>
            <ResizeHandler config={config} />
            
            {/* Map Controls */}
            <div className="absolute bottom-8 right-8 z-50 flex flex-col gap-2">
              <button 
                onClick={() => utils.zoomIn()} 
                className="w-10 h-10 bg-slate-800/90 backdrop-blur text-white rounded-lg border border-slate-700 hover:bg-slate-700 transition-all font-bold shadow-xl"
              >
                +
              </button>
              <button 
                onClick={() => utils.zoomOut()} 
                className="w-10 h-10 bg-slate-800/90 backdrop-blur text-white rounded-lg border border-slate-700 hover:bg-slate-700 transition-all font-bold shadow-xl"
              >
                −
              </button>
              <button 
                onClick={() => utils.centerView(2, 200)} 
                className="w-10 h-10 bg-slate-800/90 backdrop-blur text-white rounded-lg border border-slate-700 hover:bg-slate-700 transition-all shadow-xl"
              >
                ⟲
              </button>
            </div>

            <TransformComponent 
              wrapperClass="!w-full !h-full" 
              contentClass="w-full h-full"
            >
              {/* Removing flex centering from contentClass and setting explicit 
                pixel dimensions prevents the "bottom-right jump" bug.
              */}
              <div 
                className="pointer-events-none"
                style={{ 
                  width: `${SVG_WIDTH}px`,
                  height: `${SVG_HEIGHT}px`,
                }}
              >
                <ReactSVG
                  src={config.url}
                  className="floorplan-svg-root pointer-events-auto"
                  beforeInjection={(svg) => {
                    svg.setAttribute('width', '100%');
                    svg.setAttribute('height', '100%');
                    svg.setAttribute('viewBox', `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`);
                    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                    
                    units.forEach(unit => {
                      // Supports multiple ID formats commonly found in exported SVGs
                      const element = svg.querySelector(
                        `[id="${unit.id}"], [data-name="${unit.id}"], [id="_${unit.id}"]`
                      );
                      
                      if (element) {
                        element.classList.add('unit-interactive');
                        if (unit.id === activeId) {
                          element.classList.add('unit-active');
                        }
                        
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