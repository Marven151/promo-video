import { Audio } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, interpolate, staticFile, useVideoConfig } from "remotion";
import { useFontsReady } from "./fonts";
import { Brand } from "./scenes/Brand";
import { EndCard } from "./scenes/EndCard";
import { Hook } from "./scenes/Hook";
import { Services } from "./scenes/Services";
import { PromoProps, T } from "./schema";
import { Wipe } from "./Wipe";

export const Promo: React.FC<PromoProps> = (p) => {
  const fontsReady = useFontsReady();
  const { durationInFrames } = useVideoConfig();
  const { ink, paper, accent } = p.colors;
  if (!fontsReady) {
    return <AbsoluteFill style={{ background: ink }} />;
  }
  const music = p.music
    ? p.music.startsWith("http")
      ? p.music
      : staticFile(p.music)
    : null;

  return (
    <AbsoluteFill style={{ background: ink }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Hook" durationInFrames={T.hook}>
          <Hook p={p} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={T.wipe}>
          <Wipe first={accent} second={paper} />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence name="Brand" durationInFrames={T.brand}>
          <Brand p={p} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={T.wipe}>
          <Wipe first={accent} second={ink} />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence
          name="Services"
          durationInFrames={p.services.length * T.service}
        >
          <Services p={p} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={T.wipe}>
          <Wipe first={paper} second={accent} />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence name="End card" durationInFrames={T.end}>
          <EndCard p={p} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      {music ? (
        <Audio
          src={music}
          volume={(f) =>
            interpolate(f, [0, 15, durationInFrames - 30, durationInFrames], [0, 0.8, 0.8, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      ) : null}
    </AbsoluteFill>
  );
};
