<template>
  <div class="app-container page-edit">
    <el-form label-width='85px' :model="modalData" :rules="editRules" ref="dialogRef">
      <el-row>
        <el-col :span="10">
          <el-form-item label="弹窗名称" prop="name">
            <el-input v-model="modalData.name" minlength="1" maxlength='10' placeholder="请输入弹窗名称" style="width: 220px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <pe-button label="保存" type="primary" class="save-btn" perms="operation:dialogEdit:save" @click="handleSaveSubject" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item prop="startDate" label="生效时间">
            <el-date-picker v-model="modalData.startDate" type="datetime" :editable='false' value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="endDate" label="失效时间">
            <el-date-picker v-model="modalData.endDate" type="datetime" :editable='false' value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="dialog-con">
        <el-col :span="10" min-width="50%">
          <p class="text">弹窗图片设置（图片600*600 支持PNG JPG）</p>
          <el-form-item class="dialog-img" prop="imageUrl">
            <el-upload class="avatar-uploader" v-loading="loading" :action="actionUrl" :headers="headers" drag :show-file-list="false" :before-upload="beforeImgUpload" :on-success="handleImgSuccess" :on-error="handleImgError">
              <img v-if="modalData.imageUrl" :src="modalData.imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="跳转地址">
            <el-col :span="12">
              <el-form-item prop="formUrl" style="width: 300px;">
                <el-input v-model="modalData.formUrl" placeholder="请输入正确的链接地址" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <!-- 目前后端返回弹窗列表没做过滤，暂时隐藏掉企业勾选功能 to do list -->
        <el-col :span="12" min-width="50%">
          <el-form-item label="弹窗用户" prop="status">
            <el-radio v-model="modalData.type" label=1>全部用户</el-radio>
            <el-radio v-model="modalData.type" label=2>企业</el-radio>
            <el-radio v-model="modalData.type" label=3>指定用户</el-radio>
          </el-form-item>

          <el-form-item label="参与企业" required v-if="modalData.type == 2">
            <el-transfer filterable :titles="['未选择企业', '已选择企业']" v-model="modalData.groups" :data="companyAllData"></el-transfer>
          </el-form-item>
          <el-form-item v-if="modalData.type == 3">
            <el-row>
              <el-col :span="12">
                <!-- <pe-button label="下载导入模板" type="primary" perms="operation:dialogEdit:download" icon="el-icon-download" @click="handleDownload" /> -->
                <el-button @click="handleDownload">下载导入模板</el-button>
              </el-col>
              <el-col :span="12">
                <!-- <kt-button label="导入数据" type="primary" perms="operation:dialogEdit:upload" icon="el-icon-upload" @click="handleUpload" /> -->
                <el-upload action='' :auto-upload='false' :on-change='changeUploadExcel'>
                  <el-button>导入数据</el-button>
                </el-upload>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>

<script>
import dialogEdit from './dialogEdit'
export default dialogEdit
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
