import styles from "./Sections.module.css";

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
};

export function HeroSection({
  eyebrow,
  title,
  description,
  ctaLabel,
}: HeroSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionContent}>
          <span className={styles.tag}>{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <button type="button" className={styles.ctaButton}>
            {ctaLabel}
          </button>
        </div>
        <div className={styles.sectionMedia} aria-hidden="true" />
      </div>
    </section>
  );
}
