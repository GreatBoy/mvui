<template>
    <div :class="classes" :style="style">
        <Button :disabled.sync="disabledPrev" @click="prevClick">上一页</Button>
        <span>{{current}}/{{all}}</span>
        <Button :disabled.sync="disabledNext" @click="nextClick">下一页</Button>        
    </div>
</template>
<script>
    import Icon from '../icon/icon.vue';
    import Button from '../button/button.vue';
    import { indexOf } from '../../utils/utils';

    export default {
        components: { Icon , Button},
        props: {
            class: {
                type: String,
                default: ""
            },
            style: {
                type: [Object, String],
                default: ""
            },
            current: {
                type: Number,
                default: 1
            },
            all: {
                type: Number,
                default: 1
            }
        },
        computed: {
            classes () {
                return `mv-page ${this.class}`;
            },
            disabledPrev (){
                return this.current == 1 ? true : false;
            },
            disabledNext (){
                return this.current == this.all ? true : false;
            }
        },
        methods: {
            prevClick(){
                if( this.current > 1 ){
                    this.current = this.current - 1;
                    this.$emit( 'on-change', this.current );
                }
            },
            nextClick(){
                if( this.current < this.all ){
                    this.current = this.current + 1;
                    this.$emit('on-change', this.current );
                }
            }
        }
    }
</script>
<style lang="less">
    @import "../../assets/css/common.less";

    div.mv-page{
        span{
            position: relative;
            display: inline-block;
            padding: 0.07rem 0.18rem;
            margin-bottom: 0;
            font-size: 0.13rem;
            font-weight: 400;
            line-height: 1.42;
            color: @color-theme-font-2;
            text-align: center;
            white-space: nowrap;
            vertical-align: top;
        }
        .mv-btn{
            margin: 0px;
        }
    }
</style>

