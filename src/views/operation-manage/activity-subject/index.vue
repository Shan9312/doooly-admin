<template>
  <div class="app-container subject-list">
    <el-button type="primary" class="modal-save-btn" @click="createPage(1)">新建专题</el-button>
    <el-table stripe :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="专题编号" width="180">
      </el-table-column>
      <el-table-column prop="name" label="专题标题" width="180">
      </el-table-column>
      <el-table-column prop="status" label="上架状态" width="80">
      </el-table-column>
      <el-table-column prop="status" label="网址">
      </el-table-column>
      <el-table-column prop="status" label="更新时间">
      </el-table-column>
      <el-table-column prop="status" label="操作" width="300px">
        <el-button type="primary" @click="createPage()">编辑/查看</el-button>
        <el-button type="primary">复制</el-button>
        <el-button type="primary">下架</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ActivitySubject',
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        status: '是'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        status: '是'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        status: '是 '
      }, {
        date: '2016-05-03',
        name: '王小虎',
        status: '是'
      }]
    }
  },
  methods: {
    createPage(id) {
      this.$router.push(`/operationManage/edit/${id}`)
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
