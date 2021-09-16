<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <div class="createPost-main-container">
        <el-row>

          <el-col :span="24">

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="80px" label="发布人:" class="postInfo-container-item" prop="author">
                    <el-input v-model="postForm.author" />
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label-width="120px" label="发布时间:" class="postInfo-container-item" prop="time">
                    <el-date-picker v-model="postForm.time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期与时间" />
                  </el-form-item>
                </el-col>

              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="70px" label="简介:" prop="content_short">
          <el-input v-model="postForm.content_short" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入描述" />
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>

      </div>
    </el-form>
    <div class="filter-container">
      <!-- 功能框分为三部分 -->
      <div class="flex-box">
        <el-button style="visibility: hidden" class="filter-item" type="primary" icon="el-icon-edit">
          添加
        </el-button>
        <div>
          <!-- <el-button type="primary" @click="showAbout">
            查看
          </el-button> -->
          <el-button v-if="operability" type="primary" @click="Commit">
            提交
          </el-button>
        </div>
        <el-button style="visibility: hidden" class="filter-item" type="info" icon="el-icon-download">
          导出Excel
        </el-button>
      </div>
    </div>

    <el-dialog
      title="关于我们"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <div>
        <el-table :data="AboutList">
          <el-table-column label="ID" width="55px" align="center" type="index" />
          <el-table-column label="内容" min-width="180px" align="center" prop="content">
            <template slot-scope="{row}">
              <span>{{ row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="90px" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDel(row,$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tinymce from '@/components/Tinymce'
// import { validURL } from '@/utils/validate'
import { getAboutList, addAboutUs, deleteAbout } from '@/api/Article/about'
import { parseTime } from '@/utils'

export default {
  name: 'About',
  components: { Tinymce },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      AboutList: {},
      postForm: {
        content: '',
        time: '',
        content_short: '',
        author: ''
      },
      loading: false,
      rules: {
        time: [{ required: true, message: '此项不能为空哦！', trigger: 'blur' }],
        content: [{ required: true, message: '此项不能为空哦！', trigger: 'blur' }],
        author: [{ required: true, message: '此项不能为空哦！', trigger: 'blur' }],
        content_short: [{ required: true, message: '此项不能为空哦！', trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    ...mapGetters([
      'operability'
    ]),
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  },
  created() {
    this.getAbout()
  },
  methods: {
    getAbout() {
      getAboutList().then(response => {
        this.AboutList = response
        this.postForm = response.obj[0]
      })
    },
    showAbout() {
      this.dialogVisible = true
      // this.getAbout()
    },
    reset() {
      this.postForm = {
        content: '',
        time: '',
        content_short: '',
        author: ''
      }
    },
    Commit() {
      this.$refs['postForm'].validate((valid) => {
        if (valid) {
          this.postForm.time = parseTime(this.postForm.time, '{y}-{m}-{d} {h}:{i}')
          const tempData = Object.assign({}, this.postForm)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          console.log(tempData)
          addAboutUs(tempData).then(() => {
            this.$notify({
              title: '成功',
              message: '增加成功',
              type: 'success',
              duration: 2000
            })
          })
          this.reset()
          this.$nextTick(() => {
            this.$refs['postForm'].clearValidate()
          })
          this.$nextTick(() => {
            this.$refs.editor.setContent('')
          })
        }
      })
      // const tempData = Object.assign({}, this.postForm)
    },
    handleDel(row, index) {
      deleteAbout(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '成功删除',
          type: 'success',
          duration: 2000
        })
      })
      this.AboutList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}

.flex-box {
  display: flex;
  justify-content: space-between;
}
</style>
