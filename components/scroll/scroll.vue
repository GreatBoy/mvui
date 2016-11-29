<template>
    <div :class="classes" :style="styles">
        <Pullrefresh v-if="pullRefresh" scroll="scroll" :status.sync="refreshStatus">
            <div slot="down">
                <Icon class="mv-icon-arrow-down-c"></Icon>
                <span>松手更新...</span>
            </div>
            <div slot="up">
                <slot name="up">
                    <Icon class="mv-icon-arrow-up-c"></Icon>
                    <span>下拉刷新...</span>
                </slot>
            </div>
            <div slot="load">
                <slot name="load">
                    <Loadding show="show" class="mv-refresh-loadding"><Icon class="mv-icon-loading-6"></Icon></Loadding>
                    <span>加载中...</span>
                </slot>
            </div>
        </Pullrefresh>
        <slot></slot>
    </div>
</template>
<script>
import {
    getStyle,
    validate,
    indexOf,
    nowTime,
    css,
    getFullHeight,
    getFullWidth
} from '../../utils/utils';

import Bind from '../bind/bind.js';

import Pullrefresh from '../pullrefresh/pullrefresh.vue';
import Icon from '../icon/icon.vue';

export default {
    props: {
        class: {
            type: String,
                default: ""
        },
        style: {
            type: [Object, String],
            default: ""
        },
        /**
         *  滚动距离
         */
        size: {
            type: Number,
            default: 0
        },
        /**
         *  y 垂直，  x水平
         */
        direction: {
            type: String,
            default: 'y'
        },
        /**
         *  desc 是否支持惯性
         */
        isMomentum: {
            type: Boolean,
            default: true
        },
        /**
         *  超出边界是否还能拖动 默认true
         */
        isBounce: {
            type: Boolean,
            default: true
        },
        /**
         *  回弹时间
         */
        bounceTime: {
            type: Number,
            default: 350
        },
        /**
         *  是否阻止默认滚动事件
         */
        preventDefault: {
            type: Boolean,
            default: true
        },
        /**
         *  是否禁用
         */
        disabled: {
            type: Boolean,
            default: false
        },
        // /**
        //  *  是否显示滚动条
        //  */
        // showBar: {
        //     type: Boolean,
        //     default: false
        // },
        pullRefresh: {
            type: Boolean,
            default: false
        },
        /**
         * 0 等待  1 刷新中 2刷新完成
         */
        refreshStatus: {
            type: String,
            default: 'ready',
            validator (value) {
                return validate(value, ['ready','loading','move']);
            } 
        },
        /**
         * 是否重新计算
         */
        isRefresh: {
            type: Boolean,
            default: false
        }
    },
    components:{
        Pullrefresh,
        Icon
    },
    data (){
        let pos = {
            'page': 'page' + this.direction.toUpperCase(),
            'pointer': 'pointer' + this.direction.toUpperCase(),
            'x' : 0,
            'y' : 1
        }

        return {
            startPos: 0, // 开始位置
            pointPos: 0, // 手指位置
            startTime: 0, // 开始的时间
            maxDistance: 0, //滚动的最大距离
            isTransition: false, // 是否在动画中,
            pos: pos
        }
    },
    computed: {
        styles () {
            return getStyle( this.style );
        },
        classes () {
            return `mv-scroll ${this.class}`;
        }
    },
    ready () {
        this.bind = new Bind(this, this.$el);
        this.refresh();
    },
    methods: {
        /**
         *  初始化一些参数
         */
        refresh () {
            this.maxDistance = this.getMaxDistance();
            this.endTime = 0;
            this.bind.resetPos();
            if( this.pullRefresh ){
                this.refreshHeight = this.$el.children[0].children[0].offsetHeight;
            }
        },
        getMaxDistance(){
            let sizeFunction = this.direction == 'y' ? getFullHeight : getFullWidth,
            tag = this.direction == 'y' ? 'Height' : 'Width',
            size = 0;
            Array.from(this.$el.children).forEach(v => {
                size += sizeFunction(v);
            })
            return this.$el.parentNode['offset'+ tag] - size;
        },        
        start( e ) {
            // 获取touches
            let pointer = this.bind.getPointer(e);

            // 暂停正在移动的动画
            this.bind.transitionTime();

            //如果以前的动画正在进行，则先停止
            if ( this.isTransition ) {
                this.bind.stopAnimate();
            }

            // 记录手指的位置
            this.pointPos = pointer[this.pos['page']] || 0;

            // 记录时间戳
            this.startTime = e.timestamp || nowTime();

            // 初始化缓存位置
            this.startPos = this.size;
            //this.moved = false;

            this.$emit('scroll-start', e);
        },
        move ( e ) {

            // 获取手指
            let pointer = this.bind.getPointer(e);

            // 计算距离上一次拖动的距离
            let diff = pointer[this.pos['page']] - this.pointPos;

            // 保存手指的位置，覆盖start时的位置
            this.pointPos = pointer[this.pos['page']];

            // 如果距离较小，则不滑动
            if ( Math.abs(diff) < 5 && ! this.pullRefresh ) {
                return;
            }

            // 计算新的位置，为原来的位置加上新的位置
            let newPos = this.size + diff;

            /**
             * 如果拖动已经超出边界了,则减慢拖动的速度
             */

            if ( newPos > 0 || newPos < this.maxDistance ) {
                newPos =  this.isBounce ? ( this.size + diff / 3 ) : ( newPos > 0  ? 0 : this.maxDistance );
            }

            // 下拉刷新纪录
            if(this.pullRefresh){
                if ( this.size > this.refreshHeight ) {
                    this.refreshStatus = 'move';
                } else {
                    this.refreshStatus = 'ready';
                }
            }

            // this.moved = true;
            this.bind.translate(newPos);

            this.$emit('scroll-move', e);

            // 记录触摸时移动的时间，以及移动的距离，为缓动做准备, 借鉴iscroll
            let timestamp = e.timestamp || nowTime();
            if( timestamp - this.startTime > 300){
                this.startPos = this.size;
                this.startTime = timestamp;
            }

        },
        end ( e ) {

            // 设置惯性动画为false， 结束的时候，才是缓动的开始
            this.isTransition = false;

            // 是否支持下拉刷新
            if(this.pullRefresh){
                if( this.size > this.refreshHeight ){
                    this.refreshStatus = 'loading';
                    this.bind.scrollTo(this.refreshHeight, 500, 'ease-out');
                    this.$emit('on-refresh', e);
                    return;
                }
            }

            // 如果超出边界，需要做处理
            if ( this.bind.resetPos(this.bounceTime) ) {
                return;
            }

            // 修正位置
            this.bind.scrollTo(this.size);

            // 计算数据
            let duration = (this.timestamp || nowTime()) - this.startTime ;
            let newPos = this.size;
            let time = 0;
            let diff = this.size - this.startPos;
            let distance = Math.abs(diff);
            
            if(duration < 250  && distance < 20){
                // 点击行为
                return;
            }

            // 用距离加时间计算， 借鉴iscroll的方案，牛
            if ( this.isMomentum && duration < 300 ) {
                // 动量计算公式 mv*v/2
                let v = distance / duration;
                let momentumSize =  1666 * v * v / 2; 
                time = momentumSize / v ;
                newPos = diff > 0 ?  momentumSize :  ( 0 - momentumSize ) ;

                newPos = this.size + newPos;
                this.isTransition = true;
            }

            if( this.size != newPos){
                // 判断是否超出边界了
                newPos = newPos > 0 ? 0 : ( newPos < this.maxDistance ? this.maxDistance : newPos );
                this.bind.scrollTo( newPos , time, 'momentum');
            }

            this.$emit('scroll-end', e);

        },
        wheel ( e ) {
            // 滑轮滚动， 单独处理， 主要应用于pc，赞不处理，回头升级
        },
        transitionEnd (e){
            this.$emit('scroll-transition-end', e);
        },
        refreshEnd () {
            // 如果超出边界，需要做处理
            if (this.bind.resetPos(this.bounceTime, 'ease-out')) {
                return;
            }
        }
    },
    watch: {
        refreshStatus( val ){
            if( val == 'ready' ) {
                this.refreshEnd();
            }
        },
        isRefresh ( val ){
            if ( val ){
                this.refresh();
                this.isRefresh = false;
            }
        }
    }
}


