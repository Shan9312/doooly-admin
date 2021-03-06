import ImgModule from '../components/ImgModule.vue'
import ImgEdit from '../components/ImgEdit.vue'
import { SubjectService } from '@/service'
import { Validate, Auth } from '@/common'
const ModuleImgUrl = require('@/assets/image/operation/bg.png')
// changeStatus 默认状态是1，为新增。addStatus表示本地新增的模板，为后面保存图片信息时所用
const ModuleList = [
  {
    modularType: 1,
    modularSort: '',
    changeStatus: 1, // 1新增 2 修改
    addStatus: true,
    modularId: '',
    actModularAssemblyList: [
      {
        changeStatus: 1, // 1新增 2 修改
        imgUrl: ModuleImgUrl,
        url: 'http://www.baidu.com',
        type: 9,
        sort: 1
      }
    ]
  },
  {
    modularType: 2,
    modularSort: '',
    changeStatus: 1, // 1新增 2 修改
    addStatus: true,
    modularId: '',
    actModularAssemblyList: [
      {
        changeStatus: 1,
        imgUrl: ModuleImgUrl,
        url: 'http://www.baidu.com',
        type: 9,
        sort: 1
      },
      {
        changeStatus: 1,
        imgUrl: ModuleImgUrl,
        url: 'http://www.baidu.com',
        type: 9,
        sort: 2
      }
    ]
  },
  {
    modularType: 3,
    modularSort: '',
    changeStatus: 1, // 1新增 2 修改
    addStatus: true,
    modularId: '',
    actModularAssemblyList: [
      {
        changeStatus: 1,
        imgUrl: ModuleImgUrl,
        url: 'http://www.baidu.com',
        type: 9,
        sort: 1
      },
      {
        changeStatus: 1,
        imgUrl: ModuleImgUrl,
        url: 'http://www.baidu.com',
        type: 9,
        sort: 2
      },
      {
        changeStatus: 1,
        imgUrl: ModuleImgUrl,
        url: 'http://www.baidu.com',
        type: 9,
        sort: 3
      }
    ]
  },
  {
    modularType: 4,
    modularSort: '',
    changeStatus: 1, // 1新增 2 修改
    addStatus: true,
    modularId: '',
    actModularAssemblyList: [
      {
        changeStatus: 1,
        imgUrl: ModuleImgUrl,
        url: 'http://www.baidu.com',
        type: 9,
        sort: 1
      },
      {
        changeStatus: 1,
        imgUrl: ModuleImgUrl,
        url: 'http://www.baidu.com',
        type: 9,
        sort: 2
      },
      {
        changeStatus: 1,
        imgUrl: ModuleImgUrl,
        url: 'http://www.baidu.com',
        type: 9,
        sort: 3
      },
      {
        changeStatus: 1,
        imgUrl: ModuleImgUrl,
        url: 'http://www.baidu.com',
        type: 9,
        sort: 4
      }
    ]
  }
]
export default {
  name: 'ActivitySubjectEdit',
  data() {
    let validateEndDate = (rule, value, callback) => {
      if (this.specialTopicInfo.status == 1 && !value) {
        callback(new Error('请选择时间'))
      } else {
        callback()
      }
    }
    let validateTitle = (rule, value, callback) => {
      let val = value.trim()
      if (!val) {
        callback(new Error('请输入专题标题'))
      } else {
        callback()
      }
    }
    const token = Auth.getToken()
    return {
      componentName: 'img-module',
      specialTopicInfo: {
        id: this.$route.params.id,
        title: '',
        bgColor: '#fff',
        status: '1', // 下架状态 1.限时 2.永久
        endDate: '', // 下架时间,
        hasFloatLayer: 0,
      },
      actSpecialFloatLayer: {
        createBy: '',
        id: null,
        image: '',
        imageSizeType: '',
        marginBottom: '',
        marginRight: '',
        name: '',
        specialTopicId: "",
        updateBy: '',
        urlType: '',
        url: '',
      },
      modalImg: {
        url: "",
        name: "",
        urlType: "", // 跳转地址的类型，内购、品牌馆等
        linkUrl: "" // 点击图片的跳转地址
      },
      floatData: {
        type: 1,
        url: "",
        name: "",
        urlType: "", // 跳转地址的类型，内购、品牌馆等
        linkUrl: "", // 点击图片的跳转地址,
        imageSizeType: "",
        marginBottom: '',
        marginRight: '',
      },
      urlOptions: [
        {
          value: 1,
          label: "链接"
        },
        {
          value: 2,
          label: "品牌馆链接"
        },
        {
          value: 3,
          label: "内购网链接"
        },
        {
          value: 9,
          label: "无"
        }
      ],
      dialogModalVisible1: false, // 编辑框
      dialogModalVisible2: false, // 浮层框
      componentList: [],
      templateList: [
        {
          modularType: 1,
          imgUrl: ModuleImgUrl
        },
        {
          modularType: 2,
          imgUrl: ModuleImgUrl
        },
        {
          modularType: 3,
          imgUrl: ModuleImgUrl
        },
        {
          modularType: 4,
          imgUrl: ModuleImgUrl
        }
      ],
      parentIndex: null,
      currentIndex: null,
      specialTopicInfoRules: {
        title: [{ required: true, validator: validateTitle, trigger: 'blur' }],
        endDate: [{ required: true, validator: validateEndDate, trigger: 'blur' }]
      }
    }
  },
  components: {
    ImgModule,
    ImgEdit
  },
  created() {
    if (this.specialTopicInfo.id == 'null') return
    this.getSubjectDetail()
  },
  methods: {
    async getSubjectDetail() {
      const res = await SubjectService.subjectDetail(this.specialTopicInfo.id)
      if (res && res.data) {
        let data = res.data
        let list = data.list
        this.componentList = list
        this.specialTopicInfo = {
          bgColor: data.specialTopicInfo.bgColor,
          title: data.specialTopicInfo.title,
          status: data.specialTopicInfo.status === 1 ? '1' : '2',
          endDate: data.specialTopicInfo.endDate,
          id: data.specialTopicInfo.id,
          hasFloatLayer: data.specialTopicInfo.hasFloatLayer ? true : false
        }
        if (data.actSpecialFloatLayer) {
          this.actSpecialFloatLayer = data.actSpecialFloatLayer
        }
      }
    },
    addTemplate(modularType) {
      ModuleList.forEach(item => {
        let itemCopy = JSON.parse(JSON.stringify(item))
        let componentLength = this.componentList.length
        if (modularType == item.modularType) {
          itemCopy.modularSort = componentLength + 1
          this.componentList.push(itemCopy)
        }
      })
    },
    componentUp(item, index) {
      this.$set(this.componentList, index, this.componentList[index - 1])
      this.$set(this.componentList, index - 1, item)
      this.componentSort()
    },
    componentDown(item, index) {
      this.$set(this.componentList, index, this.componentList[index + 1])
      this.$set(this.componentList, index + 1, item)
      this.componentSort()
    },
    componentDelete(item, index) {
      this.componentList.splice(index, 1)
      this.componentSort()
    },
    componentSort() {
      this.componentList.forEach((item, index) => {
        item.modularSort = index + 1
      })
    },
    openDialogModal(parentIndex, subIndex, subItem) {
      // 如果有name的话证明是选择过图片的，否则是模板
      let urlTypeList = this.urlOptions.filter(item => item.value == subItem.type)
      if (subItem.name) {
        this.modalImg = {
          url: subItem.imgUrl,
          name: subItem.name,
          urlType: urlTypeList[0].value, // 跳转地址的类型，内购、品牌馆等
          linkUrl: subItem.url // 点击图片的跳转地址
        }
      }
      this.dialogModalVisible1 = true
      this.parentIndex = parentIndex
      this.currentIndex = subIndex
    },
    dialogCloseBack() {
      this.modalImg = {
        url: "",
        name: "",
        urlType: "", // 跳转地址的类型，内购、品牌馆等
        linkUrl: "" // 点击图片的跳转地址
      };
      this.dialogModalVisible1 = false;
      this.dialogModalVisible2 = false;
    },
    // 保存图片
    handleSaveImgInfo() {
      let addStatus = this.componentList[this.parentIndex].addStatus
      let imgId = this.componentList[this.parentIndex].actModularAssemblyList[this.currentIndex].id
      // 线上获取的列表，修改的时候，保存上传的图片信息时，父、子组件修改状态为2
      this.componentList[this.parentIndex].changeStatus = 2
      // 点击本地模板上传图片的话，状态为新增 1
      if (addStatus) {
        this.componentList[this.parentIndex].changeStatus = 1
      }
      this.$set(this.componentList[this.parentIndex].actModularAssemblyList, this.currentIndex, {
        changeStatus: addStatus ? 1 : 2,
        name: this.modalImg.name,
        id: imgId,
        imgUrl: this.modalImg.url,
        url: this.modalImg.linkUrl, // 跳转地址
        type: this.modalImg.urlType, // 链接类型
        sort: this.currentIndex + 1 // 排序
      })
      // 关掉弹框
      this.dialogModalVisible1 = false
    },

    validateComponent() {
      let isValidate = true
      if (this.componentList.length < 1) {
        this.$message.error('您还未添加模板哦！')
        isValidate = false
        return false
      }
      this.componentList.forEach((item, index) => {
        item.actModularAssemblyList.forEach((subItem, subIndex) => {
          if (!subItem.name) {
            isValidate = false
            this.$message.error('您还有未选择图片的模板哦！')
            return
          }
        })
      })
      return isValidate
    },
    async handleSaveSubject() {
      this.$refs['topicRef'].validate(async valid => {
        if (!valid) return false
        if (!this.validateComponent()) return false
        let specialTopicInfo = { ...this.specialTopicInfo }
        specialTopicInfo.status = Number(specialTopicInfo.status)
        let actSpecialFloatLayer = { ...this.actSpecialFloatLayer }
        actSpecialFloatLayer.specialTopicId = specialTopicInfo.id
        if (specialTopicInfo.hasFloatLayer) {
          specialTopicInfo.hasFloatLayer = 1;
          if (!actSpecialFloatLayer.name) {
            this.$message.error('请填写浮层内容！')
            return false
          }
        } else {
          specialTopicInfo.hasFloatLayer = 0;
        }
        const res = await SubjectService.updateSpecialTopic([...this.componentList], { ...specialTopicInfo }, { ...actSpecialFloatLayer })
        if (res && res.data) {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.$router.push('/operationManage/activitySubject')
        }
      })
    },
    // 保存浮层
    handleSaveFloat() {
      this.actSpecialFloatLayer = Object.assign(this.actSpecialFloatLayer, this.floatData)
      this.actSpecialFloatLayer.image = this.actSpecialFloatLayer.url
      this.actSpecialFloatLayer.url = this.actSpecialFloatLayer.linkUrl
      this.dialogModalVisible2 = false
    },
    // 打开浮层弹框
    handlFloating() {
      this.actSpecialFloatLayer.linkUrl = this.actSpecialFloatLayer.url
      this.floatData = Object.assign(this.floatData, this.actSpecialFloatLayer);
      this.floatData.url = this.floatData.image
      this.dialogModalVisible2 = true;
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
