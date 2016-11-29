<template>
    <div :class="classes" :style="style">
        <label :for="ids">
            <Icon :class="iconClasses" :style="iconStyles"></Icon>
            <input type="checkbox" :id="ids" :disabled="disabled" :value="value" :checked="checked" v-model="picked" @change="change">
            <slot>
                <span>
                    {{value}}
                </span>
            </slot>
        </label>
    </div>
</template>
<script>
import Icon from '../icon/icon.vue';
import {
    indexOf,
    getUUID
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
        picked: {
            type: Array,
            default: []
        },
        value: {
            type: String,
            default: ""
        },
        disabled: {
            type: Boolean,
            default: false
        },
        checked: {
            type: Boolean,
            default: false
        },
        selectIcon: {
            type: String,
            default: "mv-icon-round-check-fill"
        },
        noSelectIcon: {
            type: String,
            default: "mv-icon-round"
        },
        iconStyles: {
            type: [String, Object],
            default: ""
        },
        id: {
            type: String,
            default: ""
        }
    },
    computed: {
        classes() {
            return `mv-checkbox ${this.class}`;
        },
        ids() {
            return this.id === "" ? 'mv_checkbox_' + getUUID() : this.id;
        },
        iconClasses() {
            return `${this.checked ? this.selectIcon +' selected': this.noSelectIcon} ${this.disabled ? 'mv-checkbox-disabled':''} mv-checkbox-icon`;
        }
    },
    methods: {
        change: function(e) {
            this.$emit('on-change', this.picked);
        },
        isTrue(val) {
            if (val.indexOf(this.value) > -1) {
                this.checked = true;
            } else {
                this.checked = false;
            }
        }
    },
    watch: {
        picked(val) {
            let self = this;
            self.isTrue(val);
        }
    }
}
</script>
<style lang="less">
@import "../../assets/css/common.less";
.mv-checkbox {
    position: relative;
    font-size: 0.15rem;
    display: inline-block;
    label {
        word-wrap: break-word;
        word-break: break-all;
        margin-right: 0.05rem;
        display: block;
        .mv-checkbox-icon {
            font-size: 0.2rem;
            vertical-align: middle;
            color: @color-no-select-theme;
            &.selected {
                color: @color-select-theme;
            }
            &.mv-checkbox-disabled {
                color: @color-disabled-theme;
            }
        }
        input[type="checkbox"] {
            display: none;
        }
        span {
            vertical-align: middle;
        }
    }
}
</style>
