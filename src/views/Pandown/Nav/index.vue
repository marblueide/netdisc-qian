<template>
  <div class="nav">
    <div class="left">
      <span class="title">个人网盘</span>
    </div>
    <div class="right">
      <div class="user">
        <el-popover trigger="click" width="50">
          <template #reference>
            <div class="box">
              {{ user.data.name }}
            </div>
          </template>
          <div class="user-box">
            <ul>
              <li>登出</li>
            </ul>
          </div>
        </el-popover>
      </div>
      <div class="forward">
        <el-popover trigger="click" width="700" :visible="transFormListFlag">
          <template #reference>
            <div class="box" @click="trrigerFlag(true)">
              <i class="iconfont icon-chuanshu"></i>
            </div>
          </template>
          <div>
            <TransferList />
            <Teleport to="body">
              <div class="mask" @click="trrigerFlag(false)" v-show="transFormListFlag"></div>
            </Teleport>
          </div>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData, userStore } from "@/store";
import TransferList from "./TransferList/index.vue";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const user = userStore();
const data = useData();
const { transFormListFlag } = storeToRefs(data);

const handleTransfrom = () => {
  transFormListFlag.value = true;
};

const trrigerFlag = (b: boolean) => [(transFormListFlag.value = b)];
</script>

<style scoped lang="less">
.nav {
  display: flex;
  justify-content: space-between;
  height: 100%;
  .left {
    display: flex;
    align-items: center;
    .title {
      font-family: "阿里巴巴普惠体 2.0 55 Regular";
      font-size: 1.6rem;
      font-weight: 500;
    }
  }
  .right {
    display: flex;
    align-items: center;
    .box {
      padding: 0.5rem;
      margin: 0 0.7rem;
      border-radius: 0.8rem;
      height: 1.5rem;
      line-height: 1.5rem;
      width: 1.5rem;
      overflow: hidden;
      transition: background 0.3s, color 0.3s;
      cursor: pointer;
      &:hover {
        background: rgba(37, 99, 235, 1);
        color: white;
      }
      i {
        font-size: 1.5rem;
      }
    }
    .user {
      .box {
        font-size: 0.8rem;
        cursor: pointer;
      }
    }
    .forward {
      margin-right: 15rem;
    }
  }
}

.user-box {
  ul {
    list-style: none;
    margin: 0;
    padding-left: 0;
    display: flex;
    flex-direction: column;
    li {
      cursor: pointer;
      text-align: center;
    }
  }
}

.mask {
  position:fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
