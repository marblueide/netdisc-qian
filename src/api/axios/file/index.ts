import axios from "@/utils/axios";

export const download = async (path: string, filename: string) => {
  const param = new URLSearchParams();
  param.append("path", path);
  param.append("fileName", filename);
  let res = await axios({
    url: "/file/download",
    method: "Post",
    data: param,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    responseType: "blob",
  });
  const { data, headers } = res;
  // const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1')
  const blob = new Blob([data], { type: headers["content-type"] });
  let dom = document.createElement("a");
  let url = window.URL.createObjectURL(blob);
  dom.href = url;
  dom.download = decodeURI(filename);
  dom.style.display = "none";
  document.body.appendChild(dom);
  dom.click();
  dom?.parentNode?.removeChild(dom);
  window.URL.revokeObjectURL(url);
};