// 流程，初始化 -》 绑定事件，判断是否支持3d，不支持直接用translate

// 点击-》触发touchstart 

// 判断是否开启滚动，没有返回

// 如果阻止默认事件，则返回

// 设置moved为false

// 停止以前的动画

// 记录开始时间

// 如果惯性动画正在进行，则需要把动画停止在触摸位置

// 计算开始位置

// 设置滑动开关，start开关开启，记录

// touchstart回调







// ->> 触发touchmove事件，

// 判断start开关是否开启，如果未开启不调用move事件

// 判断滚动是否可用

// 判断是否需要阻止事件


// 记录拖动数据


// 判断拖动时间如果大于300毫秒，则不拖动，返回，并且距离小于10像素的时候



// 做方向判断



// 判断是否超出边界，如果超出边界，则减慢拖动距离



// 计算拖动距离，然后开始拖动


// moved 为true






// 触发end事件


// 判断是否可用，

// 判断是否组织冒泡


// 手指离开之前，保存数据

// 计算拖动耗时，用作动量计算


// 重置是否处于动画状态

// 计算结束时间

// 处理超出边界的计算


// 滚动到最后位置


// 如果在动画得时间范围内，则动量动画






// ==========
// refresh 刷新，如果遇到了转屏等事件，需要重置参数



// 兼容处理，需要处理css3 前缀





// 参数
// startX 开始x距离
// startY 开始y距离
// direction 滚动方向 默认是上下滚动 
// isMomentum 是否有惯性 默认true
// isBounce  超出边界是否还能拖动 默认true
// bounceTime 回弹时间
// preventDefault: true, 是否阻止默认滚动事件

//当遇到表单元素则不阻止冒泡，而是弹出系统自带相应的输入控件
//preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },
 


// start





// end


</script>
<style lang="less">
@import "../../assets/css/common.less";
.mv-scroll {
    background: white;
    .x-prefix(backface-visibility; hidden;);
    .x-prefix(backface-perspective; 1000;);
    .x-transform-translate3d(0px, 0px, 0px);
}
</style>
