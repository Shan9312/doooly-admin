<template>
  <div class="app-container page-edit">
    <el-row>
      <el-col :span="10">
        <el-form label-width='70px'>
          <el-form-item label="专题标题">
            <el-input v-model="title" style="width: 300px;"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="14">
        <el-form label-width='70px'>
          <el-form-item label="背景色">
            <el-input v-model="bgColor" style="width: 300px;"></el-input>
            <el-button type="primary" style="width: 120px;">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="10">
        <div class="grid-left">
          <div v-for='(item,index) in componentList' :key="index" class="item" @mouseover="showEditTab(index,true)" @mouseout="showEditTab(index,false)">
            <component :is='item.name' :config='item'></component>
            <div class="btn-group" v-show='currentComponentIndex == index'>
              <el-row>
                <el-col :span="8">
                  <el-button type="primary" :disabled='index === 0' @click="componentUp(item,index)">上移</el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-button type="primary" :disabled='index === (componentList.length-1)' @click="componentDown(item,index)">下移</el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-button type="primary" @click="componentDelete(item,index)">删除</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="grid-right">
          <el-container v-for="(item,index) in templateList" :key="index">
            <el-aside width="300px" height="200px"><img :src="item" alt=""></el-aside>
            <el-main>
              <el-button type="primary" class="btn" @click="addTemplate(index)">添加</el-button>
            </el-main>
          </el-container>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ImgModule from '../../components/ImgModule.vue'
const moduleList = [
  {
    type: 1,
    name: 'ImgModule',
    subList: [{
      imgSrc: require("@/assets/image/operation/timg1.jpg"),
      url: 'http://www.baidu.com'
    }]
  },
  {
    type: 2,
    name: 'ImgModule',
    subList: [{
      imgSrc: require("@/assets/image/operation/timg2.jpg"),
      url: 'http://www.baidu.com'
    },
    {
      imgSrc: require("@/assets/image/operation/timg2.jpg"),
      url: 'http://www.baidu.com'
    }]
  },
  {
    type: 2,
    name: 'ImgModule',
    subList: [{
      imgSrc: require("@/assets/image/operation/timg3.jpg"),
      url: 'http://www.baidu.com'
    },
    {
      imgSrc: require("@/assets/image/operation/timg3.jpg"),
      url: 'http://www.baidu.com'
    }, {
      imgSrc: require("@/assets/image/operation/timg3.jpg"),
      url: 'http://www.baidu.com'
    }]
  }
]
export default {
  name: 'ActivitySubjectEdit',
  data() {
    return {
      title: 'title',
      bgColor: '#fff',
      currentComponentIndex: null,
      componentList: [],
      templateList: [
        require("@/assets/image/operation/timg1.jpg"),
        require("@/assets/image/operation/timg2.jpg"),
        require("@/assets/image/operation/timg3.jpg")
      ]
    }
  },
  components: {
    ImgModule
  },
  methods: {
    addTemplate(index) {
      moduleList.forEach((item, moduleIndex) => {
        if (index === moduleIndex) {
          this.componentList.push(item)
        }
      })
    },
    showEditTab(index, isShow) {
      if (isShow) {
        this.currentComponentIndex = index
      } else {
        this.currentComponentIndex = null
      }
    },
    componentUp(item, index) {
      this.$set(this.componentList, index, this.componentList[index - 1]);
      this.$set(this.componentList, index - 1, item);
      this.$set(this.componentList[index - 1], 'visible', false)
    },
    componentDown(item, index) {
      this.$set(this.componentList, index, this.componentList[index + 1]);
      this.$set(this.componentList, index + 1, item);
      this.$set(this.componentList[index + 1], 'visible', false)
    },
    componentDelete(item, index) {
      this.componentList.splice(index, 1);
    }
  }
}
</script>

<style lang="less" scoped>
.page-edit {
  .grid-left {
    box-sizing: content-box;
    width: 375px;
    height: 667px;
    overflow-y: auto;
    border: 1px solid #000;
    &::-webkit-scrollbar {
      display: none;
    }
    .item {
      position: relative;
      .btn-group {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(0, -50%);
        .el-row {
          margin: 8px 0;
          .el-button {
            width: 80px;
            padding: 5px 10px;
          }
        }
      }
    }
  }
  .grid-right {
    width: 500px;
    .el-container {
      height: 200px;
      margin-bottom: 30px;
      .el-aside {
        line-height: 200px;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .el-main {
        text-align: center;
        line-height: 160px;
        .btn {
          display: inline-block;
          width: 120px;
        }
      }
    }
  }
}
</style>