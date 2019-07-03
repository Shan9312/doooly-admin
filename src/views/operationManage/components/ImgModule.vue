<template>
  <div class="img-module3">
    <div class="img" v-for="(item,index) in config.actModularAssemblyList" :key='index' @click="openModal(parentIndex,index,item)">
      <img :src="item.imgUrl" alt="">
    </div>
  </div>
</template>
<script>
export default {
  name: 'ImgModule',
  data() {
    return {

    }
  },
  props: {
    config: {
      required: true,
      type: Object
    },
    parentIndex: {
      required: true,
      type: Number
    }
  },
  methods: {
    openModal(parentIndex, subIndex, subItem) {
      this.$emit('openDialogModal', parentIndex, subIndex, subItem)
    }
  }
}
</script>
<style lang="less" scoped>
.img-module3 {
  width: 100%;
  display: flex;
  cursor: pointer;
  .img {
    flex: 1;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>


