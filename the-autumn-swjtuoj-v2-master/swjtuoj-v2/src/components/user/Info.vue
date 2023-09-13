<template>
  <div class="myinfo_container">
    <div class="avatar_box">
      <img :src="avatarUrl" height="640" width="640"/>
    </div>
    <div class="info_box">
      <h2 style="display: inline-block;">{{info.name}}</h2>
      <p style="display: inline-block;" v-if="info.signature">@{{info.signature}}</p>
      <p>
        <span style="font-weight: bold">班级</span>
        ：{{info.class_name}}
        <span style="font-weight: bold">姓名
        </span>：{{info.true_name}}
        <span style="font-weight: bold">学号</span>：{{info.sid}}
      </p>
      <div style="border: black solid 0.5px; width: 100%; position: relative;"></div>
      <div style="display: flex; flex-direction: row; justify-content: space-around; height: 100px; margin-top: 40px; margin-bottom: 40px">
        <div>
          <h4>已解决数量</h4>
          <p>{{info.pass_num}}</p>
        </div>
        <div class="gray_line_style"></div>
        <div>
          <h4>提交次数</h4>
          <p>{{info.try_num}}</p>
        </div>
        <div class="gray_line_style"></div>
        <div>
          <h4>rank</h4>
          <p>{{info.rank}}</p>
        </div>
      </div>
      <div style="border: black solid 0.5px; width: 100%; position: relative;"></div>
      <h3>总积分：{{info.score}}</h3>
      <p style="margin-top: 30px;" v-if="info.phone">联系方式：{{info.phone}}</p>
      <p>注册时间：{{info.reg_time|dateFormate}}</p>
<!--      <p>最后登录时间：{{info.last_login_time}}</p>-->
      <i class="el-icon-s-promotion" style="margin-top: 20px" @click="linkBlog"></i>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      info: {
        uid: 0,
        sid: -1,
        name: '用户名',
        reg_time: 1578473291,
        try_num: 0,
        pass_num: 0,
        rank: 0,
        score: 0,
        blog_url: 'https://www.shinenet.cn',
        signature: '此人什么都没留下。',
        true_name: '请联系老师进行更改',
        phone: '暂无',
        class_name: '暂未加入班级'
      },
      avatarUrl: ''
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    linkBlog () {
      window.open(this.info.blog_url, '_blank')
    },
    async getInfo () {
      const { data: res } = await this.$http.get('user')
      if (res.status !== 200) return this.message.error(res.msg)
      // console.log(res)
      this.info = res.data
      this.avatarUrl = 'http://oj.shinenet.cn/Avatar/' + res.data.uid + '.png' + '?t=' + (+new Date())
    }
  }
}
</script>

<style lang="less" scoped>
.myinfo_container {
  margin-left: 20%;
  margin-top: 7%;
  width: 60%;
  //height: auto;
  background-color: #ffffff;
  border-radius: 3px;
  box-shadow: 0 0 10px #ddd;
}
.avatar_box{
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: relative;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.info_box {
  position: relative;
  //height: auto;
  left: 10%;
  width: 80%;
  //top: 80px;
  text-align: center;
  bottom: 50px;
  //background-color: #ffffff;
}
.gray_line_style {
  border: #BEBEBE solid 0.5px;
  height: 100px;
}
</style>
