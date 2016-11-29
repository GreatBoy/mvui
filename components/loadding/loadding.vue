<template>
    <span v-if="show" :class="classes" :style="style">
        <slot>
            <template v-if="type == 'circle'">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </template>
            <template v-if="type == 'line'">
                <span></span>
                <span></span>
                <span></span>
            </template>
        </slot>
    </span>
</template>
<script>
    import { validate, getStyle, indexOf } from '../../utils/utils';

    export default {
        props: {
            class: {
                type: String,
                default: ""
            },
            style: {
                type: [Object, String],
                default: ""
            },
            type: {
                type: String,
                default: "circle",
                validator (value) {
                    return validate(value, ['line','circle']);
                } 
            },
            show: {
                type: Boolean,
                default: false
            },
            position: {
                type: String,
                default: ""
            }
        },
        computed: {
            classes () {
                return `mv-loadding mv-${this.type} ${this.class} ${this.position == 'center' ? 'mv-'+this.position : ''}`;
            }
        }
    }
</script>
<style lang="less">
    @import "../../assets/css/common.less";
    .mv-loadding{
        z-index: @zindex-loadding;
        &.mv-line{
            width: 0.49rem;
            height: 0.17rem;
            &.mv-center{
                position: fixed;
                left: 50%;
                top: 50%;
                margin-left: -0.245rem;
                margin-top: -0.085rem;
            }
            span{
                width: 0.14rem;
                height: 0.14rem;
                display: inline-block;
                background-color: #575f6c;
                .x-prefix(animation;lineFrames 1.4s infinite ease-in-out both);
                &:nth-child(1) {
                    -webkit-animation-delay: -.32s;
                    animation-delay: -.32s
                }
                &:nth-child(1) {
                    -webkit-animation-delay: -.16s;
                    animation-delay: -.16s
                }
            }
        }
        &.mv-circle{
            width: 0.28rem;
            height: 0.28rem;
            display: inline-block;
            position: relative;
            &.mv-center{
                position: fixed;
                left: 50%;
                top: 50%;
                margin-left: -0.14rem;
                margin-top: -0.14rem;
            }
            span {
                width: 7.14285714%;
                height: 28.57142857%;
                min-width: 1px;
                min-height: 1px;
                background-color: @color-icon-theme;
                display: block;
                position: absolute;
                left: 50%;
                margin-left: -3.57142857%;
                top: 0;
                .x-prefix(transform-origin;50% 175%);
                opacity: 0;
                &:nth-child(1) {
                    .x-prefix(transform;rotate(0deg));
                    .x-prefix(animation;circleFrames 900ms 0ms infinite);
                }
                &:nth-child(2) {
                    .x-prefix(transform;rotate(30deg));
                    .x-prefix(animation;circleFrames 900ms 75ms infinite);
                }
                &:nth-child(3) {
                    .x-prefix(transform;rotate(60deg));
                    .x-prefix(animation;circleFrames 900ms 150ms infinite);
                }
                &:nth-child(4) {
                    .x-prefix(transform;rotate(90deg));
                    .x-prefix(animation;circleFrames 900ms 225ms infinite);
                }
                &:nth-child(5) {
                    .x-prefix(transform;rotate(120deg));
                    .x-prefix(animation;circleFrames 900ms 300ms infinite);
                }
                &:nth-child(6) {
                    .x-prefix(transform;rotate(150deg));
                    .x-prefix(animation;circleFrames 900ms 375ms infinite);
                }
                &:nth-child(7) {
                    .x-prefix(transform;rotate(180deg));
                    .x-prefix(animation;circleFrames 900ms 450ms infinite);
                }
                &:nth-child(8) {
                    .x-prefix(transform;rotate(210deg));
                    .x-prefix(animation;circleFrames 900ms 525ms infinite);
                }
                &:nth-child(9) {
                    .x-prefix(transform;rotate(240deg));
                    .x-prefix(animation;circleFrames 900ms 600ms infinite);
                }
                &:nth-child(10) {
                    .x-prefix(transform;rotate(270deg));
                    .x-prefix(animation;circleFrames 900ms 675ms infinite);
                }
                &:nth-child(11) {
                    .x-prefix(transform;rotate(300deg));
                    .x-prefix(animation;circleFrames 900ms 750ms infinite);
                }
                &:nth-child(12) {
                    .x-prefix(transform;rotate(330deg));
                    .x-prefix(animation;circleFrames 900ms 825ms infinite);
                }
            }
        }


        &.mv-loadding-primary{
            span{
                background-color: @color-primary;
            }
        }
        &.mv-loadding-success{
            span{
                background-color: @color-success;
            }
        }
        &.mv-loadding-warning{
            span{
                background-color: @color-warning;
            }
        }
        &.mv-loadding-danger{
            span{
                background-color: @color-warning;
            }
        }
        &.mv-loadding-royal{
            span{
                background-color: @color-warning;
            }
        }
        
    }


    @keyframes lineFrames {
        0%,80%,to {
            -webkit-transform: scale(0);
            transform: scale(0)
        }

        40% {
            -webkit-transform: scale(1);
            transform: scale(1)
        }
    }

    .x-keyframes (circleFrames, {
        0% {
            .x-opacity(1);
        }
        90% {
            .x-opacity(0);
        }
        100% {
            .x-opacity(1);
        }
    });

</style>

