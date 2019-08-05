<template>
  <div class="app-container page-edit">
    <el-form label-width="100px" :model="params" :rules="editRules" ref="dialogRef">
      <el-row>
        <el-col :span="10">
          <el-form-item label="活动编码" prop="dictKey">
            <el-input
              :disabled="this.id !== 'null'"
              v-model="params.dictKey"
              minlength="1"
              maxlength="10"
              placeholder="纯英文或英文+数字"
              style="width: 220px;"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <pe-button
            label="保存"
            type="primary"
            class="save-btn"
            perms="operationManage:wechatQrcode:pass"
            @click="save"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" min-width="50%">
          <el-form-item label="二维码类型" prop="codeType">
            <el-radio :disabled="this.id !== 'null'" v-model="params.codeType" label="1">限时</el-radio>
            <el-radio :disabled="this.id !== 'null'" v-model="params.codeType" label="2">永久</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="主标题" prop="title">
            <el-input
              v-model="params.title"
              minlength="1"
              maxlength="50"
              placeholder="请输入主标题"
              style="width: 220px;"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="副标题" prop="subTitle">
            <el-input
              v-model="params.subTitle"
              minlength="1"
              maxlength="50"
              placeholder="请输入副标题"
              style="width: 220px;"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="dialog-con">
        <el-col :span="10" min-width="50%">
          <!-- <p class="text">图片设置（图片600*600 支持PNG JPG）</p> -->
          <el-form-item class="dialog-img" label="图片设置" prop="image">
            <!-- <br> -->
            <el-upload
              :disabled="this.id !== 'null'"
              class="avatar-uploader"
              v-loading="loading"
              :action="actionUrl"
              :headers="headers"
              drag
              :show-file-list="false"
              :before-upload="beforeImgUpload"
              :on-success="handleImgSuccess"
              :on-error="handleImgError"
            >
              <img v-if="params.image" :src="params.image" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="跳转地址" prop="url" style="width: 300px;">
            <el-input v-model="params.url" placeholder="请输入正确的链接地址" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import wechatQrcodeEdit from "./wechatQrcodeEdit";
export default wechatQrcodeEdit;
</script>

<style lang="less" scoped>
.page-edit {
  .save-btn {
    position: absolute;
    width: 120px;
    margin-left: 184px;
  }

  .modal-save-btn {
    display: block;
    margin: 30px auto;
    width: 120px;
  }
  .dialog-con {
    font-size: 14px;
    font-weight: 500;
    color: #606266;
    .text {
      text-indent: 17px;
      padding: 0;
      margin: 10px 0;
    }
    .dialog-img {
      width: 300px;
    }
  }
}
// /deep/ .el-form-item {
//   margin-bottom: 5px;
// }

/deep/ .dialog-img .el-form-item__content {
  margin: 20px 102px;
}

/deep/ .avatar-uploader {
  width: 300px;
  height: 300px;
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;

    .el-upload-dragger {
      width: 300px;
      height: 300px;
    }

    .el-upload:hover {
      border-color: #409eff;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 300px;
      height: 300px;
      line-height: 300px;
      text-align: center;
    }

    .avatar {
      width: 300px;
      height: 300px;
      display: block;
    }
  }
}
</style>
