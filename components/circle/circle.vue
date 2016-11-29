<template>
    <div :class="classes" :style="styles">
        <svg viewbox="0 0 100 100">
            <circle cx="50" cy="50" :r="strokeRouter" :stroke-width="bgWidth" :stroke="bgColor" fill="none"></circle>
            <circle cx="50" cy="50" :r="strokeRouter" :stroke-width="strokeWidth" :stroke="strokeColor" fill="none" transform="matrix(0,-1,1,0,0,100)" :stroke-dasharray="dashArray" :stroke-linecap="strokeLinecap"></circle>
        </svg>
        <div class="mv-circle-text">
            <slot>
                {{ percent }}%
            </slot>
        </div>
    </div>
</template>
<script>
import Icon from '../icon/icon.vue';
import Button from '../button/button.vue';
import {
    validate,
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
        percent: {
            type: Number,
            default: 0
        },
        size: {
            type: Number,
            default: 0.5
        },
        strokeWidth: {
            type: Number,
            default: 10
        },
        strokeColor: {
            type: String,
            default: '#007aff'
        },
        strokeLinecap: {
            type: String,
            default: 'round',
            validator (value) {
                return validate(value, ['round','square']);
            }
        },
        bgWidth: {
            type: Number,
            default: 10
        },
        bgColor: {
            type: String,
            default: '#ecf1f4'
        }
    },
    computed: {
        classes() {
            return `mv-circle ${this.class} mv-progress-${this.strokeLinecap}`;
        },
        styles() {
            let styles = getStyle(this.style);
            styles.width = this.size + 'rem';
            styles.height = this.size + 'rem';
            return styles;
        },
        strokeRouter() {
            let maxWidth = Math.max(this.strokeWidth, this.bgWidth);
            return 50 - maxWidth / 2;
        },
        dashArray() {
            this.percent = this.percent <= 0 ? 0 : this.percent;
            this.percent = this.percent >= 100 ? 100 : this.percent;
            let circleWidth = 2 * Math.PI * this.strokeRouter,
                dashArray = circleWidth * this.percent / 100,
                dashArrayTwo = circleWidth * (1 - this.percent / 100);
            return `${dashArray} ${dashArrayTwo}`;
        }
    }
}
</script>
<style lang="less">
@import "../../assets/css/common.less";
.mv-circle {
    position: relative;
    display: inline-block;
    svg {
        width: 100%;
    }
    circle {
        .x-transition(stroke-dasharray, .25s, linear, 0s);
    }
    .mv-circle-text {
        width: 100%;
        text-align: center;
        position: absolute;
        left: 0;
        top: 50%;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        line-height: 1;
    }
}
</style>
