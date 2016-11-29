<template>
    <div :class="classes" :style="style">
        <ul>
            <slot></slot>
        </ul>
        <div class="mv-slider-index">
            
        </div>
    </div>
</template>
<script>
import Icon from '../icon/icon.vue';
import {
    getFullHeight,
    getFullWidth,
    nowTime
} from '../../utils/utils';
import Bind from '../bind/bind.js';

export default {
    components: {
        Icon
    },
    props: {
        class: {
            type: String,
            default: ""
        },
        style: {
            type: [Object, String],
            default: ""
        },
        preventDefault: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        direction: {
            type: String,
            default: 'x'
        },
        bounce: {
            type: Boolean,
            default: true
        },
        index: {
            type: Number,
            default: 0
        }
    },
    computed: {
        classes() {
            return `mv-slider ${this.class}`;
        }
    },
    data(){
        let pos = {
            'page': 'page' + this.direction.toUpperCase(),
            'pointer': 'pointer' + this.direction.toUpperCase(),
            'x': 0,
            'y': 1
        }

        return {
            startPos: 0, // 开始位置
            pointPos: 0, // 手指位置
            startTime: 0, // 开始的时间
            maxDistance: 0, //滚动的最大距离
            isTransition: false, // 是否在动画中,
            pos: pos,
            size: 0,
            isBounce: true, 
            bounceTime: 300,
            liWidth: 0
        }
    },
    methods: {
        init() {
            let $ul = this.$el.children[0];
            this.childrenElem = $ul.children;
            this.liWidth = self.direction == 'y' ? getFullHeight(this.$el):getFullWidth(this.$el);
            this.setLiSize($ul, this.liWidth);
            this.maxDistance = -(this.getChildSize($ul) - this.liWidth);
            $ul.style.width = this.getChildSize($ul) + 'px';
        },
        setLiSize($ul, size){
            let self = this;
            let childs = Array.prototype.slice.call($ul.children);
            childs.forEach(function(v, k) {
                v.style.width = size + 'px';
            });
        },
        getChildSize($ul) {
            let self = this;
            let childs = Array.prototype.slice.call($ul.children);
            let size = 0;
            childs.forEach(function(v, k) {
                size += (self.direction == 'y' ? v.offsetHeight : v.offsetWidth);
            });
            return size;
        },
        start(e) {
           
            // 获取touches
            let pointer = this.bind.getPointer(e);

            // 暂停正在移动的动画
            this.bind.transitionTime();
            //如果以前的动画正在进行，则先停止
            if (this.isTransition) {
                this.bind.stopAnimate();
            }

            // 记录手指的位置
            this.pointPos = pointer[this.pos['page']] || 0;

            // 记录时间戳
            this.startTime = e.timestamp || nowTime();

            // 初始化缓存位置
            this.startPos = this.size;
            //this.moved = false;
        },
        move(e) {
            
            this.bind.transitionTime();

            // 获取手指
            let pointer = this.bind.getPointer(e);

            // 计算距离上一次拖动的距离
            let diff = pointer[this.pos['page']] - this.pointPos;

            // 保存手指的位置，覆盖start时的位置
            this.pointPos = pointer[this.pos['page']];


            // 计算新的位置，为原来的位置加上新的位置
            let newPos = this.size + diff;

            /**
             * 如果拖动已经超出边界了,则减慢拖动的速度
             */

            if (newPos > 0 || newPos < this.maxDistance) {
                if (Math.abs(diff) > 0) {
                    newPos = this.bounce ? (this.size + diff / 3) : (newPos > 0 ? 0 : this.maxDistance);
                }
            }

            this.bind.translate(newPos);

            // 记录触摸时移动的时间，以及移动的距离，为缓动做准备, 借鉴iscroll
            let timestamp = e.timestamp || nowTime();
            if( timestamp - this.startTime > 300){
                this.startPos = this.size;
                this.startTime = timestamp;
            }

        },
        end(e) {
            // // 设置惯性动画为false， 结束的时候，才是缓动的开始
            // if (this.size >= 0 || Math.abs(this.size) <= Math.abs(this.maxDistance) ) {
            //     if( !this.bounce ){
            //         this.size = this.size > 0 ? 0 : this.maxDistance;
            //         return ;
            //     }
            // }
            if( (this.size >= 0 || parseInt ( Math.abs(this.size) ) >= parseInt( Math.abs(this.maxDistance) ) ) ){
                this.bind.resetPos(this.bounceTime, 'ease-out')
                return;
            }


            this.isTransition = false;
            let timestamp = e.timestamp || nowTime();
            if( timestamp - this.startTime < 300 ){
                let diff = this.size - this.startPos;
                if( diff > 0 ){
                    let slider = Math.floor( Math.abs(this.size) / this.liWidth );
                    this.bind.scrollTo(-this.liWidth * slider, 300, 'ease-out');
                } else {
                    let slider = Math.ceil( Math.abs(this.size) / this.liWidth );
                    this.bind.scrollTo(-this.liWidth * slider, 300, 'ease-out');
                }
                return;
            }
            
            if(this.size > 0 || Math.abs(this.size) > Math.abs(this.maxDistance) ){
                this.bind.resetPos(this.bounceTime, 'ease-out');
                return;
            }

            let slider = Math.ceil( Math.abs(this.size) / this.liWidth );
            if (Math.abs(this.size) % this.liWidth  > this.liWidth / 2) {
                this.bind.scrollTo(-this.liWidth * slider, 300, 'ease-out');
                this.$emit('on-refresh', e);
            } else {
                --slider;
                this.bind.scrollTo(-this.liWidth * slider, 300, 'ease-out');
            }
        },
        wheel(e) {
            // 滑轮滚动， 单独处理， 主要应用于pc，赞不处理，回头升级
        },
        refreshEnd(e) {
            // 如果超出边界，需要做处理
            if (this.bind.resetPos(this.bounceTime, 'ease-out')) {
                return;
            }
        }
    },
    ready() {
        this.bind = new Bind(this, this.$el.children[0]);
        this.refreshHeight = this.$el.children[0].offsetHeight;
        this.init();
    }
}
</script>
<style lang="less">
@import "../../assets/css/common.less";
div.mv-slider {
    position: relative;
    overflow: hidden;
    ul {
        .x-clearfix();
        li {
            float: left;
            position: relative;
            img {
                display: block;
                width: 100%;
            }
            span{
                width: 100%;
                padding: 0.1rem;
                .x-box-sizing(border-box);
                position: absolute;
                bottom: 0px;
                color: white;
                background-image: -webkit-linear-gradient(top,transparent,rgba(0,0,0,.7));
                background-image: linear-gradient(180deg,transparent,rgba(0,0,0,.7));
                color: #fff;
                text-shadow: 0 1px 0 rgba(0,0,0,.5);
            }
        }
    }
}
</style>
