<template>
  <div class="mysettings_container">
    <div class="avatar_box">
      <vue-hover-mask class="hover_mask" @click="showCropperDialog">
        <img :src="avatarUrl" height="640" width="640"/>
        <template v-slot:action>
          <i class="el-icon-camera">更改头像</i>
        </template>
      </vue-hover-mask>
    </div>
    <el-tabs tab-position='bottom'   type="border-card">
      <el-tab-pane label="个人信息">
        <div class="pane_box">
          <h1 style="margin-left: 10%;">个人信息设置</h1>
          <el-form label-position="top"
           :model="info"
           status-icon
           :rules="infoFormRules"
           ref="infoForm"
           label-width="100px"
           class="form_margin"
           size="mini">
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="昵称" prop="name">
                  <el-input v-model="info.name" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="info.phone" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="真实姓名">
                  <el-input v-model="info.true_name" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="博客">
                  <el-input v-model="info.blog_url" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="个性签名" prop="signature">
              <el-input type="textarea" v-model="info.signature"></el-input>
            </el-form-item>
            <el-form-item style="margin-top: 6%;">
              <el-button type="primary" @click="changeInfo">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="密码设置">
        <div class="pane_box">
          <h1 style="margin-left: 10%;">密码设置</h1>
          <el-form label-position="top"
           :model="passwordForm"
           status-icon
           :rules="passwordRules"
           ref="passwordForm"
           label-width="100px"
           class="form_margin"
           size="mini">
            <el-form-item label="请输入原密码" prop="o_pwd">
              <el-input type="password" v-model="passwordForm.o_pwd" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="请输入新密码" prop="n_pwd">
              <el-input type="password" v-model="passwordForm.n_pwd" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="再次输入密码" prop="c_pwd">
              <el-input type="password" v-model="passwordForm.c_pwd"></el-input>
            </el-form-item>
            <el-form-item style="margin-top: 8%;">
              <el-button type="primary" @click="changePassword">提交</el-button>
              <el-button @click="resetForm('passwordForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 上传头像对话框 -->
    <el-dialog
      title="上传头像"
      :visible.sync="cropperDialogVisible"
      width="510px">
      <div class="cropper-component">
        <div class="info-item">
          <div class="btn-box">
            <label class="btn" for="uploads">选择图片</label>
            <input type="file" id="uploads" :value="imgFile"
                   style="position:absolute; clip:rect(0 0 0 0);width: 1px;"
                   accept="image/png, image/jpeg, image/gif, image/jpg"
                   @change="uploadImg($event, 1)">

            <input type="button" class="operation-btn" value="+" title="放大" @click="changeScale(1)">
            <input type="button" class="operation-btn" value="-" title="缩小" @click="changeScale(-1)">
            <input type="button" class="operation-btn" value="↺" title="左旋转" @click="rotateLeft">
            <input type="button" class="operation-btn" value="↻" title="右旋转" @click="rotateRight">
            <input type="button" class="operation-btn" value="↓" title="下载" @click="down('blob')">
            <div class="btn" @click="finish('blob')">上传头像</div>
          </div>
          <div class="operation-box">
            <el-row>
              <el-col :span="16">
                <div class="cropper">
                  <vueCropper
                    ref="cropper"
                    :img="option.img"
                    :outputSize="option.size"
                    :outputType="option.outputType"
                    :info="option.info"
                    :full="option.full"
                    :canMove="option.canMove"
                    :canMoveBox="option.canMoveBox"
                    :original="option.original"
                    :autoCrop="option.autoCrop"
                    :autoCropWidth="option.autoCropWidth"
                    :autoCropHeight="option.autoCropHeight"
                    :fixedBox="option.fixedBox"
                    @realTime="realTime"
                    @imgLoad="imgLoad"
                  ></vueCropper>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="preview-box">
                  <div>预览：</div>
                  <div :style="previews.div" class="preview">
                    <img :src="previews.url" :style="previews.img">
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value) || value === '') return cb() // 合法的手机号
      return cb(new Error('请输入合法的手机号'))
    }
    var checkRePassword = (rule, value, cb) => {
      if (value !== this.passwordForm.n_pwd) return cb(new Error('两次密码不同！'))
      return cb()
    }
    return {
      passwordForm: {
        o_pwd: '',
        n_pwd: '',
        c_pwd: ''
      },
      info: {
        uid: 0,
        sid: -1,
        name: '用户名',
        reg_time: 1578473291,
        try_num: 0,
        pass_num: 0,
        rank: 0,
        score: 0,
        blog_url: '',
        signature: '。',
        true_name: '请联系老师进行更改',
        phone: '',
        class_name: '暂未加入班级'
      },
      passwordRules: {
        o_pwd: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度为6到18位', trigger: 'blur' }
        ],
        n_pwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度为6到18位', trigger: 'blur' }
        ],
        c_pwd: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: checkRePassword, trigger: 'blur' }
        ]
      },
      // 信息表单规则
      infoFormRules: {
        name: [
          { required: true, message: '昵称不能为空', trigger: 'blur' }
        ],
        phone: [
          { validator: checkMobile, trigger: 'blur' }
        ],
        signature: [
          { max: 30, message: '个性签名最长30个字符', trigger: 'blur' }
        ]
      },
      // 头像链接
      avatarUrl: '',
      updateUrl: 'http://oj.shinenet.cn/api/avatar',
      // 剪切图片上传
      crap: false,
      previews: {},
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 剪切后的图片质量（0.1-1）
        full: true, // 输出原图比例截图 props名full
        outputType: 'png', // 裁剪生成额图片的格式
        canMove: true, // 能否拖动图片
        original: false, // 上传图片是否显示原始宽高
        canMoveBox: true, // 能否拖动截图框
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 150,
        autoCropHeight: 150,
        fixedBox: false // 截图框固定大小
      },
      fileName: '', // 本机文件地址
      downImg: '#',
      imgFile: '',
      uploadImgRelaPath: '', // 上传后的图片的地址（不带服务器域名）,
      // 上传图片对话框的显示
      cropperDialogVisible: false
    }
  },
  async created () {
    this.getInfo()
  },
  methods: {
    // 获取用户信息
    async getInfo () {
      const { data: res } = await this.$http.get('user')
      if (res.status !== 200) return this.message.error(res.msg)
      // console.log(res)
      this.info = res.data
      this.avatarUrl = 'http://oj.shinenet.cn/Avatar/' + res.data.uid + '.png' + '?t=' + (+new Date())
    },
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 更改信息
    changeInfo () {
      this.$refs.infoForm.validate(async (valid) => {
        if (valid) {
          const postData = {
            name: this.info.name,
            blog_url: this.info.blog_url,
            signature: this.info.signature,
            phone: this.info.phone
          }
          const { data: res } = await this.$http.put('user', postData)
          if (res.status !== 200) return this.$message.error(res.msg)
          window.sessionStorage.setItem('username', res.data.name)
          this.$message.success('更改信息成功')
          this.$emit('changeNav', res.data.name)
          this.$router.push('/info')
        }
      })
    },
    // 更改密码
    changePassword () {
      this.$refs.passwordForm.validate(async (valid) => {
        if (valid) {
          const pwdData = {
            o_pwd: this.passwordForm.o_pwd,
            n_pwd: this.passwordForm.n_pwd
          }
          const { data: res } = await this.$http.post('pwd', pwdData)
          console.log(res)
          if (res.status !== 204) return this.$message.error(res.msg)
          window.sessionStorage.clear()
          this.$message.success('密码更改成功！')
          this.$router.push('/login')
        }
      })
    },
    // 图片上传检查
    beforeAvatarUpload (file) {
      const isPic = (file.type === 'image/jpeg' || file.type === 'image/png')
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isPic) {
        this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isPic && isLt2M
    },
    // 图片上传成功回调函数
    handleAvatarSuccess (res) {
      if (res.status === 204) {
        this.$message.success('更新头像成功！')
        this.$router.push('/info')
      }
    },
    // 放大/缩小
    changeScale (num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    // 坐旋转
    rotateLeft () {
      this.$refs.cropper.rotateLeft()
    },
    // 右旋转
    rotateRight () {
      this.$refs.cropper.rotateRight()
    },
    // 上传图片（点击上传按钮）
    finish (type) {
      console.log('finish')
      const formData = new FormData()
      // 输出
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob(async (data) => {
          const img = window.URL.createObjectURL(data)
          this.model = true
          this.modelSrc = img
          formData.append('file', data, this.fileName)
          const { data: res } = await this.$http.post('avatar', formData)
          if (res.status !== 204) return this.$message.error(res.msg)
          this.$message.success('更换头像成功！')
          this.cropperDialogVisible = false
          this.$router.go(0)
        })
      } else {
        this.$refs.cropper.getCropData((data) => {
          this.model = true
          this.modelSrc = data
        })
      }
    },
    // 实时预览函数
    realTime (data) {
      console.log('realTime')
      this.previews = data
    },
    // 下载图片
    down (type) {
      console.log('down')
      var aLink = document.createElement('a')
      aLink.download = 'author-img'
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob((data) => {
          this.downImg = window.URL.createObjectURL(data)
          aLink.href = window.URL.createObjectURL(data)
          aLink.click()
        })
      } else {
        this.$refs.cropper.getCropData((data) => {
          this.downImg = data
          aLink.href = data
          aLink.click()
        })
      }
    },
    // 选择本地图片
    uploadImg (e, num) {
      console.log('uploadImg')
      var _this = this
      // 上传图片
      var file = e.target.files[0]
      _this.fileName = file.name
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
        return false
      }
      var reader = new FileReader()
      reader.onload = (e) => {
        let data
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        if (num === 1) {
          _this.option.img = data
        } else if (num === 2) {
          _this.example2.img = data
        }
      }
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file)
    },
    imgLoad (msg) {
      console.log('imgLoad')
      console.log(msg)
    },
    showCropperDialog () {
      this.cropperDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
  .mysettings_container {
    margin-left: 20%;
    width: 60%;
    height: auto;
    //background-color: #ffffff;
  }
  .avatar_box{
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #BEBEBE;
    position: relative;
    left: 50%;
    transform: translate(-50%, 50%);
    background-color: #fff;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .pane_box {
    height: auto;
    margin-top: 70px;
  }
  .hover_mask {
    height: 100%; width: 100%;
    border-radius: 50%;
  }
  .form_margin {
    width: 80%;
    margin-left: 10%;
  }
  .cropper-component {
    width: 500px;
    margin: 0 auto;
    position: relative;
    .btn-box {
      margin: 20px 0;
      .btn {
        padding: 4px 12px;
        text-align: center;
        border-radius: 4px;
        background-color: #387EF6;
        color: #fff;
        cursor: pointer;
        display: inline-block;
      }
      .operation-btn {
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background-color: #fff;
        border: 1px solid #eaeaea;
        cursor: pointer;
        display: inline-block;
        font-size: 20px;
        color: #333;
        padding: 0;
        margin: 0 10px;
      }
    }
    .info-item {
      .operation-box {
        display: inline-block;
        .cropper {
          width: 260px;
          height: 260px;
        }
      }
      .preview-box {
        top: 60px;
        right: 10px;
        .preview {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 1px solid #ccc;
          background-color: #ccc;
          margin: 5px;
          overflow: hidden;
        }
      }
    }
  }
</style>
