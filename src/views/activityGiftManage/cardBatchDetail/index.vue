<template>
  <div class="app-container card-warrp">
    <div class="title-top">礼包批次号:{{this.$route.params.id}}</div>
    <!-- 模糊查询暂无 -->
    <section class="form-box">
      <el-form ref="formObj" :model="formObj" :inline="true" key="form1">
        <el-row :span="24">
          <el-col :span="6">
            <el-form-item label="礼包">
              <el-select v-model="formObj.giftName">
                <el-option
                  v-for="(item, index) in giftList"
                  :label="item.name"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="卡类型">
              <el-select v-model="formObj.type">
                <el-option
                  v-for="(item, index) in cardTypeList"
                  :label="item.name"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="卡状态">
              <el-select v-model="formObj.status">
                <el-option
                  v-for="(item, index) in cardStatusList"
                  :label="item.name"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="卡号">
              <el-input
                style="width: 100%"
                v-model="formObj.cardNo"
                placeholder="请输入卡号"
                maxlength="40"
                clearable
                @keyup.native="onKeyup"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24">
          <el-col :span="6">
            <pe-button label="查询" perms="recycle:order:search" type="primary" @click="getList" />
          </el-col>
          <el-col :span="6">
            <pe-button label="重置" perms="recycle:order:search" type="primary" @click="handleClear" />
          </el-col>
        </el-row>
      </el-form>
    </section>
    <!-- 列表 -->
    <section class="table-box">
      <div>
        <el-table border :data="list" v-loading="listLoading" style="width: 100%">
          <el-table-column
            v-for="(item, index) in title"
            :key="index"
            :min-width="item.width"
            align="center"
            :prop="item.value"
            :label="item.label"
          >
            <template slot-scope="scope">
              <div>
                <!-- 类型 -->
                <span
                  v-if="item.value == 'type'"
                  :class="{'red_text': scope.row['type'] == '0'}"
                >{{scope.row['type'] == '0' ? '测试卡':'正常卡'}}</span>
                <!-- 操纵按钮 -->
                <span v-if="item.value == 'operat'">
                  <el-button
                    @click="handleTestCard(scope.row)"
                    type="text"
                  >{{ scope.row['type'] == '0'? '设置正常卡':"设置测试卡"}}</el-button>
                  <!-- 设置冻结/正常 -->
                  <el-button
                    v-if=" scope.row['state'] == '0'"
                    type="text"
                    @click="handleStateCard(scope.row)"
                  >设置冻结</el-button>
                  <el-button type="text" v-else @click="handleStateCard(scope.row)">设置正常</el-button>
                </span>
                <!-- 状态 -->
                <span v-if="item.value == 'status'">
                  <CardState :cardState="scope.row['status']" />
                </span>

                <!-- 其他值 -->
                <span
                  v-if="item.value !='type' && 
                item.value != 'operat' && item.value != 'status'"
                >{{scope.row[item.value]}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-row :span="24">
          <el-col :span="18">
            <pagination
              v-show="total > 0"
              :total="total"
              :page-sizes="[5,10,15,20,25,30]"
              :page.sync="formObj.pageNum"
              :limit.sync="formObj.pageSize"
              @pagination="getList"
            />
          </el-col>
          <el-col :span="6" style="margin-top:32px;">
            <router-link to="/activityGiftManage/cardBatchList">
              <pe-button label="返回" perms="recycle:order:search" type="primary" />
            </router-link>
          </el-col>
        </el-row>
      </div>
    </section>
  </div>
</template>

<script>
import { CardBatchManageService } from "@/service";
import CardState from "../components/CardState.vue";
import { Auth, Validate } from "@/common";
import { async } from "q";

// 礼包
const giftList = [
  { name: "所有礼包", value: "" }
  // { name: "大华礼包", value: "1" },
  // { name: "夏日礼包", value: "2" }
];

// 卡类型
const cardTypeList = [
  { name: "所有类型", value: "" },
  { name: "测试卡", value: "0" },
  { name: "正常卡", value: "1" }
];

// 卡状态
const cardStatusList = [
  { name: "所有状态", value: "" },
  { name: "已创建", value: "0" },
  { name: "已分配", value: "10" },
  { name: "已激活", value: "20" },
  { name: "已下单", value: "30" },
  { name: "已发货", value: "40" },
  { name: "已冻结", value: "50" }
];

// 表格title
const title = [
  { label: "礼包卡号", value: "cardNo" },
  // { label: "礼包卡密码", value: "orderId" },
  { label: "类型", value: "type" },
  { label: "礼包名称", value: "name", width: "120" },
  { label: "分配时间", value: "allocatedTime" },
  { label: "分配人", value: "allocatedBy" },
  { label: "状态", value: "status" },
  { label: "操作", value: "operat" }
];

export default {
  name: "cardBatchList",
  components: { CardState },
  data() {
    return {
      orderTimes: [],
      list: [], // 表格数据列表
      listLoading: false, // 表格数据加载的loading
      loading: false,
      title, // 表头
      total: 0,
      formObj: {
        giftName: "",
        type: "",
        status: "", // 订单号
        cardNo: "",
        pageNum: 1, // 分页
        pageSize: 10, // 每页显示条数
        batchId: this.$route.params.id
      },
      pickerOptions: {
        // 设置日期范围
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      giftList,
      cardTypeList,
      cardStatusList,
      rules: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 重置
    handleClear() {
      this.formObj = {
        giftName: "",
        type: "",
        status: "", // 订单号
        cardNo: "",
        pageNum: 1, // 分页
        pageSize: 10, // 每页显示条数
        batchId: this.$route.params.id
      };
      this.getList();
    },

    // 初始化列表,获取数据展示表格
    async getList() {
      this.listLoading = true;
      const { data } = await CardBatchManageService.getCardDetail(this.formObj);
      this.listLoading = false;
      if (data) {
        this.list = data.list;
        this.total = data.total;
      }
    },

    // 设置为测试卡
    async handleTestCard(obj) {
      const formObj = {
        id: obj.id,
        user: JSON.parse(Auth.getUserInfo()).email,
        type: obj.type == 1 ? 0 : 1
      };
      const data = await CardBatchManageService.handleTestCard(formObj);
      if (data.code == 200) {
        this.$message({
          type: "success",
          message: "设置成功"
        });
        this.getList();
      }
    },

    // 设置为正常/冻结
    async handleStateCard(obj) {
      const formObj = {
        id: obj.id,
        user: JSON.parse(Auth.getUserInfo()).email,
        type: obj.state == 1 ? 0 : 1
      };
      const data = await CardBatchManageService.handleStateCard(formObj);
      if (data.code == 200) {
        this.$message({
          type: "success",
          message: "设置成功"
        });
        this.getList();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.card-warrp {
  .red_text {
    color: red;
  }
  .newBtn {
    margin-bottom: 20px;
  }
  .title-top {
    padding: 5px 0 10px 0;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
  }
  .table-box {
    margin-top: 20px;
  }
}
</style>