import type { Ref } from 'vue';

type Entry = {
  elRef: Ref<HTMLElement | null>;
  setProgress: (v: number) => void;
};

const entries: Entry[] = [];
let raf = 0;
let listenerCount = 0;
let onScrollOrResize: (() => void) | null = null;
let removeVisualViewport: (() => void) | null = null;

function getScrollY(): number {
  return window.scrollY ?? document.documentElement.scrollTop ?? 0;
}

function elDocumentTop(el: Element): number {
  const r = el.getBoundingClientRect();
  return r.top + getScrollY();
}

function elDocumentBottom(el: Element): number {
  const r = el.getBoundingClientRect();
  return r.bottom + getScrollY();
}

/**
 * Точка на «луче внимания» в координатах документа (с учётом visual viewport),
 * в доле от видимой высоты — как раньше в `useCurvyLineScrollProgress`.
 */
function getFocusYDocument(): number {
  const sy = getScrollY();
  const vv = window.visualViewport;
  if (vv) {
    const t = 0.6;
    return sy + vv.offsetTop + vv.height * t;
  }
  return sy + window.innerHeight * 0.6;
}

function runAll() {
  const valid: { e: Entry; el: HTMLElement; top: number }[] = [];
  for (const e of entries) {
    const el = e.elRef.value;
    if (!el) {
      e.setProgress(0);
      continue;
    }
    valid.push({ e, el, top: el.getBoundingClientRect().top });
  }
  valid.sort((a, b) => a.top - b.top);

  if (valid.length === 0) {
    return;
  }

  const n = valid.length;
  const trackStart = elDocumentTop(valid[0].el);
  const trackEnd = elDocumentBottom(valid[n - 1].el);
  const range = Math.max(1, trackEnd - trackStart);

  const focusY = getFocusYDocument();
  let t = (focusY - trackStart) / range;
  t = Math.max(0, Math.min(1, t));

  for (let i = 0; i < n; i++) {
    const p = Math.max(0, Math.min(1, t * n - i));
    valid[i].e.setProgress(p);
  }
}

function schedule() {
  if (raf) {
    return;
  }
  raf = requestAnimationFrame(() => {
    raf = 0;
    runAll();
  });
}

function attachGlobalListeners() {
  onScrollOrResize = () => schedule();
  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize, { passive: true });
  const vv = window.visualViewport;
  if (vv) {
    vv.addEventListener('scroll', onScrollOrResize, { passive: true });
    vv.addEventListener('resize', onScrollOrResize, { passive: true });
    removeVisualViewport = () => {
      vv.removeEventListener('scroll', onScrollOrResize!);
      vv.removeEventListener('resize', onScrollOrResize!);
    };
  }
}

function detachGlobalListeners() {
  if (!onScrollOrResize) {
    return;
  }
  window.removeEventListener('scroll', onScrollOrResize);
  window.removeEventListener('resize', onScrollOrResize);
  removeVisualViewport?.();
  removeVisualViewport = null;
  onScrollOrResize = null;
}

/**
 * Несколько линий на странице: общий прогресс прокрутки t ∈ [0,1] от верха первой
 * линии до низа последней; у линии с индексом i (сверху вниз): max(0, min(1, t·N − i)).
 */
export function registerLineScrollBlock(
  elRef: Ref<HTMLElement | null>,
  setProgress: (v: number) => void
): () => void {
  const entry: Entry = { elRef, setProgress };
  entries.push(entry);
  if (listenerCount++ === 0) {
    attachGlobalListeners();
  }
  schedule();

  return () => {
    const idx = entries.indexOf(entry);
    if (idx >= 0) {
      entries.splice(idx, 1);
    }
    setProgress(0);
    if (--listenerCount === 0) {
      detachGlobalListeners();
    } else {
      schedule();
    }
  };
}
