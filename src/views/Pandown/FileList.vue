<template>
  <div class="content">
    <div class="th">
      <div class="select">
        <input type="checkbox" />
      </div>
      <div class="th-name">文件名</div>
      <div class="time">修改时间</div>
      <div class="size">大小</div>
    </div>
    <div class="tr return" v-if="!isRoot" @click="returnBtn">.......</div>
    <div
      class="tr"
      :class="{ active: selectList.includes(i) }"
      v-for="(item, i) in fileList"
      :key="i"
    >
      <div class="select" @click="triggleList(i)">
        <label>
          <input type="checkbox" v-model="selectList" :value="i" />
        </label>
      </div>
      <div class="th-name" @click="triggleList(i)">
        <div class="img">
          <div class="img-inner">
            <img
              :src="
                item.imgSrc.length != 0
                  ? BASE_SRC + item.imgSrc
                  : typeMapImg(item.type)
              "
            />
          </div>
        </div>
        <span @click.stop="nextDir(item)" v-show="currenRenameId != i">{{
          item.name
        }}</span>
        <div class="reNameInputBox" v-show="currenRenameId == i">
          <el-input
            v-model="nextName"
            :placeholder="item.name"
            :ref="setInputRef"
          />
          <el-button
            type="success"
            :icon="Check"
            circle
            @click="reNameupBtn()"
          />
          <el-button type="danger" :icon="Delete" circle @click="cancel()" />
        </div>
      </div>
      <div class="time" @click.stop="triggleList(i)">
        <div class="download" @click="downLoadBtn(item)" v-if="!item.directory">
          <svg
            t="1652423475127"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3643"
            width="14"
            height="14"
          >
            <path
              d="M502.010485 765.939573c3.773953 3.719718 8.686846 5.573949 13.596669 5.573949 0.075725 0 0.151449-0.010233 0.227174-0.011256 0.329505 0.016373 0.654916 0.050142 0.988514 0.050142 0.706081 0 1.400906-0.042979 2.087545-0.116657 4.352121-0.366344 8.607028-2.190899 11.961426-5.496178l335.053985-330.166675c7.619538-7.509021 7.709589-19.773346 0.200568-27.393907s-19.774369-7.711636-27.39493-0.201591L536.193005 706.304358 536.193005 50.019207c0-10.698666-8.67252-19.371186-19.371186-19.371186s-19.371186 8.67252-19.371186 19.371186l0 657.032164-306.881342-302.44838c-7.618515-7.509021-19.883863-7.419993-27.393907 0.199545-7.509021 7.619538-7.419993 19.884886 0.199545 27.393907L502.010485 765.939573z"
              p-id="3644"
              fill="#1296db"
            ></path>
            <path
              d="M867.170139 711.020776c-10.698666 0-19.371186 8.67252-19.371186 19.371186l0 165.419494c0 13.054317-10.620895 23.675212-23.676236 23.675212L205.182103 919.486668c-13.054317 0-23.676236-10.620895-23.676236-23.675212L181.505867 730.391962c0-10.698666-8.67252-19.371186-19.371186-19.371186s-19.371186 8.67252-19.371186 19.371186l0 165.419494c0 34.416857 28.000728 62.416562 62.417585 62.416562l618.941638 0c34.417881 0 62.417585-27.999704 62.417585-62.416562L886.540302 730.391962C886.541325 719.693296 877.868805 711.020776 867.170139 711.020776z"
              p-id="3645"
              fill="#1296db"
            ></path>
          </svg>
        </div>
        <p>{{ new Date(+item.update).toLocaleString() }}</p>
      </div>
      <div class="size" @click.self="triggleList(i)">
        {{ !item.directory ? getSize(item.size) : "-" }}
        <div>
          <svg
            t="1652441688173"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5094"
            width="20"
            height="20"
            @click="reNameBtn(i, item.name)"
          >
            <path
              d="M950.857143 950.857143H73.142857V73.142857h373.028572v73.142857H146.285714v731.428572h731.428572V548.571429h73.142857z"
              fill="#1296db"
              p-id="5095"
            ></path>
            <path
              d="M899.657143 160.914286l-51.2-51.2L292.571429 665.6l51.2 51.2 555.885714-555.885714z"
              fill="#1296db"
              p-id="5096"
            ></path>
          </svg>
          <el-popconfirm title="是否要删除此项?" @confirm="singleDelete(i)">
            <template #reference>
              <svg
                t="1652428231417"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4482"
                width="20"
                height="20"
              >
                <path
                  d="M86.016 0l-83.968 70.656c149.504 111.616 288.768 239.616 411.136 367.616-187.392 188.928-334.336 374.784-411.648 449.536l159.744 133.632c56.832-117.248 180.224-294.912 345.6-481.28 165.376 187.392 289.28 366.08 346.112 483.84 0 0 155.648-165.376 169.472-139.776C962.56 816.64 816.128 620.032 619.52 418.816c112.64-115.712 239.104-230.4 374.272-331.264l-36.864-68.608c-153.088 76.288-299.008 189.44-430.08 309.76-132.096-125.44-281.6-244.736-440.832-328.704z"
                  p-id="4483"
                  fill="#1296db"
                ></path>
              </svg>
            </template>
          </el-popconfirm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData } from "@/store/index";
