<template>
    <div :class="classes" v-show="show" :style="styles" :transition="tipTransition">
        <slot>提示框框</slot>
    </div>
</template>
<script>
import Icon from '../icon/icon.vue';
import {
    getStyle,
    indexOf,
    getFullWidth,
    getFullHeight,
    validate
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
        position: {
            type: String,
            default: "top",
            validator (value) {
                return validate(value, ['top','center','bottom']);
            } 
        },
        show: Boolean,
        auto: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            styles: {}
        };
    },
    computed: {
        classes() {
            return `mv-tip ${this.class} mv-${this.position}`;
        },
        tipTransition() {
            return `tip-${this.position}`;
        }
    },
    watch: {
        show(val) {
            if (val === true) {
                let stylels = getStyle(this.style),
                    self = this;
                if (this.position === 'center') {
                    // 获取可视区域宽度
                    let selfWidth = getFullWidth(this.$el),
                        seflHeight = getFullHeight(this.$el);
                    stylels['margin-left'] = '-' + selfWidth / 2 + 'px';
                    stylels['margin-top'] = '-' + seflHeight / 2 + 'px';
                }
                self.styles = stylels;
                if (this.auto === true) {
                    setTimeout(function() {
                        self.show = false;
                    }, 1500);
                }
            }
        }
    }
}
</script>
<style lang="less">
@import "../../assets/css/common.less";
.mv-tip {
    margin: 0 auto 0;
    color: white;
    background-color: rgba(30, 30, 30, 0.8);
    padding: 0.1rem 0.18rem;
    font-size: 0.13rem;
    z-index: @zindex-modal;
    &.mv-top {
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100%;
        .x-box-sizing(border-box);
    }
    &.mv-center {
        position: fixed;
        top: 50%;
        left: 50%;
        .x-box-sizing(border-box);
        max-width: 3rem;
        .x-border-radius(0.03rem);
    }
    &.mv-bottom {
        position: fixed;
        bottom: 0px;
        left: 0px;
        width: 100%;
        .x-box-sizing(border-box);
    }
}

.tip-top-transition {
    display: inline-block;
    /* 否则 scale 动画不起作用 */
    position: fixed;
    top: 0px;
    .x-prefix(transition;
    all .5s ease);
    .x-prefix(transform;
    translate(0, 0));
    opacity: 1;
    left: 0px;
}

.tip-top-enter {
    .x-prefix(transform;
    translate(0, -100%));
}

.tip-top-leave {
    .x-prefix(transform;
    translate(0, -100%));
}

.tip-center-transition {
    display: inline-block;
    /* 否则 scale 动画不起作用 */
    position: fixed;
    top: 0px;
    .x-prefix(transition;
    opacity .5s ease);
    opacity: 1;
}

.tip-center-enter {
    opacity: 0;
}

.tip-center-leave {
    opacity: 0;
}

.tip-bottom-transition {
    display: inline-block;
    /* 否则 scale 动画不起作用 */
    position: fixed;
    bottom: 0px;
    .x-prefix(transition;
    all .5s ease);
    .x-prefix(transform;
    translate(0, 0));
    opacity: 1;
    left: 0px;
}

.tip-bottom-enter {
    .x-prefix(transform;
    translate(0, 100%));
}

.tip-bottom-leave {
    .x-prefix(transform;
    translate(0, 100%));
}
</style>
