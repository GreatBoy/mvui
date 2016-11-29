<template>
    <div :class="classes" :style="style">
        <ul class="mv-slider-ul">
            <slot></slot>
        </ul>
        <ul v-if="showIndex" class="mv-slider-index">
            <template v-for="(k,v) in liLength">
                <li v-if="k == index" class="selected"></li>
                <li v-else="k == index"></li>
            </template>
        </ul>
    </div>
</template>
<script>
import Icon from '../icon/icon.vue';
import {
    getFullHeight,
    getFullWidth,
    nowTime,
    addClass,
    removeClass
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
        index: {
            type: Number,
            default: 0
        },
        showIndex: {
            type: Boolean,
            default: true
        },
        loop: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        classes() {
            return `mv-slider ${this.class} mv-slider-${this.direction}`;
        }
    },
    data() {
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
            liWidth: 0,
            liLength: 0
        }
    },
    methods: {
        init() {
            let $ul = this.$el.children[0];
            this.refreshHeight = $ul.offsetHeight;
            this.childrenElem = $ul.children;
            this.liWidth = this.direction == 'y' ? getFullHeight(this.$el) : getFullWidth(this.$el);
            this.initClass();
            this.liLength = $ul.children.length;
            this.prevSize = -this.liWidth;
            this.nextSize = this.liWidth;
        },
        initClass() {
            Array.from(this.childrenElem).forEach(v => {
                removeClass(v, 'mv-slider-active');
                removeClass(v, 'mv-slider-next');
                removeClass(v, 'mv-slider-prev');
            });
            addClass(this.getElem(this.index), 'mv-slider-active');
            addClass(this.getElem(this.index + 1), 'mv-slider-next');
            addClass(this.getElem(this.index - 1), 'mv-slider-prev');
        },
        initSize() {
            this.size = 0;
            this.prevSize = -this.liWidth;
            this.nextSize = this.liWidth;
        },
        selectIndex() {
            let indexElem = this.$el.children[1];
            if (indexElem) {

            }
        },
        getElem(index) {
            index = this.getIndex(index);
            return this.childrenElem[index];
        },
        getIndex(index) {
            let len = this.childrenElem.length;
            if (index < 0) {
                index = len + index;
            } else if (index >= len) {
                index = index - len;
            }
            return index;
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
            //this.bind.transitionTime();

            // 获取手指
            let pointer = this.bind.getPointer(e),
                // 计算距离上一次拖动的距离
                diff = this.diff = pointer[this.pos['page']] - this.pointPos;

            // 保存手指的位置，覆盖start时的位置
            this.pointPos = pointer[this.pos['page']];

            /**
             * 如果拖动已经超出边界了,则减慢拖动的速度
             */

            this.scrollTo();

            // 记录触摸时移动的时间，以及移动的距离，为缓动做准备, 借鉴iscroll
            let timestamp = e.timestamp || nowTime();
            if (timestamp - this.startTime > 300) {
                this.startPos = this.size;
                this.startTime = timestamp;
            }

        },
        end(e) {

            if (Math.abs(this.size) < 10) {
                return;
            }

            let diff = this.diff = this.size - this.startPos,
                timestamp = e.timestamp || nowTime();
            if (timestamp - this.startTime < 300 && Math.abs(this.size) > 30) {

                this.initSize();
                this.diff = this.diff > 0 ? this.liWidth : -this.liWidth;
                this.scrollTo(600);
                this.index = diff > 0 ? this.getIndex(this.index - 1) : this.getIndex(this.index + 1);
                this.initClass();
                this.initSize();
                return;
            }

            let slider = Math.abs(this.size) / this.liWidth;
            if (slider > 0.5) {
                this.initSize();
                this.diff = this.diff > 0 ? this.liWidth : -this.liWidth;
                this.scrollTo(600);
                this.index = diff > 0 ? this.getIndex(this.index - 1) : this.getIndex(this.index + 1);
                this.initClass();
                this.initSize();
            } else {
                this.initSize();
                this.diff = 0;
                this.scrollTo(600);
                this.index = diff > 0 ? this.getIndex(this.index - 1) : this.getIndex(this.index + 1);
                this.initClass();
                this.initSize();
            }
        },
        translate() {
            //非循环
            if (!this.loop) {
                if ((this.index == 0 && this.diff > 0) || (this.index == (this.liLength - 1) && this.diff < 0)) {
                    return;
                }
            }
            // 计算新的位置，为原来的位置加上新的位置
            let size = parseInt(this.size + this.diff);

            this.prevSize = this.prevSize + this.diff;
            this.nextSize = this.nextSize + this.diff;

            this.getElem(this.index).style[this.bind.Style['transform']] = this.translateStyle(size)[this.direction];
            this.getElem(this.index + 1).style[this.bind.Style['transform']] = this.translateStyle(this.nextSize)[this.direction];
            this.getElem(this.index - 1).style[this.bind.Style['transform']] = this.translateStyle(this.prevSize)[this.direction];
            this.size = size;
        },
        scrollTo(time, ease) {
            time = time || 0;
            ease = this.bind.Easing[ease] || this.bind.Easing['bounce'];

            //如果有css动画 则直接调用css3移动
            //设置相关的css3动画属性及位置 直接位移过去
            this.transitionTimingFunction(ease);
            this.transitionTime(time);
            this.translate();
        },
        transitionTime(time) {
            time = time || 0;
            this.getElem(this.index).style[this.bind.Style['transitionDuration']] = time + 'ms';
            this.getElem(this.index + 1).style[this.bind.Style['transitionDuration']] = time + 'ms';
            this.getElem(this.index - 1).style[this.bind.Style['transitionDuration']] = time + 'ms';
        },
        transitionTimingFunction(easing) {
            easing = easing || this.bind.Easing['bounce'];
            this.getElem(this.index).style[this.bind.Style['transitionTimingFunction']] = easing;
            this.getElem(this.index + 1).style[this.bind.Style['transitionTimingFunction']] = easing;
            this.getElem(this.index - 1).style[this.bind.Style['transitionTimingFunction']] = easing;
        },
        translateStyle(size) {
            return {
                'x': 'translate3d(' + size + 'px, 0px, 0px)',
                'y': 'translate3d( 0px,' + size + 'px, 0px)'
            };
        },
        transitionEnd(e) {
            this.transitionTime(0);
        }
    },
    ready() {
        this.bind = new Bind(this, this.$el.children[0]);
        this.init();
    }
}
</script>
<style lang="less">
@import "../../assets/css/common.less";
div.mv-slider {
    position: relative;
    .mv-slider-ul {
        position: relative;
        overflow: hidden;
        .x-clearfix();
        li {
            position: absolute;
            left: 0px;
            top: 0px;
            width: 100%;
            z-index: 0;
            img {
                display: block;
                width: 100%;
            }
            span {
                width: 100%;
                padding: 0.1rem;
                .x-box-sizing(border-box);
                position: absolute;
                bottom: 0px;
                color: white;
                background-image: -webkit-linear-gradient(top, transparent, rgba(0, 0, 0, .7));
                background-image: linear-gradient(180deg, transparent, rgba(0, 0, 0, .7));
                color: #fff;
                text-shadow: 0 1px 0 rgba(0, 0, 0, .5);
            }
        }
    }
    .mv-slider-index {
        position: absolute;
        bottom: 0.03rem;
        right: 0.02rem;
        height: 0.2rem;
        width: 100%;
        display: inline-block;
        text-align: right;
        z-index: 10;
        li {
            display: inline-block;
            width: 0.08rem;
            height: 0.08rem;
            .x-border-radius(0.08rem);
            background-color: white;
            margin-right: 0.04rem;
            border: 0px;
            &.selected {
                background-color: @color-primary;
            }
        }
    }
    &.mv-slider-x {
        .mv-slider-ul li {
            &.mv-slider-active {
                z-index: 1;
                position: relative;
            }
            &.mv-slider-prev {
                z-index: 1;
                .x-prefix(transform;
                translate3d(-100%, 0, 0));
            }
            &.mv-slider-next {
                z-index: 1;
                .x-prefix(transform;
                translate3d(100%, 0, 0));
            }
        }
    }
    &.mv-slider-y {
        .mv-slider-ul li {
            &.mv-slider-active {
                z-index: 1;
                position: relative;
            }
            &.mv-slider-prev {
                z-index: 1;
                .x-prefix(transform;
                translate3d(0, -100%, 0));
            }
            &.mv-slider-next {
                z-index: 1;
                .x-prefix(transform;
                translate3d(0, 100%, 0));
            }
        }
    }
}
</style>
