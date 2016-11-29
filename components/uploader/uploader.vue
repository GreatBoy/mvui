<template>
    <div :class="classes" :style="styles" :disabled="disabled">
        <input type="file" name="img" @change="change" />
        <slot name="preview">
            <Icon class="mv-icon-uploader"></Icon>
        </slot>
    </div>
</template>
<script>
import Icon from '../icon/icon.vue';
import {
    getStyle,
    indexOf
} from '../../utils/utils';

const STATUS = {
    QUEUED: 'queued',
    ABORTED: 'aborted',
    UPLOADING: 'uploading',
    COMPLETED: 'completed'
};

export default {
    components: {
        Icon
    },
    props: {
        class: {
            type: String,
                default: ''
        },
        style: [Object, String],
        /**
         *  上传链接的地址
         */
        url: {
            type: String,
            default: ''
        },
        /**
         *  后台接受的name
         */
        field: {
            type: String,
            default: 'file'
        },
        /**
         *  文件最大的尺寸 以M为单位
         */
        maxSize: {
            type: Number,
            default: 4
        },
        maxSizeMessage: {
            type: String,
            default: '图片大小超过限制'
        },
        type: {
            type: String,
            default: 'jpg,png,jpeg,gif'
        },
        typeMessage: {
            type: String,
            default: '图片格式不正确'
        },
        autoLoad: {
            type: Boolean,
            default: true
        },
        more: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            default: 'ready',
            validator (value) {
                return validate(value, ['ready','before','status','progress','success','complete','run']);
            } 
        }
    },
    computed: {
        styles() {
            return getStyle(this.style);
        },
        classes() {
            return `mv-uploader ${this.class}`;
        }
    },
    ready() {
        if (this.more) {
            this.$el.children[0].setAttribute('multiple', 'multiple');
        }
    },
    data() {
        return {
            param: {
                preview: [],
                validate: []
            },
            queue: [],
        };
    },
    methods: {
        change(event) {
            let files = event.target.files;
            this.param.validate = [];
            this.param.preview = [];
            for (let i = 0; i < files.length; ++i) {
                let url;
                if (!this.validate(files[i])) {
                    break;
                }
                this.add(files[i])
                    // 调用ready方法
                url = this.getFileUrl(files[i])
                this.param.preview.push(url)
            }
            // 校验失败回调
            if (this.param.validate.length > 0) {
                this.$emit('on-validate', this.param.validate)
            }
            this.$emit('on-preview', this.param.preview);
            this.status = 'status';
            if (this.autoLoad) {
                this.run();
            }
        },
        validate(file) {
            let fileName = file.name || file.fileName;
            // 判断图片大小
            if (file.size / 1024 / 1024 > this.maxSize) {
                //alert('上传图片超出了最大限制,最大只能上传'+this.maxSize+'M');
                this.param.validate.push({
                    file: file,
                    message: this.maxSizeMessage,
                    type: 'size'
                });
                return false;
            }
            // 判断图片
            if (!fileName.toLowerCase().match('(jpg)|(png)|(jpeg)|(gif)$')) {
                this.param.validate.push({
                    file: file,
                    message: this.typeMessage,
                    type: 'format'
                });
                return false;
            }
            return true;
        },
        add(file) {
            this.queue.push(file);
        },
        run() {
            if (this.queue.length == 0) {
                return;
            }
            let item = this.queue.shift();
            this.doUpload(item);
        },
        doUpload(item) {
            let self = this,
                xhr,
                formData = new FormData();
            xhr = item.xhr = this.xhr = this.xhr || new XMLHttpRequest();
            //this.options.beforeSend.call(this, item, xhr);
            this.$emit('on-before', item, this.xhr);
            this.status = 'before';
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    self.onComplete(item, xhr);
                }
            };
            xhr.upload.onprogress = function(evt) {
                let loaded = evt.loaded,
                    tot = evt.total,
                    per = Math.floor(100 * loaded / tot); //已经上传的百分比
                self.$emit('on-progress', per);
                this.status = 'progress';
            };
            xhr.open('post', this.url, true);
            formData.append(this.field, item);
            xhr.send(formData);
        },
        onComplete: function(item, xhr) {
            if (item.status !== STATUS.ABORTED) {
                item.status = STATUS.COMPLETED;
                if (xhr.status === 200) {
                    //this.success.call(this, item, xhr);
                    this.$emit('on-success',JSON.parse(xhr.responseText), item);
                    this.status = 'success';
                } else {
                    //this.options.error.call(this, item, xhr);
                    this.$emit('on-error', item);
                }
                //this.options.complete.call(this, item, xhr);
                this.$emit('on-complete', item);
                this.status = 'complete';
            }
            if (item.xhr) {
                delete item.xhr;
            }
            this.run();
        },
        getFileUrl: function(file) {
            let url;
            if (navigator.userAgent.indexOf("MSIE") >= 1) { // IE 
                url = this.$el.children[0].value;
            } else {
                url = window.URL.createObjectURL(file);
            }
            return url;
        }
    },
    watch:{
        status( val ){
            if( val == 'run' ){
                this.run();
            }
        }
    }
}
</script>
<style lang="less">
@import "../../assets/css/common.less";
div.mv-uploader {
    position: relative;
    display: block;
    text-align: center;
    display:table-cell;
    vertical-align: middle; 
    color: @color-border-theme;
    input{
        .x-opacity(0);
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
    }
    .mv-icon-uploader{
        font-size: 0.4rem;
        display: inline-block;
    }
}
</style>
