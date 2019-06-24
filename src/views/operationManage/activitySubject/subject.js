import { SubjectService } from '@/service'
export default {
  name: 'ActivitySubject',
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
      total: 0,
      search: {
        pageNum: 1,
        pageSize: 10,
      },
      dialogModalVisible: false,
      specialTopicInfo: {
        status: '1', // 下架状态 1.限时 2.永久
        endDate: '', // 下架时间
        shelfStatus: '', // 上架状态 1.上架 2.下架 不传是全部
      },
      currentRowData: {},
      putOnRules: {
        endDate: [{ required: true, validator: validateEndDate, trigger: 'blur' }],
      },
      shelfOptions: [
        {
          value: '',
          label: '全部',
        },
        {
          value: '1',
          label: '上架',
        },
        {
          value: '2',
          label: '下架',
        },
      ],
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
    async handleCopy(id) {
      let validateTitle = value => {
        if (!value) return '请输入新的专题标题'
        let val = value.trim()
        if (!val) {
          return '请输入新的专题标题'
        } else if (value.length == 0 || value.length > 10) {
          return '输入的标题长度需在 1 到 10 个字符之间'
        }
      }
      const res = await this.$prompt('专题标题', '复制专题', {
        inputPlaceholder: '请输入新的专题标题',
        inputValidator: validateTitle,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入',
        })
      })
      if (res && res.action === 'confirm') {
        const data = await SubjectService.copySubject(id, res.value)
        if (data && data.data) {
          this.$message({
            type: 'success',
            message: '你的专题标题是: ' + res.value,
          })
          this.getSubjectList()
        }
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
        type: 'warning',
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消本次操作！',
        })
      })

      if (res === 'confirm') {
        let data = await SubjectService.deleteSubject(endDate, id, status, 2)
        if (data && data.data) {
          this.$message({
            type: 'success',
            message: '下架架成功!',
          })
          this.getSubjectList()
        } else {
          this.$message({
            type: 'error',
            message: '操作失败!',
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
            message: '上架成功!',
          })
          this.dialogModalVisible = false
          this.getSubjectList()
        }
      })
    },
    handleEdit(id) {
      this.$router.push(`/operationManage/activitySubjectEdit/${id}`)
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
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.refreshSelectedTag(vm.$route)
    })
  },
}
