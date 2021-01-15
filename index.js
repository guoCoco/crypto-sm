import SM3 from './sm3.js';
import SM4 from './sm4.js';
import SM2 from './sm2/index.js';

function generateDigest(map, appKey) {
  if (Object.prototype.hasOwnProperty.call(map, 'sign')) {
    delete map.sign
  }
  // 排序
  const keysArr = Object.keys(map).sort()
  const valueArr = [] // 创建一个新数组，用于存放排好序的键值对
  for (var i = 0; i < keysArr.length; i++) {
    // 遍历keysArr数组
    valueArr.push(map[keysArr[i]])
  }
  valueArr.push(appKey)
  const str = valueArr.join('')
  return SM3(str)
}

SM3.generateDigest = generateDigest

export  {
  SM2,
  SM3,
  SM4,
}
