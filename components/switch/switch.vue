<template>
    <div :class="classes" :style="style" @click="change">
        <span class="mv-switch-inner">
            <span v-if="checked" class="mv-switch-open">
                <slot name="open"></slot>
            </span>
            <span v-if="!checked" class="mv-switch-close">
                <slot name="close"></slot>
            </span>
        </span>
    </div>
</template>
<script>
import Icon from '../icon/icon.vue';
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
        checked: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        classes() {
            return `mv-switch ${this.disabled ? 'mv-switch-disabled' : ''} ${this.checked ? 'mv-switch-checked' : ''} ${this.class}`;
        }
    },
    methods: {
        change: function(e) {
            if(this.disabled){
                return false;
            }
            this.checked = ! this.checked;
            this.$emit('on-change', this.checked);
        }
    }
}
</script>
<style lang="less">
@import "../../assets/css/common.less";
.mv-switch {
    width: 0.44rem;
    height: 0.24rem;
    line-height: 0.22rem;
    .x-border-radius(0.4rem);
    border: 0.01rem solid @color-border-theme;
    background-color: @color-border-theme;
    position: relative;
    .x-transition(all,.2s,ease-in-out);
    .x-user-select();
    .x-box-sizing(border-box);
    color: white;
    &:after {
        content: '';
        width: 0.22rem;
        height: 0.22rem;
        .x-border-radius(100%);
        background-color: #fff;
        position: absolute;
        left: 0;
        top: 0;
        cursor: pointer;
        .x-transition(transform,.2s,ease-in-out);
        .x-transform-translate3d(0rem,0rem,0rem);
        .x-box-sizing(border-box);
    }
    &.mv-switch-checked{
        border-color: @color-theme;
        background-color: @color-theme;
    }
    &.mv-switch-checked:after {
        .x-transform-translate3d(0.2rem,0rem,0rem);
    }
    .mv-switch-open{
        float: left;
        margin-left: 0.04rem;
    }
    .mv-switch-close{
        float: right;
        margin-right: 0.04rem;
    }
    &.mv-switch-disabled {
        cursor: not-allowed;
        background: @color-gray;
        border-color:@color-gray;
    }
    &.mv-switch-disabled:after {
        background: @color-border-theme;
        cursor: not-allowed
    }
    &.mv-switch-disabled .mv-switch-inner {
        color: @color-border-theme;
    }
}
</style>
