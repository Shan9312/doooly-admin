<template>
  <div class="app-container page-edit">
    <el-row>
      <el-col :span="10">
        <el-form label-width='70px'>
          <el-form-item label="专题标题">
            <el-input v-model="title"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <div class="guid-left">
          <component :is='item.name' v-for='item in componentList' :key="item.name"></component>
        </div>
      </el-col>
      <el-col :span="12">
        <div>rrrr</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ImgModule1 from '../../components/ImgModule1.vue'
import ImgModule2 from '../../components/ImgModule2.vue'
import ImgModule3 from '../../components/ImgModule3.vue'
export default {
  name: 'ActivitySubjectEdit',
  data() {
    return {
      title: 'title',
      componentList: [
        {
          name: 'ImgModule1',
          subList: [{
            url: 'http:www.baidu.com'
          }]
        },
        {
          name: 'ImgModule2',
          subList: [{
            url: 'http:www.baidu.com'
          },
          {
            url: 'http:www.baidu.com'
          }]
        },
        {
          name: 'ImgModule3',
          subList: [{
            url: 'http:www.baidu.com'
          },
          {
            url: 'http:www.baidu.com'
          }, {
            url: 'http:www.baidu.com'
          }]
        }
      ]
    }
  },
  components: {
    ImgModule1,
    ImgModule2,
    ImgModule3
  }
}
</script>

<style lang="less" scoped>
.page-edit {
  .guid-left {
    width: 375px;
    height: 667px;
    overflow-y: auto;
    border: 1px solid #000;
  }
}
</style>