"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Photo } from "@/lib/photos";
import { cityLabels, cityOf } from "@/lib/photos";
import styles from "./Lightbox.module.css";

type Props = {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
};

export default function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: Props) {
  const photo = photos[index];
  const count = photos.length;

  const go = useCallback(
    (dir: number) => {
      onNavigate((index + dir + count) % count);
    },
    [index, count, onNavigate]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [go, onClose]);

  if (!photo) return null;

  const han = cityLabels[cityOf(photo.place)] ?? "";

  return (
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.title}, ${photo.place}`}
    >
      <button
        className={styles.close}
        onClick={onClose}
        aria-label="Close viewer"
      >
        ✕
      </button>
      <button
        className={`${styles.nav} ${styles.navPrev}`}
        onClick={(e) => {
          e.stopPropagation();
          go(-1);
        }}
        aria-label="Previous photo"
      >
        ←
      </button>
      <button
        className={`${styles.nav} ${styles.navNext}`}
        onClick={(e) => {
          e.stopPropagation();
          go(1);
        }}
        aria-label="Next photo"
      >
        →
      </button>

      <div className={styles.stage} onClick={(e) => e.stopPropagation()}>
        {/* Single PERSISTENT print node — it never remounts on navigation.
            That keeps framer-motion's layout tree clean so the open/close
            morph (layoutId) always completes; a stale remount used to leave
            AnimatePresence stuck "exiting" forever, freezing the page.
            Navigation simply cross-fades the image inside (opacity only,
            no layout work). */}
        <figure className={styles.frame}>
          <motion.div
            layoutId={`print-${photo.id}`}
            className={styles.print}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={photo.id}
                className={styles.printImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={photo.src}
                  alt={photo.title}
                  fill
                  sizes="80vh"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </figure>

        <motion.figcaption
          className={styles.caption}
          key={"cap-" + photo.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          <span className={styles.capIndex}>
            {String(index + 1).padStart(2, "0")}
            <span className={styles.capSlash}>/</span>
            {String(count).padStart(2, "0")}
          </span>
          <span className={styles.capTitle}>{photo.title}</span>
          <span className={styles.capPlace}>
            {han && <span className={styles.capHan}>{han}</span>}
            {photo.date}
          </span>
        </motion.figcaption>
      </div>
    </motion.div>
  );
}
