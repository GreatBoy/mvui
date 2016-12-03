

<p align="center">
    <a href="https://greatboy.github.io/mvui-page/">
        <img width="200" src="https://github.com/GreatBoy/mvui/blob/master/assets/image/Mvui-02.png">
    </a>
</p>



### 简介

mvui是一套基于 Vue.js 的开源UI组件库，主要服务于移动端产品，崇尚自由的原则，您可以自己有更改的样式以及添加组件的功能

mobile + vue + ui = mvui

基于单文件的Vue组件化开发模式，npm + webpack + babel 开发

组件由来：最近自己做了一个项目，由于有自己定制的ui，因此在造一个轮子，其中参考了很多框架，例如vuex、iview等，非常感谢国内积极做开源的公司和个人，让我们的开发方面了很多很多。在这里我也把自己的轮子贡献出来，由于作者技术有限，希望大家勿喷，觉得有问题的可以提出来一起交流交流，QQ群：215660750


希望大家踊跃造轮子，因为没有自己亲手去折腾一番，永远对某些技术人认识还是不够深刻，多多动手，希望大家都能成为轮子发明人，哈哈


### 文档

#### [中文文档](https://greatboy.github.io/mvui-page/)


### 预览

#### [组件概览（Component Overview）](https://greatboy.github.io/mvui-example/)



### 安装


#### 依赖于vue.js,先安装vue.js

[vue-vueRouter-webpack](https://github.com/icarusion/vue-vueRouter-webpack)
[vue-cli](https://github.com/vuejs/vue-cli)


#### Install mvui

```bash
npm install mvui
```

#### webpack配置文件引入mvui

```js
module: {
    loaders: [
        {
            test: /node_modules\/mvui\/.*?js$/,
            loader: 'babel'
        },// for Mac
        {   
            test: /node_modules\\mvui\/.*?js$/,         
            loader: 'babel' 
        },// for Windows
        { 
            test: /\.js$/, 
            loader: 'babel', 
            exclude: /node_modules/ 
        }
    ]
}
```


### 引入例子

```html
<template>  
    <div>
        <Icon class="mv-icon-reduce"></Icon>
    </div>
</template> 
<script>
    import { Icon } from 'mvui';
    export default{   
        components: { 
            Icon,
        }
    }
</script>
```


### 链接

- [Vue](https://github.com/vuejs/vue)
- [Webpack](https://github.com/webpack/webpack)






