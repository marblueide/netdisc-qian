<template>
  <div id="pandown">
    <nav>
      <Nav/>
    </nav>
    <main>
      <div class="container">
        <Header />
        <div class="text">全部文件</div>
        <FileList />
        <el-progress type="dashboard" :percentage="percentage">
          <template #default="{ percentage }">
            <span class="percentage-value">{{ percentage }}%</span>
            <span class="percentage-label">{{ getSize(useSize) }}</span>
          </template>
        </el-progress>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, computed, watch } from "vue";
import FileList from "./FileList.vue";
import Header from "./Header.vue";
import Nav from "./Nav/index.vue"
const diskSize = ref(localStorage.getItem("disSize") || 1024 * 1024 * 1024);
const useSize = ref(localStorage.getItem("useSize") || 0);
const percentage = computed(() => {
  //@ts-ignore
  return +((useSize.value / diskSize.value) * 100).toFixed(2);
});

onUnmounted(() => {
  uLo();
});

const getSize = (num: number) => {
  let kb = +(num / 1024).toFixed(1);
  if (kb < 1024) return kb + "K";
  let mb = +(num / 1024 / 1024).toFixed(1);
  if (mb < 1024) return mb + "M";
  let gb = +(num / 1024 / 1024 / 1024).toFixed(1);
  return gb + "G";
};

const uLo = watch([diskSize, useSize], ([diskSize, useSize], prev) => {
  localStorage.setItem("disSize", "" + diskSize);
  localStorage.setItem("useSize", "" + useSize);
});
</script>

<style scoped lang="less">
#pandown {
  nav {
    height: 60px;
    box-shadow: 0 3px 10px 0 rgb(0 0 0 / 6%);
    box-sizing: border-box;
    padding: 0 3rem;
    text-align: center;
    h1 {
      font-size: 20px;
      font-weight: 700;
    }
  }
  main {
    .container {
      position: relative;
      box-shadow: 0 3px 10px 0 rgb(0 0 0 / 6%);
      height: calc(100vh - 60px);
      width: 1000px;
      margin: 0 auto;
      background: white;
      box-sizing: border-box;
      padding: 20px 0;
      .text {
        padding: 15px 0;
        padding-left: 20px;
        font-size: 14px;
        border-bottom: 1px solid #f9f9f9;
      }
      .content {
        font-size: 14px;
        .return {
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          font-size: 25px;
          color: #06a7ff;
          box-sizing: border-box;
          padding-bottom: 10px;
          cursor: pointer;
        }
        .th {
          color: #818999;
          line-height: 50px;
        }
        .th,
        .tr {
          display: flex;
          height: 50px;
          border-bottom: 1px solid #f9f9f9;
          &:hover {
            background-color: rgb(247, 249, 252);
          }
          .select {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 10%;
            cursor: pointer;
            input {
              width: 16px;
              height: 16px;
              border: 1px solid #dcdfe6;
              transition: all 0.3s;
              &:checked {
                background-color: #06a7ff;
                border-color: #06a7ff;
              }
            }
          }
          .th-name {
            display: flex;
            width: 50%;
            align-items: center;
            height: 100%;
            position: relative;
            cursor: pointer;
            .img {
              width: 50px;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              .img-inner {
                width: 40px;
                height: 40px;
                overflow: hidden;
                border-radius: 5px;
                padding: 3px;
                img {
                  border-radius: 8px;
                  height: 100%;
                  width: 100%;
                  object-fit: cover;
                  box-sizing: border-box;
                }
              }
            }
            span {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              max-width: 60%;
              &:hover {
                color: #06a7ff;
              }
            }
            .reNameInputBox {
              display: flex;
              align-items: center;
              position: absolute;
              left: 50px;
              button {
                margin-left: 10px;
              }
            }
          }
          .time {
            width: 20%;
            position: relative;
            display: flex;
            justify-content: start;
            align-self: center;
            overflow: hidden;
            height: 100%;
            .download {
              position: absolute;
              display: flex;
              align-items: center;
              padding-left: 40px;
              background-color: rgb(247, 249, 252);
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: -1;
              svg {
                cursor: pointer;
              }
            }
          }
          .size {
            width: 20%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-right: 40px;
            box-sizing: border-box;
            svg {
              cursor: pointer;
              opacity: 0;
              margin-right: 10px;
            }
          }
        }
        .tr {
          &.active {
            background-color: rgb(242, 250, 255);
            .time {
              .download {
                background-color: rgb(242, 250, 255);
              }
            }
            .size {
              svg {
                opacity: 1;
              }
            }
          }
          &:hover {
            .select {
              input {
                opacity: 1;
              }
            }
            .size {
              svg {
                opacity: 1;
              }
            }
            .time {
              .download {
                z-index: 0;
              }
            }
          }
          .select {
            input {
              opacity: 0;
              &:checked {
                opacity: 1;
              }
            }
          }
        }
      }
      .el-progress {
        position: absolute;
        top: 40px;
        right: 5%;
        transform: translate(-50%, -50%);
        .percentage-value {
          display: block;
          margin-top: 10px;
          font-size: 28px;
        }
        .percentage-label {
          display: block;
          margin-top: 10px;
          font-size: 12px;
        }
        .demo-progress .el-progress--line {
          margin-bottom: 15px;
          width: 350px;
        }
        .demo-progress .el-progress--circle {
          margin-right: 15px;
        }
      }
    }
  }
}
canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
