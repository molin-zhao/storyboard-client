import loginAttempt from "@/components/loginAttempt.vue";
import store from "@/store";
import i18n from "@/i18n";

const LoginAttempt = {
  install: function(Vue) {
    const LoginAttemptInstance = Vue.extend(loginAttempt);
    const initInstance = () => {
      // init vue instance
      currentLoginAttempt = new LoginAttemptInstance({ store, i18n });
      let loginAttemptEl = currentLoginAttempt.$mount().$el;
      document.body.appendChild(loginAttemptEl);
    };
    // add to vue prototype for global use
    let currentLoginAttempt = null;
    Vue.prototype.$loginAttempt = {
      show(options) {
        if (!currentLoginAttempt) initInstance();
        Object.assign(currentLoginAttempt, options);
        return currentLoginAttempt.show();
      }
    };
  }
};

export default LoginAttempt;
