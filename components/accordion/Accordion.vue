<template>
    <div :class="classes" :style="styles">
        <slot></slot>
    </div>
</template>
<script>
import Icon from '../icon/icon.vue';
import {
    getStyle,
    indexOf
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
        accordion: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        styles() {
            return getStyle(this.style);
        },
        classes() {
            return `mv-accordion ${this.class}`;
        }
    },
    compiled (){
        this.$children.forEach((child, index) => {
            child.key = child.key || index;            
        });
    },
    methods: {
        setOpen: function(data){
            this.$children.forEach((child, index) => {
                if(data.open){
                    child.open = false;
                    if(child.key == data.key){
                        child.open = true;
                    }
                }
            });
        },
        toggle: function(data) {
            if(this.accordion){
                this.setOpen(data);
            }
            this.$emit('on-change', data);
        }
    }
}
</script>
<style lang="less">
@import "../../assets/css/common.less";
.mv-accordion {
    background: white;
    .mv-panel{
        border-bottom: solid 1px @color-disabled-theme;
        &:last-child{
        border-bottom: none;
        }
    }

}
</style>
