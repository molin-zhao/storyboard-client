// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import VueResource from "vue-resource";
import VueScrollLock from "vue-scroll-lock";
import VueAMap from "vue-amap";

// bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

// custom elements
import "@/assets/icon";
import "@/assets/loading";
import Alert from "@/plugins/alert";
import Toast from "@/plugins/toast";
import Confirm from "@/plugins/confirm";
import Chatbox from "@/plugins/chatbox";
import Mailbox from "@/plugins/mailbox";
import Task from "@/plugins/task";

import store from "@/store";
import router from "@/router";
import i18n from "@/i18n";

Vue.config.productionTip = false;
Vue.directive("tooltip", function(el, binding) {
  $(el).tooltip({
    title: binding.value,
    placement: binding.arg,
    trigger: "hover"
  });
});
Vue.directive("title", function(el, binding) {
  document.title = el.dataset.title;
});

VueAMap.initAMapApiLoader({
  key: "234d5c63b4c1533e76233a4d1da9f5d2",
  plugin: [
    "AMap.Autocomplete",
    "AMap.PlaceSearch",
    "AMap.Scale",
    "AMap.OverView",
    "AMap.ToolBar",
    "AMap.MapType",
    "AMap.PolyEditor",
    "AMap.CircleEditor"
  ],
  v: "1.4.4"
});
Vue.use(Alert);
Vue.use(Toast);
Vue.use(Confirm);
Vue.use(Chatbox);
Vue.use(Mailbox);
Vue.use(Task);
Vue.use(VueScrollLock);
Vue.use(VueResource);
Vue.use(VueAMap);

Vue.http.options.emulateJSON = true;
Vue.http.interceptors.push(function(req, next) {
  if (this) {
    const token = this.token || store.state.user.token;
    if (token) req.headers.set("Authorization", token);
  }
  next(res => {
    /**
     * 401 unauthroized -> header token invalid
     * 403 forbidden
     * 406 not acceptable
     * 400 bad request -> params not provided or params error
     * 200 ok
     * 201 reset token
     * 500 internal server error
     * 0 network error
     */

    if (res.status === 401) {
      if (this && this.$alert) {
        this.$alert.show({
          type: "warning",
          message: this.$t("SESSION_EXPIRED_ERROR"),
          interval: 5000
        });
      }
      // this.$router.push({ name: "login", params: { mode: "token_expired" } });
    }
    if (res.status === 500) {
      if (this && this.$alert) {
        this.$alert.show({
          type: "warning",
          message: this.$t("SERVER_ERROR"),
          interval: 5000
        });
      }
    }
    if (res.status === 0) {
      if (this && this.$alert) {
        this.$alert.show({
          type: "warning",
          message: this.$t("NETWORK_ERROR"),
          interval: 5000
        });
      }
    }
    return res;
  });
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  i18n,
  store,
  router,
  components: { App },
  template: "<App/>"
});
