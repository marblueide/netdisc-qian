<template>
  <div class="nav">
    <div class="upload">
      <span>上传</span>
      <form action="javascript:void(0)">
        <input
          class="file"
          type="file"
          ref="uploadIpt"
          multiple
          @change="uploadChangeBtn()"
        />
      </form>
    </div>

    <div class="menuBtn" @click="createDirectoryBtn()">新建文件夹</div>
    <div class="menuBtn" @click="multipleDelete()" v-show="selectList.length">
      删除
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import {
  deleteFile,
  createDirectory,
  verify,
  baseAxiosUpload,
  bigAxiosUpload,
  mergeBigFile,
} from "@/api";
import { useData } from "@/store/index";
import { ElMessage, ElMessageBox } from "element-plus";
import { File_Cut } from "@/types";
import { storeToRefs } from "pinia";
import { throttle } from "lodash";

const store = useData();
const { path, fileList, pathStirng, transFormListFlag, isclear } =
  storeToRefs(store);

const selectList = ref([]);
const uploadIpt = ref<HTMLInputElement>();

watch(
  () => store.isclear,
  (value) => {
    if (value) {
      uploadIpt.value && (uploadIpt.value.value = "");
    }
  }
);

const uploadChunks = async (file: File_Cut, fileList: string[]) => {
  let totalLoaded = 0;
  await Promise.all(
    file.children.map((chunkInput) => {
      if (fileList.includes(chunkInput.hash)) {
        totalLoaded += chunkInput.size;
        return;
      }
      let lastLoaded = 0;
      //@ts-ignore
      return bigAxiosUpload(
        {
          filename: chunkInput.filename,
          hash: chunkInput.hash,
          chunk: chunkInput.chunk,
          path: pathStirng.value,
        },
        {
          onUploadProgress: throttle((e) => {
            const { loaded } = e;
            const dataTotal = loaded - lastLoaded;
            totalLoaded += dataTotal;
            lastLoaded = loaded;
            const percentage = ((totalLoaded / file.size) * 100) | 0;
            file.percentage = percentage > 99 ? 99 : percentage;
            if (percentage < 99) {
              file.internetSpeed = dataTotal / 0.5;
            }
          }, 500),
          signal: file.abortController.signal,
        }
      );
    })
  );
};

const baseUpload = async (files: File_Cut[]) => {
  if (!files.length) return;
  try {
    await Promise.all(
      files.map(
        async (file) =>
          await new Promise<void>(async (resolve, reject) => {
            let res = await verify(pathStirng.value, file.filename, "", false);
            transFormListFlag.value = true;
            if (res.data.shouldUpload) {
              const res = await baseAxiosUpload(
                {
                  path: pathStirng.value,
                  file: file.file,
                },
                {
                  onUploadProgress: (e) => {
                    const { loaded } = e;
                    const percentage = ((loaded / file.size) * 100) | 0;
                    file.percentage = percentage;
                  },
                  signal: file.abortController.signal,
                }
              );
              ElMessage({
                type: "success",
                message: res.data.message,
              });
            } else {
              file.text = {
                type: "error",
                value: "文件已存在,请勿重复上传",
              };
              ElMessage({
                type: "warning",
                message: `${file.filename}文件已存在,请勿重复上传`,
              });
            }
            file.percentage = 100;
            file.internetSpeed = 0;
            resolve();
          })
      )
    );
  } catch (error) {
    ElMessage({
      type: "error",
      message: error as string,
    });
  } finally {
    store.getList();
  }
};

const bigUpload = async (files: File_Cut[]) => {
  if (!files.length) return;
  try {
    transFormListFlag.value = true;
    await Promise.all(
      files.map(
        (file) =>
          new Promise<void>(async (resolve, reject) => {
            let vaild = await verify(
              pathStirng.value,
              file.filename,
              file.hash,
              true
            );
            if (vaild.data.shouldUpload) {
              await uploadChunks(file, vaild.data.fileList);
              const res = await mergeBigFile(file.filename, pathStirng.value, {
                signal: file.abortController.signal,
              });
              ElMessage({
                type: "success",
                message: `${file.filename}上传成功`,
              });
            } else {
              file.text = {
                type: "error",
                value: "文件已存在,请勿重复上传",
              };
              ElMessage({
                type: "warning",
                message: `${file.filename}文件已存在,请勿重复上传`,
              });
            }
            file.percentage = 100;
            file.internetSpeed = 0;
            resolve();
          })
      )
    );
  } catch (error) {
    ElMessage({
      type: "error",
      message: error as string,
    });
  } finally {
    store.getList();
  }
};

const uploadChangeBtn = async () => {
  isclear.value = false;
  const files = uploadIpt?.value?.files || [];
  if (!files.length) return;
  const baseFile: File_Cut[] = [];
  const bigFile: File_Cut[] = [];
  //@ts-ignore
  for (let file of files) {
    const controller = new AbortController();
    const item = await store.addFile(file, pathStirng.value, controller);
    if (file.size >= store.SIZE) {
      bigFile.push(item);
    } else {
      baseFile.push(item);
    }
  }
  await baseUpload(baseFile);
  await bigUpload(bigFile);
  isclear.value = true;
};

const createDirectoryBtn = async () => {
  const { value } = await ElMessageBox.prompt(
    "请输入文件夹名称",
    "新建文件夹",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern: /^(?!\.)[^\\\/:\*\?"<>\|]{1,255}$/,
      inputErrorMessage: "名称错误",
    }
  );
  try {
    let res = await createDirectory(pathStirng.value, value);
    ElMessage({
      message: res.data?.mkdir.message,
      type: "success",
    });
  } catch (error) {
  } finally {
    store.getList();
  }
};

const multipleDelete = async () => {
  ElMessageBox.confirm(
    `是否要删除这${selectList.value.length}文件?`,
    "确认删除",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      let paths = selectList.value.map((i) => {
        return path.value.join("/").slice(1) + "/" + fileList[i].name;
      });
      let res = await deleteFile(paths);
      if (res.data.state) {
        ElMessage({
          type: "success",
          message: "删除成功！",
        });
      } else {
        ElMessage({
          type: "info",
          message: res.data.msg,
        });
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "删除失败",
      });
    })
    .finally(() => {
      store.getList();
    });
};
</script>

<style scoped lang="less">
.nav {
  display: flex;
  align-items: center;
  height: 50px;
  .upload,
  .menuBtn {
    border-radius: 16px;
    color: white;
    box-sizing: border-box;
    cursor: pointer;
    position: relative;
    margin-left: 20px;
  }
  .upload {
    background: #06a7ff;
    span {
      display: block;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 8px 24px;
      cursor: pointer;
    }
    form {
      cursor: pointer;
      .file {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        opacity: 0;
        cursor: pointer;
      }
    }
  }
  .menuBtn {
    background: #f0fbff;
    color: #06a7ff;
    padding: 8px 12px;
  }
}
</style>
