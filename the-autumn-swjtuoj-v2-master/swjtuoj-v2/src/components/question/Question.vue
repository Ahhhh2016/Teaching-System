<template>
  <div style="width: 100%;">
    <el-row :gutter="15">
      <el-col :span="5">
        <el-card>
          <div style="margin-top:20px; width:100%; height:400px" ref="questionChart"></div>
        </el-card>
      </el-col>
      <el-col :span="14">
        <div class="question_container">
          <el-card>
            <el-tag size="mini" v-for="item in questionInfo.tag" :key="item.id" style="margin-top: 20px">
              {{ item.name }}
            </el-tag>
            <h1>
              {{ questionInfo.title !== null ? questionInfo.title : '标题' }}
            </h1>
          </el-card>
          <el-card>
            <h3>题目描述</h3>
            <div v-html="content_md"></div>
          </el-card>
          <el-card>
            <h4>输入要求</h4>
            {{ questionInfo.in }}
          </el-card>
          <el-card>
            <h4>输出要求</h4>
            {{ questionInfo.out }}
          </el-card>
          <el-row :gutter="20" v-for="(item, index) in questionInfo.example" :key="index">
            <el-col :span="12">
              <el-card>
                <h4>输入样例{{ index }}</h4>
                <div class="example_style">
                  <p>{{ item.in }}</p>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card>
                <h4>输出样例{{ index }}</h4>
                <div class="example_style">
                  <p>{{ item.out }}</p>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-card style="height: 500px; width: 100%">
            <div class="code_title">
              <el-select v-model="languageValue" placeholder="请选择" @change="changeLanguage">
                <el-option
                  v-for="item in languageOptions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-button-group style="margin-left: 20px;">
                <el-button type="success" @click="saveCode">保存代码到云端<i class="el-icon-upload2 el-icon--right"></i></el-button>
                <el-button type="success" @click="getCode(false)">从云端下载代码<i class="el-icon-download el-icon--right"></i></el-button>
              </el-button-group>
              <el-button round type="primary" style="float: right">提交代码</el-button>
            </div>
            <div ref="code_div" class="code_container"></div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import  * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import 'monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution'
import 'monaco-editor/esm/vs/basic-languages/java/java.contribution'
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution'
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js'

import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

const Base64 = require('js-base64').Base64
const marked = require('marked')
export default {
  name: 'Question',
  data () {
    return {
      id: 0,
      questionInfo: {},
      // markdown生成
      content_md: '',
      // echarts配置信息
      option: {
        baseOption: {
          title: {
            text: '题目提交情况',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          color: ['#80FF80', '#F75000', '#E1E100', '#81C0C0', '#E67D22', '#7E3D76', '#2894FF'],
          legend: {
            data: ['Accept', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Presentation ERROR', 'Runtime ERROR', 'Compile ERROR']
          },
          calculable: true,
          series: [
            {
              name: '面积模式',
              type: 'pie',
              data: []
            }
          ]
        },
        media: [
          {
            option: {
              legend: {
                right: 'center',
                bottom: 0,
                orient: 'horizontal'
              },
              series: [
                {
                  radius: [20, '50%'],
                  center: ['50%', '50%']
                }
              ]
            }
          },
          {
            query: {
              minAspectRatio: 1
            },
            option: {
              legend: {
                right: 'center',
                bottom: 0,
                orient: 'horizontal'
              },
              series: [
                {
                  radius: [20, '50%'],
                  center: ['50%', '30%']
                }
              ]
            }
          },
          {
            query: {
              maxAspectRatio: 1
            },
            option: {
              legend: {
                right: 'center',
                bottom: 0,
                orient: 'horizontal'
              },
              series: [
                {
                  radius: [20, '50%'],
                  center: ['50%', '30%']
                }
              ]
            }
          },
          {
            query: {
              maxWidth: 500
            },
            option: {
              legend: {
                right: 10,
                bottom: 0,
                orient: 'horizontal'
              },
              series: [
                {
                  radius: [20, '50%'],
                  center: ['50%', '40%']
                }
              ]
            }
          }
        ]
      },
      languageOptions: [],
      languageValue: 'cpp',
      codeEditor: ''
    }
  },
  created () {
    this.id = this.$route.params.id
  },
  mounted () {
    this.getQuestionInfo()
  },
  methods: {
    // 获取题目信息
    async getQuestionInfo () {
      const { data: res } = await this.$http.get('qu/' + String(this.id))
      if (res.status !== 200) return this.$message.error(res.msg)
      this.questionInfo = res.data
      this.languageOptions = res.data.languageOptions
      this.option.baseOption.series[0].data = res.data.num
      for (var i = 0; i < this.option.baseOption.series[0].data.length; ++i) {
        if (this.option.baseOption.series[0].data[i].value === null) {
          this.option.baseOption.series[0].data[i].value = 0
        }
      }
      this.content_md = marked(this.questionInfo.content)
      this.initEcharts()
      this.initMonacoEditor()
    },
    // 初始化Echarts
    initEcharts () {
      var myChart = echarts.init(this.$refs.questionChart)
      myChart.setOption(this.option)
      // 根绝窗口大小调整图表大小
      setTimeout(function () {
        window.onresize = function () {
          myChart.resize()
        }
      }, 200)
    },
    // 初始化代码编辑器
    initMonacoEditor () {
      const _this = this
      this.codeEditor = monaco.editor.create(this.$refs.code_div, {
        language: _this.languageValue,
        automaticLayout: true
      })
      this.getCode(true)
    },
    // 更改代码编辑器语言
    changeLanguage () {
      monaco.editor.setModelLanguage(this.codeEditor.getModel(), this.languageValue)
    },
    async saveCode () {
      const { data: res } = await this.$http.post('save/' + String(this.id), {
        code: Base64.encode(this.codeEditor.getValue())
      })
      if (res.status !== 204) return this.$message.error(res.msg)
      this.$message.success('保存成功！')
    },
    async getCode (flag) {
      if (flag === false) {
        // 弹窗询问用户是否获取云端代码
        const confirmResult = await this.$confirm('此操作将覆盖当前代码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') return
      }
      const { data: res } = await this.$http.get('save/' + String(this.id))
      if (res.status !== 200) return this.$message.error(res.msg)
      this.codeEditor.setValue(res.data)
    }
  }
}
</script>

<style lang="less" scoped>
.question_container {
  .el-card {
    margin-bottom: 10px;
  }
}

.example_style {
  margin: 5px;
  border-radius: 4px;
  border: 0.5px solid gainsboro;
  padding-left: 5px;

  .p {
    color: goldenrod;
  }
}

.code_container {
  margin-top: 10px;
  width: 100%;
  height: 400px;
  border: solid black 1px;
}

.code_title {
  margin-top: 20px;
  display: inline-block;
  width: 100%;
}
</style>
