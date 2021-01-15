### 介绍

sm2位非对称加密，sm3摘要算法，sm4对称加密。对http请求响应报文进行加密。

**客户端加密过程**

1. 获取sm2 公钥， 可以服务端获取，或者直接存在客户端
2. 客户端使用sm4生成密钥 
3. 使用sm2公钥加密 sm4密钥 生成密文 msg1
4. 对请求参数（报文）sm3签名
5. 将请求参数和sm3签名使用sm4密钥加密生成密文msg2
6. 将请求参数拼接 ` {xn: msg1+'|'+msg2}`,发送请求
7. 对请求返回的响应内容实用sm4密钥解密 

### 基本使用

```javascript
// 引入
import { SM2, SM3, SM4 } from './index.js'

// SM2
// 获取公私钥匙对
const keypair = SM2.generateKeyPairHex()
publicKey = keypair.publicKey // 公钥
privateKey = keypair.privateKey // 私钥

const encryptData = SM2.doEncrypt(msgString, publicKey) // 加密结果
const decryptData = SM2.doDecrypt(encryptData, privateKey) // 解密结果


// SM3 签名
const digest = SM3('abx')

// SM4  默认走 ECB 模式
const secretKey = SM4.createKey() // 生成对称密钥 为16进制数 32位字符串
const msg = 'hello world'
const encryptData = SM4.encrypt(msg, secretKey)
const decryptData = SM4.decrypt(encryptData, secretKey)
```



### 使用axios示例

在发送请求时，对数据加密，加签

```javascript
import { SM2, SM3, SM4 } from './index.js'

// 签名



function http(method, url, params) {
  const methodArr = ['post', 'POST', 'PUT', 'put', 'PATCH']
  const paramKey = methodArr.includes(method) ? 'data' : 'params'
  
  const secretKey = SM4.createKey() // sm4 密钥
  const msg1 = SM2.doEncrypt(secretKey, publicKey, 0) // sm4 密钥密文
  params.sign = generateDigest(params, 'kkkkkkkkkkkkkkkk')
  const obj = JSON.stringify(params)
  const msg2 = SM4.encrypt(obj, secretKey)
  reqData = {
    xn: `${msg1}|${msg2}`
  }
  
  return new Promise((resolve, reject) => {
    axios({
      headers: {
        appId: 'supplyChain'
      },
      url,
      method,
      [paramKey]: reqData
    }).then(res => {
      console.log(res)
      if (res.status === 200) {
        if (encrypt) {
          const resData = JSON.parse(SM4.decrypt(res.data, secretKey))
          console.log(typeof resData)
          console.log(JSON.parse(resData))
          resolve(resData)
        } else {
          resolve(res.data)
        }
      } else {
        reject(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}
```



