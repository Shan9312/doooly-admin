import { SubjectService } from '@/service'
const titleList = [
  {
    prop: 'id',
    label: '弹窗编号',
    width: '180'
  },
  {
    prop: 'title',
    label: '弹窗名称',
    width: '180'
  },
  {
    prop: 'shelfStatus',
    label: '弹窗状态',
    width: '100'
  },
  {
    prop: 'updateDate',
    label: '创建时间',
    width: '200'
  },
  {
    prop: 'updateDate',
    label: '生效时间',
    width: '200'
  }
]
export default {
  name: 'DialogList',
  data() {
    let validateEndDate = (rule, value, callback) => {
      if (this.specialTopicInfo.status == 1 && !value) {
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
        pageSize: 10
      },
      dialogModalVisible: false,
      specialTopicInfo: {
        status: '1', // 下架状态 1.限时 2.永久
        endDate: '', // 下架时间
        shelfStatus: '' // 上架状态 1.上架 2.下架 不传是全部
      },
      currentRowData: {},
      putOnRules: {
        endDate: [{ required: true, validator: validateEndDate, trigger: 'blur' }]
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
          value: '2',
          label: '下架'
        }
      ]
    }
  },
  created() {
    this.getSubjectList()
  },
  methods: {
    async getSubjectList() {
      let { pageNum, pageSize, shelfStatus } = this.search
      let data = await SubjectService.getSubjectList(pageNum, pageSize, shelfStatus)
      if (data && data.data && data.data.specialTopicList) {
        this.tableData = data.data.specialTopicList
        this.total = data.data.total
      }
    },
    async handleShelf(objectData) {
      if (objectData.shelfStatus == 1) {
        console.log('需要下架')
        this.pullOffShelf(objectData)
      } else if (objectData.shelfStatus == 2) {
        this.resetFields('putOnRef')
        this.dialogModalVisible = true
        this.currentRowData = objectData
      }
    },
    async pullOffShelf(objectData) {
      const { endDate, id, status } = objectData
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
        let data = await SubjectService.deleteSubject(endDate, id, status, 2)
        if (data && data.data) {
          this.$message({
            type: 'success',
            message: '下架架成功!'
          })
          this.getSubjectList()
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
        let data = await SubjectService.deleteSubject(this.specialTopicInfo.endDate, this.currentRowData.id, Number(this.specialTopicInfo.status), 1)
        if (data && data.data) {
          this.$message({
            type: 'success',
            message: '上架成功!'
          })
          this.dialogModalVisible = false
          this.getSubjectList()
        }
      })
    },
    handleEdit(id) {
      this.$router.push(`/operationManage/dialogEdit/${id}`)
    },
    handleSearch() {
      this.search.pageNum = 1 // 如果是点击查询，则页码需要重置，否则可能没数据
      this.getSubjectList()
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
