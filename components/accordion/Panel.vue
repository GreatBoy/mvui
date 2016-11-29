<template>
    <div :class="classes" :style="styles">
        <div class="mv-panel-title" @click="toggle">
            <slot name="title">
                测试
            </slot>
            <Icon class="mv-icon-arrow-right"></Icon>
        </div>
        <div class="mv-panel-content">
            <slot>
                测试一下啦啦
            </slot>
        </div>
    </div>
</template>
<script>
import Icon from '../icon/icon.vue';
import {
    getStyle,
    indexOf,
    getUUID
} from '../../utils/utils';

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
        open: {
            type: Boolean,
            default: false
        },
        key: {
            type: String,
            default: ''
        }
    },
    computed: {
        styles() {
            return getStyle(this.style);
        },
        classes() {
            return `mv-panel ${this.open ? 'mv-panel-open' : ''} ${this.class}`;
        }
    },
    methods: {
        toggle: function(e) {
            this.open = ! this.open;
            this.$parent.toggle({
                'key' : this.key,
                'open' : this.open
            });
        }
    }
}
</script>
<style lang="less">
@import "../../assets/css/common.less";
.mv-panel {
    .mv-panel-title{
        position: relative;
        padding:0.1rem;
        color: @color-theme-font;
        font-size: 0.13rem;
        i{
            position: absolute;
            right: 0.12rem;
            top: 0.08rem;
            color: @color-icon-theme;
            .x-transition(all, 0.2s, ease);
            font-size: 0.16rem;
        }
    }
    .mv-panel-content{
        display: none;
        padding: 0rem 0.1rem 0.1rem;
        overflow: hidden;
        .x-transition(all, 0.2s, ease);
        font-size: 0.13rem;
        color: @color-theme-font-1;
    }
    &.mv-panel-open{
        .mv-panel-title{
            i{
                .x-transform-rotate(90deg);
            }
        }
        .mv-panel-content{
            display: block;
        }
    }
}
</style>
