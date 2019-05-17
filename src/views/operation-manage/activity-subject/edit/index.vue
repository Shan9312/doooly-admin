<template>
  <div class="app-container page-edit">
    <el-row>
      <el-col :span="10">
        <el-form label-width='70px'>
          <el-form-item label="专题标题">
            <el-input v-model="title" style="width: 300px;"></el-input>
          </el-form-item>
          <el-form-item label="背景色">
            <el-color-picker v-model="bgColor" size="medium" v-on:change='changeColor'></el-color-picker>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="14">
        <el-form label-width='70px'>
          <el-form-item label="下架状态">
            <el-radio v-model="radioStatus" label="1">限时下架</el-radio>
            <el-radio v-model="radioStatus" label="2">永久下架</el-radio>
            <el-button type="primary" class="save-btn">保存</el-button>
          </el-form-item>
          <el-form-item label="下架时间">
            <el-date-picker v-model="shelfTime" type="datetime" placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="10">
        <div class="grid-left" :style="{backgroundColor: bgColor}">
          <div v-for='(item,index) in componentList' :key="index" class="item" @mouseover="showEditTab(index,true)" @mouseout="showEditTab(index,false)">
            <component :is='item.name' :config='item' :parentIndex='index' v-on:openDialogModal='openDialogModal'></component>
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
            <el-aside width="300px" height="200px"><img :src="item.url" alt=""></el-aside>
            <el-main>
              <el-button type="primary" class="btn" @click="addTemplate(item.type)">添加</el-button>
            </el-main>
          </el-container>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="编辑" :visible.sync="dialogModalVisible">
      <el-form label-width='70px'>
        <el-form-item label="图片名称">
          <el-input v-model="modalImg.name" style="width: 217px;"></el-input>
        </el-form-item>
      </el-form>
      <el-upload class="avatar-uploader" action="" :show-file-list="false" :on-success="handleAvatarSuccess" :on-change='handleUpImgChange'>
        <img v-if="modalImg.url" :src="modalImg.url" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <el-form label-width='70px'>
        <el-form-item label="操作类型">
          <el-select v-model="urlType" placeholder="请选择">
            <el-option v-for="item in urlOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="linkUrl" style="width: 300px; margin-left:20px;"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="modal-save-btn" @click="handleSaveImgInfo">保存</el-button>
    </el-dialog>
  </div>
</template>

<script>
import ImgModule from '../../components/ImgModule.vue'
import { link } from 'fs';
import { constants } from 'crypto';
const ModuleList = [
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
    type: 3,
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
      title: '专题1',
      bgColor: '#fff',
      radioStatus: '1', // 下架状态
      shelfTime: '', // 下架时间
      dialogModalVisible: false, // 编辑框
      modalImg: {
        name: 'dfdf',
        url: '',
        type: ''
      },
      currentComponentIndex: null,
      componentList: [],
      templateList: [
        {
          type: 1,
          url: require("@/assets/image/operation/timg1.jpg")
        },
        {
          type: 2,
          url: require("@/assets/image/operation/timg2.jpg")
        },
        {
          type: 3,
          url: require("@/assets/image/operation/timg3.jpg")
        }
      ],
      urlOptions: [{
        value: '选项1',
        label: '链接'
      }, {
        value: '选项2',
        label: '品牌馆链接'
      }, {
        value: '选项3',
        label: '内购网链接'
      }, {
        value: '选项4',
        label: '无'
      }],
      urlType: '', // 跳转地址的类型，内购、品牌馆等
      linkUrl: '', // 点击图片的跳转地址
      parentIndex: null,
      currentIndex: null
    }
  },
  components: {
    ImgModule
  },
  methods: {
    addTemplate(type) {
      ModuleList.forEach((item) => {
        if (type === item.type) {
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
    },
    componentDown(item, index) {
      this.$set(this.componentList, index, this.componentList[index + 1]);
      this.$set(this.componentList, index + 1, item);
    },
    componentDelete(item, index) {
      this.componentList.splice(index, 1);
    },
    changeColor() {
      console.log(this.bgColor)
    },
    openDialogModal(parentIndex, subIndex) {
      this.dialogModalVisible = true
      this.parentIndex = parentIndex
      this.currentIndex = subIndex
    },
    handleAvatarSuccess(res, file) {
      // this.modalImg.name = URL.createObjectURL(file.raw);
    },
    handleUpImgChange(file, fileList) {
      this.$set(this.modalImg, 'url', URL.createObjectURL(file.raw))
    },
    handleSaveImgInfo() {
      this.dialogModalVisible = false
      console.log(this.componentList)
      this.componentList[this.parentIndex].subList[this.currentIndex].imgSrc = this.modalImg.url
      console.log(this.componentList)
    }
  }
}
</script>

<style lang="less" scoped>
.page-edit {
  .save-btn {
    position: absolute;
    width: 120px;
    margin-left: 58px;
  }
  .modal-save-btn {
    display: block;
    margin: 30px auto;
    width: 120px;
  }
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
/deep/ .el-dialog {
  width: 40%;
  min-width: 670px;
}
/deep/ .avatar-uploader {
  margin-bottom: 30px;
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    overflow: hidden;

    .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 300px;
      height: 200px;
      line-height: 200px;
      text-align: center;
    }
    .avatar {
      width: 300px;
      height: 200px;
      display: block;
    }
  }
}
</style>