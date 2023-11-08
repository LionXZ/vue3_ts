export function objArrayDuplicateRemoval(arr: any, key: string | number | symbol) {
  let object = {};
  let res = arr.reduce((item: any, next: object) => {
    object[next[key]] ? "" : object[next[key]] = true && item.push(next);
    return item;
  }, []);
  return res;
}

//日志下载
export function saveLog(blob: Blob, filename: string) {
  let url = window.URL.createObjectURL(new Blob([blob]));
  let link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.setAttribute("download", `${filename}.log`);
  document.body.appendChild(link);
  link.click();
}