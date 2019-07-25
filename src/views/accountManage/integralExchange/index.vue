<template>
  <div class="integral-exchange app-container">
    <div class="form">
      <el-form
        label-position="left"
        :inline="true"
        :model="search"
        class="demo-form-inline"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item label="订单时间">
              <el-date-picker
                :editable="false"
                v-model="orderDate"
                type="daterange"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业名称" prop="businessName">
              <el-select
                style="width: 145px;"
                v-model="search.groupName"
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
                  :value="item.groupName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单编号">
              <el-input
                style="width: 100%"
                v-model="search.orderId"
                placeholder="请输入订单编号"
                maxlength="40"
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <pe-button
                label="查询"
                perms="account:integralExchange:search"
                type="primary"
                @click="handleSearch"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="手机号码">
              <el-input
                style="width: 100%"
                v-model="search.tel"
                placeholder="请输入手机号码"
                maxlength="15"
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="会员编号">
              <el-input
                style="width: 100%"
                v-model="search.memberId"
                placeholder="请输入会员编号"
                maxlength="15"
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商户名称">
              <el-select
                v-model="search.merchantName"
                filterable
                remote
                clearable
                placeholder="请输入商户名称"
                :remote-method="getbusinessName"
                :loading="loading"
                @keyup.native="onKeyup"
              >
                <el-option
                  v-for="item in businessList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <pe-button
                :loading="downloadLoading"
                label="导出订单明细"
                perms="account:integralExchange:export"
                type="primary"
                @click="handleDownload"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <el-table
        border
        :data="list"
        v-loading="listLoading"
        style="width: 100%"
        :row-key="getRowKey"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" :reserve-selection="true" width="55">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in title"
          :key="index"
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
        :page.sync="search.page"
        :limit.sync="search.limit"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
  import { Utils, Auth } from "@/common";
  import { IntegralExchangeService } from "@/service";
  const title = [
    // 表格title
    { label: "订单时间", value: "orderDate" },
    { label: "订单编号", value: "orderId" },
    { label: "会员编号", value: "memberId" },
    { label: "会员姓名", value: "memberName" },
    { label: "企业名称", value: "groupName" },
    { label: "商户名称", value: "bizName" },
    { label: "商品明细", value: "itemDetail" },
    { label: "应付总额", value: "totalAmount" },
    { label: "积分实付总额", value: "paiedAmount" }
  ];
  const startDate = () => {
    let year = new Date().getFullYear(),
      month = new Date().getMonth(),
      strDate = new Date().getDate();
    if (month == 0) {
      year -= 1;
      month = 12;
    }
    if (month == 1) {
      year -= 1;
      month = 13;
    }
    if (month == 2) {
      year -= 1;
      month = 14;
    }
    return `${year}-${month - 2 < 10 ? "0" + String(month - 2) : month - 2}-${
      strDate < 10 ? "0" + String(strDate) : strDate
    }`;
  };
  const endDate = () => {
    let year = new Date().getFullYear(),
      month = new Date().getMonth(),
      strDate = new Date().getDate();
    return `${year}-${month + 1 < 10 ? 0 + String(month + 1) : month + 1}-${
      strDate < 10 ? "0" + String(strDate) : strDate
    }`;
  };
  export default {
    name: "IntegralExchange",
    data() {
      return {
        pickerOptions: {
          // 设置日期只能选择前三个月
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        getRowKey(row) {
          return row.id;
        },
        title,
        orderDate: [startDate(), endDate()], // 订单时间
        search: {
          startDate: startDate(), // 订单开始时间
          endDate: endDate(), // 订单结束时间
          groupName: "", // 企业名称
          orderId: "", // 订单编号
          tel: "", // 手机号码
          memberId: "", // 会员编号
          merchantName: "", // 商户名称
          limit: 20, // 每页显示条数
          page: 1 // 分页
        },
        loading: false, // 搜索框loading
        listLoading: false, // 表格数据加载的loading
        downloadLoading: false, // 导出excel按钮loading
        list: [], // 表格数据列表
        businessList: [], // 商户列表
        enterpriseList: [], // 企业列表
        multipleSelection: [], // 需要导出的数据
        total: 0 // 返回的列表总数
      };
    },
    watch: {
      // 订单时间
      orderDate(time) {
        if (time) {
          this.search.startDate = time[0];
          this.search.endDate = time[1];
        } else {
          this.search.startDate = "";
          this.search.endDate = "";
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      // 初始化列表,获取数据展示表格
      async getList() {
        this.listLoading = true;
        const { data } = await IntegralExchangeService.getIntegralExchangeList(
          this.search
        );
        this.listLoading = false;
        if (data) {
          this.list = data.list;
          this.total = data.total;
        }
      },

      // 筛选输入框禁止输入特殊字符
      onKeyup(e) {
        e.target.value = e.target.value.replace(
          /[！……（）——￥!~@#$%*&()_+\s^]/g,
          ""
        );
      },

      // 查询订单
      handleSearch() {
        const { startDate, endDate } = this.search;
        this.getList();
      },

      // 搜索商户
      getbusinessName(query) {
        if (query !== "") {
          this.loading = true;
          setTimeout(async () => {
            const { data } = await IntegralExchangeService.getbusinessName(query);
            this.loading = false;
            if (data.hits) {
              this.businessList = data.hits;
            }
          }, 200);
        } else {
          this.businessList = [];
        }
      },

      // 搜索企业
      getEnterpriseName(query) {
        if (query !== "") {
          this.loading = true;
          setTimeout(async () => {
            const { data } = await IntegralExchangeService.getEnterpriseName(
              query
            );
            this.loading = false;
            this.enterpriseList = data;
          }, 200);
        } else {
          this.enterpriseList = [];
        }
      },

      // 选择需要导出的数据
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      // 导出订单
      handleDownload() {
        this.downloadLoading = true;
        if (this.multipleSelection.length > 0) {
          import("@/vendor/Export2Excel").then(excel => {
            const tHeader = [
              "订单时间",
              "订单编号",
              "会员编号",
              "会员姓名",
              "企业名称",
              "商户名称",
              "商品明细",
              "应付总额",
              "积分实付总额"
            ];
            const filterVal = [
              "orderDate",
              "orderId",
              "memberId",
              "memberName",
              "groupName",
              "bizName",
              "itemDetail",
              "totalAmount",
              "paiedAmount"
            ];
            const list = this.multipleSelection;
            const data = this.formatJson(filterVal, list);
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: "积分兑换订单列表" + new Date().toLocaleDateString()
            });
            this.downloadLoading = false;
          });
        } else {
          let query = {};
          let token = Auth.getToken();
          query.Authorization = token;
          const { startDate, endDate } = this.search;
          this.downloadLoading = false;
          if (!startDate || !endDate) return;
          Object.assign(query, this.search);
          let params = Utils.obj2Param(query);
          IntegralExchangeService.export(params);
        }
      },

      // 格式化需要导出的数据
      formatJson(filterVal, jsonData) {
        return jsonData.map(v =>
          filterVal.map(j => {
            return v[j];
          })
        );
      }
    }
  };
</script>
<style lang="less">
</style>


