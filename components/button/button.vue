<template>
    <button :type="type" :class="classes" :style="style" :disabled="disabled">
        <Icon v-if="icon" :class="icon" :style="iconStyle"></Icon>
        <label>
            <slot></slot>
        </label>
    </button>
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
        disabled: Boolean,
        type: String,
        shape: [String],
        plain: {
            type: Boolean,
            default: false
        },
        icon: String,
        iconStyle: [Object, String]
    },
    computed: {
        classes() {
            return `mv-btn ${this.shape ? 'mv-border-'+this.shape : ''} ${this.plain ?'mv-btn-plain':''} ${this.class}`;
        }
    }
}
</script>
<style lang="less">
@import "../../assets/css/common.less";
.p-custom-btn(@custome) {
    color: #fff;
    background-color: @custome;
    border-color: @custome;
    border-style: solid;
    border-width: 1px;
    &.mv-btn-plain {
        color: @custome;
    }
    .mv-icon {
        color: white;
    }
}

button.mv-btn {
    position: relative;
    display: inline-block;
    padding: 0.06rem 0.12rem;
    margin-bottom: 0;
    font-size: 0.13rem;
    color: @color-theme-font;
    text-align: center;
    line-height: 1.4;
    white-space: nowrap;
    background-color: #fff;
    border: 1px solid @color-border-theme;
    outline: 0;
    vertical-align: top;
    -webkit-tap-highlight-color: transparent;
    .x-transition(all, 0.2s, linear, 0s);
    .x-prefix(border-radius;
    0px);
    .x-prefix(appearance;
    none);
    .x-prefix(box-sizing;
    border-box);
    .x-user-select();
    &::after {
        background-color: black;
        content: " ";
        opacity: 0;
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
    }
    &:not(.disabled):active::after {
        opacity: .4
    }
    .mv-icon {
        font-size: 0.13rem;
        color: #333;
        margin-right: 0.03rem;
    }
    &.disabled,
    &[disabled] {
        opacity: .5;
        cursor: not-allowed;
        pointer-events: none;
    }
    &.mv-border-round {
        .x-border-radius(0.03rem)
    }
    &.mv-btn-primary {
        .p-custom-btn(@color-primary);
    }
    &.mv-btn-success {
        .p-custom-btn(@color-success);
    }
    &.mv-btn-warning {
        .p-custom-btn(@color-warning);
    }
    &.mv-btn-danger {
        .p-custom-btn(@color-danger);
    }
    &.mv-btn-royal {
        .p-custom-btn(@color-royal);
    }
    &.mv-btn-plain {
        background-color: transparent;
        color: @color-theme-font;
        border-width: 0.01rem;
    }
    &.mv-btn-radius {
        .x-border-radius(0.03rem);
    }
}
</style>
