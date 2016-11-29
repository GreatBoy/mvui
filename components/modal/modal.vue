<template>
    <div class="mv-modal-wrapper">
        <div class="mv-modal-mask" @click="mask" v-show="show" transition="mv-fade"></div>
        <div :class="classes" :style="styles" v-show="show" transition="mv-modal">
            <div class="mv-modal-header" v-if="!headerHide">
                <slot name="header">
                    <p>{{ title }}</p>
                </slot>
            </div>
            <div class="mv-modal-body">
                <slot></slot>
            </div>
            <div class="mv-modal-footer" v-if="!footerHide">
                <slot name="footer">
                    <div class="mv-modal-footer-btn mv-1px-t">
                        <Button class="mv-1px-r" @click="cancel">{{ cancelText }}</Button>
                    </div>
                    <div class="mv-modal-footer-btn mv-1px-t">
                        <Button @click="ok">{{ okText }}</Button>
                    </div>
                </slot>
            </div>
        </div>
    </div>
</template>
<script>
import Icon from '../icon/icon.vue';
import Button from '../button/button.vue';
import {
    getStyle,
    indexOf
} from '../../utils/utils';

export default {
    components: {
        Icon,
        Button
    },
    props: {
        class: {
            type: String,
                default: ""
        },
        style: [Object, String],
        show: {
            type: Boolean,
            default: false
        },
        headerHide: {
            type: Boolean,
            default: false
        },
        footerHide: {
            type: Boolean,
            default: false
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        okText: {
            type: String,
            default: '确定'
        },
        width: {
            type: Number,
            default: '80%'
        },
        autoClose: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        classes() {
            return `mv-modal ${this.class}`;
        },
        styles() {
            let styles = getStyle(this.style);
            if (this.width) {
                styles.width = this.width;
            }
            return styles;
        },
    },
    methods: {
        mask() {
            if (this.autoClose) {
                this.show = false;
            }
        },
        cancel() {
            if (this.autoClose) {
                this.show = false;
            }
            this.$emit('on-cancel');
        },
        ok() {
            if (this.autoClose) {
                this.show = false;
            }
            this.$emit('on-ok');
        },
        watch: {
            show(val) {
                if (val === false) {
                    setTimeout(() => {
                        //this.wrapShow = false;
                    }, 300);
                    //this.removeScrollEffect();
                } else {
                    //this.wrapShow = true;
                    //this.addScrollEffect();
                }
            }
        }
    }
}
</script>
<style lang="less">
@import "../../assets/css/common.less";
.mv-modal-wrapper {
    .mv-modal-body {
        padding: 0.1rem 0.05rem 0.1rem;
    }
    .mv-modal-header {
        font-size: 0.14rem;
        font-weight: bold;
        padding: 0.13rem 0.05rem 0rem;
    }
    .mv-modal-footer {
        .x-prefix(border-bottom-left-radius;
        0.03rem);
        .x-prefix(border-bottom-right-radius;
        0.03rem);
        overflow: hidden;
        .mv-modal-footer-btn {
            border: 0px;
            width: 50%;
            float: left;
            padding: 0px;
            button {
                border: 0px;
                width: 100%;
                padding: 0.1rem 0px;
                margin: 1px 0px 0px;
                color: @color-theme;
            }
        }
    }
    .mv-modal {
        position: fixed;
        z-index: @zindex-modal;
        width: 85%;
        top: 50%;
        left: 50%;
        .x-prefix(transform;
        translate(-50%, -50%));
        background-color: white;
        text-align: center;
        border-radius: 3px;
        overflow: hidden;
        &.mv-modal-transition {
            opacity: 1;
            .x-prefix(transition-duration;0.4s);
            .x-prefix(transform;translate(-50%, -50%) scale(1));
            .x-prefix(transition-property;transform, opacity);
        }
        &.mv-modal-enter {
            .x-prefix(transform;translate(-50%, -50%) scale(1.185));
            opacity: 0;
        }
        &.mv-modal-leave {
            .x-prefix(transform;translate(-50%, -50%) scale(1));
            opacity: 0;
        }
    }
    .mv-modal-mask {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: @zindex-modal-background;
        background: rgba(0, 0, 0, .6);
    }

}
</style>
