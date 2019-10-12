<template>
  <div class="state-tag-wrapper">
    <span v-if="cardState == '0'" class="white">已创建</span>
    <span v-if="cardState == '10'" class="default">已分配</span>
    <span v-if="cardState == '20'" class="warning">已激活</span>
    <span v-if="cardState == '30'" class="gray">已下单</span>
    <span v-if="cardState == '40'" class="success">已发货</span>
    <span v-if="cardState == '50'" class="error">已冻结</span>
  </div>
</template>

<script>
export default {
  name: "card-state",
  data() {
    return {};
  },
  props: {
    cardState: {
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
  .warning {
    color: #ff9900;
  }
  .success {
    color: #67c23a;
  }
  .gray {
    color: #409eff;
  }
  .error {
    color: red;
  }
}
</style>


