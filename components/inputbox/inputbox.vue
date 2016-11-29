<template>
    <div :class="classes" :style="style">
        <input :type="type" :placeholder="placeholder" v-model="value" :value="value" />
        <slot name="icon">
            <Icon v-if="status == 1 && closeIcon" class="mv-icon-round-close-fill mv-inputbox-clear" @click="cleanInput"></Icon>
        </slot>
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
        value: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            default: "text"
        },
        placeholder: {
            type: String,
            default: ""
        },
        closeIcon: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            status: 0
        }
    },
    computed: {
        classes() {
            return `mv-inputbox ${this.class}`;
        }
    },
    methods: {
        cleanInput() {
            this.value = "";
        }
    },
    watch: {
        value(val) {
            if (val.length > 0) {
                this.status = 1;
            } else {
                this.status = 0;
            }
            this.$emit('on-change');
        }
    }
}
</script>
<style lang="less">
@import "../../assets/css/common.less";
.mv-inputbox {
    position: relative;
    display: inline-block;
    font-size: 0.13rem;
    label {
        word-wrap: break-word;
        word-break: break-all;
        margin-right: 0.05rem;
    }
    input {
        width: 100%;
        border: 0;
        outline: 0;
        .x-prefix(appearance;none);
        background-color: transparent;
        font-size: inherit;
        color: inherit;
        line-height: normal;
        .x-flex(1);
        padding: 0.1rem 0.03rem;
    }
    .mv-inputbox-clear {
        color: @color-icon-theme;
        font-size: 0.16rem;
    }
    i {
        color: @color-icon-theme;
        font-size: 0.16rem;
        position: absolute;
        right: 0.1rem;
        top: 0.045rem;
    }
}
</style>
