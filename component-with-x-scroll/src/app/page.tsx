import { HeroSection, PlansSection, StoriesSection } from "@/components/sections";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <HeroSection
        eyebrow="Tu camino"
        title="Tu primer empleo tech paso a paso"
        description="Sigue un plan claro y enfocado en resultados con el acompañamiento de especialistas en carrera."
        ctaLabel="Agenda una consulta"
      />

      <PlansSection
        eyebrow="Planes personalizados"
        title="Elegí el acompañamiento ideal para tu objetivo"
        description="Desplaza horizontalmente para revisar las propuestas claves del programa."
      />

      <StoriesSection
        eyebrow="Resultados reales"
        title="Historias de quienes ya dieron el salto"
        description="Conecta con la comunidad, aprende de sus experiencias y descubre cómo potenciar tu perfil profesional."
        placeholders={3}
      />
    </main>
  );
}
