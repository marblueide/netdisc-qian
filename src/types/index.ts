import { Ref } from "@vue/runtime-dom"

export type fileObj = {
  name: string
  update:string
  size:number
  directory:boolean
  type:string
  imgSrc:string
}

export type UserModel = {
  id:string
  username:string
  password:string
  name:string
  authorization:string
  diskSize:number
  useSize:number
}

export type generRes = {
  code:number
  message:string
}

export type File_Cut = {
  id: number;
  file: File;
  filename: string;
  hash: string;
  size: number;
  percentage: number;
  children: File_Cut_Children[];
  path:string,
  internetSpeed:number,
  text?:{
    value:string,
    type:"error" | "success" | "warning"
  },
  abortController:AbortController,
  isUpload:boolean
};

export type File_Cut_Children = {
  id: number;
  filename: string;
  chunk: Blob;
  percentage: number;
  size: number;
  isChildren: boolean;
  hash:string,
  isUpload:boolean
};