<template>
  <div class="questionlist_container">
    <el-row :gutter="10">
      <el-col :span="5">
        <div class="rand_container">
          <el-card>
            <div slot="header">
              <h3>标签选题</h3>
            </div>
            <!-- 树形控件 -->
            <el-tree
              lazy
              :props="treeProps"
              :load="loadNode"
              :data="tagInfo"
              show-checkbox
              highlight-current
              check-on-click-node
              check-strictly
              @check-change="handleClick"
              node-key="tid"
              ref="treeRef"
            ></el-tree>
            <!-- 滑块选择难度 -->
            <el-slider
              v-model="level"
              show-stops
              :max="5"
              :min="1">
            </el-slider>
            <el-divider></el-divider>
            <el-button type="primary" class="selectBtn" size="small" @click="getRandQuestion">Bingo</el-button>
          </el-card>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="list_container">
          <el-card>
            <div slot="header">
              <h3>判题记录</h3>
            </div>
            <el-table
              :data="judgeLogs"
              style="width: 100%">
              <el-table-column
                prop="id"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column label="问题名称" width="300px">
                <template v-slot="scope">
                  <p v-if="scope.row.title === '非法问题'" style="color: #ff0000;">{{ scope.row.title }}</p>
                  <el-button v-else type="text" @click="goToQuestion(scope.row.qu_id)">{{ scope.row.title }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="标签" width="150px">
                <template v-slot="scope">
                  <el-tag v-if="scope.row.tagName === '非法标签'" size="mini" type="danger">{{ scope.row.tagName }}</el-tag>
                  <el-tag v-else size="mini">{{ scope.row.tagName }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="level"
                label="难度"
                width="50">
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态" width="50px">
              </el-table-column>
              <el-table-column
                prop="lan"
                label="语言"
                width="100">
              </el-table-column>
              <el-table-column label="时间" width="200px">
                <template v-slot="scope">
                  {{ scope.row.time|dateFormate }}
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right">
                <template v-slot="scope">
                  <el-button size="mini" type="success" @click="showJudgeInfoDialog(scope.row.id)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="queryinfo.page_index"
              :page-size="page_size"
              layout="total, prev, pager, next, jumper"
              :total="total"
              style="margin-top: 20px">
            </el-pagination>
            <el-dialog
              title="详细评测信息"
              :visible.sync="judgeInfoDialogVisible"
              width="70%"
              @opened="initCodeEditor">
              <el-table
                :data="judgeTable"
                style="width: 100%">
                <el-table-column prop="id" label="序号" width="50px"></el-table-column>
                <el-table-column prop="qu_title" label="问题名称">
                  <template v-slot="scope">
                    <el-button type="text" @click="goToQuestion(scope.row.qu_id)">{{ scope.row.qu_title }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="lan" label="语言" width="100px"></el-table-column>
                <el-table-column prop="status" label="状态"></el-table-column>
                <el-table-column label="时间">
                  <template v-slot="scope">
                    {{ scope.row.time|dateFormate }}
                  </template>
                </el-table-column>
              </el-table>
              <div ref="judgeCode" class="judge_code_container"></div>
            </el-dialog>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import 'monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution'
import 'monaco-editor/esm/vs/basic-languages/java/java.contribution'
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution'
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js'

export default {
  name: 'QuestionList',
  data () {
    return {
      // 树形控件配置项
      treeProps: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      tagInfo: [],
      level: 3,
      judgeLogs: [
        {
          id: 1,
          title: 'A+B',
          qu_id: 8134,
          status: -5,
          time: 1579518813,
          lan: 'C++'
        }
      ],
      // 评测记录总数
      total: 1,
      page_size: 15,
      // 公告列表页码
      queryinfo: {
        page_index: 1
      },
      judgeInfoDialogVisible: false,
      codeEditor: {},
      judgeInfo: {},
      // 防止重复加载
      codeArea: false,
      judgeTable: []
    }
  },
  created () {
    this.getFirstTag()
    this.getJudgeLogs()
  },
  methods: {
    // 获取第一标签
    async getFirstTag () {
      const { data: res } = await this.$http.get('tag/1')
      if (res.status !== 200) return this.$message.error(res.msg)
      res.data.forEach(item => {
        item.disabled = true
      })
      this.tagInfo = res.data
    },
    // 树形节点懒加载
    async loadNode (node, resolve) {
      if (node.level === 1) {
        const { data: res } = await this.$http.get('tag/2/' + node.key)
        if (res.status !== 200) return this.$message.error(res.msg)
        res.data.forEach(item => {
          item.leaf = true
          return item
        })
        resolve(res.data)
      }
    },
    handleClick (data, checked, node) {
      if (checked) {
        this.$refs.treeRef.setCheckedNodes([data])
      }
    },
    // 获取随机题目内容
    async getRandQuestion () {
      const tagId = this.$refs.treeRef.getCheckedKeys()[0]
      if (!tagId) return this.$message.error('请选择标签！')
      const { data: res } = await this.$http.get('choose/tag/' + tagId + '/' + this.level)
      if (res.status !== 200) return this.$message.error(res.msg)
      this.goToQuestion(res.data)
    },
    // 改变页码
    handleCurrentChange (newPage) {
      this.queryinfo.page_index = newPage
      this.getJudgeLogs()
    },
    // 获取当前页判题记录
    async getJudgeLogs () {
      const { data: res } = await this.$http.get('judge', {
        page_index: this.queryinfo.page_index
      })
      if (res.status !== 200) return this.$message.error(res.msg)
      this.total = res.data.total
      this.pagesize = res.data.page_size
      this.judgeLogs = res.data.list.Judge
      for (var i = 0; i < this.judgeLogs.length; i++) {
        // eslint-disable-next-line no-unused-vars
        let flag = false
        for (var j = 0; j < res.data.list.Qu.length; j++) {
          if (this.judgeLogs[i].qu_id === res.data.list.Qu[j].id) {
            this.judgeLogs[i].title = res.data.list.Qu[j].title == null ? '标题' : res.data.list.Qu[j].title
            this.judgeLogs[i].level = res.data.list.Qu[j].level
            this.judgeLogs[i].tagName = res.data.list.Qu[j].tag[0].name
            flag = true
            break
          }
        }
        if (flag === false) {
          this.judgeLogs[i].title = '非法问题'
          this.judgeLogs[i].tagName = '非法标签'
        }
      }
    },
    // 打开详细评测信息
    async showJudgeInfoDialog (id) {
      const { data: res } = await this.$http.get('judge/' + String(id))
      if (res.status !== 200) return this.$message.error(res.msg)
      this.judgeInfo = res.data
      if (this.judgeInfo.qu_title === null) this.judgeInfo.qu_title = '标题'
      this.judgeTable = []
      this.judgeTable.push(this.judgeInfo)
      this.judgeInfoDialogVisible = true
    },
    initCodeEditor () {
      if (this.codeArea === false) {
        const _this = this
        this.codeEditor = monaco.editor.create(this.$refs.judgeCode, {
          language: _this.judgeInfo.lan,
          value: _this.judgeInfo.coding,
          readOnly: true,
          automaticLayout: true
          // overviewRulerBorder: false
        })
        this.codeArea = true
      } else {
        monaco.editor.setModelLanguage(this.codeEditor.getModel(), this.judgeInfo.lan)
        this.codeEditor.setValue(this.judgeInfo.coding)
      }
    },
    goToQuestion (id) {
      this.$router.push({
        name: 'question',
        params: {
          id: id
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.questionlist_container {
  width: 100%;
  position: relative;
  margin-top: 20px;
}

.rand_container {
  min-width: 263px;
  float: right;
}

.list_container {
  width: 100%;
}

.selectBtn {
  margin-bottom: 15px;
  float: right;
}

.judge_code_container {
  width: 100%;
  height: 400px;
  margin-top: 50px;
}
</style>
