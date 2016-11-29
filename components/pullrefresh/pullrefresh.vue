<template>
    <div :type="type" :class="classes" :style="style" :disabled="disabled">
        <div class="mv-pullrefresh-content">
            <slot name="down" v-if="status == 'ready'">
                <Icon class="mv-icon-arrow-down-c"></Icon>
                <span>下拉刷新...</span>
            </slot>
            <slot name="up" v-if="status == 'move'">
                <Icon class="mv-icon-arrow-up-c"></Icon>
                <span>松手更新...</span>
            </slot>
            <slot name="load" v-if="status == 'loading'">
                <Loadding show="show" class="mv-refresh-loadding mv-circular" style="width: auto;height: auto;"><Icon class="mv-icon-loading-6"></Icon></Loadding>
                <span>加载中...</span>
            </slot>
        </div>
    </div>
</template>
<script>
import Icon from '../icon/icon.vue';
import Loadding from '../loadding/loadding.vue';
import {
    validate,
    nowTime,
    scrollTop
} from '../../utils/utils';
import Bind from '../bind/bind.js';

export default {
    name: "Pullrefresh",
    components: {
        Icon,
        Loadding
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
        disabled: {
            type: Boolean,
            default: false
        },
        preventDefault: {
            type: Boolean,
            default: false
        },
        /**
         * 滚动条的类型 默认是window,scroll,other
         */
        scroll: {
            type: String,
            default: 'window',
            validator (value) {
                return validate(value, ['window','scroll','other']);
            }
        },
        direction: {
            type: String,
            default: 'y',
            validator (value) {
                return validate(value, ['x','y']);
            }
        },
        status: {
            type: String,
            default: 'ready',
            validator (value) {
                return validate(value, ['ready','loading','move']);
            }
        }
    },
    computed: {
        classes() {
            return `mv-pullrefresh ${this.class}`;
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
        }
    },
    ready() {

        // 判断scroll是不是 原声滚动条，如果是原声的，更新监听事件，非原声的，靠监听器来判断到了更新的时候。
        if (this.scroll === 'window') {
            this.$el.parentNode.parentNode.insertBefore(this.$el, this.$el.parentNode);
            this.bind = new Bind(this, this.$el.parentNode);
            this.refreshHeight = this.$el.children[0].offsetHeight;
            if (this.status == 'loading') {
                this.bind.scrollTo(this.refreshHeight, 500, 'ease-out');
            }
        }

    },
    methods: {
        start(e) {
            let $elem = this.scroll == 'window' ? window : this.$el.parentNode;
            if (scrollTop($elem) != 0) {
                return;
            }

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

            let $elem = this.scroll == 'window' ? window : this.$el.parentNode;

            if (scrollTop($elem) != 0) {
                return;
            }
            

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
                if (diff > 0) {
                    newPos = this.isBounce ? (this.size + diff / 3) : (newPos > 0 ? 0 : this.maxDistance);
                }
            }
            
            if (this.size >= 0 && diff > 0) {
                e.preventDefault();
            } else if(diff < 0 && this.size < 0) {
                this.size = 0;
            }

            if (this.size > this.refreshHeight) {
                this.status = 'move';
            } else {
                this.status = 'ready';
            }

            if (newPos < 0) {
                newPos = 0;
            }

            this.bind.translate(newPos);

        },
        end(e) {
            // 设置惯性动画为false， 结束的时候，才是缓动的开始
            this.isTransition = false;
            if (this.size > this.refreshHeight) {
                this.status = 'loading';
                this.bind.scrollTo(this.refreshHeight, 500, 'ease-out');
                this.$emit('on-refresh', e);
            } else {
                this.bind.resetPos(this.bounceTime, 'ease-out')
            }
        },

        wheel(e) {
            // 滑轮滚动， 单独处理， 主要应用于pc，赞不处理，回头升级
        },
        refreshEnd() {
            // 如果超出边界，需要做处理
            if (this.bind.resetPos(this.bounceTime, 'ease-out')) {
                return;
            }
        }
    },
    watch: {
        status(val) {
            if (val == 'ready' && this.scroll == 'window') {
                this.refreshEnd();
            }
        }
    }
}
</script>
<style lang="less">
@import "../../assets/css/common.less";
.mv-pullrefresh {
    height: 0px;
    position: relative;
    text-align: center;
    color: #666;
    font-weight: normal;
    .mv-pullrefresh-content {
        height: 0.4rem;
        line-height: 0.4rem;
        position: absolute;
        top: -0.4rem;
        width: 100%;
    }
    .mv-refresh-loadding .mv-icon-loading-6{
        .x-animate-circular();
        padding: 1px;
    }
}
</style>
