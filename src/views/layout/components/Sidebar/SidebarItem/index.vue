<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <menu-item :meta="Object.assign({},item.meta,onlyOneChild.meta)"></menu-item>
        </el-menu-item>
      </app-link>
    </template>
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)">
      <template slot="title">
        <menu-item :meta="item.meta"></menu-item>
      </template>
      <sidebar-item v-for="child in item.children" :is-nest="true" :item="child" :key="child.path" :base-path="resolvePath(child.path)" class="nest-menu" />
    </el-submenu>
  </div>
</template>

<script>
  import path from 'path'
  import { Validate } from '@/common'
  import AppLink from './AppLink'
  import MenuItem from './MenuItem'

  export default {
    name: 'SidebarItem',
    props: {
      item: {
        type: Object,
        required: true
      },
      isNest: {
        type: Boolean,
        default: false
      },
      basePath: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        onlyOneChild: null
      }
    },
    methods: {
      hasOneShowingChild(children = [], parent) {
        const showingChildren = children.filter(item => {
          if (item.hidden) {
            return false
          } else {
            // Temp set(will be used if only has one showing child)
            this.onlyOneChild = item
            return true
          }
        })

        // 当只有一个子路由时，默认下显示子路由
        if (showingChildren.length === 1) {
          return true
        }

        // 如果没有要显示的子路由，则显示父路由
        if (showingChildren.length === 0) {
          this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
          return true
        }

        return false
      },
      resolvePath(routePath) {
        if (Validate.isExternal(routePath)) {
          return routePath
        }
        return path.resolve(this.basePath, routePath)
      }
    },
    components: { MenuItem, AppLink }
  }
</script>