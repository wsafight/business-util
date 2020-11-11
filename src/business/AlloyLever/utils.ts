/**
 * 加载及保本
 * @param src
 * @param callback
 */
export function loadScript(src: string, callback: () => void) {
  const s: HTMLElementTagNameMap["script"] = document.createElement('script')
  s.type = 'text/javascript'
  s.src = src
  let r: boolean = false

  s.onload = (s as any).onreadystatechange = function () {
    //console.log( this.readyState ); //uncomment this line to see which ready states are called.
    if (!r && (!this.readyState || this.readyState == 'complete')) {
      r = true
      callback()
    }
  }
  const t = document.getElementsByTagName('script')[0]
  t?.parentNode?.insertBefore(s, t)
}

function getParameterByName(name: string, url: string = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&")
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)")
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, " "))
}


export function getParameter(n: string) {
  const m = window.location.hash.match(new RegExp('(?:#|&)' + n + '=([^&]*)(&|$)'))
  const result = !m ? '' : decodeURIComponent(m[1])
  return result || getParameterByName(n)
}

export function processStackMsg (error: Error) {
  let stack = error.stack!
    .replace(/\n/gi, "")
    .split(/\bat\b/)
    .slice(0, 9)
    .join("@")
    .replace(/\?[^:]+/gi, "")
  const msg = error.toString()
  if (stack.indexOf(msg) < 0) {
    stack = msg + "@" + stack
  }
  return stack
}

export  function  isOBJByType(o: any, type: string) {
  return Object.prototype.toString.call(o) === "[object " + (type || "Object") + "]"
}

export function getCookie(name: string){
  let arr
  const reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)")

  if(arr = document.cookie.match(reg))
    return unescape(arr[2])
  else
    return null
}
