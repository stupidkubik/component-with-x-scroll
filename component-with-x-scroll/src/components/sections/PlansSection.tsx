"use client";

import { useEffect, useRef } from "react";
import styles from "./Sections.module.css";

export type PlanCardData = {
  label: string;
  title: string;
  description: string;
};

type PlansSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  cards: PlanCardData[];
};

export function PlansSection({
  eyebrow,
  title,
  description,
  cards,
}: PlansSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const section = sectionRef.current;
      const scroller = scrollerRef.current;

      if (!section || !scroller) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const sectionFullyInView =
        rect.top >= 0 && rect.bottom <= viewportHeight;
      const viewportWithinSection =
        rect.top <= 0 && rect.bottom >= viewportHeight;

      if (!sectionFullyInView && !viewportWithinSection) {
        return;
      }

      const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
      if (maxScrollLeft <= 0) {
        return;
      }

      if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) {
        return;
      }

      const rawDelta =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaY * 40 : event.deltaY;
      if (rawDelta === 0) {
        return;
      }

      const delta = rawDelta;
      const tolerance = 1;
      const atStart = scroller.scrollLeft <= tolerance;
      const atEnd = scroller.scrollLeft >= maxScrollLeft - tolerance;

      if ((delta > 0 && atEnd) || (delta < 0 && atStart)) {
        return;
      }

      const nextPosition = Math.min(
        Math.max(scroller.scrollLeft + delta, 0),
        maxScrollLeft
      );

      if (Math.abs(nextPosition - scroller.scrollLeft) < 0.5) {
        return;
      }

      event.preventDefault();
      scroller.scrollTo({ left: nextPosition, behavior: "auto" });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const [featuredCard, ...restCards] = cards;
  const scrollerCards = restCards.length > 0 ? restCards : cards;

  return (
    <section ref={sectionRef} className={`${styles.section} ${styles.plansSection}`}>
      <div className={`${styles.sectionInner} ${styles.plansLayout}`}>
        <aside className={styles.plansAside}>
          <div className={styles.plansAsideHeading}>
            <span className={styles.tag}>{eyebrow}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          {featuredCard && (
            <article className={styles.plansFeatured}>
              <span className={styles.cardLabel}>{featuredCard.label}</span>
              <h3>{featuredCard.title}</h3>
              <p>{featuredCard.description}</p>
              <div className={styles.plansFeaturedMedia} aria-hidden="true">
                <div className={styles.plansFeaturedMediaPrimary} />
                <div className={styles.plansFeaturedMediaSecondary} />
              </div>
            </article>
          )}
        </aside>
        <div
          className={`${styles.sectionScroller} ${styles.plansScroller}`}
          role="region"
          aria-label={title}
        >
          <div ref={scrollerRef} className={styles.scroller} role="list">
            <div className={styles.scrollerTrack}>
              {scrollerCards.map((card) => (
                <article key={card.title} className={styles.card} role="listitem">
                  <span className={styles.cardLabel}>{card.label}</span>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <div className={styles.cardMedia} aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
