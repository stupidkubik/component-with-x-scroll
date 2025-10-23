import { render, screen } from "@testing-library/react";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  PlansSection,
  defaultPlanCards,
  type PlanCardData,
} from "./PlansSection";

const cards: PlanCardData[] = defaultPlanCards.map((card, index) => ({
  ...card,
  label: `${card.label} (${index})`,
}));

type Rect = ReturnType<HTMLElement["getBoundingClientRect"]>;

const defaultRect: Rect = {
  top: 0,
  left: 0,
  bottom: 770,
  right: 1280,
  width: 1280,
  height: 770,
  x: 0,
  y: 0,
  toJSON: () => ({}),
};

let currentRect: Rect = defaultRect;

const rectSpy = vi
  .spyOn(HTMLElement.prototype, "getBoundingClientRect")
  .mockImplementation(function () {
    if (this instanceof HTMLElement) {
      return currentRect;
    }
    return defaultRect;
  });

beforeEach(() => {
  currentRect = defaultRect;
});

afterAll(() => {
  rectSpy.mockRestore();
});

async function renderPlansSection() {
  render(
    <PlansSection
      eyebrow="Planes personalizados"
      title="Elige tu plan"
      description="Lista de planes con overflow horizontal."
      cards={cards}
    />
  );

  const list = await screen.findByRole("list");
  const scroller = list as HTMLDivElement;

  const metrics = mockHorizontalOverflow(scroller, {
    scrollWidth: 2000,
    clientWidth: 960,
  });

  return {
    scroller,
    getScrollLeft: () => metrics.getScrollLeft(),
    setScrollLeft: (value: number) => metrics.setScrollLeft(value),
  };
}

type ScrollMetricsOptions = {
  scrollWidth: number;
  clientWidth: number;
  initialScrollLeft?: number;
};

function mockHorizontalOverflow(
  element: HTMLDivElement,
  { scrollWidth, clientWidth, initialScrollLeft = 0 }: ScrollMetricsOptions
) {
  let internalScrollLeft = initialScrollLeft;

  Object.defineProperty(element, "scrollWidth", {
    configurable: true,
    value: scrollWidth,
  });

  Object.defineProperty(element, "clientWidth", {
    configurable: true,
    value: clientWidth,
  });

  Object.defineProperty(element, "scrollLeft", {
    configurable: true,
    get: () => internalScrollLeft,
    set: (value: number) => {
      internalScrollLeft = value;
    },
  });

  element.scrollTo = ((options: ScrollToOptions | number, top?: number) => {
    if (typeof options === "number") {
      internalScrollLeft = options;
      return;
    }

    if (typeof options.left === "number") {
      internalScrollLeft = options.left;
    } else if (typeof top === "number") {
      internalScrollLeft = top;
    }
  }) as typeof element.scrollTo;

  return {
    getScrollLeft: () => internalScrollLeft,
    setScrollLeft: (value: number) => {
      internalScrollLeft = value;
    },
  };
}

describe("PlansSection wheel scrolling", () => {
  it("maps vertical wheel gestures to horizontal scroll when section is anchored", async () => {
    const { getScrollLeft } = await renderPlansSection();

    const event = new WheelEvent("wheel", { deltaY: 100, cancelable: true });
    window.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(getScrollLeft()).toBeGreaterThan(0);
  });

  it("lets vertical scroll pass through after reaching the horizontal end", async () => {
    const { getScrollLeft, setScrollLeft } = await renderPlansSection();
    setScrollLeft(1040);

    const event = new WheelEvent("wheel", { deltaY: 120, cancelable: true });
    window.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(getScrollLeft()).toBeGreaterThanOrEqual(1040);
  });

  it("does not intercept wheel scrolling until the section is fully visible", async () => {
    currentRect = {
      ...defaultRect,
      top: 400,
      bottom: 1170,
    };

    const { getScrollLeft } = await renderPlansSection();

    const event = new WheelEvent("wheel", { deltaY: 120, cancelable: true });
    window.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(getScrollLeft()).toBe(0);
  });
});
