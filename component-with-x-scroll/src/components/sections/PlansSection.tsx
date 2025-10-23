"use client";

import { useEffect, useRef } from "react";
import styles from "./Sections.module.css";

export type PlanCardData = {
  label: string;
  title: string;
  description: string;
};

export const defaultPlanCards: PlanCardData[] = [
  {
    label: "Plan de carrera seguro",
    title: "Consulta de carrera gratuita",
    description:
      "Obtendrás un plan personalizado basado en tus fortalezas, objetivos y experiencia.",
  },
  {
    label: "Habilidades tech en demanda",
    title: "Bootcamp en línea",
    description:
      "Aprende de forma práctica todo lo necesario para convertirte en Analista de Datos.",
  },
  {
    label: "Mentorías guiadas",
    title: "Sesiones 1:1 con expertos",
    description:
      "Obtén respuestas puntuales y guía constante para mantener el ritmo de estudio.",
  },
  {
    label: "Seguimiento continuo",
    title: "Eventos en vivo cada semana",
    description:
      "Resuelve dudas en directo con mentores y mantén tu motivación con la comunidad.",
  },
  {
    label: "Comunidad activa",
    title: "Networking con profesionales",
    description:
      "Participa en espacios colaborativos y conecta con otros aspirantes y expertos del sector.",
  },
  {
    label: "Portafolio en marcha",
    title: "Proyectos prácticos guiados",
    description:
      "Construye piezas reales para tu portafolio mientras recibes retroalimentación personalizada.",
  },
];

type PlansSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  cards?: PlanCardData[];
};

export function PlansSection({
  eyebrow,
  title,
  description,
  cards = defaultPlanCards,
}: PlansSectionProps) {
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

  const resolvedCards = cards.length > 0 ? cards : defaultPlanCards;
  const [featuredCard, ...restCards] = resolvedCards;
  const scrollerCards = restCards.length > 0 ? restCards : resolvedCards;

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
          <div
            ref={scrollerRef}
            className={styles.scroller}
            role="list"
            tabIndex={-1}
          >
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
