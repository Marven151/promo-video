import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Captions } from "../Captions";
import { SERIF } from "../fonts";
import { CLAMP, display, EASE, fitSize, Marks, meta, MetaBar, Rise, useLayout } from "../kit";
import { PromoProps, T } from "../schema";

const pad = (n: number) => String(n).padStart(2, "0");

const Card: React.FC<{
  readonly p: PromoProps;
  readonly index: number;
  readonly w: number;
  readonly h: number;
}> = ({ p, index, w, h }) => {
  const frame = useCurrentFrame();
  const { vertical } = useLayout();
  const { ink, paper, accent } = p.colors;
  const s = p.services[index];
  const n = p.services.length;
  const start = index * T.service;

  // How far this card has landed, and how many later cards sit on top of it.
  const landed = interpolate(frame, [start, start + 18], [0, 1], {
    ...CLAMP,
    easing: EASE,
  });
  let depth = 0;
  for (let j = index + 1; j < n; j++) {
    depth += interpolate(frame, [j * T.service, j * T.service + 18], [0, 1], {
      ...CLAMP,
      easing: EASE,
    });
  }
  if (frame < start - 2 || depth > 2.6) {
    return null;
  }
  // Two words per line keeps titles chunky; the size then shrinks to fit the card.
  const titleLines = s.title.split(/\s+/).reduce<string[]>((acc, word) => {
    const last = acc[acc.length - 1];
    if (last && last.split(" ").length < 2 && (last + word).length < 13) {
      acc[acc.length - 1] = `${last} ${word}`;
    } else {
      acc.push(word);
    }
    return acc;
  }, []);
  const titleSize = fitSize(titleLines, w - 112, vertical ? 132 : 112, 70, 850);
  const enterFrom = vertical ? `0 ${(1 - landed) * 1300}px` : `${(1 - landed) * 1200}px 0`;
  const stackShift = vertical ? `0 ${-depth * 26}px` : `${-depth * 40}px 0`;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        translate: landed < 1 ? enterFrom : stackShift,
        rotate: `${(1 - landed) * (vertical ? 6 : 4)}deg`,
        scale: `${1 - depth * 0.05}`,
        transformOrigin: vertical ? "center top" : "left center",
        zIndex: index,
      }}
    >
      <div
        style={{
          position: "relative",
          width: w,
          height: h,
          background: paper,
          overflow: "hidden",
          borderRadius: 6,
          boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
        }}
      >
        {/* Oversized index number, cropped by the card edge. */}
        <div
          style={{
            ...display(vertical ? 620 : 520),
            position: "absolute",
            right: -24,
            bottom: vertical ? -70 : -60,
            color: accent,
            lineHeight: 0.8,
            translate: `0 ${(1 - landed) * 120}px`,
          }}
        >
          {pad(index + 1)}
        </div>
        {/* Cards pushed to the back dim into the background. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: ink,
            opacity: Math.min(0.55, depth * 0.4),
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: 52,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: ink,
            ...meta(vertical ? 24 : 20),
          }}
        >
          <span>
            Service {pad(index + 1)} / {pad(n)}
          </span>
          {s.tag ? (
            <span
              style={{
                background: ink,
                color: paper,
                padding: "12px 18px",
                borderRadius: 999,
              }}
            >
              {s.tag}
            </span>
          ) : null}
        </div>
        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: vertical ? 170 : 150,
            color: ink,
          }}
        >
          {titleLines.map((line, i) => (
            <Rise key={line} delay={start + 8 + i * 4}>
              <div style={{ ...display(titleSize, 70, 850), whiteSpace: "nowrap" }}>
                {line}
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Services: React.FC<{ readonly p: PromoProps }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { vertical, margin, width } = useLayout();
  const { ink, paper, accent } = p.colors;
  const onAccent = p.colors.onAccent ?? ink;
  const n = p.services.length;
  const active = Math.min(n - 1, Math.floor(frame / T.service));
  const cardW = vertical ? width - 2 * margin : 940;
  const cardH = vertical ? 900 : 640;
  const headIn = interpolate(frame, [0, 14], [0, 1], { ...CLAMP, easing: EASE });

  return (
    <AbsoluteFill style={{ background: ink }}>
      <Marks color={paper} />
      <MetaBar color={paper} left={p.business.name} right={p.disclaimer} />

      {vertical ? (
        <div style={{ position: "absolute", left: margin, right: margin, top: 236 }}>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 76,
              color: paper,
              opacity: headIn,
            }}
          >
            What we do
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
            {p.services.map((s, i) => (
              <div key={s.title} style={{ flex: 1, height: 8, background: `${paper}33` }}>
                <div
                  style={{
                    height: "100%",
                    background: accent,
                    transformOrigin: "left",
                    scale: `${interpolate(frame, [i * T.service, (i + 1) * T.service], [0, 1], CLAMP)} 1`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ position: "absolute", left: margin, top: 210, width: 620 }}>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 88,
              color: paper,
              opacity: headIn,
              marginBottom: 44,
            }}
          >
            What we do
          </div>
          {p.services.map((s, i) => {
            const on = i === active;
            return (
              <div
                key={s.title}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 22,
                  padding: "16px 0",
                  borderTop: `2px solid ${paper}33`,
                  color: paper,
                  opacity: interpolate(frame, [4 + i * 3, 14 + i * 3], [0, on ? 1 : 0.38], CLAMP),
                }}
              >
                <span style={{ ...meta(20), color: on ? accent : paper, width: 40 }}>{pad(i + 1)}</span>
                <span style={{ ...display(54, 75, 800), whiteSpace: "nowrap" }}>{s.title}</span>
              </div>
            );
          })}
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: vertical ? margin : 860,
          top: vertical ? 450 : 220,
          width: cardW,
          height: cardH,
        }}
      >
        {p.services.map((s, i) => (
          <Card key={s.title} p={p} index={i} w={cardW} h={cardH} />
        ))}
      </div>

      {p.services.map((s, i) => (
        <AbsoluteFill key={s.title} style={{ pointerEvents: "none" }}>
          {active === i ? (
            <Captions
              text={s.line}
              from={i * T.service + 10}
              until={(i + 1) * T.service + (i === n - 1 ? 6 : 0)}
              color={paper}
              highlight={accent}
              onHighlight={onAccent}
            />
          ) : null}
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};
