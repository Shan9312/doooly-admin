<template>
  <el-dialog
    title="编辑"
    :visible.sync="dialogModalVisible"
    :before-close="dialogCloseBack"
  >
  <!-- <div id="ossfile">你的浏览器不支持flash,Silverlight或者HTML5！</div> -->
    <!-- <div id="container">
      <a id="selectfiles" href="javascript:void(0);" class="btn">选择文件</a>
      <a id="postfiles" href="javascript:void(0);" class="btn">开始上传</a>
    </div> -->
    <el-form
      label-width="85px"
      ref="editImgRef"
      :model="formData"
      :rules="editImgRules"
    >
      <el-form-item label="图片名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入图片名称"
          clearable
          maxlength="10"
          minlength="1"
          style="width: 217px;"
        ></el-input>
      </el-form-item>

      <el-form-item prop="url" v-if="!formData.type">
        <el-upload
          class="avatar-uploader"
          v-loading="loading"
          :action="actionUrl"
          :headers="headers"
          drag
          :show-file-list="false"
          :before-upload="beforeImgUpload3M"
          :on-success="handleImgSuccess"
          :on-error="handleImgError"
        >
          <img v-if="formData.url" :src="formData.url" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item prop="url" v-if="formData.type">
        <el-upload
          id="selectfiles"
          class="avatar-uploader"
          v-loading="loading"
          :action="actionUrl"
          :headers="headers"
          drag
          :show-file-list="false"
          :before-upload="beforeImgUpload100K"
          :on-success="handleImgSuccess"
          :on-error="handleImgError"
        >
          <img v-if="formData.url" :src="formData.url" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item v-if="formData.type" label="图片尺寸" prop="imageSizeType">
        <el-select
          v-model="formData.imageSizeType"
          placeholder="请选择图片尺寸"
        >
          <el-option label="大" :value="1"> </el-option>
          <el-option label="小" :value="2"> </el-option>
        </el-select>
        <span> 大尺寸：150*180 小尺寸 80*80</span>
      </el-form-item>

      <el-form-item v-if="formData.type" label="向下留空" prop="marginBottom">
        <el-input
          v-model="formData.marginBottom"
          placeholder="请输入内容"
          clearable
          maxlength="10"
          minlength="1"
          style="width: 217px;"
        ></el-input>
      </el-form-item>

      <el-form-item v-if="formData.type" label="向右留空" prop="marginRight">
        <el-input
          v-model="formData.marginRight"
          placeholder="请输入内容"
          clearable
          maxlength="10"
          minlength="1"
          style="width: 217px;"
        ></el-input>
      </el-form-item>

      <el-form-item label="操作类型" required>
        <el-col :span="10">
          <el-form-item prop="urlType">
            <el-select
              v-model="formData.urlType"
              placeholder="请选择链接类型"
              :change="changeOption(formData.urlType)"
            >
              <el-option
                v-for="item in urlOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="linkUrl" style="width: 300px; margin-left:20px;">
            <el-input
              v-model="formData.linkUrl"
              placeholder="请输入正确的链接地址"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" class="modal-save-btn" @click="handleSave"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
  import axios from 'axios'
  import { Validate, Auth } from "@/common";
  import { DialogService } from "@/service";
  import { async } from 'q';
  export default {
    name: "ImgEdit",
    props: {
      dialogModalVisible: {
        required: true,
        type: Boolean
      },
      urlOptions: {
        required: true,
        type: Array
      },
      formData: {
        required: true,
        type: Object
      }
    },
    model: {
      prop: "formData"
    },
    data() {
      const token = Auth.getToken();
      let validateTitle = (rule, value, callback) => {
        if (!value) {
          callback(new Error("请输入专题标题"));
        } else {
          callback();
        }
      };
      let validateLinkUrl = (rule, value, callback) => {
        if (this.formData.urlType !== 9 && !Validate.isUrl(value)) {
          callback(new Error("请输入正确的链接地址"));
        } else {
          callback();
        }
      };
      return {
        headers: { Authorization: token },
        actionUrl: process.env.VUE_APP_URL + "fileUpload",
        loading: false,
        editImgRules: {
          name: [
            {
              required: true,
              validator: validateTitle,
              message: "请输入图片名称",
              trigger: "blur"
            }
          ],
          url: [{ required: true, message: "请选择图片", trigger: "change" }],
          imageSizeType: [
            { required: true, message: "请选择图片尺寸", trigger: "change" }
          ],
          marginBottom: [
            { required: true, message: "请输入内容", trigger: "blur" }
          ],
          marginRight: [
            { required: true, message: "请输入内容", trigger: "blur" }
          ],
          urlType: [
            { required: true, message: "请选择链接类型", trigger: "change" }
          ],
          linkUrl: [{ validator: validateLinkUrl, trigger: "blur" }]
        }
      };
    },

    created() {
    },
    mounted(){
    },
    methods: {
      // 获取oss的参数
      async getOssMsg(file) {
        const res = await DialogService.getUploadMsg();
        if (res.code == 200) {
          this.postOssImg(res.data,file)
        } else{
         this.$message.error("服务有误，无法上传图片");
        }
      },
      // 参数
      getFormData(obj = {}, file) {
        const fd = new FormData();
        const { policy, accessKeyId, signature, expire, callback, dir } = obj;
        let content_len = Math.round((file.size * 100) / 1024) / 100;
        fd.append("name", file.name);
        fd.append("Content-Length", content_len);
        fd.append("key", `${dir}${file.name}`);
        fd.append("policy", policy);
        fd.append("OSSAccessKeyId", accessKeyId);
        fd.append("callback", callback);
        fd.append("Signature", signature);
        fd.append("success_action_status", 200);
        fd.append("expire", parseInt(expire));
        fd.append("file", file);
        return fd;
      },
      // 发送到oss 
      postOssImg(obj,file){
        const formData = this.getFormData(obj, file);
        axios
        .post(`http://${obj.host}`, formData, {
          headers: {
            "content-type": "multipart/form-data"
          }
        }).then(res =>{
          if (res.data.code == 200) {
           this.$set(this.formData, "url", res.data.data.filename);
           this.loading = false;
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      dialogCloseBack() {
        this.$emit("click", {});
        this.$refs["editImgRef"].clearValidate();
      },
      beforeImgUpload3M(file) {
        const isJPG = file.type == "image/jpeg" || file.type == "image/png";
        const isLt3M = file.size / 1024 / 1024 <= 3;
        this.loading = true;
        if (!isJPG) {
          this.loading = false;
          this.$message.error("上传图片只能是PNG、JPG格式!");
        }
        if (!isLt3M) {
          this.loading = false;
          this.$message.error("上传图片大小不能超过3MB!");
        }
        return isJPG && isLt3M;
      },
      beforeImgUpload100K(file) {
        const isJPG = file.type == "image/jpeg" || file.type == "image/png";
        const isLt100K = file.size / 1024 <= 100;
        this.loading = true;
        if (!isJPG) {
          this.loading = false;
          this.$message.error("上传图片只能是PNG、JPG格式!");
        }
        if (!isLt100K) {
          this.loading = false;
          this.$message.error("上传图片大小不能超过100k!");
        }
        return isJPG && isLt100K;
      },
      handleImgSuccess(res, file) {
        this.getOssMsg(file.raw);
      },
      handleImgError(err, file) {
        this.loading = false;
        this.$message.error("上传图片失败，请重新上传！");
      },
      changeOption(urlType) {
        if (urlType == 9) {
          this.formData.linkUrl = "";
        }
      },
      handleSave() {
        this.$refs["editImgRef"].validate(valid => {
          if (!valid) return false;
          this.$emit("handleSave", {});
          if (!this.formData.type) {
            this.$refs["editImgRef"].clearValidate(); // 保存成功后清除表单内容
          }
        });
      }
    }
  };
</script>
<style lang="less">
</style>
