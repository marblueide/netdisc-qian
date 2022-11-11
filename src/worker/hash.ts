import { File_Cut, File_Cut_Children } from "@/types";
import SparkMD5 from "spark-md5"
import { Ref } from "vue";

// 生成文件 hash
self.onmessage = (e:MessageEvent<{
  fileChunkList:File_Cut_Children[]
}>) => {
   const { fileChunkList } = e.data;
   const spark = new SparkMD5.ArrayBuffer();
   let percentage = 0;
   let count = 0;
   const loadNext = (index:number) => {
     const reader = new FileReader();
     reader.readAsArrayBuffer(fileChunkList[index].chunk);
     reader.onload = e => {
       count++;
       spark.append(e.target?.result as globalThis.ArrayBuffer);
       if (count === fileChunkList.length) {
         self.postMessage({
           percentage: 100,
           hash: spark.end()
         });
         self.close();
       } else {
         percentage += 100 / fileChunkList.length;
         self.postMessage({
           percentage
         });
         // calculate recursively
         loadNext(count);
       }
     };
   };
   loadNext(0);
 };