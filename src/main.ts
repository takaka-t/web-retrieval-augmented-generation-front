import "@/assets/main.css";

import { createApp } from "vue";
import App from "@/App.vue";
const app = createApp(App);

import { createPinia } from "pinia";
const pinia = createPinia();
import { createPersistedState } from "pinia-plugin-persistedstate";
pinia.use(createPersistedState());
app.use(pinia);

import router from "@/router";
app.use(router);

import "vuetify/styles";
import { createVuetify, type ThemeDefinition } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
const mainTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#1976D2",
    secondary: "#607D8B",
    accent: "#009688",
    error: "#F44336",
    warning: "#FFC107",
    info: "#03A9F4",
    success: "#4CAF50",
  },
};
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "mainTheme",
    themes: {
      mainTheme,
    },
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});
app.use(vuetify);

import { errorHandler } from "@/commons/errorHandler";
app.use(errorHandler);

app.mount("#app");
