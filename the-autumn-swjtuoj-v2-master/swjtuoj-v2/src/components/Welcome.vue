<template>
  <div>
    <!-- 容器组件 -->
    <el-container>
      <!-- 布局头部区域 -->
      <el-header>
        <el-menu
          mode="horizontal"
          class="navmenu_pos"
          router
          :default-active="getPath">
          <el-menu-item index="/home">首页</el-menu-item>
          <el-menu-item index="/notice">公告</el-menu-item>
          <el-menu-item index="/question">题目</el-menu-item>
          <el-menu-item style="float: right" @click="logout">登出</el-menu-item>
          <el-submenu index="1" style="float: right">
            <template slot="title">{{username}}</template>
            <el-menu-item index="/info">个人信息</el-menu-item>
            <el-menu-item index="/setting">信息修改</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-main>
        <router-view @changeNav="changeNavName"></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data () {
    return {
      // 被激活的链接地址
      activePath: '',
      username: '用户名'
    }
  },
  created () {
    this.init()
  },
  methods: {
    // 登出函数
    async logout () {
      const { data: res } = await this.$http.delete('session')
      // console.log(res)
      if (res.status !== 204) this.$message.error(res.msg)
      else this.$message.success('登出成功！')
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 初始化
    init () {
      if (!window.sessionStorage.getItem('username')) this.judgeLoginStatus()
      this.username = window.sessionStorage.getItem('username')
    },
    changeNavName (name) {
      this.username = name
    },
    // 判断登录状态
    async judgeLoginStatus () {
      const { data: res } = await this.$http.get('session')
      // console.log(res)
      if (res.status === 200) {
        window.sessionStorage.setItem('username', res.data.name)
        this.username = window.sessionStorage.getItem('username')
        return this.$router.push('/welcome')
      }
    }
  },
  computed: {
    // 获取路由地址前缀
    getPath () {
      const path = '/' + this.$route.path.split('/')[1]
      // console.log(path)
      return path
    }
  }
}
</script>

<style lang="less" scoped>
  .navmenu_pos {
    padding-left: 20%;
    padding-right: 20%
  }
</style>
