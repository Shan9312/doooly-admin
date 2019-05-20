<template>
  <div class="app-container subject-list">
    <el-button type="primary" class="modal-save-btn" @click="handleEdit(null)">新建专题</el-button>
    <el-table stripe :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="专题编号" width="180">
      </el-table-column>
      <el-table-column prop="title" label="专题标题" width="180">
      </el-table-column>
      <el-table-column prop="status" label="上架状态" width="80">
      </el-table-column>
      <el-table-column prop="url" label="网址">
      </el-table-column>
      <el-table-column prop="updateDate" label="更新时间" width="200">
      </el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑/查看</el-button>
          <el-button size="mini" @click="handleCopy(scope.row.id)">复制</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > search.pageSize" :total="total" :page.sync="search.pageNum" :limit.sync="search.pageSize" @pagination="getSubjectList" />
  </div>
</template>

<script>
import { SubjectService } from '@/service'
import { async } from 'q';
export default {
  name: 'ActivitySubject',
  data() {
    return {
      tableData: [],
      total: 0,
      search: {
        pageNum: 1,
        pageSize: 10
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
    async handleDelete(objectData) {
      const res = await this.$confirm('确认下架专题, 是否继续?', '下架专题页', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
      const { endDate, id, status } = objectData
      const data = await SubjectService.deleteSubject({ endDate, id, status, type: 2 })
      if (res === 'confirm') {
        if (data) {
          this.$message({
            type: 'success',
            message: '下架成功!'
          });
          this.getSubjectList()
        }
      }
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
</style>
