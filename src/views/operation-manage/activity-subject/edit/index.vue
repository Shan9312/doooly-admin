<template>
  <div class="app-container page-edit">
    <el-form label-width='85px' :model="specialTopicInfo" :rules="specialTopicInfoRules" ref="topicRef">
      <el-row>
        <el-col :span="10">
          <el-form-item label="专题标题" prop="title">
            <el-input v-model="specialTopicInfo.title" minlength="1" maxlength='10' placeholder="请输入专题标题" style="width: 300px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="下架状态" prop="status">
            <el-radio v-model="specialTopicInfo.status" label=1>限时下架</el-radio>
            <el-radio v-model="specialTopicInfo.status" label=2>永久</el-radio>
            <el-button type="primary" class="save-btn" @click="handleSaveSubject">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="背景色" prop="bgColor">
            <el-color-picker v-model="specialTopicInfo.bgColor" size="medium"></el-color-picker>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item prop="endDate" v-show="specialTopicInfo.status === '1'" label="下架时间">
            <el-date-picker v-model="specialTopicInfo.endDate" type="datetime" :editable='false' value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="24">
      <el-col :span="10">
        <div class="grid-left" :style="{backgroundColor: specialTopicInfo.bgColor}">
          <div v-if="componentList.length > 0">
            <div v-for='(item,index) in componentList' :key="index" class="item">
              <component :is='componentName' :config='item' :parentIndex='index' v-on:openDialogModal='openDialogModal'></component>
              <div class="btn-group hover-show">
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
    <el-dialog title="编辑" :visible.sync="dialogModalVisible" :close='dialogCloseBack'>
      <el-form label-width='85px' ref="editImgRef" :model="modalImg" :rules="editImgRules">
        <el-form-item label="图片名称" prop="name">
          <el-input v-model="modalImg.name" placeholder="请输入图片名称" clearable maxlength=10 minlength=1 style="width: 217px;"></el-input>
        </el-form-item>

        <el-form-item prop="url">
          <el-upload class="avatar-uploader" v-loading="loading" :action="actionUrl" drag :show-file-list="false" :before-upload="beforeImgUpload" :on-success="handleImgSuccess" :on-error="handleImgError">
            <img v-if="modalImg.url" :src="modalImg.url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="操作类型" required>
          <el-col :span="10">
            <el-form-item prop="urlType">
              <el-select v-model="modalImg.urlType" placeholder="请选择链接类型" :change='changeOption(modalImg.urlType)'>
                <el-option v-for="item in urlOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="linkUrl" style="width: 300px; margin-left:20px;">
              <el-input v-model="modalImg.linkUrl" placeholder="请输入正确的链接地址" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="modal-save-btn" @click="handleSaveImgInfo">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import edit from './edit'
export default edit
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
        display: none;
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
      &:hover .hover-show {
        display: block;
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

/deep/ .el-form-item__content {
  margin-bottom: 30px;
}

/deep/ .avatar-uploader {
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