<template>
  <div class="order-detail-wapper">
    <!-- 订单详情 -->
    <div>
      <el-row :gutter="20" class="detail-row">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">订单编号:</el-col>
            <el-col :span="18">{{orderObj.orderNumber}}</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">产品名称:</el-col>
            <el-col :span="18">{{orderObj.productName}}</el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="detail-row">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">订单日期:</el-col>
            <el-col :span="18">{{orderObj.orderTime}}</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">规格:</el-col>
            <el-col :span="18">{{orderObj.productSpecification}}</el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="detail-row">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">会员卡号:</el-col>
            <el-col :span="18">{{orderObj.cardNumber}}</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">数量:</el-col>
            <el-col :span="18">{{orderObj.productNum}}</el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="detail-row">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">订单状态:</el-col>
            <el-col :span="18">{{orderObj.orderState}}</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">支付宝姓名:</el-col>
            <el-col :span="18">{{orderObj.alipayName}}</el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="detail-row">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">所属企业:</el-col>
            <el-col :span="18">{{orderObj.groupName}}</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">支付宝账号:</el-col>
            <el-col :span="18">{{orderObj.alipayAccount}}</el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="detail-row">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">商家名称:</el-col>
            <el-col :span="18">{{orderObj.businessName}}</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">购买人手机号:</el-col>
            <el-col :span="18">{{orderObj.userPhone}}</el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="detail-row">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">销售金额:</el-col>
            <el-col :span="18">{{orderObj.sellPrice}}</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">购买人姓名:</el-col>
            <el-col :span="18">{{orderObj.userName}}</el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="detail-row">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">供货金额:</el-col>
            <el-col :span="18">{{orderObj.supplyPrice}}</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">回收状态:</el-col>
            <el-col :span="18">{{orderObj.recoveryState}}</el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="detail-row">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">回收发起时间:</el-col>
            <el-col :span="18">{{orderObj.recoveryTime}}</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <!-- 返回按钮 -->
          <router-link :to="{path: '/recycleGoods/orderManage/orderList'}">
            <el-button type="primary" plain class="btn">返回</el-button>
          </router-link>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { RecycleGoodsService } from "@/service";

export default {
  name: "OrderDetail",
  data() {
    return {
      orderNumber: this.$route.params.id,
      orderObj: {
        recoveryTime: "",
        orderNumber: "21235562934929"
      }
    };
  },
  created() {
    console.log(this.$route.params.id);
    this.getOrderDetails();
  },
  methods: {
    // 查询订单详情
    async getOrderDetails() {
      const { data } = await RecycleGoodsService.recycleGoodsDetail({
        orderNumber: this.orderNumber
      });
      this.orderObj = data;
      console.log(data, "订单详情");
    }
  }
};
</script>

<style lang="less" scoped>
.order-detail-wapper {
  .detail-row {
    margin-bottom: 2.5rem;
  }
}
</style>