/**
 * 下载文件
 * @param urlOrFilename
 * @param content
 * @param mime
 */
export default function downloadFile(
  urlOrFilename: string,
  content: BlobPart,
  mime?: string,
  bom?: string) {
  if (content) {
    downloadContent(content, urlOrFilename, mime, bom)
  } else {
    downloadUrl(urlOrFilename)
  }
}

function downloadUrl(url: string) {
  let el: any = document.getElementById('iframeForDownload') as HTMLElement
  if (!el) {
    el = document.createElement('iframe')
    el.id = 'iframeForDownload'
    el.style.width = 0
    el.style.height = 0
    el.style.position = 'absolute'
    document.body.appendChild(el)
  }
  el.src = url
}

/**
 * https://github.com/kennethjiang/js-file-download/blob/master/file-download.js
 * @param filename
 * @param content
 * @param mime
 */
function downloadContent(data:  string | ArrayBuffer | ArrayBufferView | Blob,
                         filename: string,
                         mime?: string,
                         bom?: string) {
  const blobData = bom ? [bom, data] : [data]
  const blob = new Blob(blobData, {type: mime || 'application/octet-stream'});
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const blobURL = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);

    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }

    document.body.appendChild(tempLink);
    tempLink.click();

    setTimeout(function () {
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobURL);
    }, 200)
  }
}