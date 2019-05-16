<template>
  <div class="img-module3">
    <div class="img" v-for="(item,index) in config.subList" :key='index' @click="goDetail(item.url)">
      <img :src="item.imgSrc" alt="">
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
    }
  },
  created() {
    console.log(this.config)
  },
  methods: {
    goDetail(url) {
      // window.open(url, '_blank')
    }
  }
}
</script>
<style lang="less" scoped>
.img-module3 {
  width: 100%;
  display: flex;
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


