import "@testing-library/jest-dom";

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "0px";
  readonly thresholds: ReadonlyArray<number>;
  private callback: IntersectionObserverCallback;
  private elements = new Set<Element>();

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.thresholds =
      options?.threshold !== undefined
        ? Array.isArray(options.threshold)
          ? options.threshold
          : [options.threshold]
        : [0];
  }

  observe(target: Element) {
    this.elements.add(target);
    const entry = this.createEntry(target);
    this.callback([entry], this);
  }

  unobserve(target: Element) {
    this.elements.delete(target);
  }

  disconnect() {
    this.elements.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  private createEntry(target: Element): IntersectionObserverEntry {
    const rect = target.getBoundingClientRect();
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    const viewportTop = 0;
    const viewportBottom = viewportHeight;
    const intersection = Math.max(
      0,
      Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, viewportTop)
    );
    const ratio = rect.height > 0 ? intersection / rect.height : 0;
    return {
      boundingClientRect: rect,
      intersectionRect: rect,
      intersectionRatio: ratio,
      rootBounds: null,
      target,
      time: Date.now(),
      isIntersecting: ratio > 0,
    };
  }
}

if (!(globalThis as Record<string, unknown>).IntersectionObserver) {
  (globalThis as Record<string, unknown>).IntersectionObserver = MockIntersectionObserver;
}
