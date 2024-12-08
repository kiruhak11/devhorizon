export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/google-fonts",
    "nuxt-particles",
    "@pinia/nuxt",
    "@nuxt/ui",
    "@pinia-plugin-persistedstate/nuxt",
    "frog-modal",
    "@nuxtjs/device",
    "nuxt-swiper",
  ],
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: "strict",
    },
    storage: "localStorage",
  },
  colorMode: {
    preference: "system", // default value of $colorMode.preference
    fallback: "light", // fallback value if not system preference found
  },
  googleFonts: {
    families: {
      Ubuntu: [400, 500, 600, 700],
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/collection/index.scss";',
        },
      },
    },
  },
});
