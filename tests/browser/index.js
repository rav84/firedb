"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var vue_1 = __importDefault(require("vue"));
require("vue/dist/vue");
var vuex_1 = __importDefault(require("vuex"));
require("./firebase");
var FireDB_1 = require("../../src/FireDB");
vue_1["default"].use(vuex_1["default"]);
var store = new vuex_1["default"].Store({ state: {}, plugins: [FireDB_1.FireDBPlugin] });
var vue = new vue_1["default"]({ store: store });
window.onload = function () { return vue.$mount("#app"); };
window.vue = vue;
