<template>
  <div class="navbar">
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />
    <breadcrumb />
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img
          :src="userInfo.avatar + '?imageView2/1/w/80/h/80'"
          class="user-avatar"
        />
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            主页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;" @click="editPasword">修改密码</span>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import { encryption } from "@/common/jsencrypt.js";
  import { UserService } from "@/service";
  import Breadcrumb from "./Breadcrumb";
  import Hamburger from "./Hamburger";

  export default {
    computed: {
      ...mapGetters(["sidebar", "userInfo"])
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch("ToggleSideBar");
      },
      editPasword() {
        this.$prompt("请输入新密码", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputType: "password",
          inputPattern: /^(\w){6,20}$/,
          inputErrorMessage: "只能输入6-20个字母、数字、下划线"
        })
          .then(async ({ value }) => {
            let userInfo = sessionStorage.getItem("userInfo");
            let params = {
              id: JSON.parse(userInfo).userId,
              password: encryption(value)
            };
            const data = await UserService.editPassword(params);
            if (data) {
              this.$message({
                type: "success",
                message: "密码修改成功！"
              });
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消修改"
            });
          });
      },
      logout() {
        this.$store.dispatch("Logout").then(() => {
          location.reload();
        });
      }
    },
    components: {
      Breadcrumb,
      Hamburger
    }
  };
</script>

<style lang="less" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }

    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }

    .avatar-container {
      height: 50px;
      display: inline-block;
      position: absolute;
      right: 35px;

      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        line-height: initial;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
</style>