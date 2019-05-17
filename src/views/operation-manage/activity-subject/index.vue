<template>
  <div class="app-container subject-list">
    <el-button type="primary" class="modal-save-btn" @click="createPage(1)">新建专题</el-button>
    <el-table stripe :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="专题编号" width="180">
      </el-table-column>
      <el-table-column prop="title" label="专题标题" width="180">
      </el-table-column>
      <el-table-column prop="status" label="上架状态" width="80">
      </el-table-column>
      <el-table-column prop="url" label="网址" width="200">
      </el-table-column>
      <el-table-column prop="updateDate" label="更新时间" width="180">
      </el-table-column>
      <el-table-column label="操作" width="300px">
        <el-button type="primary" @click="createPage()">编辑/查看</el-button>
        <el-button type="primary">复制</el-button>
        <el-button type="primary">下架</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { SubjectService } from '@/service'
export default {
  name: 'ActivitySubject',
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.getSubjectList()
  },
  methods: {
    createPage(id) {
      this.$router.push(`/operationManage/edit/${id}`)
    },
    async getSubjectList() {
      const { data } = await SubjectService.getSubjectList({ pageNum: 1, pageSize: 10 })
      if (data && data.specialTopicList.length > 0) {
        this.tableData = data.specialTopicList
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
