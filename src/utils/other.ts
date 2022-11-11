//@ts-ignore
export function changeBASE64(file) {
  return new Promise((resolve) => {
    let fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (ev) => {
      //@ts-ignore
      resolve(ev.target.result);
    };
  });
}

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

const defaultMap = new URL('@/assets/ic_other_v2.png',import.meta.url).href

type MapKey = keyof typeof map

export const typeMapImg =  (type:MapKey) => {
  if(!map.hasOwnProperty(type)) return defaultMap
  return map[type]
}

export const getSize = (num: number) => {
  let kb = +(num / 1024).toFixed(1);
  if (kb < 1024) return kb + "K";
  let mb = +(num / 1024 / 1024).toFixed(1);
  if (mb < 1024) return mb + "M";
  let gb = +(num / 1024 / 1024 / 1024).toFixed(1);
  return gb + "G";
};