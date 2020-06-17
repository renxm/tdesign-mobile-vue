import vueToast from './toast.vue';

import { createApp, defineComponent } from 'vue';
import { ToastProps, ToastPropsDefault } from './toast.interface';

let instance: any = null;

function Toast(props: any): Object {
  const root: HTMLElement = document.createElement('div');
  document.body.appendChild(root);

  const propsObject = {
    ...ToastPropsDefault,
    ...parseOptions(props),
  };

  if (instance) {
    instance.clear();
  }
  instance = defineComponent(vueToast);

  instance.clear = () => {
    clearTimeout(instance.timer);
    root.remove();
  };

  if (propsObject.duration && propsObject.duration > 0) {
    instance.timer = setTimeout(() => {
      instance.clear();
    }, propsObject.duration);
  }

  createApp(instance, { ...propsObject }).mount(root);

  return instance;
}

Toast.clear = () => {
  if (instance) {
    instance.clear();
  }
};

(['loading', 'success', 'fail']).forEach((type: string): void => {
  Toast[type] = (options: ToastProps | string) => {
    let props: ToastProps = {
      message: '',
      type,
    };

    if (typeof options === 'string') {
      props.message = options;
    } else {
      props = { ...props, ...options };
    }

    return Toast(props);
  };
});


function parseOptions(message: any) {
  if (typeof message === 'string') {
    return { message };
  }
  return message;
}

export default Toast;
