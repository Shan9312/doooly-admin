<template>
  <div class="form">
    <el-form
      label-position="left"
      :inline="true"
      :model="search"
      class="demo-form-inline"
    >
      <el-row>
        <el-col :span="11">
          <el-form-item label="同步日期">
            <el-date-picker
              :editable="false"
              v-model="syncDate"
              type="daterange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单编号">
            <el-input
              style="width: 100%"
              v-model="search.orderNumber"
              placeholder="请输入订单编号"
              maxlength="40"
              @keyup.native="onKeyup"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商户名称" prop="businessName">
            <el-input
              style="width: 100%"
              v-model="search.businessName"
              placeholder="请输入商户名称"
              maxlength="15"
              @keyup.native="onKeyup"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item>
            <el-button type="primary" @click="searchOrder">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="下单时间">
            <el-date-picker
              :editable="false"
              v-model="createDate"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="对账状态">
            <el-select
              style="min-width: 190px;"
              v-model="search.statusList"
              placeholder="请选择"
              multiple
            >
              <el-option
                v-for="(item, index) in checkState"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否补单">
            <el-select
              style="width: 120px;"
              v-model="search.dateMark"
              placeholder="请选择"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item>
            <el-button type="primary" @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
