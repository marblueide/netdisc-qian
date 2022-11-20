import { getDirectoryList } from "@/api";
import { useFileCut } from "@/hooks/useFileCut";
import { fileObj } from "@/types";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
export const useData = defineStore("data", () => {
  const path = ref(["/"]);
  const isRoot = computed(() => {
    return path.value.length == 1;
  });
  const isclear = ref(false);
  const fileList = ref<Array<fileObj>>([]);
  const SIZE = 10 * 1024 * 1024;
  const { fileList: uploadList, addFile, deleteFile } = useFileCut(SIZE);
  const transFormListFlag = ref(false);

  const pathStirng = computed(() => {
    return path.value.join("/").replace(/\/{2,4}/g, "/");
  });

  const getList = async () => {
    try {
      let {
        data: { getPath: data },
      } = await getDirectoryList(pathStirng.value);
      data = [...data];
      data.sort((a, b) => {
        return +b.directory - +a.directory;
      });
      fileList.value = data;
    } catch (error) {
      
    }
  };

  const setPath = (paths: string[],lazy:boolean = true) => {
    uPath();
    path.value = paths;
    !lazy && getList()
    uPath = watch(
      path.value,
      (path, oldPath) => {
        console.log(path, oldPath);
        getList();
      }
    );
  };

  let uPath = watch(
    path.value,
    (path, oldPath) => {
      getList();
    },
    {
      immediate: true,
    }
  );

  return {
    path,
    isRoot,
    fileList,
    getList,
    uploadList,
    addFile,
    SIZE,
    pathStirng,
    deleteFile,
    transFormListFlag,
    setPath,
    isclear,
  };
});
