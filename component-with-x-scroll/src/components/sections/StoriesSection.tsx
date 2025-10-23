import styles from "./Sections.module.css";

type StoriesSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  placeholders?: number;
};

export function StoriesSection({
  eyebrow,
  title,
  description,
  placeholders = 3,
}: StoriesSectionProps) {
  const placeholderItems = Array.from({ length: placeholders });

  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionContent}>
          <span className={styles.tag}>{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
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
