<template>
  <div class="app-container">
    <div>
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
              <el-select
                v-model="search.businessIds"
                multiple
                filterable
                remote
                reserve-keyword
                placeholder="请输入商户名称"
                :remote-method="remoteMethod"
                :loading="loading"
                @keyup.native="onKeyup"
              >
                <el-option
                  v-for="item in options"
                  :key="item.businessId"
                  :label="item.company"
                  :value="item.businessId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <pe-button
                class="filter-item"
                label="导出订单明细"
                icon="el-icon-download"
                perms="account:recon:export"
                type="primary"
                @click="handleDownload"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
  import { Utils, Auth } from "@/common";
  import { MerchantsExcelService } from "@/service";
  export default {
    name: "merchantsExcel",
    data() {
      return {
        pickerOptions: {
          // 设置日期范围
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        search: {
          businessIds: [], // 商户名称
          checkTimeStartDate: "", //开始日期
          checkTimeEndDate: "" //结束日期
        },
        clearingDate: "", // 清算日期
        options: [],
        loading: false
      };
    },
    methods: {
      // 筛选输入框禁止输入特殊字符
      onKeyup(e) {
        e.target.value = e.target.value.replace(/[!~@#$%*&()_+\s^]/g, "");
      },
      // 搜索商户
      remoteMethod(query) {
        if (query !== "") {
          this.loading = true;
          setTimeout(async () => {
            const { data } = await MerchantsExcelService.getbusinessName(query);
            this.loading = false;
            this.options = data;
          }, 200);
        } else {
          this.options = [];
        }
      },
      // 导出
      handleDownload() {
        let query = {};
        let token = Auth.getToken();
        query.Authorization = token;
        if (!this.clearingDate) return;
        Object.assign(query, {
          checkTimeStartDate: this.clearingDate[0],
          checkTimeEndDate: this.clearingDate[1],
          businessIds: this.search.businessIds
            ? this.search.businessIds.join(",")
            : ""
        });
        let params = Utils.obj2Param(query);
        MerchantsExcelService.export(params);
      }
    }
  };
</script>

<style lang="less">
  .search-btn {
    margin-left: 50px;
  }
</style>
