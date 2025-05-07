import { DirectiveBinding } from "vue";

interface ClickOutsideElement extends HTMLElement {
  _clickOutsideHandler?: (event: MouseEvent) => void;
}

const clickOutside = {
  beforeMount(
    el: ClickOutsideElement,
    binding: DirectiveBinding<(event: MouseEvent) => void>
  ) {
    const clickOutsideHandler = (event: MouseEvent) => {
      // 
      const eventTarget = event.target as HTMLElement;

      if (
        !(el === eventTarget || el.contains(eventTarget)) &&
        !!!eventTarget.closest("button")
      ) {
        binding.value(event);
      }
      //  else {
      //   
      // }
    };
    document.addEventListener("click", clickOutsideHandler);
    el._clickOutsideHandler = clickOutsideHandler;
  },

  unmounted(el: ClickOutsideElement) {
    if (el._clickOutsideHandler) {
      document.removeEventListener("click", el._clickOutsideHandler);
      delete el._clickOutsideHandler;
    }
  },
};

export default clickOutside;
