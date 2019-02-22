import Vue from 'vue'
import Vuex from 'vuex'
import userModule from './modules/userModule' // 用户相关模块
import qModule from './modules/qModule'     // 答题相关的功能，试题数据、答题卡、当前试题索引等
import uiModule from './modules/uiModule'     // 界面元素相关模块
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    userModule, // 用户相关模块
    qModule,    // 答题相关的功能，试题数据、答题卡、当前试题索引等
    uiModule    // 界面元素相关模块
  }
})
export default store
