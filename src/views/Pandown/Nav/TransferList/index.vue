<template>
  <div class="forward-box">
    <el-container class="container">
      <el-aside width="140px" class="wrapper-aside">
        <div class="title">传输列表</div>
        <div class="list">
          <ul>
            <li class="active">文件上传({{ uploadList.length }})</li>
          </ul>
        </div>
      </el-aside>
      <el-main class="wrapper-main">
        <el-container>
          <el-header height="30px" class="inner-header">
            <div class="title">
              上传完成({{ finishUpload }}/{{ uploadList.length }})
            </div>
            <div class="cancel" @click="handleCancelAll">全部取消</div>
          </el-header>
          <el-main class="inner-main">
            <ul>
              <li v-for="item in uploadList" :key="item.id">
                <div class="img">
                  <img :src="getTypeImage(item)" fit="cover" />
                </div>
                <div class="introduction">
                  <div class="title">
                    {{ item.filename }}
                  </div>
                  <div class="progress" v-if="item.percentage != 100">
                    <el-progress
                      :show-text="false"
                      :percentage="item.percentage"
                    />
                  </div>
                  <div class="message">
                    <div>
                      <div
                        class="text"
                        :class="{ error: item.text?.type == 'error' }"
                      >
                        {{ item.text?.value }}
                      </div>
                      <div class="size">
                        {{ getSize(item.size) }}
                      </div>
                    </div>
                    <div class="internetSpeed" v-show="item.percentage != 100">
                      {{ getSize(item.internetSpeed) }} / s
                    </div>
                  </div>
                </div>
                <div class="operation">
                  <template v-if="item.percentage != 100">
                    <div class="btn">
                      <i
                        class="iconfont"
                        :class="
                          item.isUpload ? 'icon-zanting' : 'icon-24gf-play'
                        "
                        @click="handlePauseOrPlay(item.isUpload, item)"
                      ></i>
                    </div>
                    <div class="btn">
                      <i
                        class="iconfont icon-changyonggoupiaorenshanchu"
                        @click="handleDelete(item)"
                      ></i>
                    </div>
                  </template>
                  <template v-else>
                    <div class="btn" @click="handleOpenFile(item.path)">
                      <i class="iconfont icon-wenjianjia"></i>
                    </div>
                    <div class="btn" @click="handleCloseFile(item)">
                      <i class="iconfont icon-closel"></i>
                    </div>
                  </template>
                </div>
              </li>
            </ul>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useData } from "@/store";
import { File_Cut } from "@/types";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { getSize, typeMapImg } from "@/utils";
import { throttle } from "lodash";
import { ElMessage } from "element-plus";
import { verify, baseAxiosUpload, bigAxiosUpload, mergeBigFile } from "@/api";

const store = useData();
const { uploadList, pathStirng, path, isclear, transFormListFlag } =
  storeToRefs(store);
const fileMapUrl = new WeakMap<File_Cut, string>();

const getTypeImage = (item: File_Cut) => {
  if (fileMapUrl.has(item)) return fileMapUrl.get(item);
  const imgReg = new RegExp("image|img|png|jpeg|gif");
  let url;
  if (imgReg.test(item.file.type)) {
    url = URL.createObjectURL(item.file);
  } else {
    url = typeMapImg(item.file.type as any);
  }
  fileMapUrl.set(item, url);
  return url;
};

const finishUpload = computed(() => {
  return uploadList.value.filter((item) => item.percentage == 100).length;
});

const handleOpenFile = (p: string) => {
  if (pathStirng.value == p) return;
  const paths = p.split("/");
  paths[0] = "/";
  store.setPath(paths);
};

const handleCloseFile = (item: File_Cut) => {
  store.deleteFile(item);
};

const handlePauseOrPlay = async (isUpload: boolean, item: File_Cut) => {
  if (isUpload) {
    item.isUpload = false;
    isclear.value = true;
    item.abortController.abort();
    item.abortController = new AbortController();
  } else {
    item.isUpload = true;
    if (item.size > store.SIZE) {
      await bigUpload([item]);
    } else {
      await baseUpload([item]);
    }
  }
};

const handleDelete = (item: File_Cut) => {
  handleCloseFile(item);
  handlePauseOrPlay(true, item);
};

const handleCancelAll = () => {
  uploadList.value.forEach(item => {
    handlePauseOrPlay(true,item)
  })
}

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
</script>

<style scoped lang="less">
.forward-box {
  height: 400px;
  .container {
    padding: 0;
    height: 100%;
    .wrapper-aside {
      border-right: 1px solid #f4f4f4;
      .title {
        color: rgba(0, 0, 0, 0.3);
        font-size: 0.6rem;
      }
      .list {
        ul {
          list-style: none;
          padding-left: 0.5rem;
          box-sizing: border-box;
          padding-right: 0.8rem;
          li {
            font-size: 0.8rem;
            border-radius: 0.5rem;
            overflow: hidden;
            padding: 0.3rem 0;
            text-indent: 1rem;
            box-sizing: border-box;
            cursor: pointer;
            &.active {
              background: #eef9fe;
              color: #06a7ff;
            }
          }
        }
      }
    }
    .wrapper-main {
      padding: 0;
      .el-container {
        height: 100%;
      }
      .inner-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f4f4f4;
        .title {
          font-size: 0.9rem;
          font-weight: 700;
        }
        .cancel {
          font-size: 0.7rem;
          color: #0797e5;
          cursor: pointer;
        }
      }
      .inner-main {
        height: 100%;
        padding: 0;
        ul {
          list-style: none;
          padding-left: 0;
          margin: 0;
          li {
            display: flex;
            border-bottom: 1px solid #f4f4f4;
            padding: 1rem 0;
            align-items: center;
            .img {
              width: 2.5rem;
              height: 2.5rem;
              overflow: hidden;
              border-radius: 0.5rem;
              margin: 0 0.8rem;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
            .introduction {
              flex: 1;
              display: grid;
              grid-template-columns: 1fr;
              grid-row-gap: 0.3rem;
              .title {
                font-weight: 600;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .message {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .text {
                  font-size: 0.8rem;
                  margin-right: 0.5rem;
                  &.error {
                    color: red;
                  }
                }
                .size {
                  font-size: 0.6rem;
                  color: rgba(0, 0, 0, 0.5);
                }
                .internetSpeed {
                  font-size: 0.7rem;
                  color: #06a7ff;
                }
              }
            }
            .operation {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: 1rem;
              .btn {
                cursor: pointer;
                margin: 0 0.5rem;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 2rem;
                height: 2rem;
                background: rgb(248, 248, 244);
                overflow: hidden;
                border-radius: 50%;
              }
              i {
                color: rgb(19, 175, 247);
                font-size: 0.8rem;
              }
            }
          }
        }
      }
    }
  }
}
</style>
