<template>
  <div class="merchants-order app-container">
    <div class="order-form">
      <el-form label-position="left" :inline="true" :model="search">
        <el-row>
          <el-col :span="11" :offset="1">
            <el-form-item label="清算日期">
              <el-date-picker
                :editable="false"
                v-model="clearingDate"
                type="daterange"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商户名称">
              <el-input
                style="width: 100%"
                v-model="search.businessName"
                maxlength="20"
                placeholder="请输入商户名称"
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button
                class="filter-item"
                type="primary"
                icon="el-icon-download"
                @click="handleDownload"
                >导出订单明细</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
  import { Utils } from "@/common";
  export default {
    name: "ReconExcel",
    data() {
      return {
        pickerOptions: {
          // 设置日期范围
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        search: {
          businessName: "", // 商户名称
          checkTimeStartDate: "", //开始日期
          checkTimeEndDate: "" //结束日期
        },
        clearingDate: "" // 清算日期
      };
    },
    created() {},
    methods: {
      // 筛选输入框禁止输入特殊字符
      onKeyup(e) {
        e.target.value = e.target.value.replace(/[!~@#$%*&()_+\s^]/g, "");
      },
      // 导出
      handleDownload() {
        let query = {};
        if (!this.clearingDate) return;
        if (!this.search.businessName) return;
        if (this.clearingDate) {
          Object.assign(this.search, {
            checkTimeStartDate: this.clearingDate[0],
            checkTimeEndDate: this.clearingDate[1]
          });
        }
        let params = Utils.obj2Param(this.search);
        window.location.href = `${
          process.env.VUE_APP_URL
        }reconciliInfo/accountCheckExcel?${params}`;
      }
    }
  };
</script>

<style lang="less">
  .search-btn {
    margin-left: 50px;
  }
</style>
