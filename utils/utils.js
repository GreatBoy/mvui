/**
 * Vue属于vm框架，主要避免dom的操作，但是某些dom的操作我们确是不可避免的。例如获取一个x高度，例如获取鼠标的位置
 * 本库主要封装一些vue对类型判断、样式、以及事件event的一些封装，简称vlib.js 
 * api主要兼容jquery，当然有的用户还是想使用jquery也没有问题。
 */

export function debug(str){
    document.querySelector('header').innerText = str;
}
 
export function device() {
    var userAgent = window.navigator.userAgent;
    return {
        mobile: !!userAgent.match(/AppleWebKit.*Mobile.*/), 
        ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), 
        android: userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1,
        iPhone: userAgent.indexOf('iPhone') > -1 , 
        iPad: userAgent.indexOf('iPad') > -1 
    };
}

export function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
}

export function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

export function isBoolean(obj) {
    return obj === false || obj === true || Object.prototype.toString.call(obj) === '[object Boolean]';
}

export function isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
}

export function isEmptyObject(obj) {
    for (let key in obj) {
        return false;
    }
    return true
}

export function camelCase(str) {
    str = str.replace(/-+(.)?/g, function(matchStr, targetChar) {
        return targetChar ? targetChar.toUpperCase() : ''
    });
    return str;
}

export function nowTime() {
    if (Date.now) {
        return Date.now();
    } else {
        return new Date().getTime();;
    }
}

let uuid = 0;
export function getUUID() {
    return ++uuid;
}

/**
 * 延迟执行，采用的underscore的方法
 */
export function debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
        var last = nowTime() - timestamp;

        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return function() {
        context = this;
        args = arguments;
        timestamp = nowTime();
        var callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
}

/**
 *  节流函数 underscore的方法
 *  表示首次调用返回值方法时，会马上调用func；否则仅会记录当前时刻，当第二次调用的时间间隔超过wait时，才调用func。
 *  options.leading = true;
 *  表示当调用方法时，未到达wait指定的时间间隔，则启动计时器延迟调用func函数，若后续在既未达到wait指定的时间间隔和func函数又未被调用的情况下调用返回值方法，则被调用请求将被丢弃。
 *  options.trailing = true; 
 *  注意：当options.trailing = false时，效果与上面的简单实现效果相同
 */
export function throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
        previous = options.leading === false ? 0 : nowTime();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };


    return function() {
        var now = nowTime();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}

export function trim(str) {
    if (isString(str)) {
        if (String.prototype.trim) {
            return String.prototype.trim.call(str);
        } else {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
    } else {
        return '';
    }
}

export function indexOf(value, arr) {
    if (isArray(arr)) {
        if (arr.indexOf(value) > -1) {
            return value;
        } else {
            return "";
        }
    }
}

export function validate(value, arr) {
    if ( indexOf(value, arr) == ""){
        throw "mvui组件参数" + value + "错误," + "不在" + arr.join(',') + "可选参数中";
        return false;
    } else {
        return true;
    }
}

export function getStyle(styles) {
    if (isObject(styles)) {
        return styles;
    }
    if (isString(styles)) {
        var obj = {};
        var arr = styles.split(';');
        arr.forEach(function(v, k) {
            if (v) {
                let t = v.split(":");
                obj[t[0]] = t[1];
            }
        });
        return obj;
    } else {
        return {};
    }
}

//获取滚动条的位置。
export function scrollTop(elem) {
    return (elem && elem.scrollTop) || elem.pageYOffset || document.body.scrollTop;
}
export function scrollLeft(elem) {
    var de = document.documentElement;
    return (elem && elem.scrollLeft) || elem.pageXOffset || document.body.scrollLeft;
}

// 获取属性值
export function attr(elem) {
    return (typeof name == 'string' && !(1 in arguments)) ?
        (0 in elem && elem[0].nodeType == 1 && (result = elem[0].getAttribute(name)) != null ? result : undefined) :
        elem.each(function(idx) {
            if (elem.nodeType !== 1) return
            if (isObject(name))
                for (key in name) setAttribute(elem, key, name[key])
            else setAttribute(elem, name, funcArg(elem, value, idx, elem.getAttribute(name)))
        })
}

// 获取样式
export function css(elem, name) {
    if (elem.style[name]) {
        return elem.style[name];
    } else if (elem.currentStyle) {
        return elem.currentStyle[name];
    } else if (document.defaultView && document.defaultView.getComputedStyle) {
        name = name.replace(/([A-Z])/g, "-$1");
        name = name.toLowerCase();
        var s = document.defaultView.getComputedStyle(elem, "");
        return s && s.getPropertyValue(name);
    } else {
        return null
    }
}

//可视区域的高度、宽度
export function windowHeight() {
    var de = document.documentElement;
    return self.innerHeight || (de && de.offsetHeight) || document.body.offsetHeight;
}
export function windowWidth() {
    var de = document.documentElement;
    return self.innerWidth || (de && de.offsetWidth) || document.body.offsetWidth;
}


//获取元素的样式值。
export function getStyleByElem(elem, name) {
    if (elem.style[name]) {
        return elem.style[name];
    } else if (elem.currentStyle) {
        return elem.currentStyle[name];
    } else if (document.defaultView && document.defaultView.getComputedStyle) {
        name = name.replace(/([A-Z])/g, "-$1");
        name = name.toLowerCase();
        var s = document.defaultView.getComputedStyle(elem, "");
        return s && s.getPropertyValue(name);
    } else {
        return null
    }
}

//获取元素使用css控制大小的高度和宽度
export function getHeight(elem) {
    return parseInt(getStyleByElem(elem, "height"));
}
export function getWidth(elem) {
    return parseInt(getStyleByElem(elem, "width"));
}

//获取元素可能，完整的高度和宽度
export function getFullHeight(elem) {
    if (getStyleByElem(elem, "display") != "none") {
        return getHeight(elem) || elem.offsetHeight;
    } else {
        var old = resetCss(elem, { display: "block", visibility: "hidden", position: "absolute" });
        var h = elem.clientHeight || getHeight(elem);
        restoreCss(elem, old);
        return h;
    }
}
export function getFullWidth(elem) {
    if (getStyleByElem(elem, "display") != "none") {
        return getWidth(elem) || elem.offsetWidth;
    } else {
        var old = resetCss(elem, { display: "block", visibility: "hidden", position: "absolute" });
        var w = elem.clientWidth || getWidth(elem);
        restoreCss(elem, old);
        return w;
    }
}

//设置css，并保存旧的css
export function resetCss(elem, prop) {
    var old = {};
    for (var i in prop) {
        old[i] = elem.style[i];
        elem.style[i] = prop[i];
    }
    return old;
}
export function restoreCss(elem, prop) {
    for (var i in prop) {
        elem.style[i] = prop[i];
    }
}

// hasClass
export function hasClass(elem, prop) {
    if ( elem.className.indexOf(prop) > -1 ){
        return true;
    } else {
        return false;
    }
}

// addClass
export function addClass(elem, prop) {
    let className = trim(elem.className).replace(/\s+/g, ' ');
    let classSet = new Set(className.split(' '));
    classSet.add(prop);
    elem.className = trim(Array.from(classSet).join(' '));
}

// removeClass
export function removeClass(elem, prop) {
    let className = trim(elem.className).replace(/\s+/g, ' ');
    let classSet = new Set(className.split(' '));
    classSet.delete(prop);
    elem.className = trim(Array.from(classSet).join(' '));
}

