import zhLocale from 'element-ui/lib/locale/lang/zh-TW' //引入element语言包
const tw = {
    navbar: {
        dashboard: '首页',
        logOut: '退出登录',
        profile: '个人中心',
        theme: '换肤',
        size: '布局大小'
    },
    login: {
        title: '系统登录',
        logIn: '登录',
        usernameTips: '请输入用户名',
        passwordTips: '请输入密码',
        remeberPsd: '记住密码',
        forgotPsd: '忘记密码?',
        freeRegister: '免费注册',
        usernameCheckedTips: '请输入用户名',
        passwordCheckedTips: '请输入密码',
        codeCheckedTips: '请输入验证码'
    },
    message: {
        'text': '好好学习，天天向上',
    },
    ...zhLocale
}
 
export default tw;