import Vue from 'vue';
// @ts-ignore
import component from '~component';

const root = new Vue({
  render: h => h(component)
}).$mount();

document.body.appendChild(root.$el);
