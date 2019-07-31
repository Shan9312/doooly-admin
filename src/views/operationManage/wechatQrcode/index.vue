<template>
  <div class="app-container subject-list">
    <el-form>
      <el-row>
        <el-col :span="6">
          <el-form-item label="主标题">
            <el-input
              style="width: 300px"
              v-model="searchParams.title"
              placeholder="请输入主标题"
              maxlength="10"
              @keyup.native="onKeyup"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态：">
            <el-select
              v-model="searchParams.codeType"
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
        <el-col :span="6">
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
      label="新建二维码"
      perms="operation:ActivitySubject:add"
      type="primary"
      @click="edit(null)"
    />
    <el-table stripe :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="编号" width="180">
      </el-table-column>
      <el-table-column prop="title" label="主标题" width="180">
      </el-table-column>
      <el-table-column prop="url" label="访问地址"> </el-table-column>
      <el-table-column prop="expireTime" label="失效时间" width="200">
      </el-table-column>
      <el-table-column prop="image" label="二维码" width="300">
        <template slot-scope="scope">
          <!-- <img :src="scope.row.image" alt=""> -->
          <pe-button
            label="查看"
            size="mini"
            perms="operation:ActivitySubject:edit"
            @click="downloadQrcode(String(scope.row.id))"
          />
          <vue-qr v-if="scope.row.codeUrl" v-show="false" :logoSrc="logoSrc" :text="scope.row.codeUrl" :callback="handleQrcodeData" :qid="String(scope.row.id)" :size="200" :dotScale="1"></vue-qr>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <pe-button
            label="编辑"
            size="mini"
            perms="operation:ActivitySubject:edit"
            @click="edit(scope.row.id)"
          />
          <pe-button
            label="生成二维码"
            size="mini"
            perms="operation:ActivitySubject:copy"
            @click="createQrcode(scope.row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-dialog title="上架编辑页" :visible.sync="dialogModalVisible">
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
    </el-dialog> -->
    <pagination
      v-show="total > searchParams.pageSize"
      :total="total"
      :page.sync="searchParams.pageNum"
      :limit.sync="searchParams.pageSize"
      @pagination="queryList"
    />
  </div>
</template>

<script>
  import wechatQrcode from "./wechatQrcode";
  export default wechatQrcode;
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
