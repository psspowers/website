export function animateValue(
  element: HTMLElement,
  start: number,
  end: number,
  duration: number = 2000,
  format?: (value: number) => string
): void {
  let current = start;
  const range = end - start;
  const startTime = performance.now();

  function update(currentTime: number): void {
    const elapsed = currentTime - startTime;
    current = start + (range * (elapsed / duration));

    if (current >= end) {
      current = end;
      element.textContent = format ? format(current) : Math.round(current).toString();
      return;
    }

    element.textContent = format ? format(current) : Math.round(current).toString();
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}