import { deleteFile, download, getDirectoryList, reName } from "@/api";
import { fileObj } from "@/types";
import { ElMessage } from "element-plus";
import { nextTick, onUnmounted, reactive, ref, watch } from "vue";
import { Check, Delete } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import {getSize, typeMapImg} from "@/utils"

const store = useData();
const { path, fileList, isRoot } = storeToRefs(store);
const selectList = ref([]);
const BASE_SRC = "http://localhost:3000";
const nextName = ref("");
const map = {
  "image/png": new URL("@assets/ic_other_v2.png", import.meta.url).href,
  "application/x-zip-compressed": new URL(
    "@assets/ic_compress_v2.png",
    import.meta.url
  ).href,
  "application/x-7z-compressed": new URL(
    "@assets/ic_compress_v2.png",
    import.meta.url
  ).href,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    new URL("@assets/ic_word_v2.png", import.meta.url).href,
  directory: new URL("@assets/ic_file2.png", import.meta.url).href,
};
const currenRenameId = ref(-1);
const inputRefList = reactive<any[]>([]);
const setInputRef = (el: any) => {
  if (el) {
    inputRefList.push(el);
  }
};

const returnBtn = () => {
  path.value.pop();
};

const triggleList = (name: number) => {
  //@ts-ignore
  if (selectList.value.includes(name)) {
    //@ts-ignore
    selectList.value.splice(selectList.value.indexOf(name), 1);
  } else {
    //@ts-ignore
    selectList.value.push(name);
  }
};

const nextDir = (obj: fileObj) => {
  if (!obj.directory) return;
  path.value.push(obj.name);
};

const cancel = () => {
  currenRenameId.value = -1;
  nextName.value = "";
};

const reNameupBtn = async () => {
  if (
    nextName.value == "" ||
    nextName.value == fileList.value[currenRenameId.value].name
  ) {
    cancel();
    ElMessage({
      type: "success",
      message: "修改成功",
    });
    return;
  }

  let res = await reName(
    path.value.length == 1 ? path.value[0] : path.value.join("/").slice(1),
    fileList.value[currenRenameId.value].name,
    nextName.value
  );
  ElMessage({
    type: res.data?.reName.code == 200 ? "success" : "error",
    message: res.data?.reName.message,
  });
  if (res.data?.reName.code == 200) {
    store.getList();
    cancel();
  }
};

const downLoadBtn = async (item: fileObj) => {
  await download(path.value.join("/").replace("//", "/") || "/", item.name);
};

const reNameBtn = async (index: number, name: string) => {
  if (currenRenameId.value == index) {
    currenRenameId.value = -1;
    nextName.value = "";
  } else {
    currenRenameId.value = index;
    nextName.value = name;
    const input = inputRefList[index].ref;
    inputRefList[index].focus();
    await nextTick();
    input.setSelectionRange(0, name.lastIndexOf("."));
  }
};

const singleDelete = async (index: number) => {
  try {
    let res = await deleteFile([path.value.join("/") + "/" + fileList.value[index].name]);
    console.log(res);
    ElMessage({
      message: res.data?.deleteDir.message,
      type: res.data?.deleteDir.code == 200 ? "success" : "error",
    });
  } finally {
    store.getList();
  }
};
</script>

<style scoped lang="less">
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
</style>
