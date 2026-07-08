"use client";

import type { ReactNode } from "react";
import styles from "./LearnMoreButton.module.css";
import { cn } from "@/lib/utils";

// Adapted from the classic "learn-more" circle-arrow button (expanding
// dark pill + sliding arrow on hover), themed to the site's palette.
// Polymorphic: renders as <a> when href is given, otherwise <button>.
interface Props {
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  download?: boolean;
  children: ReactNode;
  className?: string;
}

export default function LearnMoreButton({ href, onClick, target, rel, download, children, className }: Props) {
  const content = (
    <>
      <span className={styles.circle}>
        <span className={`${styles.icon} ${styles.arrow}`} />
      </span>
      <span className={styles.buttonText}>{children}</span>
    </>
  );

  const cls = cn(styles.learnMore, className);

  if (href) {
    return (
      <a href={href} target={target} rel={rel} download={download} className={cls} data-magnetic="">
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls} data-magnetic="">
      {content}
    </button>
  );
}
