import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.wrap}>
      <div className="et-container">
        <div className={styles.grid}>
          <div>
            <div className={styles.brand}>
              <span className={styles.logo} aria-hidden="true">
                E
              </span>
              <div>
                <div className={styles.name}>EcoTrace</div>
                <div className={styles.tag}>Certidumbre climática auditable</div>
              </div>
            </div>
            <p className={styles.small}>
              Transparencia técnica para comercio electrónico. Diseñado para auditorías ISO 14064 y alineación con GHG Protocol.
            </p>
          </div>

          <div className={styles.col}>
            <div className={styles.h}>Producto</div>
            <Link className={styles.a} href="/docs">
              Documentación
            </Link>
            <Link className={styles.a} href="/metodologia">
              Metodología
            </Link>
            <Link className={styles.a} href="/transparencia">
              Transparencia
            </Link>
          </div>

          <div className={styles.col}>
            <div className={styles.h}>Legal</div>
            <Link className={styles.a} href="/legal/terms">
              Términos
            </Link>
            <Link className={styles.a} href="/legal/privacy">
              Privacidad (GDPR)
            </Link>
            <Link className={styles.a} href="/legal/carbon-claims">
              Carbon claims
            </Link>
          </div>

          <div className={styles.col}>
            <div className={styles.h}>Estado</div>
            <a className={styles.a} href="https://ecotrace-gx1q.onrender.com" target="_blank" rel="noreferrer">
              API Online
            </a>
            <span className={styles.small}>Backend: Render · Web: Vercel</span>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} EcoTrace</span>
          <span className={styles.dot}>·</span>
          <span className={styles.small}>ecotracegreen.com</span>
        </div>
      </div>
    </footer>
  );
}

