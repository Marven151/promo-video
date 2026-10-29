import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { DISPLAY } from "./fonts";

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  return {
    vertical,
    width,
    height,
    // Side margin and the width usable for text.
    margin: vertical ? 80 : 120,
    textWidth: width - (vertical ? 160 : 240),
  };
};

// Display type: Archivo pushed to its narrowest, heaviest cut.
export const display = (
  size: number,
  stretch = 62,
  weight = 900,
): React.CSSProperties => ({
  fontFamily: DISPLAY,
  fontSize: size,
  fontWeight: weight,
  fontStretch: `${stretch}%`,
  textTransform: "uppercase",
  lineHeight: 0.9,
  letterSpacing: "-0.005em",
});

export const meta = (size = 22): React.CSSProperties => ({
  fontFamily: DISPLAY,
  fontSize: size,
  fontWeight: 600,
  fontStretch: "100%",
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  lineHeight: 1,
});

const widthCache = new Map<string, number>();

// Width of a single line of text at 100px.
const measure = (text: string, stretch: number, weight: number) => {
  const key = `${stretch}|${weight}|${text}`;
  const hit = widthCache.get(key);
  if (hit !== undefined) {
    return hit;
  }
  const span = document.createElement("span");
  Object.assign(span.style, {
    position: "absolute",
    visibility: "hidden",
    whiteSpace: "pre",
    fontFamily: DISPLAY,
    fontSize: "100px",
    fontWeight: String(weight),
    fontStretch: `${stretch}%`,
    textTransform: "uppercase",
    letterSpacing: "-0.005em",
  });
  span.textContent = text;
  document.body.appendChild(span);
  const w = span.getBoundingClientRect().width;
  span.remove();
  widthCache.set(key, w);
  return w;
};

// Largest font size (capped) at which every line fits maxWidth.
export const fitSize = (
  lines: string[],
  maxWidth: number,
  cap: number,
  stretch = 62,
  weight = 900,
) => {
  const widest = Math.max(...lines.map((l) => measure(l, stretch, weight)));
  return Math.min(cap, Math.floor((maxWidth / widest) * 100));
};

// Greedy word wrap into at most maxLines lines, each at most maxChars long where possible.
export const breakLines = (text: string, maxChars: number, maxLines = 3) => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const next = current ? `${current} ${w}` : w;
    if (next.length > maxChars && current && lines.length < maxLines - 1) {
      lines.push(current);
      current = w;
    } else {
      current = next;
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines;
};

// Mask reveal: the line rises out of its own box.
export const Rise: React.FC<{
  readonly delay: number;
  readonly duration?: number;
  readonly exitAt?: number;
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ delay, duration = 16, exitAt, children, style }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [delay, delay + duration], [112, 0], {
    ...CLAMP,
    easing: EASE,
  });
  const exit =
    exitAt === undefined
      ? 0
      : interpolate(frame, [exitAt, exitAt + 10], [0, -112], {
          ...CLAMP,
          easing: EASE_IN,
        });
  return (
    <div style={{ overflow: "hidden", paddingTop: "0.06em", ...style }}>
      <div style={{ translate: `0 ${enter + exit}%` }}>{children}</div>
    </div>
  );
};

// Thin registration marks in the corners, a print-shop detail.
export const Marks: React.FC<{ readonly color: string }> = ({ color }) => {
  const { width, height } = useVideoConfig();
  const inset = 44;
  const arm = 18;
  const pts = [
    [inset, inset],
    [width - inset, inset],
    [inset, height - inset],
    [width - inset, height - inset],
  ];
  return (
    <svg
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0, opacity: 0.45 }}
    >
      {pts.map(([x, y]) => (
        <g key={`${x}-${y}`} stroke={color} strokeWidth={2}>
          <line x1={x - arm} y1={y} x2={x + arm} y2={y} />
          <line x1={x} y1={y - arm} x2={x} y2={y + arm} />
        </g>
      ))}
    </svg>
  );
};

// Top bar: city on the left, disclaimer or website on the right, rule underneath.
export const MetaBar: React.FC<{
  readonly color: string;
  readonly left: string;
  readonly right?: string;
  readonly rightInset?: number;
}> = ({ color, left, right, rightInset }) => {
  const frame = useCurrentFrame();
  const { vertical, margin } = useLayout();
  const top = vertical ? 150 : 76;
  return (
    <div
      style={{
        position: "absolute",
        left: margin,
        right: rightInset ?? margin,
        top,
        color,
        ...meta(vertical ? 24 : 20),
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          opacity: interpolate(frame, [2, 12], [0, 1], CLAMP),
        }}
      >
        <span>{left}</span>
        {right ? <span style={{ opacity: 0.75 }}>{right}</span> : null}
      </div>
      <div
        style={{
          marginTop: 16,
          height: 2,
          background: color,
          opacity: 0.5,
          transformOrigin: "left",
          scale: `${interpolate(frame, [0, 22], [0, 1], { ...CLAMP, easing: EASE })} 1`,
        }}
      />
    </div>
  );
};

export const Logo: React.FC<{
  readonly svg?: string;
  readonly size: number;
  readonly color: string;
  readonly style?: React.CSSProperties;
}> = ({ svg, size, color, style }) => {
  if (!svg) {
    return null;
  }
  return (
    <div
      style={{ width: size, height: size, color, lineHeight: 0, ...style }}
      // Logo markup comes from the client's props file.
      dangerouslySetInnerHTML={{
        __html: svg.replace(
          "<svg",
          `<svg width="${size}" height="${size}" style="display:block"`,
        ),
      }}
    />
  );
};
