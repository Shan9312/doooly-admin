<template>
  <div class="order-detail app-container">
    <div class="order-form">
      <el-form
        label-position="left"
        :inline="true"
        :model="search"
        class="demo-form-inline"
      >
        <el-row>
          <el-col :span="6" :offset="1">
            <el-form-item label="商户名称">
              <el-input
                style="width: 100%"
                v-model="search.businessName"
                placeholder="请输入商户名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="下单时间">
              <el-date-picker
                :editable="false"
                v-model="createDate"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单编号">
              <el-input
                style="width: 100%"
                v-model="search.orderNumber"
                placeholder="请输入订单编号"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="1">
            <el-form-item label="收款类型">
              <el-select
                style="width: 120px;"
                v-model="search.paymentType"
                placeholder="请选择"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="平台收款" value="1"></el-option>
                <el-option label="非平台收款" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="对账状态">
              <el-select
                style="width: 120px;"
                v-model="search.state"
                placeholder="请选择"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="系统成功" value="1"></el-option>
                <el-option label="财务确认" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="searchOrder">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="reset">重置</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="downloadLoading"
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
    <div class="order-table">
      <el-table
        :data="list"
        ref="multipleTable"
        v-loading="listLoading"
        style="width: 100%"
        tooltip-effect="dark"
        @row-key="getRowKeys"
        @selection-change="handleSelectionChange"
        @cell-click="getRowFun"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          v-for="(item, index) in title"
          :min-width="item.width"
          :reserve-selection="true"
          align="center"
          :prop="item.value"
          :label="item.label"
        >
          <template slot-scope="scope">
            <span v-if="item.value !== 'orderNumber'">{{
              scope.row[item.value]
            }}</span>
            <router-link
              style="color:#409EFF"
              :to="`/order-detail/${scope.row.orderNumber}`"
              v-if="item.value == 'orderNumber'"
              >{{ scope.row[item.value] }}</router-link
            >
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
</template>
<script>
  import { MerchantsOrder } from "@/service";
  const title = [
    // 表格title
    { label: "商户名称", value: "id", width: "80px" },
    { label: "订单编号", value: "orderNumber", width: "180px" },
    { label: "下单时间", value: "date", width: "160px" },
    { label: "收款类型", value: "importance", width: "100px" },
    { label: "订单应付总金额", value: "pageviews", width: "100px" },
    { label: "订单实付总金额", value: "pageviews", width: "100px" },
    { label: "积分支付总额", value: "pageviews", width: "100px" },
    { label: "其他支付总额", value: "pageviews", width: "100px" },
    { label: "对账状态", value: "status", width: "100px" }
  ];
  export default {
    name: "OrderDetail",
    data() {
      return {
        search: {
          // 列表筛选
          startOrderDate: "", // 下单开始日期
          endOrderDate: "", // 下单结束日期
          businessName: "", // 商户名称
          orderNumber: "", // 订单编号
          state: "", // 对账状态
          paymentType: "", // 收款类型
          pageNum: 1, // 分页
          pageSize: 20 // 每页显示的条数
        },
        downloadLoading: false, // 导出excel按钮loading
        createDate: "", // 下单时间
        list: [], // 表格数据
        total: 0, // 返回的列表总数
        listLoading: false, // table列表加载的loading
        title, // 表格的title
        multipleSelection: [], // 选中的数据
        getRowKeys(row) {
          return row.id;
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      // 获取列表数据
      async getList() {
        // this.listLoading = true;
        const { data } = await MerchantsOrder.orderList(this.search);
        this.list = data.items;
        this.total = data.total;
        console.log(this.list);
        // this.listLoading = false;
        // if (data.code == 200 && data.data && data.data.list) {
        //   this.list = format(data.data.list);
        //   this.total = data.data.total;
        // } else {
        //   this.$message({
        //     message: data.info || "内部错误",
        //     type: "error",
        //     duration: 5 * 1000
        //   });
        // }
      },
      // 搜索订单
      searchOrder() {},

      // 重置
      reset() {},

      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(this.multipleSelection);
      },

      getRowFun(row, column, cell, event) {
        console.log(row);
      },

      // 导出
      handleDownload() {}
    }
  };
</script>

<style lang="less">
</style>
