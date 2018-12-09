---
title: 一个留言弹幕demo
date: '2018-10-14 16:17:25'
tag: ['php','swoole']
meta:
  -
    name: description
    content: 一个留言弹幕demo
  -
    name: keywords
    content: 一个留言弹幕demo
---
最近项目上有用到swoole搭建的websocket去实现一些功能。趁着周末写了个弹幕，原理是一样的。

首先需要开启php的redis扩展及swoole扩展。

注意：需要在cli下开启这两个扩展。因为服务端脚本执行在php的cli模式下。 查看开启扩展 : php -m

下面就是服务端代码：
```php
<?php
/**
 * author zane
 * Class myswoole
 */
class myswoole{
    private $ws;   //websocket连接句柄
    private $red;  //redis连接句柄
    public function __construct() {
        $this->myredis();      // 连接redis
        $this->mywebsocket(); // 开启websocket服务
    }
    //websocket 服务端
    public function mywebsocket(){
        //创建websocket服务器对象，监听0.0.0.0:9502端口
        $this->ws = new swoole_websocket_server("0.0.0.0", 9502);
        //初始化swoole服务
        $this->ws->set(array(
            'daemonize'   => 0, //是否作为守护进程,此配置一般配合log_file使用
            'max_request' => 1000,
            'dispatch_mode' => 2,
            'debug_mode' => 1,
            'log_file' => 'swoole.log',
            // 心跳检测的设置，自动踢掉掉线的fd
            'heartbeat_idle_time' => 600,
            'heartbeat_check_interval' => 60,
        ));
        //监听WebSocket连接开启事件
        $this->ws->on('WorkerStart', function($ws , $worker_id){
            // 在Worker进程开启时绑定定时器
            echo "【date：".date("Y-m-d H:i:s",time())."】".$worker_id ." onWorkerStart... \n";
        });
        //监听连接打开时间
        $this->ws->on('open', function($ws, $request){
            echo "【date：".date("Y-m-d H:i:s",time())."】client ".$request->fd." has established...\n";
            $msg = $this->red->lrange(date("Y-m-d",time()),0,-1);
            foreach ($msg as $data){
                $this->ws->push($request->fd,json_encode((object)$data));
                usleep(500000);
            }
        });
        //监听WebSocket消息事件
        $this->ws->on('message', function($ws, $frame){
            echo "【data：".date("Y-m-d H:i:s",time())."】 Message: {$frame->data} \n";
            $this->red->lpush(date("Y-m-d",time()),$frame->data);
            foreach($this->ws->connections as $id){
                $this->ws->push($id, json_encode((object)$frame->data));
            }
        });
        //监听WebSocket连接关闭事件
        $this->ws->on('close', function($ws, $fd){
            echo "【date：".date("Y-m-d H:i:s",time())."】client ".$fd." has established...\n";
        });
        //开启服务
        $this->ws->start();
    }
    //启动redis服务
    public function myredis(){
        $this->red = new Redis();
        $this->red->connect('127.0.0.1','6379');
        $this->red->select(5); 
        echo "【date：".date("Y-m-d H:i:s",time())."】redis service has started...\n";

    }
}
$myswoole = new myswoole;

在cli下执行脚本及可：php server.php

一个小问题：
这是浏览器客户端代码。
//初始化ws
  var wsServer = "ws://127.0.0.1:9502";
  websocket = new WebSocket(wsServer);
  websocket.onopen = function(evt){
      console.log(websocket.readyState+' websocket service established...');
  }
  //监听返回结果
  websocket.onmessage = function (evt){
      var data = JSON.parse(evt.data);
      console.log(data);
      for(var i in data){
          barrageWall.upWall("images/aq.png","我是说话人",data[i]);//初始化弹幕墙
      }
  }
```
总体功能上我是这样想的，当用户点开页面，建立会话连接，此时将之前的（一天内）弹幕信息全部取出来，广播给用户。 但是结合前端页面实际效果是，所有弹幕会在一个垂直的竖排显示。 我尝试着在循环时候加上类似于php的sleep(N)函数功能的代码。最后的效果是等待N次循环秒数之和后，全部在弹幕上以垂直竖排的方式输出。 无奈之下，只好在后端每次只发一条数据信息，并且设置合理的时间间隔，前端才会有想要的效果。 熬夜伤身体，所以我更倾向于通宵。开个玩笑！很晚了，我得睡了= = 这个问题留着，改日再究！

所有的demo文件已经上传到我的github上，需要的可以参考下载。[弹幕demo](https://github.com/itzane94/Barrage)
::: danger
本文作者：zane</br>
版权声明：本博客所有文章除特别声明外，均采用 CC BY-NC-SA 3.0 许可协议。转载请注明出处！
:::

