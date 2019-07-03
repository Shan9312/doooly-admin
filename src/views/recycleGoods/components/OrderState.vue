<template>
  <div class="state-tag-wrapper">
    <span v-if="orderState == '0'" class="default">未支付</span>
    <span v-if="orderState == '1'" class="success">已支付</span>
    <span v-if="orderState == '2'" class="gray">取消</span>
    <span v-if="orderState == '5'" class="default">已退款</span>
  </div>
</template>

<script>
export default {
  name: "order-state",
  data() {
    return {};
  },
  props: {
    orderState: {
      required: true
    }
  }
};
</script>

<style lang="less" scoped>
.state-tag-wrapper {
  display: inline-block;
  .default {
    color: #909399;
  }
  .success {
    color: #409eff;
  }
  .gray {
    color: #ff9900;
  }
}
</style>


