<template>
  <div class="app-container subject-list">
    <el-button type="primary" @click="handleEdit(null)">新建专题</el-button>
    <el-table stripe :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="专题编号" width="180">
      </el-table-column>
      <el-table-column prop="title" label="专题标题" width="180">
      </el-table-column>
      <el-table-column prop="shelfStatus" label="上架状态" width="80">
        <template slot-scope="scope">
          <span v-if='scope.row.shelfStatus ===  1'>上架</span>
          <span v-if='scope.row.shelfStatus ===  2'>下架</span>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="网址">
      </el-table-column>
      <el-table-column prop="updateDate" label="更新时间" width="200">
      </el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑/查看</el-button>
          <el-button size="mini" @click="handleCopy(scope.row.id)">复制</el-button>
          <el-button size="mini" type="success" v-if="scope.row.shelfStatus === 2" @click="handleShelf(scope.row)">上架</el-button>
          <el-button size="mini" type="danger" v-if="scope.row.shelfStatus === 1" @click="handleShelf(scope.row)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="上架编辑页" :visible.sync="dialogModalVisible">
      <el-form label-width='85px' :model="specialTopicInfo" :rules="putOnRules" ref="putOnRef">
        <el-form-item label="状态" prop="status">
          <el-radio v-model="specialTopicInfo.status" label=1>限时下架</el-radio>
          <el-radio v-model="specialTopicInfo.status" label=2>永久</el-radio>
        </el-form-item>
        <el-form-item v-show="specialTopicInfo.status === '1'" label="时间" prop="endDate">
          <el-date-picker v-model="specialTopicInfo.endDate" type="datetime" :editable='false' value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogModalVisible = false">取 消</el-button>
        <el-button type="primary" @click="putOnShelf">确 定</el-button>
      </span>

    </el-dialog>
    <pagination v-show="total > search.pageSize" :total="total" :page.sync="search.pageNum" :limit.sync="search.pageSize" @pagination="getSubjectList" />
  </div>
</template>

<script>
import { SubjectService } from '@/service'
export default {
  name: 'ActivitySubject',
  data() {
    let validateEndDate = (rule, value, callback) => {
      if (this.specialTopicInfo.status == 1 && !value) {
        callback(new Error('请选择时间'));
      } else {
        callback();
      }
    }
    return {
      tableData: [],
      total: 0,
      search: {
        pageNum: 1,
        pageSize: 10
      },
      dialogModalVisible: false,
      specialTopicInfo: {
        status: '1', // 下架状态 1.限时 2.永久
        endDate: '', // 下架时间
      },
      currentRowData: {},
      putOnRules: {
        endDate: [
          { required: true, validator: validateEndDate, trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    this.getSubjectList()
  },
  methods: {
    async getSubjectList() {
      const data = await SubjectService.getSubjectList(this.search)
      if (data && data.data && data.data.specialTopicList.length > 0) {
        this.tableData = data.data.specialTopicList
        this.total = data.data.total
      }
    },
    handleEdit(id) {
      this.$router.push(`/operationManage/edit/${id}`)
    },
    async handleCopy(id) {
      const res = await this.$prompt('专题标题', '复制专题', {
        inputPlaceholder: '请输入新的专题标题',
        inputPattern: /^.{1,10}$/,
        inputErrorMessage: '输入的标题长度需在 1 到 10 个字符之间',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      })
      if (res && res.action === 'confirm') {
        const data = await SubjectService.copySubject({ id, title: res.value })
        if (data && data.data) {
          this.$message({
            type: 'success',
            message: '你的专题标题是: ' + res.value
          });
          this.getSubjectList()
        }
      }
    },
    async handleShelf(objectData) {
      if (objectData.shelfStatus == 1) {
        console.log('需要下架')
        this.pullOffShelf(objectData)
      } else if (objectData.shelfStatus == 2) {
        this.resetFields('putOnRef')
        this.dialogModalVisible = true
        this.currentRowData = objectData
      }
    },
    async pullOffShelf(objectData) {
      const { endDate, id, status } = objectData
      let res = await this.$confirm('确认下架专题, 是否继续?', '下架专题页', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消本次操作！'
        });
      });
      let data = await SubjectService.deleteSubject({ endDate, id, status, type: 2 })
      if (res === 'confirm' && data && data.data) {
        this.$message({
          type: 'success',
          message: '下架架成功!'
        });
        this.getSubjectList()
      }
    },
    async putOnShelf() {
      let queryData = {
        endDate: this.specialTopicInfo.endDate,
        status: Number(this.specialTopicInfo.status),
        id: this.currentRowData.id,
        type: 1
      }
      this.$refs['putOnRef'].validate(async (valid) => {
        if (!valid) return
        let data = await SubjectService.deleteSubject(queryData)
        if (data && data.data) {
          this.$message({
            type: 'success',
            message: '上架成功!'
          });
          this.dialogModalVisible = false
          this.getSubjectList()
        }
      })
    },
    resetFields(formName) {
      if (!this.$refs[formName]) return
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang="less" scoped>
.subject-list {
  padding: 30px 110px;
  /deep/ .el-table {
    margin-top: 50px;
    .cell {
      text-align: center;
    }
  }
}
/deep/ .el-dialog {
  width: 40%;
  min-width: 510px;
}
</style>
