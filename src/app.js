import Vue from "vue";
import App from "./App.vue";
import { createStore } from "./store";
import { createRouter } from "./router";
import { sync } from "vuex-router-sync";
import titleMixin from "@/utils/title";
import * as filters from "@/utils/filters";
import utils from "@/utils";

const EventBus = new Vue();
// 全局 utils
Vue.prototype.$util = utils;

Vue.prototype.$event = EventBus;
// 注册获取预读取数据的方法
Vue.prototype.getPrefetchData = function() {
  const name = this.$options.name;
  return name ? this.$store.state[`${this.$route.fullPath}_${name}`] : {};
};
// vue错误上报
const errorHandler = (error, vm, info) => {
  if (typeof window !== "undefined") {
    if (
      window.muErrorMonitor &&
      typeof window.muErrorMonitor.vueErrorHandler === "function"
    ) {
      window.muErrorMonitor.vueErrorHandler(error, vm, info);
    } else {
      typeof console.error === "function" && console.error(error, vm, info);
    }
  } else {
    console.error(`error during render : ${vm.$route.fullPath}`);
    console.error(error.stack);
  }
  // throw error
};
Vue.config.errorHandler = errorHandler;
// mixin for handling title
Vue.mixin(titleMixin);

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp() {
  // create store and router instances
  const store = createStore();
  const router = createRouter();
  // sync the router with the vuex store.
  // this registers `store.state.route`
  sync(store, router);
  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  });
  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { app, router, store };
}
