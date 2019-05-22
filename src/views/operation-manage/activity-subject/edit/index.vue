<template>
  <div class="app-container page-edit">
    <el-row>
      <el-col :span="10">
        <el-form label-width='85px'>
          <el-form-item label="专题标题" required>
            <el-input v-model="specialTopicInfo.title" placeholder="请输入专题标题" style="width: 300px;"></el-input>
          </el-form-item>
          <el-form-item label="背景色">
            <el-color-picker v-model="specialTopicInfo.bgColor" size="medium"></el-color-picker>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="14">
        <el-form label-width='85px'>
          <el-form-item label="下架状态" required>
            <el-radio v-model="specialTopicInfo.status" label=1>限时下架</el-radio>
            <el-radio v-model="specialTopicInfo.status" label=2>永久</el-radio>
            <el-button type="primary" class="save-btn" @click="handleSaveSubject">保存</el-button>
          </el-form-item>
          <el-form-item v-show="specialTopicInfo.status === '1'" label="下架时间">
            <el-date-picker v-model="specialTopicInfo.endDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="10">
        <div class="grid-left" :style="{backgroundColor: specialTopicInfo.bgColor}">
          <div v-if="componentList.length > 0">
            <div v-for='(item,index) in componentList' :key="index" class="item" @mouseover="showEditTab(index,true)" @mouseout="showEditTab(index,false)">
              <component is='img-module' :config='item' :parentIndex='index' v-on:openDialogModal='openDialogModal'></component>
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
          <div v-else class="no-content">
            请将右边的组件添加到这里
          </div>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="grid-right">
          <el-container v-for="(item,index) in templateList" :key="index">
            <el-aside width="300px" height="175px" class="img-side">
              <div class="img-div" v-for="(subItem,subIndex) in item.modularType" :key='subIndex'>
                <img :src="item.imgUrl" alt="">
              </div>
            </el-aside>
            <el-main>
              <el-button type="primary" class="btn" @click="addTemplate(item.modularType)">添加</el-button>
            </el-main>
          </el-container>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="编辑" :visible.sync="dialogModalVisible">
      <el-form label-width='85px'>
        <el-form-item label="图片名称" required>
          <el-input v-model="modalImg.name" placeholder="请输入图片名称" clearable maxlength=10 minlength=1 style="width: 217px;"></el-input>
        </el-form-item>
      </el-form>
      <el-upload class="avatar-uploader" action="/subject/fileUpload" drag :show-file-list="false" :before-upload="beforeImgUpload" :on-success="handleImgSuccess">
        <img v-if="modalImg.url" :src="modalImg.url" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <el-form label-width='85px'>
        <el-form-item label="操作类型" required>
          <el-select v-model="urlType" placeholder="请选择链接类型">
            <el-option v-for="item in urlOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="linkUrl" placeholder="请输入正确的链接地址" clearable @blur='onBlur(linkUrl)' style="width: 300px; margin-left:20px;"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="modal-save-btn" @click="handleSaveImgInfo">保存</el-button>
    </el-dialog>
  </div>
</template>

<script>
import ImgModule from '../../components/ImgModule.vue'
import { SubjectService } from '@/service'
const ModuleImgUrl = require('@/assets/image/operation/bg.png')

