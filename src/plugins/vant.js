import Vue from "vue";
// register vant component to Vue
import {
  Button,
  NavBar,
  Form,
  Field,
  Toast,
  CountDown,
  Tabbar,
  TabbarItem,
  List,
  Cell,
  Tab,
  Tabs,
} from "vant";

Vue.use(Button)
  .use(NavBar)
  .use(Form)
  .use(Field)
  .use(Toast)
  .use(CountDown)
  .use(Tabbar)
  .use(TabbarItem)
  .use(List)
  .use(Cell)
  .use(Tabs)
  .use(Tab);