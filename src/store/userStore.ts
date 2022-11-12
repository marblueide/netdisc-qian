import { defineStore } from "pinia";
import { login as loginAPi } from "@/api";
import { ElMessage } from "element-plus";
import { removeAuthorization, setAuthorization } from "@/utils/apolloClient";
import { removeHeaders, setHeaders } from "@/utils/axios";
import { computed, reactive, ref } from "vue";
import router from "@/router";

export const userStore = defineStore("user", () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const authorization = localStorage.getItem("Authorization");
  const data = reactive<{
    name: string | null;
    username: string | null;
    id: string | null;
    diskSize: number;
    useSize: number;
  }>({
    name: user.name || null,
    username: user.username || null,
    id: user.id || null,
    diskSize: user.diskSize || null,
    useSize: user.useSize || null,
  });

  authorization && setAuthorization(authorization);
  authorization && setHeaders("Authorization", `Bearer ${authorization}`);

  const isLogin = computed(() => {
    return !!localStorage.getItem("Authorization");
  });

  const login = async (username: string, password: string) => {
    try {
      let res = await loginAPi(username, password);
      const {
        authorization,
        name,
        username: user,
        id,
        diskSize,
        useSize,
      } = res.data.login;
      data.name = name;
      data.username = user;
      data.id = id;
      data.diskSize = diskSize;
      data.useSize = useSize;
      setAuthorization(authorization)
      localStorage.setItem("Authorization", authorization);
      localStorage.setItem(
        "user",
        JSON.stringify({
          username,
          name,
          id,
          diskSize,
          useSize,
        })
      );
      ElMessage({
        message: "登录成功！",
        type: "success",
      });
    } catch (error) {
      ElMessage({
        message: error as string,
        type: "error",
      });
    }
  };

  const outLogin = () => {
    data.name = null;
    data.username = null;
    data.id = null;
    data.diskSize = 0;
    data.useSize = 0;
    removeAuthorization()
    localStorage.removeItem("Authorization");
    localStorage.removeItem("user");
    router.push({ name: "login" });
  };

  return {
    data,
    isLogin,
    login,
    outLogin,
  };
});
