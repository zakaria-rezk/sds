import { ref, onMounted, onUnmounted, watch } from "vue";

export function useIntersectionObserver(callback: () => void) {
  const targetElement = ref<HTMLElement | null>(null);
  let observer: IntersectionObserver | null = null;

  const startObserving = () => {
    if (!targetElement.value) return;

    observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: "0px",
      threshold: 1,
    });

    observer.observe(targetElement.value);
  };

  const stopObserving = () => {
    if (observer && targetElement.value) {
      observer.unobserve(targetElement.value);
      observer.disconnect();
    }
  };

  onMounted(startObserving);
  onUnmounted(stopObserving);

  watch(targetElement, (newVal) => {
    if (newVal) startObserving();
  });

  return { targetElement };
}
