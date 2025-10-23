import styles from "./page.module.css";

const scrollerCards = [
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
];

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionContent}>
            <span className={styles.tag}>Tu camino</span>
            <h1>Tu primer empleo tech paso a paso</h1>
            <p>
              Sigue un plan claro y enfocado en resultados con el acompañamiento
              de especialistas en carrera.
            </p>
            <button type="button" className={styles.ctaButton}>
              Agenda una consulta
            </button>
          </div>
          <div className={styles.sectionMedia} aria-hidden="true" />
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionScroller}`}>
        <div className={styles.sectionInner}>
          <header className={styles.sectionHeader}>
            <div>
              <span className={styles.tag}>Planes personalizados</span>
              <h2>Elegí el acompañamiento ideal para tu objetivo</h2>
            </div>
            <p>
              Desplaza horizontalmente para revisar las propuestas claves del
              programa.
            </p>
          </header>

          <div className={styles.scroller} role="region" aria-label="Planes">
            <div className={styles.scrollerTrack}>
              {scrollerCards.map((card) => (
                <article key={card.title} className={styles.card}>
                  <span className={styles.cardLabel}>{card.label}</span>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <div className={styles.cardMedia} aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionContent}>
            <span className={styles.tag}>Resultados reales</span>
            <h2>Historias de quienes ya dieron el salto</h2>
            <p>
              Conecta con la comunidad, aprende de sus experiencias y descubre
              cómo potenciar tu perfil profesional.
            </p>
            <div className={styles.placeholderGrid} aria-hidden="true">
              <div />
              <div />
              <div />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
