const uiModule = {
  namespaced: true,
  state: {
    headerConf: {  // 头部导航配置
      title: '',
      subTitle: '' // 副标题
    },
    qTabberConf: {              // 答题底部Tabber配置
      showTabber: true,         // 是否显示底部Tabber
      showRemove: false,        // 是否显示移除按钮,
      showAnswerSheetBtn: true  // 是否显示答题卡按钮
    },
    qConf: {
      showAnalysis: false,       // 是否用于显示解析页面
      showAnswerArea: true,      // 是否显示答案  “正确答案ABC”
      showUserAnswerText: true,  // 是否显示 “正误” “作答错误”
      doExercise: false,         // 是否刷题模式
      goNextStemWhenFin: 1       // 答完本题干时是否自动跳转至下个题干
    },
    appSkin: 'kaoyan'            // 皮肤名称
  },
  getters: {
    // (state, getters, rootState, rootGetters)
    headerConf: (state) => state.headerConf,
    qTabberConf: (state) => state.qTabberConf,
    showAnalysis: (state) => state.qConf.showAnalysis,
    showAnswerArea: (state) => state.qConf.showAnswerArea,
    showUserAnswerText: (state) => state.qConf.showUserAnswerText,
    doExercise: (state) => state.qConf.doExercise,
    goNextStemWhenFin: (state) => state.qConf.goNextStemWhenFin,
    appSkin: (state) => state.appSkin
  },
  actions: {
    // ({ dispatch, commit, getters, rootGetters })
    // headerConf
    setTitle: ({ commit }, value) => commit('SET_TITLE', value),
    setSubTitle: ({ commit }, value) => commit('SET_SUB_TITLE', value),
    // qTabberConf
    setShowTabber: ({ commit }, value) => commit('SET_SHOW_Tabber', value),
    setShowRemove: ({ commit }, value) => commit('SET_SHOW_REMOVE', value),
    setShowAnswerSheetBtn: ({ commit }, value) => commit('SET_SHOW_ANSWERSHEET_BTN', value),
    // qConf
    setShowAnalysis: ({ commit }, value) => commit('SET_SHOW_ANALYSIS', value),
    setShowAnswerArea: ({ commit }, value) => commit('SET_SHOW_ANSWER_AREA', value),
    setShowUserAnswerText: ({ commit }, value) => commit('SET_SHOW_USER_ANSWER_TEXT', value),
    setDoExercise: ({ commit }, value) => commit('SET_DO_EXCERCISE', value),
    setGoNextStemWhenFin: ({ commit }, value) => commit('SET_GO_NEXT_STEM_WHEN_FIN', value),
    setAppSkin: ({ commit }, value) => commit('SET_APP_SKIN', value)
  },
  mutations: {
    // headerConf
    SET_TITLE: (state, value) => {
      state.headerConf.title = value
    },
    SET_SUB_TITLE: (state, value) => {
      state.headerConf.subTitle = value
    },
    // qTabberConf
    SET_SHOW_Tabber: (state, value) => {
      state.qTabberConf.showTabber = value
    },
    SET_SHOW_REMOVE: (state, value) => {
      state.qTabberConf.showRemove = value
    },
    SET_SHOW_ANSWERSHEET_BTN: (state, value) => {
      state.qTabberConf.showAnswerSheetBtn = value
    },
    // qConf
    SET_SHOW_ANALYSIS: (state, value) => {
      state.qConf.showAnalysis = value
    },
    SET_SHOW_ANSWER_AREA: (state, value) => {
      state.qConf.showAnswerArea = value
    },
    SET_SHOW_USER_ANSWER_TEXT: (state, value) => {
      state.qConf.showUserAnswerText = value
    },
    SET_DO_EXCERCISE: (state, value) => {
      state.qConf.doExercise = value
    },
    SET_GO_NEXT_STEM_WHEN_FIN: (state, value) => {
      state.qConf.goNextStemWhenFin = value
    },
    SET_APP_SKIN: (state, value) => {
      state.appSkin = value
    }
  }
}
export default uiModule
