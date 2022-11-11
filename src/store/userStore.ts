import { defineStore } from "pinia";
import { login as loginAPi } from "@/api";
import { ElMessage } from "element-plus";
import { setAuthorization } from "@/utils/apolloClient";
import { removeHeaders, setHeaders } from "@/utils/axios";
import { computed, reactive, ref } from "vue";

export const userStore = defineStore("user", () => {
  const user = JSON.parse(localStorage.getItem("user") || '{}') ;
  const data = reactive<{
    Authorization: string | null;
    name: string | null;
    username: string | null;
    id: string | null;
    diskSize: number;
    useSize: number;
  }>({
    Authorization: localStorage.getItem("Authorization"),
    name: user.name || null,
    username: user.username || null,
    id: user.id || null,
    diskSize: user.diskSize || null,
    useSize: user.useSize || null,
  });

  data.Authorization && setAuthorization(data.Authorization);
  data.Authorization && setHeaders("Authorization", `Bearer ${data.Authorization}`);

  const isLogin = computed(() => {
    return !!data.Authorization;
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
      data.Authorization = authorization;
      data.name = name;
      data.username = user;
      data.id = id;
      data.diskSize = diskSize;
      data.useSize = useSize;
      setAuthorization(authorization);
      setHeaders("Authorization", `Bearer ${authorization}`);
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
    data.Authorization = null;
    data.name = null;
    data.username = null;
    data.id = null;
    data.diskSize = 0;
    data.useSize = 0;
    removeHeaders("Authorization");
  };

  return {
    data,
    isLogin,
    login,
    outLogin,
  };
});
