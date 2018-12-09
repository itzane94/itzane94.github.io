---
title: PHP的openssl加密扩展使用
date: '2018-8-31 23:34:15'
tag: ['网络安全','php','加密']
meta:
  -
    name: description
    content: PHP的openssl加密扩展使用
  -
    name: keywords
    content: PHP的openssl加密扩展使用
---
## 引言
互联网的发展史上，安全性一直是开发者们相当重视的一个主题，为了实现数据传输安全，我们需要保证：数据来源（非伪造请求）、数据完整性（没有被人修改过）、数据私密性（密文，无法直接读取）等。虽然现在已经有SSL/TLS协议实现的HTTPS协议，但是因在客户端上依赖浏览器的正确实现，而且效率又很低，所以一般的敏感数据（如交易支付信息等）还是需要我们使用加密方法来手动加密。

虽然对于一般的WEB开发人员来说，大可不必深入了解一些安全相关的底层技术，但学习加密基础知识，使用现有加密相关工具却十分必要。由于工作需要，自己看了些加密相关文章，结合自己的使用经历，完成此文。 学习如何使用加密之前，我们需要了解一些加密相关的基础知识。
## 加密基础
加密算法一般分为两种：对称加密算法和非对称加密算法。
1. 对称加密
对称加密算法是消息发送者和接收者使用同一个密匙，发送者使用密匙加密了文件，接收者使用同样的密匙解密，获取信息。常见的对称加密算法有：des/aes/3des.

对称加密算法的特点有：速度快，加密前后文件大小变化不大，但是密匙的保管是个大问题，因为消息发送方和接收方任意一方的密匙丢失，都会导致信息传输变得不安全。
2. 非对称加密
与对称加密相对的是非对称加密，非对称加密的核心思想是使用一对相对的密匙，分为公匙和私匙，私匙自己安全保存，而将公匙公开。公钥与私钥是一对，如果用公钥对数据进行加密，只有用对应的私钥才能解密；如果用私钥对数据进行加密，那么只有用对应的公钥才能解密。发送数据前只需要使用接收方的公匙加密就行了。常见的非对称加密算法有RSA/DSA:

非对称加密虽然没有密匙保存问题，但其计算量大，加密速度很慢,有时候我们还需要对大块数据进行分块加密。
3. 数字签名
为了保证数据的完整性，还需要通过散列函数计算得到一个散列值，这个散列值被称为数字签名。其特点有：

+ 无论原始数据是多大，结果的长度相同的；
+ 输入一样，输出也相同；
+ 对输入的微小改变，会使结果产生很大的变化；
+ 加密过程不可逆，无法通过散列值得到原来的数据；
+ 常见的数字签名算法有md5,hash1等算法。
## PHP的openssl扩展
openssl扩展使用openssl加密扩展包，封装了多个用于加密解密相关的PHP函数，极大地方便了对数据的加密解密。 常用的函数有：
1. 对称加密相关：
>string openssl_encrypt ( string $data , string $method , string $password)
其中$data为其要加密的数据，$method是加密要使用的方法，$password是要使用的密匙，函数返回加密后的数据；
其中$method列表可以使用openssl_get_cipher_methods()来获取，我们选取其中一个使用，$method列表形如：
```php
Array(
    0 => aes-128-cbc,   // aes加密
    1 => des-ecb,       // des加密
    2 => des-ede3,      // 3des加密
    ...
    )
```
其解密函数为 string openssl_encrypt ( string $data , string $method , string $password)
2. 非对称加密相关：
>openssl_get_publickey();openssl_pkey_get_public();      // 从证书导出公匙；
>openssl_get_privatekey();openssl_pkey_get_private();    // 从证书导出私匙；
它们都只需要传入证书文件（一般是.pem文件）；
>openssl_public_encrypt(string $data , string &$crypted , mixed $key [, int $padding = OPENSSL\_PKCS1\_PADDING ] )
openssl_public_encrypt(string $data , string &$crypted , mixed $key [, int $padding = OPENSSL\_PKCS1\_PADDING ] )
```php
openssl_private_encrypt()；  // 使用私匙加密；
openssl_private_decrypt()；  // 使用私匙解密；
openssl_public_decrypt()；  // 使用公匙解密；
```
3. 还有签名和验签函数：
>bool openssl_sign ( string $data , string &$signature , mixed $priv_key_id [, mixed $signature_alg = OPENSSL_ALGO_SHA1 ] )
>int openssl_verify ( string $data , string $signature , mixed $pub_key_id [, mixed $signature_alg = OPENSSL_ALGO_SHA1 ] )
签名函数：$data为要签名的数据；$signature为签名结果的引用变量；$priv_key_id为签名所使用的私匙;$signature_alg为签名要使用的算法，其算法列表可以使用openssl_get_md_methods ()得到，形如：
```php
array(
    0 => MD5,
    1 => SHA1,
    2 => SHA256,
    ...
)
```
验签函数：与签名函数相对，只不过它要传入与私匙对应的公匙；其结果为签名验证结果，1为成功，0为失败，-1则表示错误；
## 结束语
密码学是一个十分高深的学科，它理论艰深，概念繁多，作为一个WEB开发人员，虽然不需要我们去研究其底层实现，但是学会使用封装好的方法很有利于我们开发。甚至了解其基本实现，也可以触类旁通，对算法等有新的理解。

