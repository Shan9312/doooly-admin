<template>
  <div class="app-container subject-list">
    <el-row>
      <el-col :span="6">
        <el-button type="primary" @click="handleEdit(null)">新增弹窗</el-button>
      </el-col>
      <el-col :span="16">
        <el-form>
          <el-form-item label="上架状态：">
            <el-col :span="9">
              <el-select v-model="search.onShelf" placeholder="请选择查询状态">
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
      <el-table-column v-for='(item,index) in titleList' :key="index" :prop="item.prop" :label="item.label" :min-width="item.width">
        <template slot-scope="scope">
          <div v-if="item.prop == 'onShelf'">
            <span v-if='scope.row.onShelf'>上架</span>
            <span v-if='!scope.row.onShelf'>下架</span>
          </div>
          <div v-else>
            {{scope.row[item.prop]}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑/查看</el-button>
          <el-button size="mini" type="success" v-if="!scope.row.onShelf" @click="handleShelf(scope.row)">上架</el-button>
          <el-button size="mini" type="danger" v-if="scope.row.onShelf" @click="handleShelf(scope.row)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="上架编辑页" :visible.sync="dialogModalVisible">
      <el-form label-width='85px' :model="specialTopicInfo" :rules="putOnRules" ref="putOnRef">
        <el-form-item label="状态" prop="onShelf">
          <el-radio v-model="specialTopicInfo.onShelf" label=1>限时下架</el-radio>
          <el-radio v-model="specialTopicInfo.onShelf" label=2>永久</el-radio>
        </el-form-item>
        <el-form-item v-show="specialTopicInfo.onShelf" label="时间" prop="endDate">
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
import dialoglist from './dialogList'
export default dialoglist
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
