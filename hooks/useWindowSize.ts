import { useEffect, useState } from "react";

export function useWindowSize() {
  let [viewport, setViewport] = useState<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  let updateViewport = () => {
    let { innerWidth: width, innerHeight: height } = window;
    setViewport({ width, height });
  };

  useEffect(() => {
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => {
      window.addEventListener("resize", updateViewport);
    };
  }, []);

  return viewport;
}
