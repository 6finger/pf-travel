import Vue, { VNodeDirective, VNode } from 'vue';

var handler: (event: MouseEvent) => void;

Vue.directive('click-outside', {
  bind: (el: HTMLElement, binding: VNodeDirective, vnode: VNode) => {
    handler = function (event: MouseEvent) {
      if (!(event.target instanceof Node) || !(el == event.target || el.contains(event.target))) {
        if (vnode.context) {
          let fn = (<any>vnode.context)[binding.expression];
          if (typeof fn == 'function') {
            fn(event);
          }
        }
      }
    };
    document.body.addEventListener('click', handler, false)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', handler)
  },
});
