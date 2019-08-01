# doooly-admin-template

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


兜礼后台管理系统,目前在开发新功能时，需先在views下创建模块文件夹（如对账模块则需要创建accountManage文件夹，文件夹下创建其他菜单文件夹，形如此项目目录结构，如不想遵循这样的规则，则需要在store/modules/permission.js文件中进行更改，但所有的模块都需要统一更改），目前动态菜单只支持一级和二级菜单，如需配置多级菜单，需要使用iframe引入component组件，具体请查看https://github.com/wanzhs/kitty-ui此框架当中的配置，组件文件创建完成后，需要在相对应的环境下进行菜单配置，如dev环境，需要在dev环境菜单管理模块下添加菜单，菜单路由需要以/开头，菜单显示默认为true,如果需要创建列表详情页时，菜单显示需要为false,菜单图标从阿里字体图标库中下载SVG图片添加到src>assets>icons下,其次每个菜单下都可能会存在查询，修改，删除等按钮，需要将按钮添加在相对应的菜单下，授权标识是整个项目中按钮的唯一标志，如sys:user:add则表示系统管理->用户管理->增加,接口地址是此按钮对应的接口API地址（不含主机域名）,由于当时后端技术人员能力有限，导致此接口地址必须要配置，否则会导致接口返回403，没有权限，如果有其他接口，并不需要按钮点击的也需要配置接口地址，按钮名称只需填写一个备注即可
