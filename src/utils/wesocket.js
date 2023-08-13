import {Notification} from 'element-ui'
import { getToken } from './auth';
//var url =  'ws://' + location.host + '/socket/websocket/'
var url="ws://127.0.0.1:8443"+"/webapp/websocket/";
var ws;
var tt;
var lockReconnect = false;//避免重复连接
var clientId = getToken()//localStorage.getItem("tokenId")//缓存中取出客户端id
let count = 0;
let wsMsg="";
// const getDefaultState = () => {
//   return {
//     notifyStatus:''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   SET_NOTIFY: (state,notifyStatus) =>{
//     state.notifyStatus=notifyStatus
//   }
// }
//连接失败3次后会自动跳转到登录页面
const websocket = {
  Init: function(clientId) {
    //this.clientId = localStorage.getItem("tokenId")
    if ("WebSocket" in window) {
      ws = new WebSocket(url + clientId);
    } else if ("MozWebSocket" in window) {
      ws = new MozWebSocket(url + clientId);
    } else {
      console.log("您的浏览器不支持 WebSocket!");
      return;
    }
    if (typeof WebSocket == "undefined") {
        this.$notify({
          title: "提示",
          message: "当前浏览器无法接收实时报警信息，请使用谷歌浏览器！",
          type: "warning",
          duration: 0,
        });
    }
    ws.onmessage = function(e) {
      console.log("接受信息；",e)
      wsMsg=e.data
      messageHandle(e.data)
      heartCheck.start()
    }

    ws.onclose = function() {
      console.log("连接已关闭")
      // localStorage.clear()
      console.log(count)
      if(count <= 3&&count>0){
        reconnect(clientId);
      }else {
        Notification({
          title: '错误',
          message: '连接已关闭',
          type: 'error',
        });
        // window.location.reload();
      }
    }

    ws.onopen = function(e) {
      console.log("连接成功，发送消息：",e)
      messageHandle("ok")
    }

    ws.onerror = function(e) {
      console.log("数据传输发生错误,后台服务关闭");
      if(count>0){
        reconnect(clientId);
      }else {
        Notification({
          title: '错误',
          message: '数据传输发生错误,服务关闭或网络不通!',
          type: 'error',
        });
        //localStorage.clear()
        // window.location.reload();
      }
      messageHandle(undefined)
    }
  },
  CloseWebscoket:function(){
    ws.onclose()
  },
  GetMessage: wsMsg,
  Send:function(sender,reception,body,flag){
    let data = {
      sender:sender,
      reception:reception,
      body:body,
      flag:flag
    }
    let msg= JSON.stringify(data)
    ws.send(msg)
  },
  getWebSocket(){
    return ws;
  },
  getStatus() {
    if (ws.readyState == 0) {
      return "未连接";
    } else if (ws.readyState == 1) {
      return "已连接";
    } else if (ws.readyState == 2) {
      return "连接正在关闭";
    } else if (ws.readyState == 3) {
      return "连接已关闭";
    }
  }
}

export default websocket
// export default {
//   //namespaced: true,
//   websocket,
//   //state,
//   //mutations,
//   //actions
// }
//根据消息标识做不同的处理
function messageHandle(message) {
  console.log("msg:",message)
  console.log("连接失败:"+count)
  switch (message) {
    case '404session失效':
      //关闭连接跳转登录
      ws.close();
      break;
    case undefined :
      //连接失败
      count++;
      break;
    case 'ok' :
      //心跳消息成功
      count = 0;
      break;
    default:
      //let msg = JSON.parse(message)
      //list通知其他用户现在在线的人的id,存储到onlineUser
      if(message.match(":")){
        var count=message.split(":");
        // localStorage.setItem("onlineUserCount",count[1]);
        this.setCookie("onlineUserCount",count[1])
      }else{
        // localStorage.setItem("notifyCount",message)
        this.setCookie("notifyCount",message)
      }
      count = 0
      heartCheck.start();
  }
}

function reconnect(sname) {
  if(lockReconnect) {
    return;
  };
  lockReconnect = true;
  //没连接上会一直重连，设置延迟避免请求过多
  tt && clearTimeout(tt);
  tt = setTimeout(function () {
    console.log("执行断线重连...")
    websocket.Init(sname);
    lockReconnect = false;
  }, 5000);
}

//心跳检测
var heartCheck = {
  timeout: 1000 * 10 * 3, //3 = 30s
  timeoutObj: null,
  serverTimeoutObj: null,
  start: function(){
    var self = this;
    this.timeoutObj && clearTimeout(this.timeoutObj);
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
    this.timeoutObj = setTimeout(function(){
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      console.log('心跳检测...');
      ws.send("heartCheck:"+ clientId );
      self.serverTimeoutObj = setTimeout(function() {
        if(ws.readyState!==1){
          ws.close();
        }
      }, self.timeout);

    }, this.timeout)
  }
}