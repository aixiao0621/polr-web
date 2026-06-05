"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Photo } from "@/lib/photos";
import { cityLabels, cityOf } from "@/lib/photos";
import styles from "./Polaroid.module.css";

type Props = {
  photo: Photo;
  index?: number;
  priority?: boolean;
  onOpen?: () => void;
};

export default function Polaroid({ photo, index, priority, onOpen }: Props) {
  const [loaded, setLoaded] = useState(false);
  const han = cityLabels[cityOf(photo.place)];

  return (
    <button
      type="button"
      className={styles.card}
      onClick={onOpen}
      aria-label={`${photo.title}, ${photo.place}`}
    >
      {/* the white canvas dissolves via multiply; only the print floats.
          layoutId lets the print morph straight into the lightbox. */}
      <motion.div
        layoutId={`print-${photo.id}`}
        className={styles.frame}
        data-loaded={loaded}
      >
        <Image
          src={photo.src}
          alt={photo.title}
          fill
          sizes="(max-width: 640px) 86vw, (max-width: 1100px) 44vw, 360px"
          priority={priority}
          onLoad={() => setLoaded(true)}
        />
      </motion.div>

      <span className={styles.tag}>
        {typeof index === "number" && (
          <span className={styles.idx}>
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <span className={styles.tagTitle}>{photo.title}</span>
        {han && <span className={styles.tagHan}>{han}</span>}
      </span>
    </button>
  );
}

