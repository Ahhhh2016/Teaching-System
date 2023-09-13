<template>
  <div class="noticelist_container">
    <el-card>
      <div slot="header" class="clearfix">
        <h2>公告列表</h2>
      </div>
      <div class="notice_style" v-for="item in noticelist" :key="item.id">
        <h3 @click="showDetail(item.id)">{{item.title}}</h3>
        <p style="display: inline-block;"><i class="el-icon-time"></i> {{item.time|dateFormate}}</p>
        <p class="moreBtn" @click="showDetail(item.id)">MORE+</p>
        <el-divider></el-divider>
      </div>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryinfo.page_index"
        :page-size="page_size"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'NotcieList',
  data () {
    return {
      // 公告列表页码
      queryinfo: {
        page_index: 1
      },
      total: 2,
      // 一页显示多少条公告
      page_size: 15,
      noticelist: [
        {
          id: 1,
          title: '测试标题1',
          time: 1579576809
        },
        {
          id: 2,
          title: '测试标题2',
          time: 1579576841
        }
      ]
    }
  },
  created () {
    this.getNoticeList()
  },
  methods: {
    async getNoticeList () {
      const { data: res } = await this.$http.get('info/ann', {
        params: this.queryinfo
      })
      if (res.status !== 200) return this.$message.error(res.msg)
      this.total = res.data.total
      this.pagesize = res.data.page_size
      this.noticelist = res.data.list
    },
    // 展示详细公告
    showDetail (id) {
      console.log(id)
      this.$router.push({
        name: 'notice',
        params: {
          id: id
        }
      })
    },
    handleCurrentChange (newPage) {
      this.queryinfo.page_index = newPage
      this.getNoticeList()
    }
  }
}
</script>

<style lang="less" scoped>
  .noticelist_container {
    width: 60%;
    margin-left: 20%;
  }
  .notice_style {
    h3 {
      color: #387EF6;
      cursor: pointer;
    }

    p {
      color: #BEBEBE;
    }

    .moreBtn  {
      width: 58px;
      height: 18px;
      line-height: 18px;
      background: #e4e4e3;
      color: #000;
      font-family: "arial, helvetica, sans-serif";
      text-align: center;
      float: right;
      display: inline-block;
      cursor: pointer;
    }
  }
</style>
