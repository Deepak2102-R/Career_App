import "./assets/main.scss";

import { VueFire, VueFireAuth } from "vuefire";
import { createApp } from "vue";
import { createPinia } from "pinia";
import firebaseApp from "./firebase";
import VueWriter from "vue-writer";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueWriter);
app.use(VueFire, {
  // imported above but could also just be created here
  firebaseApp,
  modules: [
    // we will see other modules later on
    VueFireAuth(),
  ],
});

app.mount("#app");
