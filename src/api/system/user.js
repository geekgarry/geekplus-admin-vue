import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/gputil";

export function login(data) {
  return request({
    url: '/sys/user/login',
    method: 'post',
    data
  })
}
//获取菜单树
export function getMenuTree() {
  return request({
    url: '/sys/user/getMenu',
    method: 'get',
  })
}
//获取验证码图片
export function getCaptchaImage(){
  return request({
    url: '/captchaBase64',
    method: 'get'
  })
}
//获取用户信息
export function getInfo(token) {
  return request({
    //url: '/vue-admin-template/user/info',
    url: '/sys/user/detail',
    method: 'get',
    params: { userId:1,token }
  })
}
//登出
export function logout() {
  return request({
    //url: '/vue-admin-template/user/logout',
    url: '/sys/user/logout',
    method: 'post'
  })
}
//获取所有用户
export function listUser(query){
  return request({
    url: '/sys/user/list',
    method: 'get',
    params:query
  })
}
//获取在线用户
export function geySysUserOnline(){
  return request({
    url: '/sysUser/Online',
    method: 'get'
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/sys/user/detail',
    method: 'get',
    params: userId
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/sys/user/add',
    method: 'post',
    data: data
  })
}

export function addUserPwd(data) {
  return request({
    url: '/sys/user/addEncodePwd',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/sys/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(ids) {
  return request({
    url: '/sys/user/'+ids,
    method: 'delete'
  })
}

// 导出用户
export function exportUser(query) {
  return request({
    url: '/sys/user/export',
    method: 'get',
    params: query
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const queryParams = {
    userId: userId,
    password: password
  }
  return request({
    url: '/sys/user/resetUserPwd',
    method: 'get',
    params: queryParams
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/sys/user',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/sys/user/userProfile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/sys/user',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/sys/user/updateUserPwd',
    method: 'get',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/sys/user/avatar',
    method: 'post',
    data: data,
    headers:{'Content-Type': 'multipart/form-data'}
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/sys/user/importTemplate',
    method: 'get'
  })
}