## demo
```php
<?php
/**
 * 使用openssl基于rsa实现的非对称加密
 * date 2018-1-31 zx
 */
class Sll_encrypt
{
    //私钥
    private $_privKey;
    //公钥
    private $_pubKey;
    //密钥位置
    private $_keyPath;
    /**
     * 指定密钥文件地址
     * 
     */
    public function __construct($path)
    {
        if (empty($path) || !is_dir($path)) {
            throw new Exception('请指定密钥文件地址目录');
            return;
        }
        $this->_keyPath = $path;
        self::iniSetting();
    }

    /**
     * 创建公钥和私钥
     * 
     */
    public function createKey()
    {
        $config = [
            "config" => DIR_CONFIG.'rsa.cnf', //文件位置
            "digest_alg" => "sha512",
            "private_key_bits" => 4096,
            "private_key_type" => OPENSSL_KEYTYPE_RSA,
        ];
        // 生成私钥
        $rsa = openssl_pkey_new($config);
        openssl_pkey_export($rsa, $privKey, NULL, $config);
        file_put_contents($this->_keyPath . DIRECTORY_SEPARATOR . 'priv.key', $privKey);
        $this->_privKey = openssl_pkey_get_public($privKey);
        // 生成公钥
        $rsaPri = openssl_pkey_get_details($rsa);
        $pubKey = $rsaPri['key'];
        file_put_contents($this->_keyPath . DIRECTORY_SEPARATOR . 'pub.key', $pubKey);
        $this->_pubKey = openssl_pkey_get_public($pubKey);
    }
    /**
     * 设置私钥
     * 
     */
    public function setupPrivKey()
    {
        if (is_resource($this->_privKey)) {
            return true;
        }
        $file = $this->_keyPath . DIRECTORY_SEPARATOR . 'priv.key';
        $privKey = file_get_contents($file);
        $this->_privKey = openssl_pkey_get_private($privKey);
        return true;
    }

    /**
     * 设置公钥
     * 
     */
    public function setupPubKey()
    {
        if (is_resource($this->_pubKey)) {
            return true;
        }
        $file = $this->_keyPath . DIRECTORY_SEPARATOR . 'pub.key';
        $pubKey = file_get_contents($file);
        $this->_pubKey = openssl_pkey_get_public($pubKey);
        return true;
    }
    /**
     * 初始化配置
     */
    public function iniSetting(){
        $privFile = $this->_keyPath . DIRECTORY_SEPARATOR . 'priv.key';
        $pubFile = $this->_keyPath . DIRECTORY_SEPARATOR . 'pub.key';
        $bool1 = file_exists($privFile);
        $bool2 = file_exists($pubFile);
        if(!$bool1 || !$bool2){
            $this->createKey(); //创建密钥   
        }
        $this->_privKey = file_get_contents($privFile);
        $this->_pubKey = file_get_contents($pubFile);    
    }
    /**
     * 获取公钥
     */
    public function getPublicKey(){
        return $this->_pubKey;
    }
    /**
     * 获取私钥
     */
    public function getPrivateKey(){
        return $this->_pubKey;
    }
    /**
     * 用私钥加密
     * 
     */
    public function privEncrypt($data)
    {
        if (!is_string($data)) {
            return null;
        }
        $this->setupPrivKey();
        $result = openssl_private_encrypt($data, $encrypted, $this->_privKey);
        if ($result) {
            return base64_encode($encrypted);
        }
        return null;
    }

    /**
     * 私钥解密
     * 
     */
    public function privDecrypt($encrypted)
    {
        if (!is_string($encrypted)) {
            return null;
        }
        $this->setupPrivKey();
        $encrypted = base64_decode($encrypted);
        $result = openssl_private_decrypt($encrypted, $decrypted, $this->_privKey);
        if ($result) {
            return $decrypted;
        }
        return null;
    }
    /**
     * 公钥加密
     * 
     */
    public function pubEncrypt($data)
    {
        if (!is_string($data)) {
            return null;
        }
        $this->setupPubKey();
        $result = openssl_public_encrypt($data, $encrypted, $this->_pubKey);
        if ($result) {
            return base64_encode($encrypted);
        }
        return null;
    }
    /**
     * 公钥解密
     * 
     */
    public function pubDecrypt($crypted)
    {
        if (!is_string($crypted)) {
            return null;
        }
        $this->setupPubKey();
        $crypted = base64_decode($crypted);
        $result = openssl_public_decrypt($crypted, $decrypted, $this->_pubKey);
        if ($result) {
            return $decrypted;
        }
        return null;
    }
    /**
     * __destruct
     * 
     */
    public function __destruct() {
        unset($this->_privKey);
        unset($this->_pubKey);
    }
}


以简单的用户登录为例子说明类的用法：
//需要引入的js文件
<script type="text/javascript" src="jsencrypt.min"></script>
//提交登陆表单

$('#submit').click(function(e){

var userName = $("#input-username").val();

var passWord = $("#input-password").val();

var encrypt = new JSEncrypt();

var publickey ="<?php echo $publicKey;?>";

encrypt.setPublicKey(publickey);

userName = encrypt.encrypt(userName);

passWord = encrypt.encrypt(passWord);

var form = $('<form></form>');

form.attr('action', "<?php echo htmlspecialchars_decode($action); ?>");

form.attr('method', 'post');

var userName_input = $('<input type="text" name="username">');

userName_input.attr('value',userName);

form.append(userName_input);

var password_input = $('<input type="text" name="password">');

password_input.attr('value',passWord);

form.append(password_input);

form.appendTo('body').submit();

Loginanimation(e);

return false;

});
/后端代码书写方式，需要拼凑出符合形式的key值

//基于rsa非对称加密
  $path = DIR_CONFIG.'rsa.cnf'; //DIR_CONFIG 目录常量，用于存放秘钥的文件
  $rsa = new Sll_encrypt($path);
  $publicKeys = explode(PHP_EOL,$rsa->getPublicKey());
  $keyStrings = '';
  for($i=0;$i<count($publicKeys)-2;$i++){
  $keyStrings .= $publicKeys[$i]."\\".PHP_EOL;
  }
  $keyStrings .= $publicKeys[$i]; //  //传给前段的公钥

后端接受到数据
$username = $_POST['username'];
$password = $_POST['password'];
$username = $rsa->privDecrypt($username);
$password = $rsa->privDecrypt($password);
```






::: danger
本文作者：zane</br>
版权声明：本博客所有文章除特别声明外，均采用 CC BY-NC-SA 3.0 许可协议。转载请注明出处！
:::

