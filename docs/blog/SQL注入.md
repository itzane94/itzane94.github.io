---
title: SQL注入
date: '2018-7-21 9:34:15'
tag: ['sql','网络安全','php']
meta:
  -
    name: description
    content: SQL注入
  -
    name: keywords
    content: SQL注入
---
### 什么是SQL注入
SQL注入是一种将SQL代码添加到输入参数中，传递到SQL服务器解析并执行的一种攻击方式。
### SQL注入的产生
web开发人员无法保证所有的输入都已经过滤 攻击者利用发送给SQL服务器的输入数据结构可执行是SQL代码 数据库未做相应的安全配置
### 如何寻找SQL注入漏洞？
借助逻辑推理
识别web应用中所有输入点
get输入 post输入 用户个人信息 了解哪些请求可以触发异常(特殊字符，单引号双引号等） 检测服务器中响应的异常 （处理，报500错误或实行跳转
### 如何进行SQL注入攻击？
1. 数字注入
SQL语句中包含数字的部分 如get请求通过id获取文章 url?id=1 注入：url?id=-1 or 1=1
```sql
("select * from article where id = ".$id);
```
2. 字符串注入
SQL语句中包含字符串的部分 例如用户登录
```sql
("select * from user where name = $name and password = $password");
```
注入： mysql注释的方式 # 填写 用户名 zx'# 密码 suiyixie
```sql
 select * from user where name = 'zx'#' and password = 'xuiyixie'
```
mysql注释的方式-- 填写 用户名 zx'-- 密码 suiyixie
```sql
select * from user where name = 'zx'--' and password = 'xuiyixie'
```
### 如何预防SQL注入？
1. 严格减产输入变量的类型和格式 如get请求通过id获取文章 url?id=1 注入：url?id=-1 or 1=1 后台判断类型 is_numeric()，或者强制类型转换 正则表达式验证、强制限制字符长度等
2. 过滤或者转义特殊字符 addslashes($str) mysqli_real_escape_string($db,$str);
3. 利用mysql的预编译
```php
mysqli方式
$sql = "select id ,username from user where username = ? and password = ?";
$stmt = mysqli_prepare($db,$sql);
mysqli_stmt_bind_param($stmt,'ss',$username,$password); //ss表示两个参数的类型
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt,$id,$username); //绑定结果集
mysqli_stmt_fetch($stmt);
echo $id,$username; 打印结果
pdo方式
//连接
try{
$pdo = new PDO("mysql:host=localhost;dbname=zx","root","");
}catch(PDOException $e){
die("数据库连接失败".$e->getMessage());
}
//预处理
$sql = "select id ,username from user where username = ? and password = ?";
$stmt = $pdo->prepare($sql);
//绑定
$stmt->bindParam(1,$username);
$stmt->bindParam(2,$password);
//执行并返回结果
$stmt->execute();
$row = $stm->fetchAll(PDO::FETCH_ASSOC);
```

::: danger
本文作者：zane</br>
版权声明：本博客所有文章除特别声明外，均采用 CC BY-NC-SA 3.0 许可协议。转载请注明出处！
:::

