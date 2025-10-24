import styles from "./Sections.module.css";

type FooterSectionProps = {
  title: string;
  button: string;
};

export function FooterSection({ title, button }: FooterSectionProps) {
  const placeholderItems = Array.from({ length: 3 });

  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionContent}>
          <h2>{title}</h2>
          <button type="button" className={styles.ctaButton}>
            {button}
          </button>
          <div className={styles.placeholderGrid} aria-hidden="true">
            {placeholderItems.map((_, index) => (
              <div key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
