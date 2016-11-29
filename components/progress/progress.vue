<template>
    <div :class="classes" :style="styles">
        <div class="mv-progress-outer">
            <div class="mv-progress-iner" :style="bgStyles">
                <div class="mv-progress-percent" :style="inerStyles"></div>
            </div>
        </div>
        <div class="mv-progress-text">{{percent}}%</div>
    </div>
</template>
<script>
    import Icon from '../icon/icon.vue';
    import Button from '../button/button.vue';
    import { getStyle, indexOf, validate } from '../../utils/utils';

    export default {
        components: { Icon, Button },
        props: {
            class: {
                type: String,
                default: ""
            },
            style: {
                type: [Object, String],
                default: ""
            },
            height: {
                type: Number,
                default: 0.1
            },
            percent: {
                type: Number,
                default: 0
            },
            shape: {
                type: String,
                default: 'round',
                validator (value) {
                    return validate(value, ['round','square']);
                } 
            },
            strokeColor: {
                type: String,
                default: '#007aff'
            },
            bgColor: {
                type: String,
                default: '#f3f3f3'
            }
        },
        computed: {
            classes () {
                return `mv-progress ${this.class} mv-progress-${this.shape}`;
            },
            styles () {
                let styles = getStyle(this.style);
                if(this.width){
                    styles.width = this.width;
                }
                return styles;
            },
            inerStyles () {
                return {
                    'height': `${this.height}rem`,
                    'width': `${this.percent}%`,
                    'background-color': this.strokeColor
                }
            },
            bgStyles (){
                return {
                    'background-color': this.bgColor
                }
            }
        }
    }
</script>
<style lang="less">
    @import "../../assets/css/common.less";
    .mv-progress{
        .mv-progress-outer{
            display: inline-block;
            width: 100%;
            margin-right: -0.4rem;
            padding-right: 0.4rem;
            .x-box-sizing(border-box);
            .mv-progress-iner{
                width: 100%;
                .mv-progress-percent{
                    .x-transition(width, 0.25s, linear, 0s);
                }
            }
        }
        .mv-progress-text{
            display: inline-block;
            font-size: 0.13rem;
        }
        &.mv-progress-round{
            .mv-progress-iner{
                .x-border-radius(0.1rem);
                .mv-progress-percent{
                    .x-border-radius(0.1rem);
                }
            }
        }
        &.mv-progress-square{
            .mv-progress-iner{
                .x-border-radius(0rem);
                .mv-progress-percent{
                    .x-border-radius(0rem);
                }
            }
        }
    }

</style>

