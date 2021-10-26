#### 本项目是前端工程模块化的基础，总共分为4个部分



1. **[browser](./browser/package.json "浏览器客户端"):**  
浏览器客户端，这里只是做代码备份。将来应该单独分出去。

2. **[core](./core/package.json "核心包")**   
核心包主要功能包括两部分，一个是项目根路径下的lib包，另外一个是src下的常用组件  
lib提供了示例性的代码，演示了如何利用vue-cli-plugin-dr轻松组织一个项目的代码  
src是一些基础的代码框架，代码结构完全附合vue-cli-plugin-dr的规范

3.  [framework](./framework/package.json "基础平台展示页面和常用组件")  
基础平台是面向管理后台的,提供了与maven项目com.dr.framework对应的展示页面和常用组件  
**提供此项目的目的是为了积累前端页面，各个后台子项目无需自己重复维护平台相关的组件和页面，后续此项目会随着后台代码的丰富持续升级**

4. [vue-cli-plugin-dr](./vue-cli-plugin-dr/package.json "vue-cli插件")   
借助vue-cli-service接口，自定义实现的vue-cli-service插件，此工程代码将来可以升级成webpack-plugin。  
本工程规范了前端代码结构，项目结构具体如下：  

**/src/components:**  
此文件夹下的代码都会使用`vue.component()`注册为全局组件，代码组织结构为:`/src/components/*.vue` 或者`/src/components/*/index.vue`,具体的扫描规则实现详见`vue-cli-plugin-dr/src/codeGen/inject/components.js`，组织和使用方式详见`core/lib/router/index.jsx`  

**/src/plugins:**  
此文件夹下的代码只能返回function或者Promise对象，参数有四个：  
vue:全局vue对象，可以自定义install或者扩展其他属性  
router：项目的router实例，可以自定义扩展、拦截或者修改  
store:项目store实例，可以自定义扩展或修改
opts:项目启动时的额外参数  
代码组织调用的具体实现详见`core/lib/index.jsx`。此文件夹下代码组织结构为:`/src/plugins/*.js` 或者`/src/plugins/*/index.jsx`,具体的扫描规则实现详见`vue-cli-plugin-dr/src/codeGen/inject/plugins.js`  

**/src/views:**  
此文件夹下的代码会使用注册为vue router，代码组织结构为:`/src/views/**/index.vue` ,具体的扫描规则实现详见`vue-cli-plugin-dr/src/codeGen/inject/views.js`，组织和使用方式详见`core/lib/router/index.jsx`  

**/src/stores:**  
此文件夹下的代码会使用注册为vue stores的modules，代码组织结构为:`/src/stores/*.js`或者`/src/stores/*/index.jsx` ,具体的扫描规则实现详见`vue-cli-plugin-dr/src/codeGen/inject/stores.js`，组织和使用方式详见`core/lib/sore.js`  



----------
结合上述代码机构规范，vue-cli-plugin-dr在项目启动（vue-cli-service server）或打包（vue-cli-service build）时，自动扫描项目的所有依赖。若项目依赖的包的package.json文件dlib属性为true，则会自动扫描。  
若本工程相同目录结构下存在相同的文件，则优先使用本项目的代码。若两个依赖存在相同的代码，则可以在项目的vue.config.js的pluginOptions.dr属性配置具体要扫描的依赖和顺序，libs属性为字符串或者数组，若声明，则按照libs声明组织依赖，优先使用前面依赖的代码。views属性，表示启动时扫描本项目的views的具体规则，不声明则不扫描，大的项目可以配置此属性，急大提高项目启动速度。  
  
上述扫描的代码会在项目启动时在项目/node_modules/.cache/pluginDr文件夹下自动生成相关的依赖代码。因为代码是动态生成的，所以程序启动错误或者打包错误的时候，先尝试删除/node_modules/.cache/文件夹，此文件夹是编译缓存，第一次编译慢，后续会比较快。  
代码的引用方式为`import {components, views} from 'vue-cli-plugin-dr'`。**注意：必须用这种方式引用代码**，为了实现上述效果，同事需要修改项目下babel.config.js文件，将`@vue/cli-plugin-babel/preset`替换为`vue-cli-plugin-dr/preset`
  
  

----------
为了进一步提高打包和运行速度，同时满足灵活的需求，/core/lib/下的代码并没有引用css文件，也就是说项目需要自定义引用css或scss文件。  
为了实现自定义element-ui样式的目的，vue-cli-plugin-dr自定义了genTheme命令`vue-cli-service genTheme`，代码的具体实现在/vue-cli-plugin-dr/src/command/genTheme/index.jsx  
此命令会扫描所有依赖的/src/styles/var.scss 拼接完成后，在项目/src/styles/文件夹下生成theme.css文件//TODO 这里可以去掉的
