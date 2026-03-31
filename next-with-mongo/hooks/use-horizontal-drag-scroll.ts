import React from "react";

export function useHorizontalDragScroll<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  disabled: boolean = false,
) {
  const [dragging, setDragging] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const interactiveSelector =
      "a, button, input, textarea, select, [data-no-drag]";

    const onDown = (e: MouseEvent | TouchEvent) => {
      if (disabled) return;
      const target = (e as MouseEvent).target ?? (e as TouchEvent).target;
      if (!(target instanceof HTMLElement)) return;
      if (target.closest(interactiveSelector)) return;
      if (e instanceof MouseEvent && e.button !== 0) return;

      isDown = true;
      setDragging(true);
      const pageX =
        e instanceof TouchEvent ? e.touches[0].pageX : (e as MouseEvent).pageX;
      startX = pageX;
      scrollLeft = el.scrollLeft;
      el.classList.add("no-select");
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const pageX =
        e instanceof TouchEvent ? e.touches[0].pageX : (e as MouseEvent).pageX;
      const walk = pageX - startX;
      el.scrollLeft = Math.round(scrollLeft - walk);
    };

    const onUp = () => {
      isDown = false;
      setDragging(false);
      el.classList.remove("no-select");
    };

    el.addEventListener("mousedown", onDown);
    el.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove as EventListener, {
      passive: false,
    });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);

    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("touchstart", onDown as EventListener);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove as EventListener);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [ref, disabled]);

  return dragging;
}
