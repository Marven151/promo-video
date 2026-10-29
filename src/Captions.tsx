import type { Caption } from "@remotion/captions";
import { createTikTokStyleCaptions } from "@remotion/captions";
import React, { useMemo } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { DISPLAY } from "./fonts";
import { CLAMP, EASE, useLayout } from "./kit";

// No voice-over, so captions are paced like speech: about 3 words a second,
// longer words get a little more time.
export const scriptToCaptions = (
  text: string,
  startMs: number,
  budgetMs: number,
): Caption[] => {
  const words = text.split(/\s+/).filter(Boolean);
  const weights = words.map((w) => w.length + 4);
  const total = weights.reduce((a, b) => a + b, 0);
  const span = Math.min(budgetMs, words.length * 330);
  let t = startMs;
  return words.map((w, i) => {
    const d = (weights[i] / total) * span;
    const c: Caption = {
      text: i === 0 ? w : ` ${w}`,
      startMs: Math.round(t),
      endMs: Math.round(t + d),
      timestampMs: Math.round(t + d / 2),
      confidence: null,
    };
    t += d;
    return c;
  });
};

export const Captions: React.FC<{
  readonly text: string;
  // Scene-local frames.
  readonly from: number;
  readonly until: number;
  readonly color: string;
  readonly highlight: string;
  readonly onHighlight: string;
}> = ({ text, from, until, color, highlight, onHighlight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { vertical, margin } = useLayout();

  const pages = useMemo(() => {
    const startMs = (from / fps) * 1000;
    const budgetMs = ((until - from) / fps) * 1000 * 0.7;
    return createTikTokStyleCaptions({
      captions: scriptToCaptions(text, startMs, budgetMs),
      combineTokensWithinMilliseconds: 2400,
    }).pages;
  }, [text, from, until, fps]);

  const nowMs = (frame / fps) * 1000;
  const pageIndex = pages.findIndex(
    (p, i) => nowMs >= p.startMs && (i === pages.length - 1 || nowMs < pages[i + 1].startMs),
  );
  if (pageIndex === -1) {
    return null;
  }
  const page = pages[pageIndex];
  const fadeOut = interpolate(frame, [until - 8, until], [1, 0], CLAMP);

  return (
    <div
      style={{
        position: "absolute",
        left: margin,
        width: vertical ? 900 : 1300,
        bottom: vertical ? 380 : 92,
        textAlign: "left",
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontStretch: "92%",
        fontSize: vertical ? 54 : 44,
        lineHeight: 1.3,
        color,
        opacity: fadeOut,
        textWrap: "balance",
      }}
    >
      {page.tokens.map((tok, i) => {
        const startF = (tok.fromMs / 1000) * fps;
        const active = nowMs >= tok.fromMs && nowMs < tok.toMs;
        const shown = interpolate(frame, [startF - 1, startF + 5], [0, 1], {
          ...CLAMP,
          easing: EASE,
        });
        return (
          <React.Fragment key={tok.fromMs}>
            {/* A plain space between words, so wrapped lines start flush. */}
            {i > 0 ? " " : null}
            <span
              style={{
                display: "inline-block",
                opacity: shown,
                translate: `0 ${(1 - shown) * 18}px`,
                padding: "0 0.14em",
                margin: "0 -0.14em",
                borderRadius: 4,
                background: active ? highlight : "transparent",
                color: active ? onHighlight : color,
              }}
            >
              {tok.text.trim()}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};
