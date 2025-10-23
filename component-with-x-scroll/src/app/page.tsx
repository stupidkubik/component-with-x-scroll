import {
  HeroSection,
  PlansSection,
  StoriesSection,
  type PlanCardData,
} from "@/components/sections";
import styles from "./page.module.css";

const planCards: PlanCardData[] = [
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
];

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
        cards={planCards}
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
