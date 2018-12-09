---
title: PHP错误抑制符导致引用传递失效的问题
date: '2018-10-04 10:12:31'
tag: ['php','bug']
meta:
  -
    name: description
    content: 错误抑制符号
  -
    name: keywords
    content: PHP错误抑制符导致引用传递失效的问题
---
测试文件
```php
<?php
$array = array(1,2,3);
function add(&$arr){
    $arr[] = 4;
}
add(@$array);
echo '<pre>';
print_r($array);

/**
使用错误抑制符号输出结果
Notice: Only variables should be passed by reference in D:\www\test\6-20.php on line 6
Array
(
    [0] => 1
    [1] => 2
    [2] => 3
)
报错信息是：只有变量才能通过引用传递
*/
add($array);
print_r($array);
/**
不用错误抑制正常
Array
(
    [0] => 1
    [1] => 2
    [2] => 3
    [3] => 4
)
*/
```
发现在使用错误抑制符的情况下，引用传递失效了。 查找相关资料发现这个问题是PHP语言层面的bug，官方目前为止也没有修复。 参考资料：[风雪之隅](http://www.laruence.com/2010/05/28/1565.html)

原因：错误抑制符原理：
1. 保存当前的error_reporting值, 并设置error_reporting(0); //关闭错误输出
2. 恢复之前保存的error_reporting值. 按道理是没有影响的。查了相关信息，发现 PHP语法分析阶段, 把形如 “@”+expr的条目, 规约成了expr_without_variable, 而这种节点的意义就是没有变量的值, 也就是字面值, 我们都知道字面值是不能传递引用的(因为它不是变量), 所以, 就会导致这种差异。

::: danger
本文作者：zane</br>
版权声明：本博客所有文章除特别声明外，均采用 CC BY-NC-SA 3.0 许可协议。转载请注明出处！
:::

