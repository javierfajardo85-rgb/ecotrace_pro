import styles from "./DocPage.module.css";

export function DocPage(props: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className={styles.wrap}>
      <div className="et-container">
        <header className={styles.h}>
          <h1>{props.title}</h1>
          {props.subtitle ? <p>{props.subtitle}</p> : null}
        </header>
        <article className={`${styles.card} et-card`}>{props.children}</article>
      </div>
    </div>
  );
}