export default {
  name: 'ActivitySubjectEdit',
  data() {
    return {
      specialTopicInfo: {
        id: this.$route.params.id,
        title: '',
        bgColor: '#fff',
        status: '1', // 下架状态 1.限时 2.永久
        endDate: '', // 下架时间
      },
      dialogModalVisible: false, // 编辑框
      modalImg: {
        url: '',
        name: ''
      },
      currentComponentIndex: null,
      componentList: [],
      templateList: [
        {
          modularType: 1,
          imgUrl: ModuleImgUrl
        },
        {
          modularType: 2,
          imgUrl: ModuleImgUrl
        },
        {
          modularType: 3,
          imgUrl: ModuleImgUrl
        }
      ],
      urlOptions: [{
        value: '1',
        label: '链接'
      }, {
        value: '2',
        label: '品牌馆链接'
      }, {
        value: '3',
        label: '内购网链接'
      }, {
        value: '9',
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
  created() {
    if (this.specialTopicInfo.id == 'null') return
    this.getSubjectDetail()
  },
  methods: {
    async getSubjectDetail() {
      const res = await SubjectService.subjectDetail({ id: this.specialTopicInfo.id })
      if (res && res.data) {
        let data = res.data
        let list = data.list
        this.componentList = list
        this.specialTopicInfo = {
          bgColor: data.specialTopicInfo.bgColor,
          title: data.specialTopicInfo.title,
          status: data.specialTopicInfo.status === 1 ? '1' : '2',
          endDate: data.specialTopicInfo.endDate
        }
      }
    },
    addTemplate(modularType) {
      // ModuleList需写在添加方法里面；要是写在添加方法外面，后导致，修改模块某个属性，同一类模板数据都改变
      let ModuleList = [
        {
          "modularType": 1,
          "modularSort": '',
          "changeStatus": 1,  // 1新增 2 修改
          "modularId": '',
          "actModularAssemblyList": [{
            "changeStatus": 1,  // 1新增 2 修改
            "imgUrl": ModuleImgUrl,
            "url": 'http://www.baidu.com',
            "type": 9,
            "sort": 1
          }]
        },
        {
          "modularType": 2,
          "modularSort": '',
          "changeStatus": 1,  // 1新增 2 修改
          "modularId": '',
          "actModularAssemblyList": [{
            "changeStatus": 1,
            "imgUrl": ModuleImgUrl,
            "url": 'http://www.baidu.com',
            "type": 9,
            "sort": 1
          },
          {
            "changeStatus": 1,
            "imgUrl": ModuleImgUrl,
            "url": 'http://www.baidu.com',
            "type": 9,
            "sort": 2
          }]
        },
        {
          "modularType": 3,
          "modularSort": '',
          "changeStatus": 1,  // 1新增 2 修改
          "modularId": '',
          "actModularAssemblyList": [{
            "changeStatus": 1,
            "imgUrl": ModuleImgUrl,
            "url": 'http://www.baidu.com',
            "type": 9,
            "sort": 1
          },
          {
            "changeStatus": 1,
            "imgUrl": ModuleImgUrl,
            "url": 'http://www.baidu.com',
            "type": 9,
            "sort": 2
          }, {
            "changeStatus": 1,
            "imgUrl": ModuleImgUrl,
            "url": 'http://www.baidu.com',
            "type": 9,
            "sort": 3
          }]
        }
      ]
      ModuleList.forEach((item) => {
        let componentLength = this.componentList.length
        if (modularType == item.modularType) {
          item.modularSort = componentLength + 1
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
      this.componentSort()
      console.log(this.componentList)
    },
    componentDown(item, index) {
      this.$set(this.componentList, index, this.componentList[index + 1]);
      this.$set(this.componentList, index + 1, item);
      this.componentSort()
      console.log(this.componentList)
    },
    componentDelete(item, index) {
      this.componentList.splice(index, 1);
      this.componentSort()
      console.log(this.componentList)
    },
    componentSort() {
      this.componentList.forEach((item, index) => {
        item.modularSort = index + 1
      })
    },
    openDialogModal(parentIndex, subIndex) {
      this.dialogModalVisible = true
      this.parentIndex = parentIndex
      this.currentIndex = subIndex
    },
    onBlur(val) {
      if (!val) {
        this.$message({
          message: '请输入正确格式的链接地址！',
          type: 'warning'
        });
      }
    },
    beforeImgUpload(file) {
      const isJPG = file.type == 'image/jpeg' || 'image/png';
      const isLt3M = file.size / 1024 / 1024 <= 3;
      if (!isJPG) {
        this.$message.error('上传图片只能是PNG、JPG格式!');
      }
      if (!isLt3M) {
        this.$message.error('上传图片大小不能超过3MB!');
      }
      return isJPG && isLt3M;
    },
    handleImgSuccess(res, file) {
      if (res.data) {
        this.$set(this.modalImg, 'url', res.data[0])
      }
    },
    handleSaveImgInfo() {
      this.dialogModalVisible = false // 关掉弹框
      // 保存上传的图片信息时，父、子组件修改状态为2
      this.componentList[this.parentIndex].changeStatus = 2
      this.$set(this.componentList[this.parentIndex].actModularAssemblyList, this.currentIndex, {
        "changeStatus": 2,
        "name": this.modalImg.name,
        "imgUrl": this.modalImg.url,
        "url": this.linkUrl, // 跳转地址
        "type": this.urlType, // 链接类型
        "sort": this.currentIndex + 1  // 排序
      })
      console.log(this.componentList[this.parentIndex])
    },
    async handleSaveSubject() {
      let specialTopicInfo = { ...this.specialTopicInfo }
      specialTopicInfo.status = Number(specialTopicInfo.status)
      let queryData = {
        "list": [...this.componentList],
        "specialTopicInfo": { ...specialTopicInfo }
      }
      const res = await SubjectService.updateSpecialTopic(queryData)
      console.log(res)
      if (res && res.data) {
        this.$message({
          type: 'success',
          message: '保存成功!'
        });
        this.$router.push('/operationManage/activitySubject')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.page-edit {
  .save-btn {
    position: absolute;
    width: 120px;
    margin-left: 71px;
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
    .no-content {
      padding-top: 100px;
      text-align: center;
      color: #999;
      font-size: 24px;
    }
    .item {
      position: relative;
      .btn-group {
        z-index: 1;
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
      height: 175px;
      margin-bottom: 50px;
      .el-aside {
        line-height: 175px;
        display: flex;
        .img-div {
          flex: 1;
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
      .el-main {
        text-align: center;
        line-height: 135px;
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
    .el-upload-dragger {
      width: 300px;
    }
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