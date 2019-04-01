<template>
  <div class="order-detail app-container">
    <el-row>
      <el-col :span="24">订单详情页（订单编号：18550004166）</el-col>
    </el-row>
    <!-- 基础信息 -->
    <div class="basis-info">
      <div><h4>基础信息</h4></div>
      <el-row>
        <el-col :span="10" :offset="2">所属企业：大华技术（企业id编号）</el-col>
        <el-col :span="10" :offset="2">手机号码：18745678901</el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">会员id：23227618854</el-col>
        <el-col :span="10" :offset="2">供应商名称：大润发</el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">会员姓名：王小明</el-col>
        <el-col :span="10" :offset="2">门店名称：上海市丰庄店</el-col>
      </el-row>
    </div>
    <!-- 订单信息 -->
    <div class="order-info">
      <div><h4>订单信息</h4></div>
      <el-row>
        <el-col :span="10" :offset="2">订单编号：N1552378586252488463</el-col>
        <el-col :span="10" :offset="2"
          >订单下单时间：2018-01-01 23:59:59</el-col
        >
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">付款总金额：999999.99元</el-col>
        <el-col :span="10" :offset="2">订单状态：已完成</el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">收款类型：兜礼收银</el-col>
        <el-col :span="10" :offset="2">支付方式：积分+微信</el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">积分支付总额：900000.00元</el-col>
        <el-col :span="10" :offset="2">非积分支付总额：99999.99元</el-col>
      </el-row>
    </div>
    <!-- 支付流水信息 -->
    <div class="flow-info">
      <div><h4>支付流水信息</h4></div>
      <el-row>
        <el-col :span="10" :offset="2">所属企业：大华技术（企业id编号）</el-col>
        <el-col :span="10" :offset="2">手机号码：18745678901</el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">会员id：23227618854</el-col>
        <el-col :span="10" :offset="2">供应商名称：大润发</el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">会员姓名：王小明</el-col>
        <el-col :span="10" :offset="2">门店名称：上海市丰庄店</el-col>
      </el-row>
    </div>
    <!-- 订单商品明细 -->
    <div class="goods-detail">
      <div><h4>订单商品明细</h4></div>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="date" label="品类编号" width="180">
            </el-table-column>
            <el-table-column prop="name" label="商品编号" width="180">
            </el-table-column>
            <el-table-column prop="address" label="商品名称"> </el-table-column>
            <el-table-column prop="address" label="税率（%）">
            </el-table-column>
            <el-table-column prop="address" label="数量"> </el-table-column>
            <el-table-column prop="address" label="应付金额"> </el-table-column>
            <el-table-column prop="address" label="实付金额"> </el-table-column>
          </el-table>
          <div class="coll-total">
            <div class="">应收款合计：<span>999999.99</span></div>
            <div>实收款合计：<span>999999.99</span></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    name: "OrderDetail",
    data() {
      return {
        tableData: [
          {
            date: "2016-05-02",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-04",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1517 弄"
          },
          {
            date: "2016-05-01",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1519 弄"
          },
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄"
          }
        ]
      };
    },
    created() {},
    methods: {}
  };
</script>

<style lang="less">
  .order-detail {
    .basis-info,
    .order-info,
    .flow-info {
      line-height: 28px;
    }
    .el-row {
      color: #666;
    }
    .coll-total {
      float: right;
      color: #666;
      margin: 20px;
      line-height: 40px;
    }
  }
</style>
