import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "normalize.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { apolloClient } from "@/utils/apolloClient";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { createPinia } from "pinia";
import "./css/global.css"

const app = createApp(App);
const pinia = createPinia();

app.provide(DefaultApolloClient, apolloClient);
app.use(pinia);
app.use(router);
app.use(ElementPlus);
app.use(createPinia());

app.mount("#app");

router.beforeEach((to, from) => {
  const authorization = localStorage.getItem("Authorization")
  if (to.name == "login") {
    if (authorization) {
      return "pandown";
    }
    return true;
  } else {
    if (authorization) {
      return true;
    } else {
      return "login";
    }
  }
});
