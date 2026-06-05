"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Photo } from "@/lib/photos";
import {
  cityCoords,
  cityLabels,
  cityOf,
  CHINA_PATH,
  CHINA_ISLANDS,
} from "@/lib/photos";
import styles from "./MapView.module.css";

type Props = {
  photos: Photo[];
  onOpen: (index: number) => void;
};

type Place = {
  city: string;
  label: string;
  x: number;
  y: number;
  items: { photo: Photo; index: number }[];
};

function groupByCity(photos: Photo[]): Place[] {
  const map = new Map<string, Place>();
  photos.forEach((photo, index) => {
    const city = cityOf(photo.place);
    const c = cityCoords[city];
    if (!c) return;
    if (!map.has(city)) {
      map.set(city, {
        city,
        label: cityLabels[city] ?? city,
        x: c.x,
        y: c.y,
        items: [],
      });
    }
    map.get(city)!.items.push({ photo, index });
  });
  return Array.from(map.values());
}

export default function MapView({ photos, onOpen }: Props) {
  const places = useMemo(() => groupByCity(photos), [photos]);
  const [hover, setHover] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  /* trace the constellation gracefully from north to south */
  const thread = useMemo(
    () => [...places].sort((a, b) => a.y - b.y),
    [places]
  );

  const hovered = places.find((p) => p.city === hover);
  const opened = places.find((p) => p.city === open);

  const activate = (place: Place) => {
    if (place.items.length === 1) onOpen(place.items[0].index);
    else setOpen(place.city);
  };

  return (
    <motion.div
      className={styles.atlas}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.intro}>
        <span className={styles.introHan}>迹</span>
        <span className={styles.introEn}>where each frame</span>
      </div>

      <div className={styles.canvas}>
        {/* atmospheric fog */}
        <div className={`${styles.fog} ${styles.fog1}`} aria-hidden />
        <div className={`${styles.fog} ${styles.fog2}`} aria-hidden />
        <div className={`${styles.fog} ${styles.fog3}`} aria-hidden />

        {/* faint land silhouette */}
        <svg
          className={styles.map}
          viewBox="0 0 1000 700"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <path className={styles.silhouetteGlow} d={CHINA_PATH} />
          <path className={styles.silhouette} d={CHINA_PATH} />
          {CHINA_ISLANDS.map((d, i) => (
            <path key={i} className={styles.silhouette} d={d} />
          ))}
        </svg>

        {/* constellation links, threaded north → south */}
        <svg
          className={styles.links}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {thread.slice(1).map((p, i) => {
            const prev = thread[i];
            return (
              <line
                key={p.city}
                className={styles.link}
                x1={prev.x}
                y1={prev.y}
                x2={p.x}
                y2={p.y}
              />
            );
          })}
        </svg>

        {/* markers */}
        {places.map((place) => {
          const many = place.items.length > 1;
          return (
            <button
              key={place.city}
              className={`${styles.marker} ${many ? styles.markerMany : ""} ${
                open === place.city ? styles.markerActive : ""
              }`}
              style={{ left: `${place.x}%`, top: `${place.y}%` }}
              onMouseEnter={() => setHover(place.city)}
              onMouseLeave={() =>
                setHover((h) => (h === place.city ? null : h))
              }
              onFocus={() => setHover(place.city)}
              onBlur={() => setHover((h) => (h === place.city ? null : h))}
              onClick={() => activate(place)}
              aria-label={`${place.label}, ${place.items.length} ${
                place.items.length === 1 ? "frame" : "frames"
              }`}
            >
              <span className={styles.dot} aria-hidden>
                {many && <span className={styles.dotRing} aria-hidden />}
              </span>
              <span className={styles.label}>
                {place.label}
                {many && <span className={styles.count}>{place.items.length}</span>}
              </span>
            </button>
          );
        })}

        {/* floating hover preview — a fanned stack hints at several frames */}
        <AnimatePresence>
          {hovered && open === null && (
            <motion.div
              key={hovered.city}
              className={styles.preview}
              style={{ left: `${hovered.x}%`, top: `${hovered.y - 3}%` }}
              initial={{ opacity: 0, y: 8, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.previewStack}>
                {hovered.items.slice(0, 3).map(({ photo }, i, arr) => (
                  <div
                    key={photo.id}
                    className={styles.previewCard}
                    style={{
                      ["--i" as string]: i - (arr.length - 1) / 2,
                      zIndex: arr.length - i,
                    }}
                  >
                    <div className={styles.previewImg}>
                      <Image src={photo.src} alt={photo.title} fill sizes="140px" />
                    </div>
                  </div>
                ))}
              </div>
              {hovered.items.length > 1 && (
                <span className={styles.previewHint}>
                  {hovered.items.length} 帧 · 轻点展开
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* expanded contact sheet for a multi-frame city */}
        <AnimatePresence>
          {opened && (
            <motion.div
              key="sheet-scrim"
              className={styles.scrim}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.32 }}
              onClick={() => setOpen(null)}
            >
              <motion.div
                className={styles.sheet}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <header className={styles.sheetHead}>
                  <span className={styles.sheetHan}>{opened.label}</span>
                  <span className={styles.sheetMeta}>
                    {opened.city} · {opened.items.length} frames
                  </span>
                </header>
                <div className={styles.sheetGrid}>
                  {opened.items.map(({ photo, index }, i) => (
                    <motion.button
                      key={photo.id}
                      type="button"
                      className={styles.sheetItem}
                      onClick={() => {
                        setOpen(null);
                        onOpen(index);
                      }}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.06 + i * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      aria-label={`${photo.title}, ${photo.place}`}
                    >
                      <motion.div
                        layoutId={`print-${photo.id}`}
                        className={styles.sheetImg}
                      >
                        <Image src={photo.src} alt={photo.title} fill sizes="240px" />
                      </motion.div>
                      <span className={styles.sheetTitle}>{photo.title}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
