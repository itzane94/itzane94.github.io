---
title: unset和array_splice删除数组的区别
date: '2018-6-3 16:15:15'
tag: ['php']
meta:
  -
    name: description
    content: unset和array_splice删除数组的区别
  -
    name: keywords
    content: unset和array_splice删除数组的区别
---
首先看一段代码：
```php
<?php
 $a = array('0'=>'A','1'=>'B','2'=>'C','3'=>'D');
 echo json_encode($a);
 echo json_encode((object)$a);
```
代码执行结果：

["A","B","C","D"]

{"0":"A","1":"B","2":"C","3":"D"}

第一种被称为json数组，第二种被称为json对象 那接下来的问题是，如果我们存入数据库中的是json数组，我们需要删除C，再将删除后的结果保存到数据库中需要怎么做呢？

使用unset删除：
```php
<?php
 $a = array('0'=>'A','1'=>'B','2'=>'C','3'=>'D');
 $a = json_encode($a);//假设从数据库取出的值
 $a = json_decode($a,true);
 $k = array_search('C',$a,true);
 unset($a[$k]);  
 echo json_encode($a);
```
执行结果：

{"0":"A","1":"B","3":"D"}

使用array_splice删除
```php
<?php
 $a = array('0'=>'A','1'=>'B','2'=>'C','3'=>'D');
 $a = json_encode($a);//假设从数据库取出的值
 $a = json_decode($a,true);
 $k = array_search('C',$a,true);
 array_splice($a,$k,1);
 echo json_encode($a);
```
执行结果：

["A","B","D"] 将它强行转换成json对象
```php
echo json_encode((object)$a);
```
执行结果：

{"0":"A","1":"B","2":"D"} 比较发现：unset删除数组，其索引值没有变化，而array_splice删除数组值时，会重新建立索引（前提是索引数组）; 不连续的索引数组，在转成json时候，会成为json对象。连续的索引数组会称为json数组。所以需要根据需求合理使用这两个函 数！

可能存在问题的场景举例

$a = {"0":"A","1":"B","2":"D"} //假设从数据库取出 $a = json_decode($a); //未使用第二参数强转数组 in_array('A',$a); //开启报错会提示warning 如果关闭则不会报错，接下来就会出现意想不到的错误。

::: danger
本文作者：zane</br>
版权声明：本博客所有文章除特别声明外，均采用 CC BY-NC-SA 3.0 许可协议。转载请注明出处！
:::

