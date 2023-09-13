<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像取悦 -->
      <p>西南交通大学编程平台</p>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="sid">
          <el-input v-model="loginForm.sid" prefix-icon="el-icon-s-custom"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="passwd">
          <el-input v-model="loginForm.passwd" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <div ref="captchaRef"></div>
        </el-form-item>

        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        sid: '2018112675',
        passwd: '123456'
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        sid: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        passwd: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 验证码设置
      captchaConf: {}
    }
  },
  created () {
    this.judgeLoginStatus()
    this.getCsrfToken()
  },
  mounted () {
    this.getCaptchaConf()
  },
  methods: {
    // 获取csrftoken
    async getCsrfToken () {
      const { data: res } = await this.$http.get('config/csrf')
      // console.log(res)
      if (res.status !== 200) return this.$message.error('获取CsrfToken错误!')
      window.sessionStorage.setItem('token', res.data.token)
    },
    // 获取验证码配置
    async getCaptchaConf () {
      const { data: res } = await this.$http.get('config/captcha')
      if (res.status !== 200) return this.$message.error(res.msg)
      this.captchaConf = res.data
      if (res.data.kind === 'DX') this.initDxCaptcha()
      else if (res.data.kind === 'geetest') this.initGeetestCaptcha()
      // console.log(this.captchaConf)
    },
    // 点击重置按钮重置登录表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 初始化顶象验证按
    initDxCaptcha () {
      // console.log(this.captchaConf)
      window._dx.Captcha(this.$refs.captchaRef, {
        appId: this.captchaConf.AppID,
        style: 'inline',
        success: token => {
          this.loginForm.token = token
        }
      })
    },
    // 初始化geetest验证码
    initGeetestCaptcha () {
      // console.log(this.captchaConf)
      const _this = this
      window.initGeetest({
        product: 'float',
        gt: _this.captchaConf.gt,
        challenge: _this.captchaConf.challenge,
        offline: !_this.captchaConf.success,
        new_captcha: _this.captchaConf.new_captcha
      }, function (captchaObj) {
        captchaObj.appendTo(_this.$refs.captchaRef)
        captchaObj.onSuccess(function () {
          _this.loginForm.geetest_challenge = captchaObj.getValidate().geetest_challenge
          _this.loginForm.geetest_validate = captchaObj.getValidate().geetest_validate
          _this.loginForm.geetest_seccode = captchaObj.getValidate().geetest_seccode
        })
      })
    },
    login () {
      // console.log('token', window.sessionStorage.getItem('token'))
      // if (!window.sessionStorage.getItem('token')) this.getCsrfToken()
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        // console.log(this.loginForm)
        const { data: res } = await this.$http.post('session', this.loginForm)
        console.log('res', res)
        if (res.status !== 200) return this.$message.error(res.msg)
        window.sessionStorage.setItem('username', res.data.name)
        this.$message.success('登陆成功')
        this.$router.push('/welcome')
      })
    },
    // 判断登录状态，如果登陆成功跳转到首页
    async judgeLoginStatus () {
      const { data: res } = await this.$http.get('session')
      console.log(res)
      if (res.status === 200) {
        window.sessionStorage.setItem('username', res.data.name)
        return this.$router.push('/welcome')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container {
    height: 100%;
    background-image: url("../assets/images/xnjd-tsg.jpg");
    //background-repeat: no-repeat;
    background-size: cover;
  }

  .login_box {
    width: 450px;
    height: 350px;
    background-color: #fff;
    border-right: 3px;
    position: absolute;
    left: 70%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    p {
      margin-top: 40px;
      font-size: 20px;
      font-weight: bold;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }
</style>
