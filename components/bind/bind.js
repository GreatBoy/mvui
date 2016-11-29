import {
    getStyle,
    indexOf,
    nowTime,
    scrollTop,
    css
} from '../../utils/utils';



let Event = {
    addEvent(el, type, callback, capture) {
        el.addEventListener(type, callback, !!capture);
    },
    removeEvent(el, type, callback, capture) {
        el.removeEventListener(type, callback, !!capture);
    }
};


// 获取带前缀的css样式
let _prefix = (function() {
    let arr = ['webkitTransition', 'MozTransition', 'msTransition', 'OTransition', 'transition'];
    let transform = '';
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] in document.documentElement.style) {
            transform = arr[i];
            break;
        }
    }
    return transform.substring(transform.length - "transition".length, 0);
})();

let getPrefixProp = function(trans) {
    return _prefix == '' ? _prefix + trans : _prefix + trans.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}


let transitionEndPro = {
    ''          : 'transitionend',
    'webkit'    : 'webkitTransitionEnd',
    'Moz'       : 'transitionend',
    'O'         : 'otransitionend',
    'ms'        : 'MSTransitionEnd'
};


const Style = {
    transition: getPrefixProp('transition'),
    transform: getPrefixProp('transform'),
    transitionEnd: transitionEndPro[_prefix],
    transitionTimingFunction: getPrefixProp('transitionTimingFunction'),
    transitionDuration: getPrefixProp('transitionDuration'),
    transitionDelay: getPrefixProp('transitionDelay'),
    transformOrigin: getPrefixProp('transformOrigin'),
};


const Easing = {
    'bounce': 'cubic-bezier(0.1, 0.83, 0.03, 0.8)',
    'momentum': 'cubic-bezier(.1,.52,.27,.77)',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    'ease': 'ease'
}

const EventType = (function() {
    let type = {
        touchstart: 'touchstart',
        touchmove: 'touchmove',
        touchend: 'touchend',
        touchcancel: 'touchcancel',
        wheel: 'wheel',
        DOMMouseScroll: 'DOMMouseScroll',
        mousewheel: 'mousewheel',
        transitionEnd: transitionEndPro[_prefix]
    }
    if (! ('ontouchstart' in document) ) {
        Object.assign(type, {
            touchstart: 'mousedown',
            touchend: 'mouseup',
            touchmove: 'mousemove',
            touchcancel: 'mouseleave',
        });
    }
    return type;
})();


class Bind {

    constructor(_this, scrollElem){
        this.delegate = _this;
        if( !this.check( this.delegate ) ){
            return false;
        }
        this.$scrollElem = scrollElem;
        this.Style = Style;
        this.Easing = Easing;
        this.init();
    }

    init(){
        this.bindEvent();
    }
    /**
     *  检查代理需要实现的属
     */
    check(_delegate){
        const prop = [
            'direction',
            'size',
            'isTransition',
            'bounceTime',
            'maxDistance',
            'pos',
            'disabled',
            'preventDefault'
        ];
        for(let i = 0; i < prop.length; i++){
            if( ! _delegate.hasOwnProperty(prop[i]) ){
                throw `代理对象必须有${prop[i]}属性`;
                return false;
            }
        }   
        return true;
    }

    /**
     *  绑定事件
     */
    bindEvent(destory) {
        let self = this;
        let type = destory ? 'removeEvent' : 'addEvent';
        for (let i in EventType) {
            Event[type](this.$scrollElem, EventType[i], self.touch.call(self) );
        }
    }

    /**
     * touch事件绑定
     */
    touch(event) {
        let self = this;
        return function(event){
            switch (event.type) {
                case EventType['touchstart']:
                    self.start(event);
                    break;
                case EventType['touchmove']:
                    self.move(event);
                    break;
                case EventType['touchend']:
                case EventType['touchcancel']:
                    self.end(event);
                    break;
                case EventType['wheel']:
                case EventType['DOMMouseScroll']:
                case EventType['mousewheel']:
                    self.wheel(event);
                    break;
                case EventType['transitionEnd']:
                    self.transitionEnd(event);
            }
        }
    }
    start(e) {

        this.flag = true;

        if (this.delegate.disabled) {
            return false;
        }

        if (this.delegate.preventDefault) {
            e.preventDefault();
        }
        this.delegate.start && this.delegate.start(e);
    }
    move(e) {
        
        if( e.type.indexOf('mouse') > -1){
            if( !this.flag ){
                return false;
            }
            e.preventDefault();
        } 

        if (this.delegate.disabled) {
            return false;
        }
        if (this.delegate.preventDefault) {
            e.preventDefault();
        }
        this.delegate.move && this.delegate.move(e);
    }
    end(e) {

        this.flag = false;

        if (this.delegate.disabled) {
            return false;
        }
        if (this.delegate.preventDefault) {
            e.preventDefault();
        }
        this.delegate.end && this.delegate.end(e);
    }
    wheel(e) {
        if (this.delegate.disabled) {
            return false;
        }
        if (this.delegate.preventDefault) {
            e.preventDefault();
        }
        this.delegate.wheel && this.delegate.wheel(event);
    }
    getPointer(e) {
        let touches = (e.touches || e.targetTouches || e.changedTouches);
        return touches ? touches[0] : e;
    }
    getDe(param) {
        return param + this.delegate.direction.toUpperCase();
    }
    translate(size) {
        size = parseInt(size);
        let translateStyle = {
            'x': 'translate3d(' + size + 'px, 0px, 0px)',
            'y': 'translate3d( 0px,' + size + 'px, 0px)'
        };
        this.$scrollElem.style[Style['transform']] = translateStyle[this.delegate.direction];
        this.delegate.size = size;
    }
    /**
     *  滚动到某地
     */
    scrollTo(size, time, ease) {
        time = time || 0;
        ease = Easing[ease] || Easing['bounce'];
        this.delegate.isTransition = time > 0;
        //如果有css动画 则直接调用css3移动
        //设置相关的css3动画属性及位置 直接位移过去
        this.transitionTimingFunction(ease);
        this.transitionTime(time);
        this.translate(size);
    }
    /**
     *  滚动动画结束
     */
    transitionEnd(e) {
        // if (!this.delegate.isTransition) {
        //     return;
        // }
        this.transitionTime();
        this.delegate.isTransition = false;
        // if (!this.resetPos(this.delegate.bounceTime)) {
        //     this.delegate.isTransition = false;
        // }
        this.delegate.transitionEnd && this.delegate.transitionEnd(event);
    }
    transitionTime (time) {
        time = time || 0;
        this.$scrollElem.style[Style['transitionDuration']] = time + 'ms';
    }
    transitionTimingFunction (easing) {
        easing = easing || Easing['bounce'];
        this.$scrollElem.style[Style['transitionTimingFunction']] = easing;
    }
    resetPos (time, ease) {
        let size = this.delegate.size;
        time = time || 0;
        ease = Easing[ease] || Easing['bounce'];

        if (this.delegate.size > 0) {
            this.delegate.size = 0;
        } else if (this.delegate.size < this.delegate.maxDistance) {
            this.delegate.size = this.delegate.maxDistance;
        } else {
            return false;
        }
        this.scrollTo(this.delegate.size, time, ease);
        return true;
    }
    stopAnimate (){
        // 获取现在的滚动x，y
        let current = 0;
        let transform = css(this.$scrollElem, Style['transform']);
        if (transform != "") {
            transform = transform.replace("translate3d(", "").replace(")", "");
            let transArr = transform.split(',');
            current = transArr[this.delegate.pos[this.delegate.direction]].replace('px', '')
        }
        this.translate(parseInt(current));
    }
}

export default Bind;
