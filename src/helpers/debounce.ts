export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      const context = executedFunction;
      clearTimeout(timeoutId);
      func.apply(context, args);
    };

    clearTimeout(timeoutId);
    timeoutId = setTimeout(later, wait);
  };
}
