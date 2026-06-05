"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Photo } from "@/lib/photos";
import TimelineView from "./TimelineView";
import MapView from "./MapView";
import Lightbox from "./Lightbox";
import styles from "./Gallery.module.css";

type Props = { photos: Photo[] };
type View = "timeline" | "atlas";

export default function Gallery({ photos }: Props) {
  const [view, setView] = useState<View>("timeline");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className={styles.page}>
      {/* ── Fixed gallery bar ─────────────────────────────────── */}
      <header className={styles.bar}>
        <div className={styles.brand}>
          <span className={styles.mark}>POLR</span>
          <span className={styles.han}>白</span>
        </div>

        <nav className={styles.switch} aria-label="Choose a way to browse">
          <button
            className={`${styles.switchBtn} ${
              view === "timeline" ? styles.switchOn : ""
            }`}
            onClick={() => setView("timeline")}
            aria-pressed={view === "timeline"}
          >
            <span className={styles.switchHan}>纪年</span>
            <span className={styles.switchEn}>Date</span>
          </button>
          <span className={styles.switchSep} aria-hidden />
          <button
            className={`${styles.switchBtn} ${
              view === "atlas" ? styles.switchOn : ""
            }`}
            onClick={() => setView("atlas")}
            aria-pressed={view === "atlas"}
          >
            <span className={styles.switchHan}>山河</span>
            <span className={styles.switchEn}>Atlas</span>
          </button>
        </nav>

        <div className={styles.count}>
          <span className={styles.countNum}>
            {String(photos.length).padStart(2, "0")}
          </span>
          <span className={styles.countLabel}>frames</span>
        </div>
      </header>

      {/* ── Active view ───────────────────────────────────────── */}
      <div className={styles.stage}>
        {/* Keyed fade — the previous view unmounts cleanly (no lingering
            absolutely-positioned ghost), so height & layout stay correct. */}
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {view === "timeline" ? (
            <TimelineView photos={photos} onOpen={setOpenIndex} />
          ) : (
            <MapView photos={photos} onOpen={setOpenIndex} />
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox
            photos={photos}
            index={openIndex}
            onClose={() => setOpenIndex(null)}
            onNavigate={(next) => setOpenIndex(next)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
