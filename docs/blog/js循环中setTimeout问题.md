---
title: js循环中setTimeout问题
date: '2018-5-12 11:23:55'
tag: ['js']
meta:
  -
    name: description
    content: js循环中setTimeout问题
  -
    name: keywords
    content: js循环中setTimeout问题
---
之前写过弹幕，遇到的关于js循环中延迟执行的小问题。 不多说，上最后的代码。
```js
for(var i in data){
  var j = 0;
  setTimeout(function(){
  //barrageWall.upWall("images/aq.png","我是说话人",data[i]);//初始化弹幕墙
  barrageWall.upWall(data[j]['id'],data[j]['grava'],data[j]['message']);//初始化弹幕墙
  j++;
  },i*1000 );
  }
```
在网上查阅资料，发现大概是这么个意思。

为每个定时器处理函数创建不同的i变量副本。如：
```js
function doSetTimeout(i) {
  setTimeout(function() { alert(i); }, 100);
}

for (var i = 1; i <= 2; ++i)
  doSetTimeout(i);
```
每个定时器处理函数就会共享同一个作用域里的同一个变量i，那当循环完后，上面例子是多少呢？是3.这里通过定义一个函数来实现中介的作用，从而创建了变量的值的副本。由于setTimeout()是在该副本的上下文中调用的，所以它每次都有自己的私有的"i"以供使用。

但是随着时间的推移，这些代码的效果显得有些混乱是显而易见的，因为设立一些时间间隔相同的连续的setTimeout()将导致所有延时处理程序同时被调用。了解设置timer（对setTimeout()的调用）几乎不消耗时间是很重要的。也就是说，告诉系统“请在1000毫秒后调用此函数”将会被立即返回，因为在timer队列中安装延时请求的过程非常快。

因此，如果有一串连续的延时请求（比如我答案中的代码），而且每一个时间延迟值是相同的，那么一旦经过足够的时间，所有延时处理程序将一个接一个快速连续调用。

以上为引用stackoverflow上的回答。据此修改代码，效果符合预期。很经典的问题！
::: danger
本文作者：zane</br>
版权声明：本博客所有文章除特别声明外，均采用 CC BY-NC-SA 3.0 许可协议。转载请注明出处！
:::

