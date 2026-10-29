import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP } from "./kit";

const IN_OUT = Easing.bezier(0.83, 0, 0.17, 1);

// Two solid panels sweep across and hide the cut between scenes.
export const Wipe: React.FC<{ readonly first: string; readonly second: string }> = ({
  first,
  second,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const vertical = height > width;
  const panel = (lag: number, color: string) => {
    const t = interpolate(frame, [lag, durationInFrames - 4 + lag], [-1.05, 1.05], {
      ...CLAMP,
      easing: IN_OUT,
    });
    return (
      <AbsoluteFill
        style={{
          background: color,
          translate: vertical ? `0 ${-t * 100}%` : `${t * 100}% 0`,
        }}
      />
    );
  };
  return (
    <AbsoluteFill>
      {panel(0, first)}
      {panel(3, second)}
    </AbsoluteFill>
  );
};
