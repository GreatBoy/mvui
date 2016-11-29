<template>
    <div :type="type" :class="classes" :style="style" v-show="status == 'loading' || status == 'ready'">
        <slot name="load">
            <Loadding show="show" class="mv-refresh-loadding mv-circular" style="width: auto;height: auto;"><Icon class="mv-icon-loading-6"></Icon></Loadding>
            <span>加载中...</span>
        </slot>
    </div>
    <div :type="type" :class="classes" :style="styles" v-if="status == 'end'">
        <slot name="end">
            <span>已完成</span>
        </slot>
    </div>
</template>
<script>
import Icon from '../icon/icon.vue';
import Loadding from '../loadding/loadding.vue';
import {
    throttle,
    scrollTop,
    validate
} from '../../utils/utils';

export default {
    components: {
        Loadding,
        Icon
    },
    props: {
        class: {
            type: String,
                default: ''
        }, 
        /**
         *  ready 准备 loading 加载中 end 已结束
         */
        status: {
            type: String,
            default: 'start',
            validator (value) {
                return validate(value, ['start','ready','loading','end']);
            }
        },
        /**
         *  看看滚动条状态，当window的时候，是浏览器默认的滚动条，scroll的时候是scroll滚动条，其他情况，取为parent的滚动条
         */
        scroll: {
            type: String,
            default: 'window',
            validator (value) {
                return validate(value, ['window','scroll','other']);
            } 
        },
        /**
         *  滚动条滚动的距离 只有当scroll为scroll的时候起作用
         */
        size: {
            type: Number,
            default: 0
        }
    },
    computed: {
        classes() {
            return `mv-pullload ${this.class}`;
        }
    },
    ready() {
        if (this.scroll != 'scroll') {
            this.bind();
        }
    },
    beforeDestroy() {
        this.bind('destory')
    },
    methods: {
        bind(destory) {
            let self = this,
                $elem = this.scroll == 'window' ? window : this.$el.parentNode;

            if (!destory) {
                $elem.addEventListener('scroll', this.throttleFunc, false);
            } else {
                $elem.removeEventListener('scroll', this.throttleFunc, false);
            }

        },
        getHeight () {
            let height = 0,
                childrens = this.$el.parentNode.children;
            Array.prototype.slice.call(childrens).forEach( v => height += v.offsetHeight);
            return height;
        },
        throttleFunc: throttle(function() {
            let self = this,
                $elem = this.scroll == 'window' ? window : this.$el.parentNode;
            this.statusChange($elem , scrollTop($elem));
        }, 300),
        statusChange ( $elem , scrollTops ) {
            let self = this;
            if (self.status == 'ready') {
                if ( scrollTops > (self.getHeight() - ($elem.innerHeight || $elem.ofssetHeight || $elem.clientHeight) - 50)) {
                    self.status = 'loading';
                    self.$emit('on-load');
                }
            }
        }
    },
    watch: {
        size ( val ) {
            if( Math.abs(val) > 0 && ( this.scroll == 'scroll' ) ){
                let $elem = this.$el.parentNode.parentNode;
                this.statusChange($elem , Math.abs(val));
            }
        }
    }
}
</script>
<style lang="less">
@import "../../assets/css/common.less";
.mv-pullload {
    height: 0.4rem;
    line-height: 0.4rem;
    text-align: center;
    font-size: 0.12rem;
    color: @color-theme-font;
    .ion-load-c{
        .x-animate-circular();
        margin-top: -1px;
    }
}
</style>
