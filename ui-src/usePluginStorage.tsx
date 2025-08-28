import { useEffect } from "react";
import { PLANETS } from "./planets";
import { PlanetViewer } from "./planetViewer";
import { PlanetState, PlanetAction } from "./planetStateReducer";

const usePluginStorage = (
  planetState: PlanetState, 
  planetStateDispatch: (action: PlanetAction) => void,
  viewerRef: React.RefObject<PlanetViewer | null>, 
  buttonRefs: React.RefObject<Record<keyof typeof PLANETS, HTMLButtonElement | null>>
) => {
  // Load on mount
  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: "load-storage", key: "cache" } }, "*");
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;
      if (msg.type === "storage-loaded" && msg.key === "cache" && msg.value) {
        planetStateDispatch({
          type: "HYDRATE_STATE", 
          state: msg.value
        });

        if (msg.value.planet && buttonRefs.current) {
          setTimeout(() => {
            (buttonRefs.current as Record<keyof typeof PLANETS, HTMLButtonElement>)[msg.value.planet]
              .scrollIntoView({ behavior: "smooth", block: "center" });
          }, 0);
        }
        viewerRef.current?.setZoomLevel(msg.value.zoom);
      }
    };
  }, []);

  // Save whenever state changes
  useEffect(() => {
    parent.postMessage({
      pluginMessage: { type: "save-storage", key: "cache", value: planetState },
    }, "*");
  }, [planetState]);
};

export default usePluginStorage;