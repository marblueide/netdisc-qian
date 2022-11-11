import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "normalize.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { apolloClient } from "@/utils/apolloClient";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { createPinia } from "pinia";
import { userStore } from "./store/userStore";
import "./css/global.css"

const app = createApp(App);
const pinia = createPinia();

app.provide(DefaultApolloClient, apolloClient);
app.use(pinia);
app.use(router);
app.use(ElementPlus);
app.use(createPinia());

app.mount("#app");

const store = userStore();

router.beforeEach((to, from) => {
  if (to.name == "login") {
    if (store.isLogin) {
      return "pandown";
    }
    return true;
  } else {
    if (store.isLogin) {
      return true;
    } else {
      return "login";
    }
  }
});
