import { File_Cut, File_Cut_Children } from "@/types";
import { reactive, Ref, ref, toRaw } from "vue";
import Worker from "../worker/hash?worker";

const DEFAULTSIZE = 10 * 1024 * 1024;

function createFileChunk(file: File, chunkSize: number) {
  const fileChunkList = reactive<File_Cut_Children[]>([]);
  let cur = 0;
  let index = 1;
  while (cur < file.size) {
    const chunk = file.slice(cur, cur + chunkSize);
    fileChunkList.push({
      chunk,
      id: index++,
      filename: file.name,
      percentage: 0,
      size: chunk.size,
      isChildren: true,
      hash: "",
      isUpload: false,
    });
    cur += chunkSize;
  }
  return fileChunkList;
}

const calculateHash = (fileChunkList: File_Cut_Children[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker();
    worker.postMessage({ fileChunkList: toRaw(fileChunkList) });
    worker.onmessage = (e: any) => {
      const { hash } = e.data;
      if (hash) resolve(hash);
    };
  });
};

export function useFileCut(chunkSize = DEFAULTSIZE) {
  const fileList = reactive<File_Cut[]>([]);
  const fileMap = new Map<string, File_Cut>();
  const fileListSet = new Set<string>();

  async function addFile(
    file: File,
    path: string,
    abortController: AbortController
  ) {
    const data = fileMap.get(file.name);
    if (data && data.path == path) {
      return data;
    }
    const index = fileList.length;
    const fileChunkList = createFileChunk(file, chunkSize);
    const hash = await calculateHash(fileChunkList);
    fileChunkList.forEach((item, i) => {
      item.hash = `${hash}-${i}`;
    });
    const item = reactive<File_Cut>({
      id: index,
      size: file.size,
      filename: file.name,
      hash,
      percentage: 0,
      file,
      children: fileChunkList,
      path,
      internetSpeed: 0,
      abortController: abortController,
      isUpload:true
    });
    fileList.push(item);
    fileListSet.add(item.filename);
    fileMap.set(file.name, item);
    return item;
  }

  async function deleteFile(file: File_Cut) {
    const index = fileList.findIndex((item) => item == file);
    fileList.splice(index, 1);
    fileMap.delete(file.filename);
    fileListSet.delete(file.filename);
  }

  return {
    fileList,
    addFile,
    deleteFile,
  };
}
