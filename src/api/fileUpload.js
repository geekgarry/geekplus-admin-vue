import request from '@/utils/request'

//上传图片文件
export function uploadFile(formData) {
    return request({
      url: '/geekplus/articles/uploadFile',
      method: 'post',
      data: formData,
      headers:{'Content-Type': 'multipart/form-data'}
    })
  }
  
  // 获取某个文件夹下的图片list,批量删除
  export function deleteFileList(filePath) {
    return request({
      url: '/geekplus/articles/deleteFileList',
      method: 'post',
      data:filePath
    })
  }
  
  // 获取某个文件夹下的图片list，删除
  export function deleteFile(filePath) {
    return request({
      url: '/geekplus/articles/deleteFile',
      method: 'get',
      params:filePath
    })
  }