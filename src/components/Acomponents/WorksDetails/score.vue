<template>
  <div class="app-container">
    <!-- 弹出作品框 -->
    <el-dialog title="作品详情" :visible.sync="dialogFormVisible" width="60%" @close="closeDialog">
      <el-tabs>
        <el-tab-pane label="作品基本信息">
          <table class="mailTable" cellspacing="0" cellpadding="0">
            <tr>
              <td class="column"> 作品名称：</td>
              <td>{{ WorksDetails.worksList.worksname }}</td>
            </tr>
            <tr>
              <td class="column"> 团队名字：</td>
              <td>{{ WorksDetails.worksList.teamname }}</td>
            </tr>
            <tr>
              <td class="column"> 团队成员：</td>
              <td>
                <span v-for="(item, index) in WorksDetails.authorList" :key="index" style="margin-right: 20px">
                  {{ item }}
                </span>
              </td>
            </tr>
            <tr>
              <td class="column"> 学校：</td>
              <td>{{ WorksDetails.worksList.school }}</td>
            </tr>
            <tr>
              <td class="column">  作品指导老师：</td>
              <td> {{ WorksDetails.worksList.teacher }}</td>
            </tr>
            <tr>
              <td class="column">  指导老师单位：</td>
              <td> {{ WorksDetails.worksList.unit }}</td>
            </tr>
            <tr>
              <td class="column">  作品简介：</td>
              <td> {{ WorksDetails.worksList.introduce }}</td>
            </tr>
            <tr>
              <td class="column">   直接评分：</td>
              <div class="score">
                <span>请输入得分：</span>
                <input id="score_input" v-model="temp_score">
                <el-button type="primary" @click="submit_score">提交</el-button>
              </div>
            </tr>
          </table>
        </el-tab-pane>
        <el-tab-pane label="作品设计思路">
          <table class="mailTable" cellspacing="0" cellpadding="0">
            <tr>
              <td class="column">  作品设计思路：</td>
              <td> {{ WorksDetails.worksList.design }}</td>
            </tr>
          </table>
        </el-tab-pane>
        <el-tab-pane label="作品图片展示">
          <div class="details-item">
            <a :href="pdf" target="_blank">点击预览作品ppt</a>
          </div><br>
          <div class="details-item">
            作品展示：
          </div>
          <el-image v-for="(url, index) in WorksDetails.imageList" :key="index" style="width: 80%; height: 60%" :src="url" />
        </el-tab-pane>
        <el-tab-pane label="作品演示">
          <div class="details-item">
            视频观赏：
          </div>
          <div class="videoBox">
            <video ref="videoClose" :src="video" controls class="video" />
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="作品评价">
          <div v-if="WorksDetails.scoreList">
            <table class="mailTable" cellspacing="0" cellpadding="0">
              <div v-for="item in WorksDetails.scoreList" :key="item" class="details-item" style="display: inline;">
                <tr style="display: block;">
                  <td class="column td_column1"> <span class="evaluate"> 评委： {{ item.judge }} </span></td>
                  <td class="td_column2"><span class="evaluate">评分： {{ item.score }}</span></td>
                </tr>
              </div>
            </table>
          </div>
          <div class="details-item">
            <h3>平均分：{{ WorksDetails.worksList.score }}</h3>
          </div>
        </el-tab-pane> -->
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { getWorkDetails, getCourseJudgeScore } from '@/api/common'

export default {
  name: 'WorkDetails',
  data() {
    return {
      temp_wid: 0,
      temp_score: 0,
      dialogFormVisible: false,
      WorksDetails: {
        authorList: [],
        worksList: {
          worksname: '',
          introduce: '',
          design: '',
          date: '',
          teacher: '',
          unit: '',
          teamname: '',
          match_project: '',
          match_name: '',
          video: '',
          score: '',
          type: '',
          document: '',
          pdf: ''
        },
        imageList: [],
        scoreList: []
      }
    }
  },
  computed: {
    video: {
      get() {
        // return 'https://sd.bnuz.edu.cn/' + this.WorksDetails.worksList.video
        return this.BASEURL + this.WorksDetails.worksList.video
      }
    },
    pdf: {
      get() {
        // return 'https://sd.bnuz.edu.cn/' + this.WorksDetails.worksList.pdf
        return this.BASEURL + this.WorksDetails.worksList.pdf
      }
    }
  },
  methods: {
    open1() {
      this.$notify({
        title: '成功',
        message: '直接评分成功',
        type: 'success'
      })
    },
    popWorkDetails(wid) {
      this.temp_wid = wid
      getWorkDetails(wid).then(response => {
        this.dialogFormVisible = true
        this.WorksDetails = response.obj
        this.getImg()
      })
    },
    // 直接提交得分
    submit_score() {
      getCourseJudgeScore(this.temp_wid, this.temp_score).then(response => {
        console.log(response)
        this.dialogFormVisible = false
        this.open1()
      })
    },
    closeDialog() {
      this.$refs.videoClose.pause()
    },
    getImg() {
      for (var i = 0; i < this.WorksDetails.imageList.length; i++) {
        this.WorksDetails.imageList[i] = this.BASEURL + this.WorksDetails.imageList[i]
      }
    }
  }
}
</script>
<style scoped>
  .details-item {
    font-size: 18px;
    margin-bottom: 20px;
  }
  .mailTable{
    width: 100%;
    border-top: 1px solid #E6EAEE;
    border-left: 1px solid #E6EAEE;
}
.mailTable tr td{
    width: 200px;
    height: 50px;
    line-height: 25px;
    box-sizing: border-box;
    padding: 0 10px;
    border-bottom: 1px solid #E6EAEE;
    border-right: 1px solid #E6EAEE;
}
.mailTable tr td.column {
    background-color: #EFF3F6;
    color: #393C3E;
    width: 15%;
}
.videoBox {
    display: block;
    margin: 0 auto;
    width: 80%;
}
.td_column1{
  width: 260px !important;
}
.td_column2{
  width: 1800px !important;
}
.videoBox video {
    display: block;
    margin: 0 auto;
    object-fit: fill;
    max-width: 100%;
    min-height: 400px;
    max-height: 600px;
}
.evaluate{
  font-size: 14px;
  display: inline-block;
  margin-top: 15px;
}
#score_input {
  display: inline;
  width: 50px;
  border : none;
  border-bottom: 1px solid #000;
  outline:medium;
}
.score{
  float: right;
  margin-top: 2%;
  padding: 1%;
}
</style>
