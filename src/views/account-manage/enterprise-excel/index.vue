<template>
  <div class="enterprise-recon app-container">
    <div>
      <el-form label-position="left" :inline="true" :model="search">
        <el-row>
          <el-col :span="5">
            <el-form-item label="企业名称" prop="enterpriseName">
              <el-select
                style="width: 145px;"
                v-model="search.groupId"
                filterable
                remote
                clearable
                maxlength="15"
                placeholder="请输入企业名称"
                :remote-method="getEnterpriseName"
                :loading="loading"
                @keyup.native="onKeyup"
              >
                <el-option
                  v-for="item in enterpriseList"
                  :key="item.id"
                  :label="item.groupName"
                  :value="item.id"
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
                :remote-method="getbusinessName"
                :loading="loading"
                @keyup.native="onKeyup"
              >
                <el-option
                  v-for="item in businessList"
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
                @click="handleSearch"
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
        <el-table
          border
          show-summary
          :data="list"
          v-loading="listLoading"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          :summary-method="getSummaries"
        >
          <el-table-column
            v-for="(item, index) in title"
            :min-width="item.width"
            align="center"
            :prop="item.value"
            :label="item.label"
          >
            <template slot-scope="scope">
              <span v-if="item.value !== 'orderDetails'">{{
                scope.row[item.value]
              }}</span>
              <el-popover v-else trigger="hover" placement="bottom">
                <p style="max-width: 350px;">{{ scope.row[item.value] }}</p>
                <div slot="reference" class="enter-goods-detail">
                  {{ scope.row[item.value] }}
                </div>
              </el-popover>
            </template>
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
    { label: "清算日期", value: "orderCreateDate", width: "80px" },
    { label: "企业名称", value: "groupName", width: "160px" },
    { label: "商户名称", value: "businessName", width: "80px" },
    { label: "下单时间", value: "orderDate", width: "160px" },
    { label: "订单号", value: "orderNumber", width: "180px" },
    { label: "商品明细", value: "orderDetails", width: "100px" },
    { label: "积分支付总额", value: "integralSum", width: "140px" },
    { label: "商品积分支付总额", value: "orderIntegral", width: "200px" },
    { label: "手续费积分支付总额", value: "serviceCharge", width: "200px" },
    { label: "核对情况", value: "statusText", width: "80px" }
  ];

  const format = data => {
    let list = [];
    data.map(item => {
      switch (item.status) {
        case 1:
          item.statusText = "无异常";
          break;
        case 2:
          item.statusText = "有异常，已全部处理";
          break;
        case 3:
          item.statusText = "有异常未处理";
          break;
        case 4:
          item.statusText = "有异常未处理";
          break;
        case 5:
          item.statusText = "有异常未处理";
          break;
        default:
          break;
      }
      list = [...list, item];
    });
    return list;
  };

  export default {
    name: "EnterpriseExcel",
    data() {
      return {
        pickerOptions: {
          // 设置日期只能选择前一年
          disabledDate(time) {
            const year = new Date().getFullYear() - 1,
              month = new Date().getMonth() + 1,
              strDate = new Date().getDate();
            const recentYear = new Date(`${year}-${month}-${strDate}`).getTime();
            return time.getTime() < recentYear || time.getTime() > Date.now();
          }
        },
        search: {
          groupId: "", // 企业ID
          businessIds: [], // 商户ID
          startDate: "", //开始日期
          endDate: "", //结束日期
          pageNum: 1,
          pageSize: 20
        },
        title, // 列表title
        total: 0, // 返回的列表总数
        integralSum: 0, // 合计积分支付金额
        orderIntegralSum: 0, // 合计商品积分支付总额
        serviceChargeSum: 0, // 合计手续费积分支付总额
        clearingDate: "", // 清算日期
        businessList: [], // 商户列表
        enterpriseList: [], // 企业列表
        list: [], // 企业对账列表
        listLoading: false, // 列表loading
        loading: false // 搜索框loading
      };
    },
    watch: {
      // 监听日期的变化
      clearingDate(time) {
        if (time) {
          this.search.startDate = time[0];
          this.search.endDate = time[1];
        } else {
          this.search.startDate = "";
          this.search.endDate = "";
        }
      }
    },
    methods: {
      async getList() {
        this.listLoading = true;
        const { data } = await EnterExcelService.getEnterpriseList(this.search);
        this.listLoading = false;
        if (data) {
          this.list = format(data.groupAccountList);
          this.total = data.total;
          this.integralSum = data.integralSum;
          this.orderIntegralSum = data.orderIntegralSum;
          this.serviceChargeSum = data.serviceChargeSum;
        }
      },

      // 筛选输入框禁止输入特殊字符
      onKeyup(e) {
        e.target.value = e.target.value.replace(
          /[！……（）——￥!~@#$%*&()_+\s^]/g,
          ""
        );
      },

      // 表格异常数据标红处理
      tableRowClassName({ row }) {
        if (row.status === 3 || row.status === 4 || row.status === 5) {
          return "warning-row";
        }
        return "";
      },

      // 查询筛选列表
      handleSearch() {
        const { groupId, startDate, endDate } = this.search;
        if (!groupId || !startDate || !endDate) return;
        this.getList();
      },

      // 搜索企业
      getEnterpriseName(query) {
        if (query !== "") {
          this.loading = true;
          setTimeout(async () => {
            const { data } = await EnterExcelService.getEnterpriseName(query);
            this.loading = false;
            this.enterpriseList = data;
          }, 200);
        } else {
          this.enterpriseList = [];
        }
      },

      // 搜索商户
      getbusinessName(query) {
        if (query !== "") {
          this.loading = true;
          setTimeout(async () => {
            const { data } = await EnterExcelService.getbusinessName(query);
            this.loading = false;
            this.businessList = data;
          }, 200);
        } else {
          this.businessList = [];
        }
      },

      // 导出
      handleDownload() {
        let query = {};
        const { groupId, startDate, endDate } = this.search;
        if (!groupId || !startDate || !endDate) return;
        Object.assign(query, {
          groupId: groupId,
          businessIds: this.search.businessIds
            ? this.search.businessIds.join(",")
            : "",
          startDate: startDate,
          endDate: endDate
        });
        let params = Utils.obj2Param(query);
        EnterExcelService.export(params);
      },

      // 计算合计
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 5) {
            sums[index] = "合计";
            return;
          }
          if (index === 6) {
            sums[index] = this.integralSum;
          }
          if (index === 7) {
            sums[index] = this.orderIntegralSum;
          }
          if (index === 8) {
            sums[index] = this.serviceChargeSum;
          }
        });
        return sums;
      }
    }
  };
</script>

<style lang="less">
  .enterprise-recon {
    .search-btn {
      margin-left: 50px;
    }
    .el-table .warning-row {
      color: red;
    }
    .enter-goods-detail {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
