<template>
  <div class="app-container subject-list">
    <el-form>
      <el-row>
        <el-col :span="12">
          <el-form-item label="专题标题">
            <el-input
              style="width: 300px"
              v-model="search.title"
              placeholder="请输入专题标题"
              maxlength="10"
              @keyup.native="onKeyup"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上架状态：">
            <el-select
              v-model="search.shelfStatus"
              placeholder="请选择查询状态"
            >
              <el-option
                v-for="(item, index) in shelfOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="更新时间">
            <el-date-picker
              :editable="false"
              v-model="updateDate"
              type="daterange"
              :default-time="['00:00:00', '23:59:59']"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <pe-button
            label="查询"
            perms="operation:ActivitySubject:search"
            type="primary"
            @click="handleSearch"
          />
        </el-col>
      </el-row>
    </el-form>
    <pe-button
      label="新建专题"
      perms="operation:ActivitySubject:add"
      type="primary"
      @click="handleEdit(null)"
    />
    <el-table stripe :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="专题编号" width="180">
      </el-table-column>
      <el-table-column prop="title" label="专题标题" width="180">
      </el-table-column>
      <el-table-column prop="shelfStatus" label="上架状态" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.shelfStatus === 1">上架</span>
          <span v-if="scope.row.shelfStatus === 2">下架</span>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="网址"> </el-table-column>
      <el-table-column prop="updateDate" label="更新时间" width="200">
      </el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <pe-button
            label="编辑/查看"
            size="mini"
            perms="operation:ActivitySubject:edit"
            @click="handleEdit(scope.row.id)"
          />
          <pe-button
            label="复制"
            size="mini"
            perms="operation:ActivitySubject:copy"
            @click="handleCopy(scope.row.id)"
          />
          <pe-button
            label="上架"
            size="mini"
            type="success"
            v-if="scope.row.shelfStatus === 2"
            perms="operation:ActivitySubject:shelves"
            @click="handleShelf(scope.row)"
          />
          <pe-button
            label="下架"
            size="mini"
            type="danger"
            v-if="scope.row.shelfStatus === 1"
            perms="operation:ActivitySubject:soldOut"
            @click="handleShelf(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="上架编辑页" :visible.sync="dialogModalVisible">
      <el-form
        label-width="85px"
        :model="specialTopicInfo"
        :rules="putOnRules"
        ref="putOnRef"
      >
        <el-form-item label="状态" prop="status">
          <el-radio v-model="specialTopicInfo.status" label="1"
            >限时下架</el-radio
          >
          <el-radio v-model="specialTopicInfo.status" label="2">永久</el-radio>
        </el-form-item>
        <el-form-item
          v-show="specialTopicInfo.status === '1'"
          label="时间"
          prop="endDate"
        >
          <el-date-picker
            v-model="specialTopicInfo.endDate"
            type="datetime"
            :editable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogModalVisible = false">取 消</el-button>
        <el-button type="primary" @click="putOnShelf">确 定</el-button>
      </span>
    </el-dialog>
    <pagination
      v-show="total > search.pageSize"
      :total="total"
      :page.sync="search.pageNum"
      :limit.sync="search.pageSize"
      @pagination="getSubjectList"
    />
  </div>
</template>

<script>
  import subject from "./subject";
  export default subject;
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
