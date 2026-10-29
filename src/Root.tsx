import React from "react";
import { CalculateMetadataFunction, Composition } from "remotion";
import sample from "../props/hvac-copperline.json";
import { Promo } from "./Promo";
import { FPS, PromoProps, promoSchema, totalFrames } from "./schema";

// Length follows the number of services (3 → 15.9 s, 4 → 18.2 s).
const calculateMetadata: CalculateMetadataFunction<PromoProps> = ({ props }) => ({
  durationInFrames: totalFrames(props.services.length),
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Vertical"
        component={Promo}
        schema={promoSchema}
        defaultProps={sample}
        calculateMetadata={calculateMetadata}
        durationInFrames={totalFrames(4)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Wide"
        component={Promo}
        schema={promoSchema}
        defaultProps={sample}
        calculateMetadata={calculateMetadata}
        durationInFrames={totalFrames(4)}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
