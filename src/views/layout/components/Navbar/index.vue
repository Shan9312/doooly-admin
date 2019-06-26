<template>
  <div class="navbar">
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />
    <breadcrumb />
    <div class="right-menu">
      <div class="user-name">您好，{{userInfo.name}}</div>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img
            src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
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
      ...mapGetters(["sidebar"]),
      userInfo() {
        const userInfo = sessionStorage.getItem("userInfo");
        return JSON.parse(userInfo);
      }
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
    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;
      display: flex;

      &:focus {
        outline: none;
      }
      .user-name{
        padding-right: 20px;
        color: #666;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: rgba(0, 0, 0, 0.025);
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>