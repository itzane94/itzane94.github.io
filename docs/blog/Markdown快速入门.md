---
title: markdown快速入门
date: '2018-12-09 10:12:31'
tag: ['js', 'vue','markdown']
meta:
  -
    name: description
    content: markdown
  -
    name: keywords
    content: markdown
---
## 标题
在markdown中有6级标题。其中六级最小，一级最大。
```
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
```
效果如下
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

## 换行
在Markdown之中我们会发现文字无法换行，始终集中在一行之中。这时如果需要换行那么该怎么办呢？
```
上段文字
</br>
下段文字
```
> 有些编辑器如网易云笔记markdown编辑器中空格+enter也可以实现换行功能。
## 分割线
```
看
***
分割线
```
看
***
分割线
## 引用
```
>引用话语
```
>引用话语
## 文字样式
```
*斜体*
**加粗**
==高亮==
~~划线~~
```
*斜体*
**加粗**
==高亮==
~~划线~~
如果想修改文字大小/颜色/字体，使用font标签
```
<font color=#2196F3 size=2 face="宋体">宋体大小为2的字</font>
```
<font color=#2196F3 size=2 face="宋体">宋体大小为2的字</font>
文字居中
```
<center>居中</center>
```
<center>居中</center>
## 代码高亮

==```key==
==code something==
==```==
```php
echo 1;
```
## 列表
```
- 列表1
+ 列表1
* 列表1
1. 有序1
2. 有序2
```
- 列表1
+ 列表1
* 列表1
1. 有序1
2. 有序2
## 表格
```
表头|表头|表头
---|:--:|---:
内容|内容|内容
内容|内容|内容

第二行分割表头和内容。
- 有一个就行，为了对齐，多加了几个
文字默认居左
-两边加：表示文字居中
-右边加：表示文字居右
注：原生的语法两边都要用 | 包起来。此处省略
```

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
## emoji
```
:tada: :100:
::: tip 哈哈大小
```
:tada: :100:

## tip
```
::: tip 
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a dangerous warning
:::
```
::: tip 
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a dangerous warning
:::
## 图片
```
语法：![图片Alt](图片地址 “图片Title”)
图片Alt：这个就是图片没有加载出来的时候，然后就会显示这个文字啦。
图片Title：悬浮的时候现实的文字。
```
![gravatar](/img/logo.png)

## 超链接
```
行内式：[链接文字](链接地址 “title”)
说明：
[] 里填写链接文字；就是界面上看到的那个文字。
() 里填写链接地址；就是需要跳转的地址。
title属性：就是鼠标悬浮时展示的文字，该项非必填。
```
[简书](http://www.jianshu.com)

::: danger
本文作者：zane</br>
版权声明：本博客所有文章除特别声明外，均采用 CC BY-NC-SA 3.0 许可协议。转载请注明出处！
:::
