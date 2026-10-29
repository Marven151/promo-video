import { loadFont } from "@remotion/fonts";
import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

export const DISPLAY = "Archivo";
export const SERIF = "Instrument Serif";

const ready = Promise.all([
  loadFont({
    family: DISPLAY,
    url: staticFile("fonts/Archivo-Variable.woff2"),
    weight: "100 900",
    stretch: "62% 125%",
  }),
  loadFont({
    family: SERIF,
    url: staticFile("fonts/InstrumentSerif-Italic.woff2"),
    style: "italic",
    weight: "400",
  }),
]);

// Text is measured to fit, so nothing renders until the real fonts are in.
export const useFontsReady = () => {
  const [loaded, setLoaded] = useState(false);
  const [handle] = useState(() => delayRender("Waiting for fonts"));
  useEffect(() => {
    ready.then(() => {
      setLoaded(true);
      continueRender(handle);
    });
  }, [handle]);
  return loaded;
};
