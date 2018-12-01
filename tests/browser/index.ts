import Vue from "vue";
import "vue/dist/vue";
import Vuex from "vuex";
import "./firebase";

import { FireDBPlugin } from "../../src/FireDB";

Vue.use(Vuex);

const store = new Vuex.Store({ state: {}, plugins: [FireDBPlugin] });

const vue = new Vue({ store });

window.onload = () => vue.$mount("#app");

(window as any).vue = vue;