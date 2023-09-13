<template>
  <div class="notice_container">
    <el-card>
      <h2>{{noticeInfo.title}}</h2>
      <p class="time_show"><i class="el-icon-time"></i>{{noticeInfo.time|dateFormate}}</p>
      <p style="display: inline-block; float: right; color: #475669; cursor: pointer;" @click="backList">
        返回列表<i class="el-icon-arrow-left"></i>
      </p>
      <el-divider></el-divider>
      <!-- 显示markdown内容 -->
      <div v-html="md"></div>

    </el-card>
  </div>
</template>

<script>
const marked = require('marked')
export default {
  name: 'Notice',
  data () {
    return {
      noticeId: 1,
      noticeInfo: {},
      // markdown内容
      md: ''
    }
  },
  created () {
    this.getNotice()
  },
  methods: {
    async getNotice () {
      this.noticeId = this.$route.params.id
      const { data: res } = await this.$http.get('info/ann/' + String(this.noticeId))
      console.log(res)
      if (res.status !== 200) return this.$message.error(res.msg)
      this.noticeInfo = res.data
      this.md = marked(this.noticeInfo.info)
    },
    backList () {
      this.$router.push('/notice')
    }
  }
}
</script>

<style lang="less" scoped>
  .notice_container {
    width: 60%;
    margin-left: 20%;
    .time_show {
      color: #BEBEBE;
      display: inline-block;
    }
  }
</style>
