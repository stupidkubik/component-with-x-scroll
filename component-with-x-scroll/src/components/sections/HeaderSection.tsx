import styles from "./Sections.module.css";

type HeaderSectionProps = {
  title: string;
  button: string;
};

export function HeaderSection({ title, button }: HeaderSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionContent}>
          <h1>{title}</h1>
          <button type="button" className={styles.ctaButton}>
            {button}
          </button>
        </div>
        <div className={styles.sectionMedia} aria-hidden="true" />
      </div>
    </section>
  );
}
