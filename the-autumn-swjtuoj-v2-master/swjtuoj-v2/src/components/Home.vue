<template>
  <div class="home_container">
    <el-row :gutter="20">
      <!-- 走马灯 -->
      <el-col :span="16">
        <el-carousel trigger="click" :height="bannerHeight + 'px'">
          <el-carousel-item v-for="item in carousel_card" :key="item.notice_id">
            <el-row>
              <el-col>
                  <img ref="bannerImgRef" :src="item.img_url" @load="imgLoad">
              </el-col>
            </el-row>
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <!-- 公告栏 -->
    </el-row>
    <el-card class="notice-card">
      <div slot="header">
        <span style="font-weight: bold">公告</span>
      </div>
      <el-table
        :data="noticelist"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}">
        <el-table-column label="标题">
          <template v-slot="scope">
            <el-link @click="showNotice(scope.row.id)">{{scope.row.title}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="time" width="200px">
          <template v-slot="scope">
            {{scope.row.time|dateFormate}}
          </template>
        </el-table-column>
      </el-table>
      <p class="moreBtn" @click="showNoticeList">MORE+</p>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      carousel_card: [
        {
          img_url: require('../assets/images/banner1.png'),
          notice_id: 1
        },
        {
          img_url: require('../assets/images/banner2.png'),
          notice_id: 2
        },
        {
          img_url: require('../assets/images/banner3.png'),
          notice_id: 3
        }
      ],
      // 走马灯高度
      bannerHeight: '300',
      noticelist: []
    }
  },
  created () {
    this.getNoticeList()
  },
  mounted () {
    this.imgLoad()
    window.addEventListener('resize', () => {
      this.bannerHeight = this.$refs.bannerImgRef[0].height
      this.imgLoad()
    })
  },
  methods: {
    imgLoad () {
      this.$nextTick(() => {
        this.bannerHeight = this.$refs.bannerImgRef[0].height
        // console.log(this.$refs.bannerImgRef[0].height)
      })
    },
    // 跳转到指定公告
    showNotice (id) {
      console.log(id)
      this.$router.push({
        name: 'notice',
        params: {
          id: id
        }
      })
    },
    // 获取公告列表
    async getNoticeList () {
      const { data: res } = await this.$http.get('info/ann', {
        params: this.queryinfo
      })
      if (res.status !== 200) return this.$message.error(res.msg)
      this.noticelist = res.data.list.slice(0, 5)
      console.log(this.noticelist)
    },
    // 跳转到公告列表
    showNoticeList () {
      this.$router.push('/notice')
    }
  }
}
</script>

<style lang="less" scoped>
  .home_container {
    padding-right: 20%;
    padding-left: 20%;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit:cover;
  }

  .moreBtn  {
    //width: 58px;
    //height: 18px;
    line-height: 18px;
    background: #e4e4e3;
    color: #000;
    font-family: "arial, helvetica, sans-serif";
    text-align: center;
    float: right;
    cursor: pointer;
    float: right;
  }
</style>
