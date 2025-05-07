<template>
  <div class="actions text-center">
    <button class="rounded-full text-center text-white">
      <label
        class="switch relative inline-block w-[30px] h-[20px] "
        :class="{ 'w-[50px] h-[28px]': variant === 'slider' }"
      >
        <input
          type="checkbox"
          id="mySwitch"
          :checked="checked"
          :disabled="disabled"
          class="w-5 h-5 rounded-full bg-white absolute cursor-pointer top-1 left-1 right-1 bottom-1 transition duration-400"
          :class="{ 'opicty-0 w-0 h-0': variant === 'slider' }"
          ref="switchInput"
          @change="fireToggleEmit($event)"
        />
        <span
          v-if="variant === 'slider'"
          class="slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 color-second transition duration-400 rounded-full"
        ></span>
      </label>
    </button>
  </div>
</template>
<script lang="ts">
export default {
  props: {
    checked: {
      type: Boolean,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
    variant: {
      type: String,
      default: "slider", // Other possible values could be "toggle", "switch", etc.
    },
  },
  methods: {
    fireToggleEmit(event: Event) {
      const target = event.target as HTMLInputElement;
      const isChecked = target.checked;

      this.$emit("fireToggleEmit", isChecked);
    },
  },
};
</script>
<style scoped>
.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 5px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}
.switch input:checked + .slider {
  background-color: #5d53d2;
}
.switch input:checked + .slider:before {
  transform: translateX(24px);
}
</style>
