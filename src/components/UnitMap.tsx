/* src/components/UnitMap.tsx */
import React, { useEffect, useCallback } from "react";
import { ReactSVG } from "react-svg";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { Unit, FloorConfig, Amenity } from "../types/building";
import { useBuilding } from "../context/BuildingContext";

interface UnitMapProps {
  config: FloorConfig;
  units: Unit[];
  amenities?: Amenity[];
  activeId: string | undefined;
  onSelect: (unit: Unit) => void;
  onAmenitySelect?: (id: string) => void;
}

const ResizeHandler = ({ config }: { config: FloorConfig }) => {
  const { centerView, instance } = useControls();

  const handleFitView = useCallback((animationMs: number = 200) => {
    const wrapper = instance.wrapperComponent;
    if (!wrapper) return;

    const padding = 48 * 2; 

    const availableWidth = Math.max(wrapper.offsetWidth - padding, 0);
    const availableHeight = Math.max(wrapper.offsetHeight - padding, 0);

    const scaleX = availableWidth / config.width;
    const scaleY = availableHeight / config.height;
    
    const fitScale = Math.min(scaleX, scaleY);

    centerView(fitScale, animationMs);
  }, [centerView, instance, config.width, config.height]);

  useEffect(() => {
    const handleResize = () => {
      const timeoutId = setTimeout(() => handleFitView(200), 50);
      return () => clearTimeout(timeoutId);
    };

    window.addEventListener("resize", handleResize);
    const loadTimeout = setTimeout(() => handleFitView(0), 50);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(loadTimeout);
    };
  }, [handleFitView, config.url]);

  return null;
};
export default function UnitMap({
  config,
  units,
  amenities = [],
  activeId,
  onSelect,
  onAmenitySelect,
}: UnitMapProps) {
  const { width: SVG_WIDTH, height: SVG_HEIGHT } = config;
  const { isDesktop } = useBuilding();


  return (
    <div className="relative w-full h-full overflow-hidden">
      <TransformWrapper
        key={config.url}
        minScale={1} 
        maxScale={4}
        centerOnInit={false} 
        limitToBounds={false}
        doubleClick={{ disabled: true }}
        panning={{ disabled: isDesktop }}
        wheel={{ disabled: false }}
      >
        {(utils) => {
          const handleManualRecenter = () => {
            const wrapper = utils.instance.wrapperComponent;
            if (wrapper) {
              const PADDING_BUFFER = 48 * 2;
              const scale = Math.min(
                (wrapper.offsetWidth - PADDING_BUFFER) / SVG_WIDTH,
                (wrapper.offsetHeight - PADDING_BUFFER) / SVG_HEIGHT
              );
              utils.centerView(scale, 300);
            }
          };

          return (
            <>
              <ResizeHandler config={config} />
              
              <div className="absolute bottom-8 right-8 z-50 flex flex-col gap-2">
                <button 
                  onClick={() => utils.zoomIn()} 
                  className="w-10 h-10 bg-slate-800/90 backdrop-blur text-white rounded-lg border border-slate-700 hover:bg-slate-700 transition-all font-bold shadow-xl"
                > + </button>
                <button 
                  onClick={() => utils.zoomOut()} 
                  className="w-10 h-10 bg-slate-800/90 backdrop-blur text-white rounded-lg border border-slate-700 hover:bg-slate-700 transition-all font-bold shadow-xl"
                > − </button>
                <button 
                  onClick={handleManualRecenter} 
                  className="w-10 h-10 bg-slate-800/90 backdrop-blur text-white rounded-lg border border-slate-700 hover:bg-slate-700 transition-all shadow-xl"
                > ⟲ </button>
              </div>

              <TransformComponent 
                wrapperClass="!w-full !h-full" 
                contentClass="w-full h-full"
              >
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
                      
                      // Inject Residential Units
                      units.forEach(unit => {
                        const element = svg.querySelector(
                          `[id="${unit.id}"], [data-name="${unit.id}"], [id="_${unit.id}"]`
                        ) as SVGElement | null;
                        
                        if (element) {
                          element.removeAttribute('style');
                          element.removeAttribute('fill');

                          const children = element.querySelectorAll('path, polygon, rect, circle');
                            children.forEach(child => {
                              child.removeAttribute('style');
                              child.removeAttribute('fill');
                          });

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

                      // Inject Amenity Icons (Pointer only, no blue fill)
                      amenities.forEach(amenity => {
                        const element = svg.querySelector(
                          `[id="${amenity.id}"], [data-name="${amenity.id}"], [id="_${amenity.id}"]`
                        ) as SVGElement | null;

                        if (element) {
                          element.classList.add('amenity-interactive');
                          element.addEventListener('click', (e) => {
                            e.stopPropagation();
                            onAmenitySelect?.(amenity.id);
                          });
                        }
                      });
                    }}
                  />
                </div>
              </TransformComponent>
            </>
          );
        }}
      </TransformWrapper>
    </div>
  );
}