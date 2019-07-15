<template>
  <div class="app-container page-edit">
    <el-form
      label-width="85px"
      :model="specialTopicInfo"
      :rules="specialTopicInfoRules"
      ref="topicRef"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="专题标题" prop="title">
            <el-input
              v-model="specialTopicInfo.title"
              minlength="1"
              maxlength="10"
              placeholder="请输入专题标题"
              style="width: 300px;"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <div class="floating-layer">
            <el-checkbox v-model="specialTopicInfo.hasFloatLayer"
              >是否需要浮层</el-checkbox
            >
            <div
              v-show="specialTopicInfo.hasFloatLayer"
              class="floating-layer-img"
            >
              <img
                :src="
                  actSpecialFloatLayer.image
                    ? actSpecialFloatLayer.image
                    : require('@/assets/image/operation/bg.png')
                "
                alt=""
                @click="handlFloating"
              />
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下架状态" prop="status">
            <el-radio v-model="specialTopicInfo.status" label="1"
              >限时下架</el-radio
            >
            <el-radio v-model="specialTopicInfo.status" label="2"
              >永久</el-radio
            >
            <pe-button
              label="保存"
              type="primary"
              class="save-btn"
              perms="operation:ActivitySubjectEdit:save"
              @click="handleSaveSubject"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="背景色" prop="bgColor">
            <el-color-picker
              v-model="specialTopicInfo.bgColor"
              size="medium"
            ></el-color-picker>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item
            prop="endDate"
            v-show="specialTopicInfo.status === '1'"
            label="下架时间"
          >
            <el-date-picker
              v-model="specialTopicInfo.endDate"
              type="datetime"
              :editable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="24">
      <el-col :span="10">
        <div
          class="grid-left"
          :style="{ backgroundColor: specialTopicInfo.bgColor }"
        >
          <div v-if="componentList.length > 0">
            <div
              v-for="(item, index) in componentList"
              :key="index"
              class="item"
            >
              <component
                :is="componentName"
                :config="item"
                :parentIndex="index"
                v-on:openDialogModal="openDialogModal"
              ></component>
              <div class="btn-group hover-show">
                <el-row>
                  <el-col :span="8">
                    <el-button
                      type="primary"
                      size="mini"
                      :disabled="index === 0"
                      @click="componentUp(item, index)"
                      >上移</el-button
                    >
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-button
                      type="primary"
                      size="mini"
                      :disabled="index === componentList.length - 1"
                      @click="componentDown(item, index)"
                      >下移</el-button
                    >
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="componentDelete(item, index)"
                      >删除</el-button
                    >
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div v-else class="no-content">
            <p class="text">请将右边的组件添加到这里</p>
            <p class="des">（单机添加按钮或者双击模板图片）</p>
          </div>
          <div          
            v-if="specialTopicInfo.hasFloatLayer"
            class="float-img"
            :style="{
              'bottom': actSpecialFloatLayer.marginBottom + 'px',
              'right': actSpecialFloatLayer.marginRight + 'px'
            }"
          >
            <img
              :src="
                actSpecialFloatLayer.image
                  ? actSpecialFloatLayer.image
                  : require('@/assets/image/operation/bg.png')
              "
              alt=""
            />
          </div>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="grid-right">
          <el-container v-for="(item, index) in templateList" :key="index">
            <el-aside
              width="300px"
              height="175px"
              class="img-side"
              @dblclick.native="addTemplate(item.modularType)"
            >
              <div
                class="img-div"
                v-for="(subItem, subIndex) in item.modularType"
                :key="subIndex"
              >
                <img :src="item.imgUrl" alt="" />
              </div>
            </el-aside>
            <el-main>
              <pe-button
                label="添加"
                type="primary"
                class="btn"
                perms="operation:ActivitySubjectEdit:add"
                @click="addTemplate(item.modularType)"
              />
            </el-main>
          </el-container>
        </div>
      </el-col>
    </el-row>
    <img-edit
      :dialogModalVisible="dialogModalVisible1"
      @click="dialogCloseBack"
      @handleSave="handleSaveImgInfo"
      :urlOptions="urlOptions"
      v-model="modalImg"
    ></img-edit>
    <img-edit
      :dialogModalVisible="dialogModalVisible2"
      @click="dialogCloseBack"
      @handleSave="handleSaveFloat"
      :urlOptions="urlOptions"
      v-model="floatData"
    ></img-edit>
  </div>
</template>

<script>
  import edit from "./edit";
  export default edit;
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
    .floating-layer {
      text-align: center;
      margin-top: 10px;
      .floating-layer-img {
        margin: 10px auto;
        width: 100px;
        img {
          width: 100%;
          cursor: pointer;
        }
      }
    }

    .grid-left {
      box-sizing: content-box;
      width: 375px;
      height: 667px;
      overflow-y: auto;
      border: 1px solid #000;
      position: relative;
      .float-img {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 120px;
        img {
          width: 100%;
        }
      }
      &::-webkit-scrollbar {
        display: none;
      }

      .no-content {
        padding-top: 100px;
        text-align: center;
        color: #999;
        font-size: 24px;
        .des {
          font-size: 18px;
        }
      }

      .item {
        position: relative;

        .btn-group {
          z-index: 1;
          display: none;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translate(0, -50%);

          .el-row {
            margin: 8px 0;

            .el-button {
              width: 50px;
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
      .img-side {
        cursor: pointer;
      }
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