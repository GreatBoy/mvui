<template>
    <div :class="classes" :style="styles">
    </div>
</template>
<script>
import {
    getStyle,
    indexOf,
    nowTime,
    css,
    getFullHeight,
    getFullWidth
} from '../../utils/utils';

export default {
    props: {
        class: {
            type: String,
            default: ""
        },
        style: {
            type: [Object, String],
            default: ""
        },
        /**
         *  滚动距离
         */
        size: {
            type: Number,
            default: 0
        }
    },
    data (){
        let pos = {
            'page': 'page' + this.direction.toUpperCase(),
            'pointer': 'pointer' + this.direction.toUpperCase(),
            'x' : 0,
            'y' : 1
        }

        return {
            startPos: 0, // 开始位置
            pointPos: 0, // 手指位置
            startTime: 0, // 开始的时间
            maxDistance: 0, //滚动的最大距离
            isTransition: false, // 是否在动画中,
            pos: pos
        }
    },
    computed: {
        styles () {
            return getStyle( this.style );
        },
        classes () {
            return `mv-scroll-bar ${this.class}`;
        }
    },
    ready () {
        
    },
    methods: {
      
    }
}


</script>
<style lang="less">
@import "../../assets/css/common.less";
.mv-scroll-bar {
    position: absolute;
    z-index: 100;
    background: padding-box padding-box rgba(0, 0, 0, 0.498039);
    border: 1px solid rgba(255, 255, 255, 0.901961);
    box-sizing: border-box;
    width: 100%;
    border-radius: 3px;
    pointer-events: none;
    transition-property: transform;
    transition-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    transform: translate(0px, 0px) translateZ(0px);
    height: 132px;
}
</style>
