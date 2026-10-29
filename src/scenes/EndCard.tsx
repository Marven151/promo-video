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

// Each digit rolls up through a few numbers and lands, like an odometer.
const RollingPhone: React.FC<{
  readonly phone: string;
  readonly size: number;
  readonly color: string;
  readonly delay: number;
}> = ({ phone, size, color, delay }) => {
  const frame = useCurrentFrame();
  const steps = 6;
  return (
    <div style={{ display: "flex", ...display(size, 62, 900), color, lineHeight: 1 }}>
      {phone.split("").map((ch, i) => {
        const d = delay + i * 1.5;
        const t = interpolate(frame, [d, d + 22], [0, 1], { ...CLAMP, easing: EASE });
        if (!/\d/.test(ch)) {
          return (
            <span key={i} style={{ opacity: t, whiteSpace: "pre" }}>
              {ch}
            </span>
          );
        }
        const target = Number(ch);
        const column = Array.from({ length: steps + 1 }, (_, k) => (target - steps + k + 20) % 10);
        return (
          <span key={i} style={{ display: "inline-block", height: "1em", overflow: "hidden" }}>
            <span
              style={{
                display: "flex",
                flexDirection: "column",
                translate: `0 ${-t * steps}em`,
              }}
            >
              {column.map((dgt, k) => (
                <span key={k} style={{ height: "1em" }}>
                  {dgt}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </div>
  );
};

export const EndCard: React.FC<{ readonly p: PromoProps }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { vertical, margin, textWidth } = useLayout();
  const { ink, paper, accent } = p.colors;
  const onAccent = p.colors.onAccent ?? ink;

  const head = breakLines(p.cta.headline, vertical ? 10 : 16, 3);
  const headSize = fitSize(head, vertical ? textWidth : 1240, vertical ? 230 : 150);
  const phoneSize = fitSize([p.business.phone], textWidth, vertical ? 210 : 200);
  const subIn = interpolate(frame, [34, 50], [0, 1], { ...CLAMP, easing: EASE });
  const ruleIn = interpolate(frame, [16, 36], [0, 1], { ...CLAMP, easing: EASE });
  const footer = [p.business.website, p.business.city].filter(Boolean).join("  ·  ");

  return (
    <AbsoluteFill style={{ background: accent }}>
      <Marks color={onAccent} />
      <MetaBar
        color={onAccent}
        left={vertical ? p.business.name : [p.business.name, p.business.website].filter(Boolean).join("  ·  ")}
        right={p.disclaimer}
      />
      <div
        style={{
          position: "absolute",
          left: margin,
          right: margin,
          top: vertical ? 270 : 170,
          color: onAccent,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            {head.map((line, i) => (
              <Rise key={line} delay={2 + i * 5}>
                <div style={{ ...display(headSize), whiteSpace: "nowrap" }}>{line}</div>
              </Rise>
            ))}
          </div>
          {vertical ? null : (
            <Logo
              svg={p.logoSvg}
              size={150}
              color={onAccent}
              style={{
                scale: `${interpolate(frame, [10, 28], [0, 1], { ...CLAMP, easing: EASE })}`,
                marginBottom: 10,
              }}
            />
          )}
        </div>
        <div
          style={{
            height: 4,
            background: onAccent,
            margin: vertical ? "52px 0 40px" : "36px 0 28px",
            transformOrigin: "left",
            scale: `${ruleIn} 1`,
          }}
        />
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: vertical ? 64 : 56,
            lineHeight: 1,
            marginBottom: vertical ? 18 : 10,
            opacity: ruleIn,
          }}
        >
          Call or text
        </div>
        <RollingPhone phone={p.business.phone} size={phoneSize} color={onAccent} delay={14} />
        {p.cta.sub ? (
          <div
            style={{
              marginTop: vertical ? 44 : 30,
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: vertical ? 60 : 50,
              lineHeight: 1.05,
              opacity: subIn,
              translate: `0 ${(1 - subIn) * 24}px`,
              maxWidth: vertical ? 900 : 1300,
              textWrap: "balance",
            }}
          >
            {p.cta.sub}
          </div>
        ) : null}
      </div>
      {vertical ? (
        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            bottom: 230,
            display: "flex",
            alignItems: "center",
            gap: 28,
            color: onAccent,
            opacity: subIn,
          }}
        >
          <Logo svg={p.logoSvg} size={84} color={onAccent} />
          <div style={meta(24)}>{footer}</div>
        </div>
      ) : null}
      <Captions
        text={p.captions.end}
        from={40}
        until={T.end + 30}
        color={onAccent}
        highlight={ink}
        onHighlight={paper}
      />
    </AbsoluteFill>
  );
};
