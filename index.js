AudioContext = null //防止获取audio指纹，非视听网站用到这个都是获取浏览器指纹的

//这个部分防止获取webgl指纹
WebGLRenderingContext = null
WebGL2RenderingContext = null
WebGLSync = null
WebGLBuffer = null

//浏览器特性，其实就是部分h5的api，检测你支持哪些api来获取你的h5指纹，这个地方不做处理其实也可以，因为高版本chrome撞的概率很大，这里采用随机概率抽一部分屏蔽，可以自己根据需要增减
let feature = [
  "history",
  "History",
  "Blob",
  "File",
  "DataView",
  "URL",
  "crypto",
  "btoa",
  "atob",
  "decodeURIComponent",
  "encodeURIComponent",
  "customElements",
  "unescape",
  "escape",
  "SourceBuffer",
  "MediaSource",
  "VideoPlaybackQuality",
  "HTMLMediaElement",
  "HTMLVideoElement",
  "MessageChannel",
  "MessagePort",
  "PublicKeyCredential",
  "AuthenticatorResponse",
  "TextEncoder",
  "TextDecoder",
  "GeolocationPosition",
  "Geolocation",
  "RTCPeerConnection",
  "WebSocket"
].sort(() => 0.5 - Math.random())
let length = Math.random() * feature.length
for (i = 0; i < length; i++) {
  delete window[feature[i]]
}

document.execCommand = null //防止获取clipboard

window.screen = null //这个方法防止读屏幕宽高，其实读的方式有很多，这只防止了其中之一，主要是我懒

window.Intl.DateTimeFormat = undefined //这是专门读你时区的，大部分网站禁了没事

// Date=()=>{} //时间可以暴露你的时区，但是禁用之后大部分网站都会加载失败

document.referrer = ""//防止在当前网站打开新网站时，新网站获取你的上个网站地址

//防止获取字体指纹。这段代码的初始版本是网上找的，这些转发的人抄都抄不全，你找找原版就知道了
var rand3 = {
  "noise": function () {
    let num1 = Math.random()
    let num2 = Math.random()
    var SIGN = Math.random() < Math.random() ? -1 : 1;
    var SIGN = num1 < num2 ? -1 : 1;
    return Math.floor(num1 + SIGN * num2);
  },
  "sign": function () {
    const tmp = [-1, -1, -1, -1, -1, -1, 1, -1, -1, -1];
    return tmp.sort((pre, next) => 0.5 - Math.random())[0];
  }
};

Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
  get() {
    const height = Math.floor(this.getBoundingClientRect().height);
    const valid = height && rand3.sign() === 1;
    const result = valid ? height + rand3.noise() : height;
    return result;
  }
});

Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
  get() {
    const width = Math.floor(this.getBoundingClientRect().width);
    const valid = width && rand3.sign() === 1;
    const result = valid ? width + rand3.noise() : width;
    return result;
  }
})

// 防止读显卡信息，canvas的context如果不是"2d","3d"大多是要读取你的显卡型号，可以网上找到显卡信息的相关代码，型号非常准确，这是大部分放浏览器指纹教程最容易忽略的
document.createElement = (function (fn) {
  return function (type, id, className) {
    var elem = fn.call(document, type);
    elem.attachShadow = undefined
    elem.getContext = ((fn) => {
      return (str) => {
        if (["2d", "3d"].includes(str)) {
          let result = fn.call(elem, str)
          return result
        } else {
          console.log("canvas警报:", str)
        }
      }
    })(elem.getContext)
    if (id) elem.id = id;
    if (className) elem.className = className;
    return elem;
  }
})(document.createElement)

// console=null //打开这个可以防止页面判断是否打开了控制台，当然打开后及容易卡死页面

window.Worker = null//禁用worker可以防止wasm分析电脑算力

// navigator是暴露浏览器信息的主要漏洞，大部分网站都会读navigator，因此直接删除有可能造成网站初始化时加载错误，采用如下方式伪造
let dic = {
  "string": Math.random().toString(33).slice(2),
  "number": ~~(Math.random() * 10),
  "boolean": (Math.random() - 0.5) > 0,
  "function": () => { },
  "object": {}
}
let o = {}
for (item in window.navigator) {
  o[item] = dic[typeof window.navigator[item]]
}
delete window.navigator
delete o.clipboard
window.navigator = o
console.log("o", window.navigator)

delete window.indexedDB // 禁用某网站存储不会对indexedDB生效，因此防止策略是删掉indexedDB，注意window.indexedDB = null的写法在某些浏览器并不能真正禁止访问

// 清除cookie：某些网站如b站直接禁用bilibili.com域名cookie会导致页面无法正常加载，所以策略改变现有cookie，并清空localStorage，b站的cookie都不是http-only的因此这个写法有效。像知乎有http-only但对cookie没有绝对要求的网站直接在浏览器禁止该网站cookie即可
// setInterval(()=>{
//   localStorage.clear();
//   sessionStorage.clear();
//   var arr = document.cookie.split(";")
//   for(i=0;i<arr.length;i++) {
//     document.cookie=arr[i].trim().split("=")[0]+"=1;"+`Domain=${"."+location.host.split(".").slice(-2).join(".")}`+";path=/"
//     // document.cookie=arr[i].trim().split("=")[0]+"=1;"+`Domain=${location.host}`
//   }
//   async function a(){
//     arr = await cookieStore.getAll()
//     // console.log("cookieStore",arr)
//     arr.map(item=>cookieStore.delete(item.name))
//   }
//   a()
// },5000)