"use client";

import { useEffect, useId, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import styles from "./Sections.module.css";

const cardImagePaths = [
  "/images/cards/card-image-1.png",
  "/images/cards/card-image-2.png",
  "/images/cards/card-image-3.png",
  "/images/cards/card-image-4.png",
  "/images/cards/card-image-5.png",
];

const getCardImage = (index: number) =>
  cardImagePaths[index] ?? cardImagePaths[index % cardImagePaths.length];

export type PlanCardData = {
  label: string;
  title: string;
  description: string;
  image: string;
  width?: number;
};

export const defaultPlanCards: PlanCardData[] = [
  {
    label: "Plan de carrera seguro",
    title: "Consulta de carrera gratuita",
    description: "Obtendrás un plan personalizado basado en tus fortalezas, objetivos y experiencia",
    image: getCardImage(0),
    width: 407,
  },
  {
    label: "Habilidades tech en demanda",
    title: "Bootcamp en línea",
    description: "Aprende de forma práctica todo lo necesario para convertirte en Analista de Datos",
    image: getCardImage(1),
    width: 534,
  },
  {
    label: "¡Estás listo para ser contratado!",
    title: "Acelerador de carrera",
    description: "Trabajarás 1 a 1 con un coach personal para elaborar un CV llamativo, armar un portafolio de proyectos reales y llegar a tus entrevistas preparado",
    image: getCardImage(2),
    width: 538,
  },
  {
    label: "Ingresos remotos + equilibrio trabajo-vida",
    title: "Tu primer empleo tech",
    description: "Podrás ganar desde $30,000 MXN al mes, con la oportunidad de trabajar a nivel global",
    image: getCardImage(3),
    width: 498,
  },
  {
    label: "Una red que te respalda",
    title: "Apoyo de la comunidad TripleTen",
    description: "Conectarás con personas afines, para compartir logros y seguir creciendo juntos",
    image: getCardImage(4),
    width: 530,
  },
];

type MainSectionProps = {
  title: ReactNode;
  button: string;
  cards?: PlanCardData[];
};

export function MainSection({
  title,
  button,
  cards = defaultPlanCards,
}: MainSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = sectionRef.current;
    const track = scrollerRef.current;
    if (!container || !track) {
      return;
    }

    const ACTIVATE_RATIO = 0.7;
    const DEACTIVATE_RATIO = 0.6;
    const noSnapClass = styles.scrollerNoSnap;

    let active = false;
    let touchY = 0;
    let snapTimer: ReturnType<typeof setTimeout> | null = null;

    const atStart = () => track.scrollLeft <= 1;
    const atEnd = () =>
      Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth - 1;

    const beginFreeScroll = () => {
      if (noSnapClass) {
        track.classList.add(noSnapClass);
      }
      if (snapTimer) {
        clearTimeout(snapTimer);
      }
      snapTimer = setTimeout(endFreeScroll, 140);
    };

    const endFreeScroll = () => {
      if (noSnapClass) {
        track.classList.remove(noSnapClass);
      }
    };

    const visibleRatio = () => {
      const rect = container.getBoundingClientRect();
      const viewportTop = 0;
      const viewportBottom =
        window.innerHeight || document.documentElement.clientHeight;
      const intersection = Math.max(
        0,
        Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, viewportTop)
      );
      return intersection / Math.max(1, rect.height);
    };

    const activate = () => {
      if (active) return;
      active = true;
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("keydown", onKey, { passive: false });
      track.addEventListener("touchstart", onTouchStart, { passive: true });
      track.addEventListener("touchmove", onTouchMove, { passive: false });
      track.setAttribute("aria-live", "polite");
    };

    const deactivate = () => {
      if (!active) return;
      active = false;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchmove", onTouchMove);
      track.removeAttribute("aria-live");
      if (snapTimer) {
        clearTimeout(snapTimer);
      }
      if (noSnapClass) {
        track.classList.remove(noSnapClass);
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (!active) return;

      const dominantDelta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX || event.deltaY;

      if (dominantDelta === 0) {
        return;
      }

      const goingForward = dominantDelta > 0;
      if ((atStart() && !goingForward) || (atEnd() && goingForward)) {
        return;
      }

      beginFreeScroll();
      track.scrollLeft += dominantDelta;
      event.preventDefault();
      event.stopPropagation();
    };

    const onKey = (event: KeyboardEvent) => {
      if (!active) return;
      const key = event.key;
      const pageDistance = track.clientWidth * 0.9;
      const stepDistance = Math.max(40, Math.round(track.clientWidth * 0.2));

      const goLeft = (amount: number) => {
        if (atStart()) return;
        track.scrollBy({ left: -amount, behavior: "smooth" });
      };
      const goRight = (amount: number) => {
        if (atEnd()) return;
        track.scrollBy({ left: amount, behavior: "smooth" });
      };

      switch (key) {
        case "ArrowDown":
          event.preventDefault();
          goRight(stepDistance);
          break;
        case "PageDown":
          event.preventDefault();
          goRight(pageDistance);
          break;
        case " ":
          event.preventDefault();
          event.shiftKey ? goLeft(pageDistance) : goRight(pageDistance);
          break;
        case "ArrowUp":
          event.preventDefault();
          goLeft(stepDistance);
          break;
        case "PageUp":
          event.preventDefault();
          goLeft(pageDistance);
          break;
        case "Home":
          event.preventDefault();
          track.scrollTo({ left: 0, behavior: "smooth" });
          break;
        case "End":
          event.preventDefault();
          track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
          break;
        default:
          break;
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      const initialY = event.touches[0]?.clientY;
      if (typeof initialY === "number") {
        touchY = initialY;
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!active) return;
      const currentY = event.touches[0]?.clientY;
      if (typeof currentY !== "number") {
        return;
      }

      const delta = touchY - currentY;
      const goingForward = delta > 0;
      if ((atStart() && !goingForward) || (atEnd() && goingForward)) {
        return;
      }

      beginFreeScroll();
      track.scrollLeft += delta;
      touchY = currentY;
      event.preventDefault();
    };

    const onTouchStartBootstrap = (event: TouchEvent) => {
      if (active) return;
      const initialY = event.touches[0]?.clientY;
      if (typeof initialY === "number") {
        touchY = initialY;
      }
      activate();
    };

    const handleScrollState = () => {
      const ratio = visibleRatio();
      if (ratio >= ACTIVATE_RATIO) {
        activate();
      } else if (ratio <= DEACTIVATE_RATIO) {
        deactivate();
      }
    };

    const thresholds = Array.from({ length: 101 }, (_, index) => index / 100);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target !== container) return;
          const ratio = entry.intersectionRatio;
          if (ratio >= ACTIVATE_RATIO) {
            activate();
          } else if (ratio <= DEACTIVATE_RATIO) {
            deactivate();
          }
        });
      },
      { threshold: thresholds }
    );

    const onPointerEnter = () => {
      if (!active) activate();
    };

    const onPointerLeave = () => {
      if (visibleRatio() <= DEACTIVATE_RATIO) {
        deactivate();
      }
    };

    observer.observe(container);
    window.addEventListener("scroll", handleScrollState, { passive: true });
    window.addEventListener("resize", handleScrollState, { passive: true });

    track.addEventListener("pointerenter", onPointerEnter);
    track.addEventListener("pointerleave", onPointerLeave);
    track.addEventListener("mouseenter", onPointerEnter);
    track.addEventListener("mouseleave", onPointerLeave);
    track.addEventListener("focusin", onPointerEnter);
    track.addEventListener("focusout", onPointerLeave);
    track.addEventListener("touchstart", onTouchStartBootstrap, {
      passive: true,
    });

    handleScrollState();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScrollState);
      window.removeEventListener("resize", handleScrollState);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchmove", onTouchMove);
      track.removeEventListener("pointerenter", onPointerEnter);
      track.removeEventListener("pointerleave", onPointerLeave);
      track.removeEventListener("mouseenter", onPointerEnter);
      track.removeEventListener("mouseleave", onPointerLeave);
      track.removeEventListener("focusin", onPointerEnter);
      track.removeEventListener("focusout", onPointerLeave);
      track.removeEventListener("touchstart", onTouchStartBootstrap);
      if (snapTimer) {
        clearTimeout(snapTimer);
      }
      if (noSnapClass) {
        track.classList.remove(noSnapClass);
      }
      track.removeAttribute("aria-live");
    };
  }, []);

  const scrollerCards = cards.length > 0 ? cards : defaultPlanCards;
  const headingId = useId();

  return (
    <section ref={sectionRef} className={`${styles.section} ${styles.mainSection}`}>
      <div className={`${styles.sectionInner} ${styles.mainLayout}`}>
        <aside className={styles.mainLeadColumn}>
          <div className={styles.mainLeadHeader}>
            <h2 id={headingId}>{title}</h2>
            <button type="button" className={styles.ctaButton}>
              {button}
            </button>
          </div>
        </aside>
        <div
          className={`${styles.sectionScroller} ${styles.mainScroller}`}
          role="region"
          aria-labelledby={headingId}
        >
          <div
            ref={scrollerRef}
            className={styles.scroller}
            role="list"
            tabIndex={-1}
          >
            <div className={styles.scrollerTrack}>
              {scrollerCards.map((card) => {
                const cardStyle: CSSProperties | undefined = card.width
                  ? { width: `${card.width}px` }
                  : undefined;
                const imageStyle: CSSProperties | undefined = card.image
                  ? { backgroundImage: `url(${card.image})` }
                  : undefined;

                return (
                  <article
                    key={card.title}
                    className={styles.card}
                    role="listitem"
                    style={cardStyle}
                  >
                    <span className={styles.cardLabel}>{card.label}</span>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <div
                      className={styles.cardImage}
                      aria-hidden="true"
                      style={imageStyle}
                    />
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
