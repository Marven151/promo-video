#!/usr/bin/env bash
# Render a client's promo in both formats plus a poster from one props file.
#   ./render.sh props/client.json [output-name]
# Writes out/<name>-vertical.mp4 (1080x1920), out/<name>-wide.mp4 (1920x1080)
# and out/<name>-poster.png (1280x720).
set -euo pipefail

PROPS=${1:?usage: ./render.sh props/client.json [output-name]}
NAME=${2:-$(basename "$PROPS" .json)}
CRF=${CRF:-20}

cd "$(dirname "$0")"
mkdir -p out

common=(--props="$PROPS" --codec=h264 --crf="$CRF" --x264-preset=slow --pixel-format=yuv420p --color-space=bt709 --log=error)
npx remotion render Vertical "out/$NAME-vertical.mp4" "${common[@]}"
npx remotion render Wide "out/$NAME-wide.mp4" "${common[@]}"
# Poster: the last frame of the 16:9 cut (finished end card), scaled to 1280x720.
npx remotion still Wide "out/$NAME-poster.png" --props="$PROPS" --frame=-1 --scale=0.6666667 --log=error

ls -lh "out/$NAME-vertical.mp4" "out/$NAME-wide.mp4" "out/$NAME-poster.png"
