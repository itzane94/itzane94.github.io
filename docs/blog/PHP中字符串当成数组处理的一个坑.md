---
title: PHP中字符串当成数组处理的一个坑
date: '2018-11-26 21:00:25'
tag: ['php','bug']
meta:
  -
    name: description
    content: PHP中字符串当成数组处理的一个坑
  -
    name: keywords
    content: PHP中字符串当成数组处理的一个坑
---
首先看一段代码：
```php
<?php
$suite_id = 6;
$a = '6个核桃';
if($a['suite_id'] == $suite_id){
echo 1;
}else{
echo 2;
}
```
答案是输出：1；

php中会将字符串当成数组处理；

比如：$a = 'abc'; $a[0] ->a $a[2]->c 没有定义的下标默认是 $a[0] (会报warning错误，但是不影响程序的执行)；有中文的会显示乱码，因为中文编码和数字字母占字节不同。

所以开发过程中需要注意下，开发的过程中为了避免这种情况最好用isset先判断下。
::: danger
本文作者：zane</br>
版权声明：本博客所有文章除特别声明外，均采用 CC BY-NC-SA 3.0 许可协议。转载请注明出处！
:::

