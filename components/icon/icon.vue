<style lang="less">
@import "../../assets/css/common.less";
@import "../../assets/fonts/iconfont.css";
</style>
<template>
    <i :class="classes" :style="style"></i>
</template>
<script>
export default {
    props: {
        class: {
            type: String,
                default: ""
        },
        style: {
            type: [Object, String],
            default: ""
        }
    },
    computed: {
        classes() {
            return `mvfont ${this.class}`;
        }
    }
}
</script>
<style lang="less">
.mvfont {
    font-size: 0.14rem;
}
</style>
