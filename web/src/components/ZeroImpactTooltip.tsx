"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const ease = [0.22, 1, 0.36, 1] as const;

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

const POPOVER_W = 288;

export function ZeroImpactTooltip() {
  const { t } = useTranslation();
  const popoverId = useId();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const gap = 8;
    const left = Math.min(
      Math.max(8, r.right - POPOVER_W),
      window.innerWidth - POPOVER_W - 8,
    );
    setPos({ top: r.top - gap, left });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function reposition() {
      const el = triggerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const gap = 8;
      const left = Math.min(
        Math.max(8, r.right - POPOVER_W),
        window.innerWidth - POPOVER_W - 8,
      );
      setPos({ top: r.top - gap, left });
    }
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      const n = e.target as Node;
      if (triggerRef.current?.contains(n)) return;
      if (popoverRef.current?.contains(n)) return;
      setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const popover =
    mounted &&
    createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            ref={popoverRef}
            id={popoverId}
            role="dialog"
            aria-label={t("widget.zeroImpactTooltipTitle")}
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease }}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              width: POPOVER_W,
              transform: "translateY(-100%)",
            }}
            className="z-[110] rounded-xl border border-slate-200/90 bg-white/95 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/[0.04] backdrop-blur-md"
          >
            <div className="text-xs font-bold tracking-tight text-slate-950">{t("widget.zeroImpactTooltipTitle")}</div>
            <p className="mt-2.5 text-[11px] leading-relaxed text-slate-600">{t("widget.zeroImpactTooltipBody")}</p>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
    );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-brand-gold/40 bg-brand-gold/10 text-[#D4AF77] transition hover:border-brand-gold hover:bg-brand-gold/15"
        aria-label={t("widget.zeroImpactTooltipAria")}
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
      >
        <InfoIcon className="shrink-0 text-[#D4AF77]" />
      </button>
      {popover}
    </>
  );
}
