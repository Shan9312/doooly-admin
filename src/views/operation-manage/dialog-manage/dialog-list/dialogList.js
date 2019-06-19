import { DialogService } from '@/service'
const titleList = [
  {
    prop: 'id',
    label: '弹窗编号',
    width: '180'
  },
  {
    prop: 'name',
    label: '弹窗名称',
    width: '180'
  },
  {
    prop: 'onShelf',
    label: '弹窗状态',
    width: '100'
  },
  {
    prop: 'createDate',
    label: '创建时间',
    width: '200'
  },
  {
    prop: 'startDate',
    label: '生效时间',
    width: '200'
  },
  {
    prop: 'endDate',
    label: '失效时间',
    width: '200'
  }
]
export default {
  name: 'DialogList',
  data() {
    let validateDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择时间'))
      } else {
        callback()
      }
    }
    return {
      tableData: [],
      titleList,
      total: 0,
      search: {
        pageNum: 1,
        pageSize: 10,
        onShelf: '' // 上架状态 0下架 1上架 不传是全部
      },
      dialogModalVisible: false,
      dialogInfo: {
        endDate: '', // 下架时间
        startDate: '' // 上架时间
      },
      currentRowData: {},
      putOnRules: {
        startDate: [{ required: true, validator: validateDate, trigger: 'blur' }],
        endDate: [{ required: true, validator: validateDate, trigger: 'blur' }]
      },
      shelfOptions: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '上架'
        },
        {
          value: '0',
          label: '下架'
        }
      ]
    }
  },
  created() {
    this.getHomePageList()
  },
  methods: {
    async getHomePageList() {
      let { pageNum, pageSize, onShelf } = this.search
      let data = await DialogService.getHomePageList(pageNum, pageSize, onShelf)
      if (data && data.data && data.data.list) {
        this.tableData = data.data.list
        this.total = data.data.total
      }
    },
    async handleShelf(objectData) {
      if (objectData.onShelf) {
        console.log('需要下架')
        this.pullOffShelf(objectData)
      } else {
        this.resetFields('putOnRef')
        this.dialogModalVisible = true
        this.currentRowData = objectData
      }
    },
    async pullOffShelf(objectData) {
      const { id, onShelf } = objectData
      let res = await this.$confirm('确认下架专题, 是否继续?', '下架专题页', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消本次操作！'
        })
      })

      if (res === 'confirm') {
        let data = await DialogService.updateHomePage({ id, onShelf: !onShelf })
        if (data && data.code == 200) {
          this.$message({
            type: 'success',
            message: '下架成功!'
          })
          this.getHomePageList()
        } else {
          this.$message({
            type: 'error',
            message: '操作失败!'
          })
        }
      }
    },
    async putOnShelf() {
      this.$refs['putOnRef'].validate(async valid => {
        if (!valid) return
        let { startDate, endDate } = this.dialogInfo
        let { id, onShelf } = this.currentRowData
        let data = await DialogService.updateHomePage({ id, onShelf: !onShelf, startDate, endDate })
        if (data && data.code == 200) {
          this.$message({
            type: 'success',
            message: '上架成功!'
          })
          this.dialogModalVisible = false
          this.getHomePageList()
        }
      })
    },
    handleEdit(id) {
      this.$router.push(`/operationManage/dialogEdit/${id}`)
    },
    handleSearch() {
      this.search.pageNum = 1 // 如果是点击查询，则页码需要重置，否则可能没数据
      this.getHomePageList()
    },
    resetFields(formName) {
      if (!this.$refs[formName]) return
      this.$refs[formName].resetFields()
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('delCachedView', view)
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.refreshSelectedTag(vm.$route)
    })
  }
}
