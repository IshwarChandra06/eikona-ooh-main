import colors from "vuetify/es5/util/colors";

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  ssr: false,
  head: {
    titleTemplate: "%s - OOH",
    title: "Eikona",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~/assets/style.css"],
  loading: "~/components/PageLoader.vue",
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["~/plugins/notifications.js", "~/plugins/axios"],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  modules: ["@nuxtjs/axios", "@nuxtjs/auth-next", "vue-sweetalert2/nuxt"],
  axios: {
    // baseURL: process.env.BK_URL || "http://103.74.54.133:8081/",
    // authenticated url
    // baseURL: process.env.BK_URL || "http://103.74.54.133:8082/",
    proxy: true,
  },
  proxy: {
    // authenticated url
   // "/api": "http://103.74.54.133:8082/",
    //"/authenticate": "http://103.74.54.133:8082/",
    //"/logout": "http://103.74.54.133:8082/",
    //"/getprincipal": "http://103.74.54.133:8082/",
    "/api": "http://localhost:8082/",
    "/authenticate": "http://localhost:8082/",
    "/logout": "http://localhost:8082/",
    "/getprincipal": "http://localhost:8082/",
  },
  auth: {
    redirect: {
      login: "/signin",
      logout: "/signin",
      callback: "/signin",
      organization: "/organization",
      home: "/",
    },
    strategies: {
      local: {
        //scheme: "local",
        token: {
          property: "jwt",
          maxAge: 60 * 60 * 24 * 2,
          type: "Bearer",
        },
        /*    refreshToken: {
          property: "data.refresh_token",
          data: "refresh_token",
          maxAge: 60 * 60 * 24 * 30
        }, */
        user: {
          property: false,
          autoFetch: true,
        },
        endpoints: {
          login: { url: "authenticate", method: "post" },
          // refresh: { url: "refresh", method: "post" },
          user: { url: "getprincipal", method: "post" },
          logout: { url: "logout", method: "post" },
        },
        autoLogout: false,
      },
    },
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: "#c72027",
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        light: {
          primary: "#c72027",
          secondary: colors.grey.darken1,
          accent: colors.shades.black,
          error: colors.red.accent3,
          warning: colors.amber.base,
          success: colors.green.accent3,
        },
      },
    },
  },
  server: {
    host: process.env.SERVER || "localhost",
    port: process.env.PORT || "3000",
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
