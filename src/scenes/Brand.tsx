import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Captions } from "../Captions";
import { SERIF } from "../fonts";
import {
  breakLines,
  CLAMP,
  display,
  EASE,
  fitSize,
  Logo,
  Marks,
  meta,
  MetaBar,
  Rise,
  useLayout,
} from "../kit";
import { PromoProps, T } from "../schema";

export const Brand: React.FC<{ readonly p: PromoProps }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { vertical, margin, textWidth, height } = useLayout();
  const { ink, paper, accent } = p.colors;
  const onAccent = p.colors.onAccent ?? ink;

  const nameWidth = vertical ? textWidth : 1080;
  const lines = breakLines(p.business.name, vertical ? 11 : 18, vertical ? 3 : 2);
  // Three-line names get a smaller cap so the tagline keeps clear of the captions.
  const size = fitSize(lines, nameWidth, vertical ? (lines.length > 2 ? 190 : 230) : 200);
  const logoIn = interpolate(frame, [0, 18], [0, 1], { ...CLAMP, easing: EASE });
  const ruleIn = interpolate(frame, [14, 34], [0, 1], { ...CLAMP, easing: EASE });
  const taglineIn = interpolate(frame, [20, 36], [0, 1], { ...CLAMP, easing: EASE });
  const panelIn = interpolate(frame, [4, 26], [1, 0], { ...CLAMP, easing: EASE });

  const metaLine = [p.business.city, p.business.established]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <AbsoluteFill style={{ background: paper }}>
      <Marks color={ink} />
      <MetaBar
        color={ink}
        left={p.business.city}
        right={vertical ? p.disclaimer : undefined}
        rightInset={vertical ? undefined : 520 + 64}
      />

      {vertical ? null : (
        // Accent column on the right: the city, set in the serif.
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 520,
            height,
            background: accent,
            translate: `${panelIn * 100}% 0`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0 64px 150px",
            boxSizing: "border-box",
            color: onAccent,
          }}
        >
          {p.disclaimer ? (
            <div style={{ ...meta(18), position: "absolute", top: 76, left: 64, opacity: 0.75 }}>
              {p.disclaimer}
            </div>
          ) : null}
          <div style={{ ...meta(20), marginBottom: 24 }}>Serving</div>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 96,
              lineHeight: 0.95,
            }}
          >
            {p.business.city}
          </div>
          {p.business.established ? (
            <div style={{ ...meta(20), marginTop: 28 }}>
              {p.business.established}
            </div>
          ) : null}
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: margin,
          top: vertical ? 280 : 190,
          width: nameWidth,
        }}
      >
        <Logo
          svg={p.logoSvg}
          size={vertical ? 120 : 110}
          color={ink}
          style={{
            scale: `${logoIn}`,
            rotate: `${(1 - logoIn) * -90}deg`,
            marginBottom: vertical ? 56 : 40,
          }}
        />
        {lines.map((line, i) => (
          <Rise key={line} delay={6 + i * 5}>
            <div style={{ ...display(size), color: ink, whiteSpace: "nowrap" }}>
              {line}
            </div>
          </Rise>
        ))}
        <div
          style={{
            marginTop: vertical ? 48 : 36,
            height: 10,
            width: vertical ? "100%" : 760,
            background: accent,
            transformOrigin: "left",
            scale: `${ruleIn} 1`,
          }}
        />
        <div
          style={{
            marginTop: vertical ? 44 : 30,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: vertical ? 84 : 68,
            lineHeight: 1.02,
            color: ink,
            maxWidth: vertical ? 900 : 1000,
            opacity: taglineIn,
            translate: `0 ${(1 - taglineIn) * 30}px`,
            textWrap: "balance",
          }}
        >
          {p.business.tagline}
        </div>
        {vertical && metaLine && lines.length < 3 ? (
          <div
            style={{
              ...meta(24),
              color: ink,
              marginTop: 40,
              opacity: taglineIn * 0.75,
            }}
          >
            {metaLine}
          </div>
        ) : null}
      </div>
      <Captions
        text={p.captions.brand}
        from={16}
        until={T.brand + 6}
        color={ink}
        highlight={ink}
        onHighlight={paper}
      />
    </AbsoluteFill>
  );
};
