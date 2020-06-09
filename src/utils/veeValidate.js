import Vue from "vue";
import { ValidationProvider, extend } from "vee-validate";

// extend rules to validation-provider
extend("phone", {
  validate: function(value) {
    return /^1\d{10}/.test(value);
  },
  message: "请输入有效的手机号码",
});

// register component to Vue
Vue.component("ValidationProvider", ValidationProvider);
