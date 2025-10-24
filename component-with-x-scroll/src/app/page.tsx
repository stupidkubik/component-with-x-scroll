import { HeaderSection, MainSection, FooterSection } from "@/components/sections";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      {/*     <HeaderSection
        title="Tu primer empleo tech paso a paso"
        button="Agenda una consulta"
      /> */}

      <MainSection
        title={
          <>
            Tu camino paso a paso <strong>hacia tu primer empleo tech</strong>
          </>
        }
        button="Agenda una consulta"
      />

      <FooterSection
        title="Historias de quienes ya dieron el salto"
        button="Explorar historias"
      />
    </main>
  );
}
