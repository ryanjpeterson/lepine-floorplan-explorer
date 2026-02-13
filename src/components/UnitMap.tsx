import React, { useEffect, useCallback } from "react";
import { ReactSVG } from "react-svg";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { Unit, FloorConfig } from "../types/building";

interface UnitMapProps {
  config: FloorConfig;
  units: Unit[];
  activeId: string | undefined;
  onSelect: (unit: Unit) => void;
}

const ResizeHandler = ({ config }: { config: FloorConfig }) => {
  const { centerView, instance } = useControls();

  const handleFitView = useCallback((animationMs: number = 200) => {
    const wrapper = instance.wrapperComponent;
    if (!wrapper) return;

    // Use actual container pixels vs SVG data dimensions
    const scaleX = wrapper.offsetWidth / config.width;
    const scaleY = wrapper.offsetHeight / config.height;
    
    // Math.min ensures the entire SVG is visible with no clipping
    const fitScale = Math.min(scaleX, scaleY);

    centerView(fitScale, animationMs);
  }, [centerView, instance, config.width, config.height]);

  useEffect(() => {
    const handleResize = () => {
      const timeoutId = setTimeout(() => handleFitView(200), 50);
      return () => clearTimeout(timeoutId);
    };

    window.addEventListener("resize", handleResize);
    
    // Initial load: 0ms animation to "snap" into place immediately
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
  activeId,
  onSelect,
}: UnitMapProps) {
  const { width: SVG_WIDTH, height: SVG_HEIGHT } = config;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <TransformWrapper
        key={config.url}
        // Lower minScale allows massive 2560px SVGs to fit on 375px mobile screens
        minScale={1} 
        maxScale={4}
        centerOnInit={false} 
        limitToBounds={false}
        doubleClick={{ disabled: true }}
      >
        {(utils) => {
          // Dynamic fit for the manual recenter button
          const manualRecenter = () => {
            const wrapper = utils.instance.wrapperComponent;
            if (wrapper) {
              const scale = Math.min(
                wrapper.offsetWidth / SVG_WIDTH,
                wrapper.offsetHeight / SVG_HEIGHT
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
                  onClick={manualRecenter} 
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
          );
        }}
      </TransformWrapper>
    </div>
  );
}