import Vue from 'vue';
import Icon from '../icon/icon.vue';
import Modal from '../modal/modal.vue';
import Button from '../button/button.vue';
import { getStyle, indexOf } from '../../utils/utils';


class Alert{
    constructor(){
        this.options = {};
        this.instance = null;
        this.initAlert();
    }
    initAlert (){
        const $div = document.createElement('div');
        const self = this;
        $div.innerHTML = `
            <Modal :show.sync="show">
                <div slot="header"><div>{{{ title }}}</div></div>
                <div>
                    {{{ content }}}
                </div>
                <div slot="footer">
                    <Button class="mv-alert-btn mv-1px-t" style="border: 0px;background-color: transparent;width: 100%;height: 0.4rem;" @click="ok">{{ okText }}</Button>
                </div>
            </Modal>
        `;

        document.body.appendChild($div);
        this.modal = new Vue({
            el: $div,
            components: { 
                Modal, 
                Button, 
                Icon 
            },
            data: Object.assign(this.options, {
                show: false,
                title: '',
                content: '',
                okText: '确定',
                onClose: function(){}
            }), 
            methods: {
                ok () {
                    this.show = false;
                    this.onClose && this.onClose.call(self);
                },
                destroy () {
                    this.$destroy();
                    document.body.removeChild($div);
                }
            }
        });

    }
    show(param){
        Object.assign(this.options, param);
    }
    destory(){
        this.modal.destroy();
        Alert.instance = null;
    }
    static getInstance(){
        if(!this.instance){
            this.instance = new Alert()
        }
        return this.instance;
    }
}

export default {
    show(param = {}){
        let instance = Alert.getInstance();
        param['show'] = true;
        instance.show(param);
    },
    remove(){
        let instance = Alert.getInstance();
        instance.destory();
    }
}