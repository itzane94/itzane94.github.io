---
title: php session 的GC机制
date: '2018-10-26 21:00:25'
tag: ['php','网络安全']
meta:
  -
    name: description
    content: php session 的GC机制
  -
    name: keywords
    content: php session 的GC机制
---
php的session默认有效期是24分钟（1440s），如果客户端超过24分钟没有刷新，session就应当会被回收，失效。用户关闭浏览器，会话结束，session也应当失效。但是事实情况往往并非如此！

首先谈谈关于session gc的基本设置。 session的生命周期可以通过session.gc_maxlifetime来设置。 php中session的默认存储方式是文件，可以通过php.ini中session.save_handler来设置，使用文件进行存储时，默认的存储位置为/var/lib/php/session(ubuntu系统)，也可通过session.save_path自行修改存储位置。

注释：phpini中对于配置session.save_path同时给出这种方式：session.save_path = "N;MODE;/tmp" 其中，N表示多级目录，值为数字。MODE表示创建session文件权限。/tmp表示session存储路径。官方给出如下解释性说明：

此指令还有一个可选的 N 参数来决定会话文件分布的目录深度。 例如，设定为 '5;/tmp' 将使创建的会话文件和路径类似于 /tmp/4/b/1/e/3/sess_4b1e384ad74619bd212e236e52a5a174If。 要使用 N 参数，必须在使用前先创建好这些目录。 在 ext/session 目录下有个小的 shell 脚本名叫 mod_files.sh，windows 版本是 mod_files.bat 可以用来做这件事。 此外注意如果使用了 N 参数并且大于 0，那么将不会执行自动垃圾回收，更多信息见 php.ini。 另外如果用了 N 参数，要确保将 session.save_path 的值用双引号 "quotes" 括起来，因为分隔符分号（ ;）在 php.ini 中也是注释符号。 文件储存模块默认使用 mode 600 创建文件。 通过 修改可选参数 MODE 来改变这种默认行为： N;MODE;/path ，其中 MODE 是 mode 的八进制表示。 MODE 设置不影响进程的掩码(umask)。 Caution：使用以上描述的可选目录层级参数 N 时请注意，对于绝大多数站点， 大于1或者2的值会不太合适——因为这需要创建大量的目录：例如，值设置为 3 需要在文件系统上创建 64^3 个目录，将浪费很多空间和 inode。 仅仅在绝对肯定站点足够大时，才可以设置 N 大于2。

除此之外，与session有关的还有一个比较重要的，那就是session.cookie_lifetime，这是设置存储phpsessionID所使用的cookie生命周期，默认时间是0，所以用户关闭浏览器，session就失效了，其实是用来存储phpsessionID的cookie失效了！ 那么接下来就简单讨论下session的GC机制。

第一种方式，用户可以通过修改php.ini中session.gc_probability和session.gc_divisor来设置php session的回收概率，默认情况下是1和100，也就是说当用户使用session_start()时，会执行这种回收机制，回收概率是1/100。不过，从性能的角度讲，不建议将这个比率设置过大。

另一种方式在ubuntu下，通过外部的cron进程来完成gc的回收，可以在/etc/cron.d/php中查看
```shell
vi /etc/cron.d/php 
# Look for and purge old sessions every 30 minutes
09,39 * * * * root [ -x /usr/lib/php/sessionclean ] && if [ ! -d /run/systemd/system ]; then /usr/lib/php/sessionclean; fi
```
除此之外，用户也可以通过程序的方式清除session
```php
session_destory()
unset();
```
对于如何设置一个严格30分钟过期的session，鸟哥有给出完美的答案，可供参考学习。 附上链接地址：[风雪之隅](http://www.laruence.com/2012/01/10/2469.html)


::: danger
本文作者：zane</br>
版权声明：本博客所有文章除特别声明外，均采用 CC BY-NC-SA 3.0 许可协议。转载请注明出处！
:::

