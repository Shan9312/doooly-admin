<template>
  <div class="integral app-container">
    <el-form
      label-position="left"
      :inline="true"
      :model="search"
      class="demo-form-inline"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="用户返利积分类型">
            <el-radio-group v-model="search.type">
              <el-radio label="1">通用积分</el-radio>
              <el-radio label="2"
                >定向积分--批次号XXXXXXXX（默认为仅限品牌馆使用，具体可根据该批次号设置使用范围）</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item>
            <pe-button
              label="保存"
              perms="account:accountEntry:search"
              type="primary"
              @click="handlSave"
            />
            <el-button type="default">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { RebateIntegralService } from "@/service";
  export default {
    name: "Integral",
    data() {
      return {
        search: {
          type: "1"
        },
        id: ""
      };
    },
    created() {
      this.initData();
    },
    methods: {
      async initData() {
        const { data } = await RebateIntegralService.getRebateIntegralType();
        if (data) {
          this.type = data.type;
          this.id = data.id;
        }
      },
      async handlSave() {
        let query = Object.assign({ id: this.id }, this.search);
        const { data } = await RebateIntegralService.saveRebateIntegralType(
          query
        );
        if (data) {
          this.initData();
          this.$message({ message: "操作成功", type: "success" });
        }
      }
    }
  };
</script>

<style lang="less">
</style>

