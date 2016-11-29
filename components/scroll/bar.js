


export default {
    /**
     * wrapperHeight 滚动条的高度，以及可视区域高度
     */
    $el: null,
    init: function ( wrapperHeight, clientHeight, parent ) {
        let scrollHeight = clientHeight * clientHeight / wrapperHeight;
        if( !$el ) {
            this.$el = document.createElement('div');
            this.$el.innerHtml = '<div class="mv-scroll-bar" style=""></div>'
        }
    }
}