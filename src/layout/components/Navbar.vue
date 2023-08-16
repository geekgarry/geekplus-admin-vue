<template>
  <div class="navbar">
    <hamburger 
      :is-active="sidebar.opened" 
      class="hamburger-container" 
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <div class="right-menu-item hover-effect" @click="showNotice">
        <el-badge
          :value="100"
          :max="10"
          class="redPoint"
          ref="msgPoint"
          type="danger"
          is-dot
          v-if="notifyMsg!=undefined"
        ></el-badge>
        <span class="el-icon-chat-dot-square"></span>
      </div>
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

<!--        <el-tooltip content="源码地址" effect="dark" placement="bottom">-->
<!--          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />-->
<!--        </el-tooltip>-->

<!--        <el-tooltip content="文档地址" effect="dark" placement="bottom">-->
<!--          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />-->
<!--        </el-tooltip>-->

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
        <langs class="right-menu-item hover-effect" />
        <!-- <div class="right-menu-item">
          <span class="avatar-wrapper-span">在线人数:{{ onlineUserCount }}</span>
        </div> -->
      </template>
      <div class="right-menu-item">
        <span class="avatar-wrapper-span">{{ nickName }}:{{ userName }}</span>
      </div>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <!-- <el-avatar shape="square" :src="avatar ? prefixUrl+avatar : mePic"></el-avatar> -->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              <i class="el-icon-house"></i>首页
            </el-dropdown-item>
          </router-link>
          <router-link to="/user/profile">
            <el-dropdown-item>
              <i class="el-icon-user"></i>个人中心
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/geekgarry">
            <el-dropdown-item>
              <!-- <i class="el-icon-fork-spoon"></i> -->
              <i><svg-icon icon-class="github"/></i>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://github.com/geekgarry/geekplus-admin-vue#readme">
            <el-dropdown-item><i class="el-icon-document"></i>Docs</el-dropdown-item>
          </a>
          <el-dropdown-item @click.native="setting = true">
            <span><i class="el-icon-magic-stick"></i>布局设置</span>
          </el-dropdown-item>
          <!-- <el-dropdown-item @click.native="lang = true">
            <span>语言设置</span>
          </el-dropdown-item> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;"><i class="el-icon-switch-button"></i>退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import Langs from "./Lang"
import headPic from "@/assets/image/profile/mai.png";
import { getToken } from "@/utils/auth"

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    Langs
  },
  data() {
    return {
      mePic: headPic,
      //userName:'',
      notifyMsg: "",
      onlineUserCount:0,
      baseHost: window.location.host,
      baseApi: process.env.VUE_APP_BASE_API,
      prefixUrl: process.env.VUE_APP_BASE_API
    };
  },
  created: function () {
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      "device", 
      "nickName",
      "userName"
    ]),
    userAvatar:{
      get() {
        return this.$store.state.user.avatar;
      },
    },
    nkName: {
      get() {
        return this.$store.getters.nickName;
      },
    },
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
    lang: {
      get() {
        return this.$store.state.settings.switchLangs;
      },
      set(val) {
        this.$store.dispatch("settings/switchLang", {
          key: "switchLangs",
          value: val,
        });
      },
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('user/logout').then(() => {
          location.href = '/';
        })
      })
      // await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    changeLanguage(lang) {
      this.$i18n.locale = lang; // 设置给本地的i18n插件
      this.msgSuccess("切换多语言成功");
    },
    async showNotice() {
      this.msgSuccess("暂未开发！");
    },
    //调用方法
    initWebsocket(tokenId){
      this.websocket.Init(tokenId)
    },
    websocketClose(){
      this.websocket.CloseWebscoket()
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }
  .point {
    position: absolute;
    top: 0;
    right: -5px;
    width: 6px;
    height: 6px;
    background: red;
    border-radius: 50%;
  }
  .redPoint {
    position: absolute;
    margin-top: -7px;
    margin-left: -6px;
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
    .avatar-wrapper-span {
      font-size: 12px;
      position: inherit;
      right: 0px;
      top: 0px;
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
