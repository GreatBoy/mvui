<template>
    <div :class="classes" :style="style">
        <label :for="ids">
            <Icon :class="iconClasses" :style="iconStyles"></Icon>
            <input type="radio" :disabled="disabled" :id="ids" :value="value" :checked="checked" v-model="picked" @change="change">
            <slot>
                <span>{{value}}</span>
            </slot>
        </label>
    </div>
</template>
<script>
import Icon from '../icon/icon.vue';
import {
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
            type: String,
            default: ""
        },
        value: {
            type: String,
            default: ""
        },
        checked: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        selectIcon: {
            type: String,
            default: "mv-icon-round-radio"
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
            return `mv-radio ${this.class}`;
        },
        ids() {
            return this.id === "" ? "mv_radio_" + getUUID() : this.id;
        },
        iconClasses() {
            return `${this.checked ? this.selectIcon+' selected' : this.noSelectIcon} ${this.disabled ? 'mv-radio-disabled':''} mv-radio-icon`;
        }
    },
    methods: {
        change: function(e) {
            this.$emit('on-change', this.picked);
        }
    },
    watch: {
        picked(val) {
            if (this.disabled === false) {
                if (val != this.value) {
                    this.checked = false;
                } else {
                    this.checked = true;
                }
            }
        }
    }
}
</script>
<style lang="less">
@import "../../assets/css/common.less";
.mv-radio {
    position: relative;
    font-size: 0.15rem;
    display: inline-block;
    label {
        word-wrap: break-word;
        word-break: break-all;
        display: block;
        .mv-radio-icon {
            font-size: 0.2rem;
            vertical-align: middle;
            color: @color-no-select-theme;
            &.selected {
                color: @color-select-theme;
            }
            ;
            &.mv-radio-disabled {
                color: @color-disabled-theme;
            }
            ;
        }
        input[type="radio"] {
            display: none;
        }
        span {
            vertical-align: middle;
        }
    }
}
</style>
