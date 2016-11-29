<template>
    <div :class="classes" :style="style">
        <select @change="change" :disabled="disabled">
            <option v-if="placeholder" value="">{{placeholder}}</option>
            <option v-for="item in optionArr" :value="item.value" :selected="item.selected">{{ item.label }}</option>
        </select>
        <Icon :class="iconClasses" :style="iconStyle"></Icon>
    </div>
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
        selected: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        options: {
            type: Array,
            default: []
        },
        disabled: {
            type: Boolean,
            default: false
        },
        arrowIcon: {
            type: String,
            default: "mv-icon-arrow-bottom"
        },
        iconStyle: {
            type: [String, Object],
            default: ""
        }
    },
    computed: {
        classes() {
            return `mv-selector ${this.class}`;
        },
        optionArr() {
            let self = this;
            this.options.forEach(v => {
                if (v.value == self.selected) {
                    v.selected = "selected";
                }
            });
            return this.options;
        },
        iconClasses() {
            return `mv-arrow-icon ${this.arrowIcon}`;
        }
    },
    methods: {
        change: function(e) {
            this.selected = e.target.value;
            this.$emit('on-change', this.selected);
        }
    }
}
</script>
<style lang="less">
@import "../../assets/css/common.less";
.mv-selector {
    position: relative;
    font-size: 0.13rem;
    display: inline-block;
    border: solid 1px @color-border-theme;
    padding: 0rem 0.05rem;
    border-radius: 0.02rem;
    vertical-align: middle;
    select {
        vertical-align: middle;
        .x-prefix(appearance;
        none);
        .x-prefix(box-sizing;
        border-box);
        .x-user-select();
        border: 0px;
        background: transparent;
    }
    .mv-arrow-icon {
        vertical-align: middle;
        color: @color-no-select-theme;
    }
}
</style>
