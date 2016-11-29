<template>
    <div v-if="isShow" :type="type" :class="classes" :style="style" :disabled="disabled" @click="gotop" transition="gotop-fade">
        <slot>
            <Icon :class="icon" :style="iconStyle"></Icon>
        </slot>
    </div>
</template>
<script>
    import Icon from '../icon/icon.vue';
    import { indexOf, scrollTop, throttle } from '../../utils/utils';

    export default {
        components: { Icon },
        props: {
            class: {
                type: String,
                default: ""
            },
            style: {
                type: [Object, String],
                default: ""
            },
            icon: {
                type: String,
                default: "mv-icon-arrow-top"
            },
            iconStyle: {
                type: [Object, String],
                default: ""
            },
            height: {
                type: Number,
                default: 100
            }
        },
        data() {
            return {
                isShow: false
            };
        },
        computed: {
            classes () {
                return `mv-gotop ${this.class}`;
            }
        },
        ready () {
            window.addEventListener('scroll', this.throttleFunc, false);
            window.addEventListener('resize', this.throttleFunc, false);
        },
        beforeDestroy () {
            window.removeEventListener('scroll', this.throttleFunc, false);
            window.removeEventListener('resize', this.throttleFunc, false);
        },
        methods: {
            gotop (e) {
                window.scrollTo(0, 0);
                this.$emit('on-click', e);
            },
            throttleFunc: throttle(function(){
                this.handleScroll();
            },300),
            handleScroll () {
                let self = this;
                let isShow = self.isShow;
                let scrollTopNum = scrollTop(window);
                if (self.height <= scrollTopNum && !isShow) {
                    self.isShow = true;
                } else if (self.height > scrollTopNum && isShow) {
                    self.isShow = false;
                }
            }
        }
    }
</script>
<style lang="less">
    @import "../../assets/css/common.less";
    .mv-gotop{
        background-color: rgba(0,0,0,.6);
        .x-border-radius(0.02rem);
        .x-box-shadow(0, 1px, 3px, rgba(0,0,0,.2));
        .x-transition(all ,0.2s ,ease-in-out ,0s);
        position: fixed;
        bottom: 0.2rem;
        right: 0.2rem;
        text-align: center;
        padding: 0.06rem 0.1rem;
        color: white;
        &:hover, &:active{
            background-color: rgba(0,0,0,.8);
        }
        .mv-icon{
            display: inline-block;
            padding: 0.06rem 0.12rem;
            font-size: 0.18rem;
            color: white;
            text-align: center;
        }
        &.gotop-fade-transition {
            display: inline-block; /* 否则 scale 动画不起作用 */
            .x-prefix(transition; opacity .3s ease);
            opacity: 1;
        }
        &.gotop-fade-enter {
            opacity: 0;
        }
        &.gotop-fade-leave {
            opacity: 0; 
        }
    }
    
</style>

