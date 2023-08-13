<template>
  <el-dropdown trigger="click" @command="changeLanguage" class="header-language">
    <div class="language-btn">
      <!-- <svg-icon style="color:#fff;font-size:20px" icon-class="language" /> -->
      <svg t="1687890363434" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2376" data-spm-anchor-id="a313x.7781069.0.i3" width="18" height="18">
        <path d="M768 426.666667a42.666667 42.666667 0 0 0-42.666667-42.666667H128a42.666667 42.666667 0 0 0-42.666667 42.666667v341.333333a42.666667 42.666667 0 0 0 42.666667 42.666667h597.333333a42.666667 42.666667 0 0 0 42.666667-42.666667v-341.333333m85.333333 0v341.333333a128 128 0 0 1-128 128H128a128 128 0 0 1-128-128v-341.333333a128 128 0 0 1 128-128h597.333333a128 128 0 0 1 128 128z" fill="#516280" p-id="2377"></path>
        <path d="M896 640h-64v-85.333333H896a42.666667 42.666667 0 0 0 42.666667-42.666667V256a42.666667 42.666667 0 0 0-42.666667-42.666667H298.666667a42.666667 42.666667 0 0 0-42.666667 42.666667v64H170.666667V256a128 128 0 0 1 128-128h597.333333a128 128 0 0 1 128 128v256a128 128 0 0 1-128 128z" fill="#516280" p-id="2378"></path>
        <path d="M597.333333 490.666667m0 34.133333l0 0q0 34.133333-34.133333 34.133333l-273.066667 0q-34.133333 0-34.133333-34.133333l0 0q0-34.133333 34.133333-34.133333l273.066667 0q34.133333 0 34.133333 34.133333Z" fill="#1A90FF" p-id="2379" data-spm-anchor-id="a313x.7781069.0.i5" class="selected"></path>
        <path d="M597.333333 635.733333m0 34.133334l0 0q0 34.133333-34.133333 34.133333l-273.066667 0q-34.133333 0-34.133333-34.133333l0 0q0-34.133333 34.133333-34.133334l273.066667 0q34.133333 0 34.133333 34.133334Z" fill="#1A90FF" p-id="2380" data-spm-anchor-id="a313x.7781069.0.i0" class="selected"></path>
        <path d="M341.333333 704m-42.666666 0l0 0q-42.666667 0-42.666667-42.666667l0-128q0-42.666667 42.666667-42.666666l0 0q42.666667 0 42.666666 42.666666l0 128q0 42.666667-42.666666 42.666667Z" fill="#1A90FF" p-id="2381" data-spm-anchor-id="a313x.7781069.0.i2" class="selected"></path>
        <path d="M597.333333 704m-42.666666 0l0 0q-42.666667 0-42.666667-42.666667l0-128q0-42.666667 42.666667-42.666666l0 0q42.666667 0 42.666666 42.666666l0 128q0 42.666667-42.666666 42.666667Z" fill="#1A90FF" p-id="2382" data-spm-anchor-id="a313x.7781069.0.i4" class="selected"></path>
        <path d="M469.333333 789.333333m-42.666666 0l0 0q-42.666667 0-42.666667-42.666666l0-298.666667q0-42.666667 42.666667-42.666667l0 0q42.666667 0 42.666666 42.666667l0 298.666667q0 42.666667-42.666666 42.666666Z" fill="#1A90FF" p-id="2383" data-spm-anchor-id="a313x.7781069.0.i1" class="selected"></path>
      </svg>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="'zh'=== $i18n.locale ">中文简体</el-dropdown-item>
      <el-dropdown-item command="tw" :disabled="'tw'=== $i18n.locale ">中文繁体</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="'en'=== $i18n.locale ">英文</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookies from 'js-cookie'
import {mapMutations } from 'vuex'

export default {
  name: 'Langs',
  methods: {
    // ...mapMutations('app', [
    //       'SET_LANGUAGE'
    // ]),
    changeLanguage(lang) {
      this.$i18n.locale = lang // 设置给本地的i18n插件
      //this.SET_LANGUAGE(lang);
      Cookies.set('language',lang)
      this.$message.success('切换多语言成功')
    }
  },
  computed: {
    // language() {
    //   return this.$store.getters.language
    // }
  }
}
</script>
<style scoped>
.header-language{
  font-size: 0 !important;
  margin: 0 auto;
  display: flexbox;
}
.language-btn{
  align-content: center;
  align-items: center;
}
.icon{
  vertical-align: middle;
}
</style>
