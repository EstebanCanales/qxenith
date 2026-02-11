"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import FlipCard from "./FlipCard";
import Overlay from "./Overlay";
import GapTable6x6 from "./GapTable6x6";
import SegmentedText from "./SegmentedText";
import Image from "next/image";
import ScrollCursor from "../ScrollCursor";

type Origin = { r: number; c: number };
type TrailCell = { key: string; t: number };

const COLS = 6;
const LAST = COLS - 1;
const TOTAL = COLS * COLS;
const STEP_MS = 80;
const TRAIL_TTL_MS = 600;
const TRAIL_MAX = 30;

const BASE_R = 6;
const CORNER_R = 24;

function getCornerRadius(r: number, c: number, expanded: boolean): string {
  const tl = r === 0 && c === 0 ? CORNER_R : expanded ? 0 : BASE_R;
  const tr = r === 0 && c === LAST ? CORNER_R : expanded ? 0 : BASE_R;
  const bl = r === LAST && c === 0 ? CORNER_R : expanded ? 0 : BASE_R;
  const br = r === LAST && c === LAST ? CORNER_R : expanded ? 0 : BASE_R;
  return `${tl}px ${tr}px ${br}px ${bl}px`;
}

export default function GridWithOverlay() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [snapReady, setSnapReady] = useState(false);
  const [origin, setOrigin] = useState<Origin>({ r: 0, c: 0 });

  const [trail, setTrail] = useState<TrailCell[]>([]);

  const trailMap = useMemo(() => {
    const now = Date.now();
    const map = new Map<string, number>();
    for (const { key, t } of trail) {
      const age = now - t;
      const raw = Math.max(0, 1 - age / TRAIL_TTL_MS);
      map.set(key, raw * raw);
    }
    return map;
  }, [trail]);

  const [pulses, setPulses] = useState<number[]>(() =>
    Array.from({ length: TOTAL }, () => 0),
  );

  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cards = useMemo(
    () =>
      Array.from({ length: TOTAL }, (_, i) => ({
        i,
        r: Math.floor(i / COLS),
        c: i % COLS,
      })),
    [],
  );

  const rippleDelay = (r: number, c: number): number => {
    const dr = r - origin.r;
    const dc = c - origin.c;
    return Math.round(Math.sqrt(dr * dr + dc * dc) * STEP_MS);
  };

  // Enable snap scroll after expand animation settles
  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => setSnapReady(true), 100);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "";
      setSnapReady(false);
    }
  }, [expanded]);

  useEffect(() => {
    if (trail.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      setTrail((prev) => prev.filter((x) => now - x.t < TRAIL_TTL_MS));
    }, 60);

    return () => clearInterval(interval);
  }, [trail.length]);

  const mapToCard = (
    row: number,
    col: number,
    cellSize: number,
  ): { r6: number; c6: number } | null => {
    const PADDING = 6; // p-1.5
    const GAP = 3;
    const el = scrollRef.current;
    if (!el) return null;

    const totalW = el.clientWidth;
    const totalH = el.clientHeight;

    // Pixel position of overlay cell center
    const px = col * cellSize + cellSize / 2;
    const py = row * cellSize + cellSize / 2;

    // Outside padding area — ignore
    if (px < PADDING || px > totalW - PADDING) return null;
    if (py < PADDING || py > totalH - PADDING) return null;

    // 6x6 grid area
    const gridW = totalW - PADDING * 2;
    const gridH = totalH - PADDING * 2;
    const cardW = (gridW - GAP * 5) / COLS;
    const cardH = (gridH - GAP * 5) / COLS;

    const stepW = cardW + GAP;
    const stepH = cardH + GAP;
    const localX = px - PADDING;
    const localY = py - PADDING;

    const c6 = Math.floor(localX / stepW);
    const r6 = Math.floor(localY / stepH);

    // Check if in the gap between cards
    const inGapX = localX - c6 * stepW > cardW;
    const inGapY = localY - r6 * stepH > cardH;
    if (inGapX || inGapY) return null;

    if (c6 < 0 || c6 > 5 || r6 < 0 || r6 > 5) return null;

    return { r6, c6 };
  };

  const onCellOverlay = useCallback(
    (row: number, col: number, numCols: number, cellSize: number) => {
      const key = `${row}_${col}`;
      const now = Date.now();

      setTrail((prev) => {
        const filtered = prev.filter((x) => x.key !== key);
        const next = [...filtered, { key, t: now }];
        if (next.length > TRAIL_MAX) {
          return next.slice(next.length - TRAIL_MAX);
        }
        return next;
      });

      if (!expanded) {
        const card = mapToCard(row, col, cellSize);
        if (!card) {
          setHoveredCard(null);
          return;
        }
        const id6 = card.r6 * COLS + card.c6;

        setHoveredCard(id6);

        setPulses((prev) => {
          const next = prev.slice();
          next[id6] = next[id6] + 1;
          return next;
        });
      }
    },
    [expanded],
  );

  const onClickExpandOverlay = useCallback(
    (row: number, col: number, numCols: number, cellSize: number) => {
      if (expanded) return;
      const card = mapToCard(row, col, cellSize);
      if (!card) return;
      setOrigin({ r: card.r6, c: card.c6 });
      setExpanded(true);
    },
    [expanded],
  );

  return (
    <>
      <ScrollCursor scrollContainerRef={scrollRef} />
      <div
        ref={scrollRef}
        className="w-screen"
        style={{
          height: "100vh",
          overflowY: expanded ? "scroll" : "hidden",
          scrollSnapType: snapReady ? "y mandatory" : "none",
          scrollBehavior: "smooth",
        }}
      >
        <div
          className="relative"
          style={{
            height: "100vh",
            scrollSnapAlign: expanded ? "start" : undefined,
          }}
        >
          <div
            className="relative z-[10] grid grid-cols-6 grid-rows-6 w-full h-full p-1.5"
            style={{
              gap: expanded ? 0 : "3px",
              transition: "gap 700ms ease-in-out",
            }}
          >
            {cards.map(({ i, r, c }) => (
              <FlipCard
                key={i}
                index={i}
                row={r}
                col={c}
                expanded={expanded}
                hovered={hoveredCard === i}
                pulse={pulses[i]}
                cornerRadius={getCornerRadius(r, c, expanded)}
                rippleDelayMs={expanded ? rippleDelay(r, c) : 0}
                onExpandFromHere={() => {
                  setOrigin({ r, c });
                  setExpanded(true);
                }}
                front={
                  <SegmentedText row={r} col={c}>
                    <div className="flex flex-col">
                      <span
                        className="font-extrabold tracking-tight text-white"
                        style={{ fontSize: "clamp(56px, 14vw, 190px)" }}
                      >
                        QXENITH
                      </span>
                      <span
                        className={"font-extrabold tracking-tight text-white"}
                        style={{
                          fontSize: "clamp(16px, 3vw, 60px)",
                          fontFamily: "var(--font-nanum-brush-script)",
                        }}
                      >
                        우리는 존재할 가치가 있는 아이디어를 만들어냅니다.
                      </span>
                    </div>
                  </SegmentedText>
                }
                back={
                  <SegmentedText row={r} col={c}>
                    <div className="flex flex-col justify-center items-center -mb-14">
                      <span
                        className="font-extrabold tracking-tight text-white"
                        style={{ fontSize: "clamp(56px, 14vw, 190px)" }}
                      >
                        QXENITH
                      </span>
                      <span
                        className={"font-extrabold tracking-tight text-white"}
                        style={{
                          fontSize: "clamp(16px, 3vw, 60px)",
                          fontFamily: "var(--font-nanum-brush-script)",
                        }}
                      >
                        당신의 비전을 디자인하세요.
                      </span>
                      <Image
                        className="fill-white"
                        src="/Capibara.svg"
                        alt="Capibara"
                        width={50}
                        height={50}
                      />
                    </div>
                  </SegmentedText>
                }
              />
            ))}
          </div>

          {!expanded && <GapTable6x6 />}

          <Overlay
            trail={trailMap}
            expanded={expanded}
            onCell={onCellOverlay}
            onClickExpand={onClickExpandOverlay}
            onMouseLeave={() => setHoveredCard(null)}
          />
        </div>

        {expanded && (
          <section
            className="h-screen bg-[#030301]"
            style={{ scrollSnapAlign: "start" }}
          />
        )}
      </div>
    </>
  );
}
