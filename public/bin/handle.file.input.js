
const fileSelect = document.getElementById("fileSelect");
const fileElem = document.getElementById("fileElem");
fileElem.addEventListener("change", handleFiles, false);
function handleFiles() {
  const fileList = this.files; /* now you can work with the file list */
  console.log(fileList)
  console.log(URL.createObjectURL(fileList[0]))

  const link = document.createElement("a");
  const p = document.createElement("p");
  link.href = URL.createObjectURL(
    new Blob(fileList, { type: "application/json", endings: "native" }),
  );
  p.innerText = fileList[0]
  link.source = "source.json";
  link.link = "link.json";
  link.name = "name.json";
  link.download = "download.json";
  link.innerText = "Open the array URL";

  document.body.appendChild(p);
  document.body.appendChild(link);
}
//  const url = typedArrayToURL(bytes, "text/plain");

fileSelect.addEventListener(
  "click",
  (e) => {
    if (fileElem) {
      fileElem.click();
    }
  },
  false,
)
