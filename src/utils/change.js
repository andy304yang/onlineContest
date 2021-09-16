// url转为base
export function getBase64Image(img) {
  var canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  var ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)
  var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
  var dataURL = canvas.toDataURL('image/' + ext)
  return dataURL
}

// 获取图片完整名字,a.jpg
export function getFileName(str) {
  const start = str.lastIndexOf('/') + 1
  const filename = str.slice(start)
  return filename
}

// 获取图片名字,a
export function getImageName(str) {
  const start = str.lastIndexOf('/') + 1
  const end = str.lastIndexOf('.')
  const imgname = str.slice(start, end)
  return imgname
}

// base转file
export function btof(data, fileName) {
  const dataArr = data.split(',')
  const byteString = atob(dataArr[1])

  const options = {
    type: 'image/jpeg',
    endings: 'native'
  }
  const u8Arr = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    u8Arr[i] = byteString.charCodeAt(i)
  }
  return new File([u8Arr], fileName + '.jpg', options)
}
