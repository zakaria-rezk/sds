import { DirectiveBinding } from "vue";

interface EnterElement extends HTMLElement {
  _enterHandler?: (event: KeyboardEvent) => void;
}

const clickEnter = {
  beforeMount(
    el: EnterElement,
    binding: DirectiveBinding<(event: KeyboardEvent) => void>
  ) {
    const enterHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        binding.value(event); // Trigger the passed function on Enter key press
      }
    };

    el._enterHandler = enterHandler;
    el.addEventListener("keydown", enterHandler);
  },

  unmounted(el: EnterElement) {
    if (el._enterHandler) {
      el.removeEventListener("keydown", el._enterHandler);
      delete el._enterHandler;
    }
  },
};

export default clickEnter;
