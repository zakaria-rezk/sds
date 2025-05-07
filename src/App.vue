<template>
  <div
    class="w-full transition-all duration-300"
    :dir="isRtl ? 'rtl' : 'ltr'"
    :class="fontClass"
  >
    <sidebar-component
      v-if="showLayout"
      :isSidebarOpen="isSidebarOpen"
      @toggleSidebar="toggleSidebar"
      :class="
        isSidebarOpen ? (isRtl ? 'mr-72' : 'ml-72') : isRtl ? 'mr-0' : 'ml-0'
      "
    />
    <div
      :class="
        isSidebarExist ? (isRtl ? 'mr-0' : 'ml-0') : isRtl ? 'mr-12' : 'ml-12'
      "
    >
      <div
        v-if="showSidebar"
        class="transition-all duration-300"
        :class="[
          'lg:p-0 md:p-0 sm:p-0',
          isSidebarOpen
            ? isRtl
              ? 'lg:mr-64 lg:ml-8 md:ml-0 sm:ml-0'
              : 'lg:ml-64 lg:mr-8 md:ml-0 sm:ml-0'
            : isRtl
            ? 'lg:mr-0 lg:ml-8 md:mr-0 sm:mr-0 '
            : 'lg:ml-0 lg:mr-8 md:ml-0 sm:ml-0',
        ]"
      >
        <RouterView v-slot="{ Component }">
          <component
            :is="Component"
            :isSidebarOpen="isSidebarOpen"
            class="page-slide mx-8"
          ></component>
        </RouterView>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import SidebarComponent from "@/components/Layouts/AppLayoutComponents/SidebarComponent.vue";

export default {
  components: { SidebarComponent },
  data: () => ({
    isSidebarOpen: false,
    isLargeScreen: window.innerWidth >= 1024, // Track if screen size is large
  }),
  computed: {
    isRtl() {
      return this.$i18n.locale !== "en";
    },
    fontClass() {
      return this.$i18n.locale === "ar" ? "font-arabic" : "font-english";
    },
    showLayout() {
      return this.$route.meta?.showLayout !== false;
    },
    showSidebar() {
      return this.$route.meta.showSidebar !== false;
    },
    isSidebarExist() {
      return this.$route.meta.isSidebarExist !== true;
    },
  },
  watch: {
    $route: "updateSidebarState",
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    updateSidebarState() {
      this.isSidebarOpen =
        this.isLargeScreen && this.$route.meta.autoOpenSidebar === true;
    },
    loggedUserData() {
      const Key = localStorage.getItem("TOKEN_KEY");
      if (Key) {
        this.$store
          .dispatch("authentication_module/getUserData")
          .then((r) => {});
      }
    },
    handleResize() {
      this.isLargeScreen = window.innerWidth >= 1024;
      this.updateSidebarState();
    },
  },
  mounted() {
    // this.loggedUserData();
    this.updateSidebarState();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #c4b5fd;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #c4b5fd, #7c3aed);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #7c3aed, #5b21b6);
}
.page-slide {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(80px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dark body {
  background-color: #252525;
}

.font-english h1,
.font-english h2,
.font-english h3,
.font-english h4,
.font-english h5,
.font-english h6,
.font-english span,
.font-english p,
.font-english input,
.font-english input::placeholder,
.font-english label,
.font-english li {
  font-family: "Plus Jakarta Sans", sans-serif;
}

.font-arabic h1,
.font-arabic h2,
.font-arabic h3,
.font-arabic h4,
.font-arabic h5,
.font-arabic h6,
.font-arabic span,
.font-arabic p,
.font-arabic input,
.font-arabic input::placeholder,
.font-arabic label,
.font-arabic li {
  font-family: "Cairo", sans-serif;
}
</style>
