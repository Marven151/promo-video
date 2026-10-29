import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Captions } from "../Captions";
import { CLAMP, display, fitSize, Marks, MetaBar, Rise, useLayout } from "../kit";
import { PromoProps, T } from "../schema";

export const Hook: React.FC<{ readonly p: PromoProps }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { vertical, margin, textWidth } = useLayout();
  const { ink, paper, accent } = p.colors;
  const onAccent = p.colors.onAccent ?? ink;
  const lines = p.hook;
  // Fit the widest line, then make sure the stack clears the caption area.
  const maxStack = vertical ? 1050 : 640;
  const size = Math.min(
    fitSize(lines, textWidth, vertical ? 330 : 300),
    Math.floor(maxStack / (lines.length * 0.96)),
  );

  return (
    <AbsoluteFill style={{ background: ink }}>
      <Marks color={paper} />
      <MetaBar color={paper} left={p.business.city} right={p.disclaimer} />
      <div
        style={{
          position: "absolute",
          left: margin,
          top: vertical ? 300 : 130,
          display: "flex",
          flexDirection: "column",
          justifyContent: vertical ? "flex-start" : "center",
          height: vertical ? undefined : 760,
          scale: `${interpolate(frame, [0, T.hook], [1, 1.04], CLAMP)}`,
          transformOrigin: "left center",
        }}
      >
        {lines.map((line, i) => (
          <Rise key={line} delay={3 + i * 6}>
            <div
              style={{
                ...display(size),
                color: i === lines.length - 1 ? accent : paper,
                whiteSpace: "nowrap",
              }}
            >
              {line}
            </div>
          </Rise>
        ))}
      </div>
      <Captions
        text={p.captions.hook}
        from={12}
        until={T.hook + 6}
        color={paper}
        highlight={accent}
        onHighlight={onAccent}
      />
    </AbsoluteFill>
  );
};
