<template>
  <div class="app-container subject-list">
    <el-row>
      <el-col :span="6">
        <el-button type="primary" @click="handleEdit(null)">新建专题</el-button>
      </el-col>
      <el-col :span="16">
        <el-form>
          <el-form-item label="上架状态：">
            <el-col :span="9">
              <el-select v-model="search.shelfStatus" placeholder="请选择查询状态">
                <el-option v-for="(item,index) in shelfOptions" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-col>

    </el-row>
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
import subject from './subject'
export default subject
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
