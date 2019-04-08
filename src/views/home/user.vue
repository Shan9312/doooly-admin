<template>
  <div class="user app-container">
    <div class="user-form">
      <el-form
        label-position="left"
        :inline="true"
        :model="search"
        class="demo-form-inline"
      >
        <el-row>
          <el-col :span="11" :offset="1">
            <el-form-item label="自定义日期查询">
              <el-date-picker
                :editable="false"
                v-model="search.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" @click="searchUser">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="user-table">
      <el-row>
        <el-col :span="23" :offset="1">
          <el-button
            v-for="(item, index) in tabs"
            class="filter-item"
            type="primary"
            @click="handleClick(item.value)"
            >{{ item.label }}</el-button
          >
        </el-col>
      </el-row>
      <el-table
        :data="list"
        ref="multipleTable"
        v-loading="listLoading"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item, index) in title"
          :min-width="item.width"
          align="center"
          :prop="item.value"
          :label="item.label"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import { HomeService } from "@/service";
  import { Utils } from "@/common";
  const title = [
    // 表格title
    { label: "当前用户总数", value: "currentUser", width: "80px" },
    { label: "当前激活用户数", value: "currentActivate", width: "180px" },
    { label: "当期新增用户数", value: "currentPerAdd", width: "160px" },
    { label: "当期激活用户数", value: "currentPerAct", width: "100px" },
    { label: "当期新增并激活用户数", value: "currentPerActAdd", width: "100px" }
  ];

  // 快捷查询按钮
  const tabs = [
    { label: "1月", value: 1 },
    { label: "2月", value: 2 },
    { label: "3月", value: 3 },
    { label: "4月", value: 4 },
    { label: "5月", value: 5 },
    { label: "6月", value: 6 },
    { label: "7月", value: 7 },
    { label: "8月", value: 8 },
    { label: "9月", value: 9 },
    { label: "10月", value: 10 },
    { label: "11月", value: 11 },
    { label: "12月", value: 12 }
  ];
  export default {
    name: "User",
    data() {
      return {
        search: {
          // 列表筛选
          date: "" // 搜索日期
        },
        listLoading: false,
        title,
        list: [],
        tabs
      };
    },
    created() {
      // this.getUsers();
    },
    methods: {
      // 获取列表数据
      async getUsers() {
        this.listLoading = true;
        const data = await HomeService.getUsers(this.search);
        this.listLoading = false;
        if (
          data.data01 &&
          data.data02 &&
          data.data04 &&
          data.data05 &&
          data.data06
        ) {
          this.list = [
            ...this.list,
            {
              currentUser: data.data01["infoData"],
              currentActivate: data.data02["infoData"],
              currentPerAdd: data.data04['infoData'],
              currentPerAct: data.data05['infoData'],
              currentPerActAdd: data.data06['infoData']
            }
          ];
        }
      },
      // 搜索订单
      searchUser() {
        const { date } = this.search;
        if (date) {
          // 判断有没有选择下单时间，有的话格式化时间并添加到search对象下
          Object.assign(this.search, {
            startDate: date[0].toLocaleDateString(),
            endDate: date[1].toLocaleDateString()
          });
        }
        // console.log(date[0].toLocaleDateString())
        this.getUsers();
      },

      // 快捷搜索
      handleClick(value) {
        console.log(value)
        switch (value) {
          case "1":
            
            break;
        
          default:
            break;
        }
      }
    }
  };
</script>

<style lang="less">
</style>
