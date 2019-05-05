<template>
  <div class="app-container">
    <div>
      <el-form label-position="left" :inline="true" :model="search">
        <el-row>
          <el-col :span="5">
            <el-form-item label="企业名称" prop="enterpriseName">
              <el-select
                style="width: 145px;"
                v-model="search.enterpriseName"
                filterable
                remote
                clearable
                maxlength="15"
                placeholder="请输入企业名称"
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
          <el-col :span="8">
            <el-form-item label="清算日期">
              <el-date-picker
                style="width: 310px"
                :editable="false"
                v-model="clearingDate"
                type="daterange"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="商户名称" prop="businessName">
              <el-select
                style="width: 145px;"
                v-model="search.businessIds"
                multiple
                filterable
                remote
                reserve-keyword
                maxlength="15"
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
              <el-button
                class="filter-item"
                type="primary"
                icon="el-icon-download"
                @click="handleDownload"
                >查询</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button
                class="filter-item"
                type="primary"
                icon="el-icon-download"
                @click="handleDownload"
                >导出明细</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>
        <el-table :data="list" v-loading="listLoading" style="width: 100%">
          <el-table-column
            v-for="(item, index) in title"
            :min-width="item.width"
            align="center"
            :prop="item.value"
            :label="item.label"
          >
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="search.pageNum"
          :limit.sync="search.pageSize"
          @pagination="getList"
        />
      </div>
    </div>
  </div>
</template>
<script>
  import { Utils } from "@/common";
  import { EnterExcelService } from "@/service";
  const title = [
    // 表格title
    { label: "清算日期", value: "businessType", width: "80px" },
    { label: "企业名称", value: "orderCreateDate", width: "160px" },
    { label: "商户名称", value: "dateMarkText", width: "80px" },
    { label: "下单时间", value: "orderDate", width: "160px" },
    { label: "订单号", value: "orderNumber", width: "180px" },
    { label: "商户明细", value: "businessName", width: "100px" },
    { label: "积分支付总额", value: "receiptTypeValue", width: "100px" },
    { label: "核对情况", value: "orderAmountPlan", width: "80px" }
  ];
  export default {
    name: "enterpriseExcel",
    data() {
      return {
        pickerOptions: {
          // 设置日期只能选择前一年
          disabledDate(time) {
            const year = new Date().getFullYear() - 1,
              month = new Date().getMonth() + 1,
              strDate = new Date().getDate();
            const recentYear = new Date(`${year}-${month}-${strDate}`).getTime();
            return  time.getTime() < recentYear || time.getTime() > Date.now();
          },
        },
        search: {
          enterpriseName: "", // 企业名称
          businessIds: [], // 商户名称
          checkTimeStartDate: "", //开始日期
          checkTimeEndDate: "", //结束日期
          pageNum: 1,
          pageSize: 20
        },
        title, // 列表title
        total: 0, // 返回的列表总数
        clearingDate: "", // 清算日期
        options: [], // 商户名称
        list: [], // 企业对账列表
        listLoading: false, // 列表loading
        loading: false // 搜索框loading
      };
    },
    created() {},
    methods: {
      async getList() {
        this.listLoading = true;
        const { data } = await EnterExcelService.getEnterpriseList(this.search);
        this.listLoading = false;
        // this.list = format(data.list);
        // this.total = data.total;
      },

      // 筛选输入框禁止输入特殊字符
      onKeyup(e) {
        e.target.value = e.target.value.replace(/[!~@#$%*&()_+\s^]/g, "");
      },

      // 搜索商户
      remoteMethod(query) {
        if (query !== "") {
          this.loading = true;
          setTimeout(async () => {
            const { data } = await EnterExcelService.getbusniessName(
              encodeURI(query)
            );
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
        if (!this.clearingDate) return;
        Object.assign(query, {
          checkTimeStartDate: this.clearingDate[0],
          checkTimeEndDate: this.clearingDate[1],
          businessIds: this.search.businessIds
            ? this.search.businessIds.join(",")
            : ""
        });
        let params = Utils.obj2Param(query);
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
