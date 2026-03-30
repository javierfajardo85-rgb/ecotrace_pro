import Link from "next/link";
import styles from "./Nav.module.css";

export function Nav() {
  return (
    <header className={styles.wrap}>
      <div className="et-container">
        <div className={styles.bar}>
          <Link className={styles.brand} href="/">
            <span className={styles.logo} aria-hidden="true">
              E
            </span>
            <span className={styles.brandText}>
              <span className={styles.brandName}>EcoTrace</span>
              <span className={styles.brandTag}>Auditable climate compliance</span>
            </span>
          </Link>

          <nav className={styles.nav} aria-label="Primary">
            <Link className={styles.link} href="/transparencia">
              Transparencia
            </Link>
            <Link className={styles.link} href="/metodologia">
              Metodología
            </Link>
            <Link className={styles.link} href="/docs">
              Docs
            </Link>
            <Link className={styles.link} href="/legal/privacy">
              Legal
            </Link>
          </nav>

          <div className={styles.cta}>
            <a className={styles.btnSecondary} href="#waitlist">
              Ver demo
            </a>
            <a className={styles.btnPrimary} href="#waitlist">
              Instalar en Shopify
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

