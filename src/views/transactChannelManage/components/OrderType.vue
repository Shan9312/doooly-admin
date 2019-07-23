<template>
  <div class="state-tag-wrapper">
    <span v-if="payType == '1' || payType== '2'" class="success">微信</span>
    <span v-if="payType == '6' || payType== '11'" class="success">支付宝</span>
    <span v-if="payType == '12'" class="success">工银支付</span>
    <span v-if="payType == '14' || payType== '17'" class="success">云闪付</span>
    <span v-if="payType == '15' || payType== '16'" class="success">建行龙支付</span>
  </div>
</template>

<script>
export default {
  name: "order-state",
  data() {
    return {};
  },
  props: {
    payType: {
      required: true
    }
  }
};
</script>

<style lang="less" scoped>
.state-tag-wrapper {
  display: inline-block;
  .success {
    color: #409eff;
  }
  .default {
    color: #909399;
  }
}
</style>


