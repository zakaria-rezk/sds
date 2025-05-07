<template>
  <section
    class="otp-component bg-cyan-100 flex items-center justify-center py-14 h-[100vh]"
  >
    <div class="w-full flex items-center flex-col justify-center">
      <svg
        width="55"
        height="55"
        viewBox="0 0 55 55"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0.5"
          y="0.5"
          width="54"
          height="54"
          rx="13.5"
          stroke="black"
          stroke-opacity="0.15"
        />
        <path
          d="M18.6282 34.3238C18.3515 34.3238 18.0928 34.251 17.8718 34.1233L24.3897 28.4429L24.9981 28.9723C25.5073 29.4148 26.1447 29.6388 26.7761 29.6388C27.4106 29.6388 28.048 29.4148 28.5572 28.9723L29.1653 28.4429L31.3719 30.3665C31.6214 29.946 31.9315 29.5671 32.2912 29.2397L30.2712 27.4797L36.452 22.0874V28.0445C37.0267 28.1493 37.5656 28.3548 38.0522 28.6421V21.3512C38.0522 21.1448 38.032 20.9405 37.9942 20.7428C37.8923 20.2307 37.6654 19.7621 37.3484 19.3749C37.2814 19.2906 37.2115 19.215 37.1356 19.1395C36.5741 18.5749 35.7854 18.2227 34.9239 18.2227H18.6282C17.7667 18.2227 16.9812 18.5749 16.4165 19.1395C16.3409 19.215 16.2711 19.2906 16.2041 19.3749C15.8868 19.7621 15.6599 20.2307 15.5611 20.7428C15.5202 20.9405 15.5 21.1448 15.5 21.3512V32.7963C15.5 33.2354 15.5931 33.6574 15.759 34.0386C15.9129 34.4024 16.1402 34.7316 16.4165 35.0076C16.4864 35.0775 16.5562 35.1417 16.6318 35.2056C17.1732 35.6538 17.8718 35.9245 18.6282 35.9245H31.7757C31.3952 35.4542 31.099 34.9135 30.9126 34.3237H18.6282V34.3238ZM17.5483 20.2713C17.8278 19.9921 18.2033 19.8232 18.6282 19.8232H34.924C35.3489 19.8232 35.7275 19.9922 36.0039 20.2713C36.053 20.3211 36.0996 20.3765 36.1408 20.4315L27.5997 27.8754C27.364 28.0819 27.0729 28.1839 26.7761 28.1839C26.4822 28.1839 26.1913 28.0819 25.9524 27.8754L17.4148 20.4284C17.4526 20.3733 17.4992 20.3211 17.5483 20.2713ZM17.1001 32.7963V22.0845L23.2812 27.4766L17.1033 32.863C17.1001 32.8426 17.1001 32.8196 17.1001 32.7963Z"
          fill="black"
        />
        <path
          d="M35.5759 28.9277C33.4086 28.9277 31.6523 30.6846 31.6523 32.8519C31.6523 35.0188 33.4086 36.7757 35.5759 36.7757C37.7435 36.7757 39.5 35.0188 39.5 32.8519C39.5 30.6846 37.7435 28.9277 35.5759 28.9277ZM36.1827 34.7286H35.2297V32.0839H35.2183L34.5272 32.4103L34.383 31.575L35.3512 31.1324H36.1827L36.1827 34.7286Z"
          fill="black"
        />
      </svg>
      <h2 class="font-bold font-xl mt-8 text-systemColor">
        {{ $t("otp.title") }}
      </h2>
      <p class="mt-4 px-3 text-center">{{ $t("otp.sub-title") }}</p>
      <div class="flex space-x-2 justify-center mt-8">
        <input
          v-for="(value, index) in otp"
          :key="index"
          v-model="otp[index]"
          type="text"
          inputmode="numeric"
          maxlength="1"
          placeholder="-"
          @input="handleInput(index)"
          @keydown.backspace="handleBackspace(index)"
          class="md:w-16 md:h-16 w-10 h-10 font-bold text-systemColor md:text-2xl text-center border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
          ref="otpInput"
        />
      </div>
      <div class="w-[300px] py-10">
        <button-component
          :title="$t('otp.btn')"
          @click="sentOtp"
          :loading="false"
        />
      </div>
      <p>
        {{ $t("otp.no-code") }}
        <button>
          <span class="text-systemColor"> {{ $t("otp.new-code") }}</span>
        </button>
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
export default {
  components: {
    ButtonComponent,
  },
  beforeMount() {
  
  },
  data: () => ({
    otp: Array<number>(6).fill(undefined),
  }),
  methods: {
    handleInput(index: number) {
      this.otp[index] = this.otp[index].replace(/[^0-9]/g, "").slice(0, 1);
      if (this.otp[index] && index < this.otp.length - 1) {
        this.$refs.otpInput[index + 1].focus();
      }
      if (this.otp.join("").length === this.otp.length) {
        this.$emit("otp-complete", this.otp.join(""));
      }
    },
    handleBackspace(index: number) {
      if (!this.otp[index] && index > 0) {
        this.$refs.otpInput[index - 1].focus();
      }
    },
    sentOtp() {
   
    },
  },
};
</script>

