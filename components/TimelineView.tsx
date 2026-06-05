"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Photo } from "@/lib/photos";
import Polaroid from "./Polaroid";
import styles from "./TimelineView.module.css";

type Props = {
  photos: Photo[];
  onOpen: (index: number) => void;
};

type Chapter = {
  key: string; // "2026-04"
  year: string;
  monthIdx: number; // 0-11
  items: { photo: Photo; index: number }[];
};

const MONTH_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_HAN = [
  "一月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "十一月", "十二月",
];

function groupByMonth(photos: Photo[]): Chapter[] {
  const map = new Map<string, Chapter>();
  photos.forEach((photo, index) => {
    const d = photo.date; // expects YYYY-MM-DD (falls back gracefully)
    const year = d.slice(0, 4);
    const monthIdx = Math.min(11, Math.max(0, Number(d.slice(5, 7)) - 1)) || 0;
    const key = d.length >= 7 ? d.slice(0, 7) : `${year}-01`;
    if (!map.has(key)) map.set(key, { key, year, monthIdx, items: [] });
    map.get(key)!.items.push({ photo, index });
  });
  return Array.from(map.values()).sort((a, b) => (a.key < b.key ? 1 : -1));
}

export default function TimelineView({ photos, onOpen }: Props) {
  const chapters = groupByMonth(photos);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [active, setActive] = useState(chapters[0]?.key ?? "");

  /* while a click-to-scroll is in flight we lock the observer so it can't
     thrash `active` through every section we pass — that thrashing was what
     made the red dot stutter and the year accordion flicker. */
  const lockRef = useRef(false);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* track which chapter is centred in the viewport */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (lockRef.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const key = (visible.target as HTMLElement).dataset.key;
          if (key) setActive(key);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [chapters.length]);

  useEffect(
    () => () => {
      if (lockTimer.current) clearTimeout(lockTimer.current);
    },
    []
  );

  const scrollTo = (key: string) => {
    // expand the target year + settle the dot there immediately
    setActive(key);
    // ignore intermediate sections while we reposition
    lockRef.current = true;
    if (lockTimer.current) clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => {
      lockRef.current = false;
    }, 700);
    // query the live DOM (ref identity is unstable across the re-render that
    // setActive just scheduled) and run a custom eased scroll so the jump is
    // always smooth AND always lands — native `behavior:"smooth"` is flaky
    // across browsers/distances and was causing the "only moves one year" stall.
    const el =
      sectionRefs.current[key] ??
      document.querySelector<HTMLElement>(`section[data-key="${key}"]`);
    if (!el) return;
    const startY = window.scrollY;
    const targetY = startY + el.getBoundingClientRect().top;
    const delta = targetY - startY;
    if (Math.abs(delta) < 2) return;
    const duration = 620;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // easeOutCubic
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      window.scrollTo(0, startY + delta * ease(t));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* group chapters by year for the collapsible scrubber */
  const years = (() => {
    const order: string[] = [];
    const byYear = new Map<string, Chapter[]>();
    chapters.forEach((c) => {
      if (!byYear.has(c.year)) {
        byYear.set(c.year, []);
        order.push(c.year);
      }
      byYear.get(c.year)!.push(c);
    });
    return order.map((year) => ({ year, months: byYear.get(year)! }));
  })();

  const activeYear = chapters.find((c) => c.key === active)?.year ?? "";

  return (
    <div className={styles.timeline}>
      {/* ── Collapsible year / month scrubber ───────────────── */}
      <nav className={styles.scrubber} aria-label="Jump through the timeline">
        <span className={styles.scrubberLine} aria-hidden />
        {years.map(({ year, months }) => {
          const yearOpen = year === activeYear;
          return (
            <div
              key={year}
              className={`${styles.tickGroup} ${
                yearOpen ? styles.tickGroupOpen : ""
              }`}
            >
              {/* the year anchor — scrolls to that year's first month.
                  It never carries the red dot: the single shared red dot
                  (layoutId) always lives on a month tick, since the active
                  month of the open year is what's highlighted. */}
              <button
                className={`${styles.tick} ${styles.tickYearAnchor}`}
                onClick={() => scrollTo(months[0].key)}
              >
                <span className={styles.tickDot} aria-hidden />
                <span className={styles.tickLabel}>
                  <span className={styles.tickYear}>{year}</span>
                </span>
              </button>

              {/* months expand only for the active year */}
              {yearOpen && (
                <motion.div
                  className={styles.tickMonths}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                >
                  {months.map((c) => {
                    const on = c.key === active;
                    return (
                      <button
                        key={c.key}
                        className={`${styles.tick} ${styles.tickMonthTick} ${
                          on ? styles.tickOn : ""
                        }`}
                        onClick={() => scrollTo(c.key)}
                        aria-current={on ? "true" : undefined}
                      >
                        <span className={styles.tickDot} aria-hidden>
                          {on && (
                            <motion.span
                              key="halo"
                              className={styles.tickHalo}
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                duration: 0.4,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                            />
                          )}
                        </span>
                        <span className={styles.tickLabel}>
                          <span className={styles.tickMonth}>
                            {String(c.monthIdx + 1).padStart(2, "0")}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </div>
          );
        })}
      </nav>

      {chapters.map((chapter, ci) => (
        <section
          className={styles.chapter}
          key={chapter.key}
          data-key={chapter.key}
          ref={(el) => {
            sectionRefs.current[chapter.key] = el;
          }}
        >
          {/* sticky year + month rail */}
          <aside className={styles.rail}>
            <div className={styles.railInner}>
              <span className={styles.year}>{chapter.year}</span>
              <span className={styles.monthLine}>
                <span className={styles.monthHan}>
                  {MONTH_HAN[chapter.monthIdx]}
                </span>
                <span className={styles.monthEn}>
                  {MONTH_EN[chapter.monthIdx]}
                </span>
              </span>
              <span className={styles.yearCount}>
                {String(chapter.items.length).padStart(2, "0")} —
              </span>
            </div>
          </aside>

          {/* editorial frame flow */}
          <div className={styles.flow}>
            {chapter.items.map(({ photo, index }, i) => (
              <motion.div
                key={photo.id}
                className={styles.cell}
                data-span={i % 5}
                initial={{ opacity: 0, y: 38 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.85,
                  delay: (i % 3) * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Polaroid
                  photo={photo}
                  index={index}
                  priority={ci === 0 && i < 3}
                  onOpen={() => onOpen(index)}
                />
              </motion.div>
            ))}
          </div>
        </section>
      ))}

      <footer className={styles.end}>
        <span className={styles.endHan}>白</span>
        <span className={styles.endMark}>POLR · MMXXVI</span>
      </footer>
    </div>
  );
}
