import { getParameter, isOBJByType, loadScript, processStackMsg } from "./utils";

interface AlloyLeverStoreItem {
  logType: string,
  logs: any
  noOrigin?: any
}

interface Log {

}

class AlloyLever {
  static settings: Record<string, any> = {
    cdn:'//s.url.cn/qqun/qun/qqweb/m/qun/confession/js/vconsole.min.js',
    reportUrl: null,
    reportPrefix: '',
    reportKey: 'msg',
    otherReport: null,
    entry: null
  }

  static store: AlloyLeverStoreItem[] = []

  static logs: any[] = []

  static config (config: any) {
    for(let i in config){
      if(config.hasOwnProperty(i)){
        AlloyLever.settings[i] = config[i]
      }
    }

    if(config.entry){
      window.addEventListener('load', function() {
        AlloyLever.entry(config.entry)
      })
    }

    const parameter = getParameter('vconsole')

    if(parameter) {
      if (parameter === 'show') {
        AlloyLever.vConsole(true)
      } else {
        AlloyLever.vConsole(false)
      }
    }

  }
  static vConsole(show: boolean) {
    loadScript(AlloyLever.settings.cdn, function() {
      // @ts-ignore
      if (typeof (vConsole as any) === 'undefined') {
        // @ts-ignore
        (window as any).vConsole = new VConsole({
          defaultPlugins: ['system', 'network', 'element', 'storage'],
          maxLogNumber: 5000
        })
      }

      let i = 0;
      const len = AlloyLever.store.length

      for (; i < len; i++) {
        const item = AlloyLever.store[i]
        //console[item.type].apply(console, item.logs)
        //prevent twice log
        if (item) {
          item.noOrigin = true
        }
        (window as any).vConsole.pluginList.default.printLog(item)
      }

      if(show) {
        try {
          (window as any).vConsole.show()
        } catch (e) {

        }

        window.addEventListener('load', function () {
          (window as any).vConsole.show()
        })
      }
    })
  }

  static entry (selector: string) {
    let count = 0
    const entry = document.querySelector(selector)
    if(entry) {
      entry.addEventListener('click', function () {
        count++
        if (count > 5) {
          count = -10000
          AlloyLever.vConsole(true)
        }
      })
    }
  }
}

const methodList = ['log', 'info', 'warn', 'debug', 'error'];

// 修改原生 log 方法
methodList.forEach(function(item) {
  const method = (console as any)[item];

  (console as any)[item] = function() {
    AlloyLever.store.push({
      logType: item,
      logs: arguments
    });

    method.apply(console, arguments);
  }
});

const parameter = getParameter('vconsole')

if (parameter) {
  if (parameter === 'show') {
    AlloyLever.vConsole(true)
  } else {
    AlloyLever.vConsole(false)
  }
}

window.onerror = function(msg, url, line, col, error) {
  let newMsg = msg

  if (error && error.stack) {
    newMsg = processStackMsg(error)
  }

  if (isOBJByType(newMsg, "Event")) {
    const arr =  []
    const errorType: string = (newMsg as Event)?.type
    const errorTarget: Record<string, any> = (newMsg as any).target
    if (errorType) {
      arr.push("--" + errorType + "--")
      if (errorTarget) {
        arr.push(errorTarget.tagName + "::" + errorTarget.src)
      }
    }
    newMsg += arr.join('')
  }

  newMsg = (newMsg + "" || "").substr(0,500)

  AlloyLever.logs.push({
    msg: newMsg,
    target: url,
    rowNum: line,
    colNum: col
  })

  if ((msg as any).toLowerCase().indexOf('script error') > -1) {
    console.error('Script Error: See Browser Console for Detail')
  } else {
    console.error(newMsg)
  }

  const ss = AlloyLever.settings
  if(ss.reportUrl) {
    let src = ss.reportUrl + (ss.reportUrl.indexOf('?')>-1?'&':'?') + ss.reportKey + '='+( ss.reportPrefix?('[' + ss.reportPrefix +']'):'')+ newMsg+'&t='+new Date().getTime()
    if(ss.otherReport) {
      for (let i in ss.otherReport) {
        if (ss.otherReport.hasOwnProperty(i)) {
          src += '&' + i + '=' + ss.otherReport[i]
        }
      }
    }
    new Image().src = src
  }
}