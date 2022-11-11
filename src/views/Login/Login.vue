<template>
  <div id="box">
    <canvas id="canvas" />
    <div class="loginBox">
      <div class="login" v-show="!isRegister">
        <div class="user">
          <div>账号</div>
          <input type="text" name="text" v-model="u.username" />
        </div>
        <div class="password">
          <div>密码</div>
          <input type="password" name="text" v-model="u.password" />
        </div>
        <div class="buttons">
          <div class="registerBtn" @click="triggerRegister()">注册</div>
          <div class="loginBtn" @click="loginBtn">登录</div>
        </div>
      </div>
      <div class="register" v-show="isRegister">
        <div class="return" @click="triggerRegister()">
          <svg
            t="1652330376905"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2426"
            width="32"
            height="32"
          >
            <path
              d="M781.248 109.248A64 64 0 0 0 690.752 18.752l-448 448a64 64 0 0 0 0 90.496l448 448a64 64 0 0 0 90.496-90.496L378.496 512l402.752-402.752z"
              fill="#ffffff"
              p-id="2427"
            ></path>
          </svg>
        </div>
        <div class="user">
          <div>账号</div>
          <input type="text" name="text" v-model="registerData.user" />
        </div>
        <div class="password">
          <div>密码</div>
          <input type="password" name="text" v-model="registerData.password" />
        </div>
        <div class="buttons">
          <div class="registerBtn" @click="registerBtn()">注册</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, inject } from "vue";
import { start } from "@/utils/Canvas";
import { login, register } from "@/api";
import { ElMessage } from "element-plus";
import md5 from "md5";
import { useRouter } from "vue-router";
import { useGraphql } from "./useHooks";
import {userStore} from "@/store/userStore"

const u = reactive({
  username: "1198",
  password: "123456",
});

const store = userStore();

const registerData = reactive({
  user: "",
  password: "",
});

const router = useRouter();

let isRegister = ref(false);

const triggerRegister = () => {
  isRegister.value = !isRegister.value;
};

const loginBtn = async () => {
  if (u.username.length == 0 || u.password.length == 0) {
    ElMessage({
      message: "账号密码不允许为空！",
      type: "warning",
    });
    return;
  }
  await store.login(u.username,u.password)
  router.push({
    name: "pandown",
  });
};

const registerBtn = async () => {
  if (registerData.user.length == 0 || registerData.password.length == 0) {
    ElMessage({
      message: "账号密码不允许为空！",
      type: "warning",
    });
    return;
  }
  let res = await register(registerData.user, md5(registerData.password));
  if (!res.data.register) {
    ElMessage({
      message: res.data.msg,
      type: "error",
    });
    return;
  }
  ElMessage({
    message: res.data.msg,
    type: "success",
  });
  triggerRegister();
  u.user = registerData.user;
};

useGraphql()

onMounted(() => {
  start();
});
</script>

<style scoped lang="less">
#box {
  height: 100%;
  box-sizing: border-box;
  position: relative;
  .loginBox {
    position: relative;
    left: 50%;
    top: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 275px;
    box-shadow: 0 0 18px rgb(0 0 0 / 50%);
    background-color: #053847;
    padding-top: 10px;
    transition: all 0.5s;

    .user,
    .password,
    .buttons {
      margin: 15px 0;
    }
    .user,
    .password {
      display: flex;
      height: 50px;
      width: 320px;
      flex-direction: row;

      div {
        height: 100%;
        width: 70px;
        user-select: none;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        text-align: center;
        line-height: 50px;
        background-color: #085870;
        color: white;
      }
      input {
        width: 250px;
        padding: 0 20px;
        font-size: 20px;
        outline: none;
        border: none;
      }
    }

    .buttons {
      display: flex;
      width: 320px;
      color: white;
      justify-content: space-around;
      align-items: center;
      .loginBtn,
      .registerBtn {
        cursor: pointer;
        text-align: center;
        line-height: 50px;
        width: 95px;
        height: 50px;
        background-color: #085870;
      }
    }

    .user:hover,
    .password:hover,
    .buttons .loginBtn:hover,
    .buttons .registerBtn:hover {
      box-shadow: 0 0 14px hsl(0deg 0% 100% / 30%);
    }

    .register {
      .return {
        position: absolute;
        left: 10px;
        top: 10px;
        cursor: pointer;
        padding: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        background-color: #085870;
        svg {
          width: 20px;
          height: 20px;
        }
        &:hover {
          box-shadow: 0 0 14px hsl(0deg 0% 100% / 30%);
        }
      }
    }
  }
  canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgb(0, 43, 54);
  }
}
</style>
