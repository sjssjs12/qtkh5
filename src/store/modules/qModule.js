const qModule = {
  namespaced: true,
  state: {
    ticker: 0,                // 保存答题时间
    dbQuestions: [],          // 试题列表
    examSection: [],          // 试卷结构
    examInfo: {
      ExamName: '',           // 试卷名称
      ExamTypeName: '',       // 试卷类型
      MinutesCount: 0         // 考试时长
    },
    examRecord: {             // 试卷记录
      ExamID: 190,
      ExamName: '',
      FinishedDate: '',
      ExamRecordID: 0,
      Score: 0,
      ElapsedMinutes: '',
      Correct: 0
    },
    baseInfo: {               // 基础信息
      examid: 317,
      productid: 4,
      userid: 650814,
      examrecordid: 219866,
      questionid: 31892,
      oldurl: '',             // 上一步访问连接
      appid: '100005',        // 配置中心产品包通用id
      reportkey: 'ceshijilu', // 记录来源
      subsubjectid: 586,
      status: 0
    },
    answerSheet: {            // 用户当前答题卡
      ExamRecordID: 0,
      ElapsedMinutes: 0,
      SheetItems: []
    },
    questionIndexs: [],       // 试题ID列表，来自答题卡
    curStemGindex: 0,         // 当前题干在答题卡里的索引
    curQuestionID: 0,         // 与curstemgindex对应的试题ID
    questionBeginIndex: 0,    // 显示在第1个slide的试题索引
    gotoAnswerSheet: false,   // 答完最后一题后跳转到答题卡
    removeCollection: false,  // 是否执行收藏清理操作
    doRefreshNote: 0,         // 是否刷新笔记
    bindAnswerSrc: 0,       // 绑定到选项里的答案来源 0用户答题卡  1题干原答案
    subjectInfo: {
      Name: '',
      TypeName: ''
    }
  },
  getters: {
    // (state, getters, rootState, rootGetters)
    ticker: (state) => state.ticker,
    dbQuestions: (state) => state.dbQuestions,
    examSection: (state) => state.examSection,
    examInfo: (state) => state.examInfo,
    examRecord: state => state.examRecord,
    baseInfo: state => state.baseInfo,
    answerSheet: state => state.answerSheet, // 获取答题卡
    questionIndexs: state => state.questionIndexs, // 获取试题ID列表
    stemTotal: state => state.answerSheet.stemTotal, // 获取答题卡题干总数
    curStemGindex: state => state.curStemGindex,     // 获取当前答题卡全局索引
    curQuestionID: state => state.curQuestionID, // 获取当前试题ID
    // 获取显示在第一个slide里试题索引
    questionBeginIndex: state => state.questionBeginIndex,
    gotoAnswerSheet: (state) => state.gotoAnswerSheet,
    removeCollection: (state) => state.removeCollection,
    doRefreshNote: (state) => state.doRefreshNote,
    bindAnswerSrc: (state) => state.bindAnswerSrc,
    subjectInfo: (state) => state.subjectInfo
  },
  actions: {
    // ({ dispatch, commit, getters, rootGetters })
    tickerAdd: ({ commit }, value) => commit('TICKER_ADD', value),
    setDBQuestions: ({ commit }, value) => commit('SET_DB_QUESTIONS', value),
    setExamSection: ({ commit }, value) => commit('SET_EXAM_SECTION', value),
    setExamInfo: ({ commit }, value) => commit('SET_EXAM_INFO', value),
    setExamRecord: ({ commit }, value) => commit('SET_EXAM_RECORD', value),
    setBaseInfo: ({ commit }, value) => commit('SET_BASE_INFO', value),
    setFavourite: ({ commit }, value) => commit('SET_FAVOURITE', value),
    setAnswerSheet: ({ commit }, sheet) => commit('SET_ANSWER_SHEET', sheet),           // 设置答题卡内容
    setAnswerSheetStems: ({ commit }, value) => commit('SET_ANSWER_SHEET_STEMS', value), // 设置答题卡题干
    setQuestionIndexs: ({ commit }, value) => commit('SET_QUESTION_INDEXS', value),     // 获取试题ID列表
    // 设置当前题干全局索引 可传入int 或者 对象 {qid: 2332323, sid: 2}
    setCurStemGindex: ({ commit }, value) => commit('SET_CUR_STEM_GINDEX', value),
    // 设置第1个slide的试题索引
    setQuestionBeginIndex: ({ commit }, value) => commit('SET_QUESTION_BEGIN_INDEX', value),
    // 设置答案
    setAnswer: ({ commit }, value) => commit('SET_ANSWER', value),
    setGotoAnswerSheet: ({ commit }, value) => commit('SET_GOTO_ANSWERSHEET', value),
    setRemoveCollection: ({ commit }, value) => commit('SET_REMOVE_COLLECTION', value),
    setDoRefreshNote: ({ commit }, value) => commit('SET_DO_REFRESH_NOTE', value),
    setBindAnswerSrc: ({ commit }, value) => commit('SET_BIND_ANSWER_SRC', value),
    addAnswerSheetStems: ({ commit }, value) => commit('ADD_ANSWER_SHEET_STEMS', value), // 添加答题卡数据
    setSubjectInfo: ({ commit }, value) => commit('SET_SUBJECT_INFO', value)
  },
  mutations: {
    TICKER_ADD: (state, value) => {
      state.ticker = state.ticker + value
    },
    SET_DB_QUESTIONS: (state, value) => {
      if (value) {
        state.dbQuestions = value
      }
    },
    SET_EXAM_SECTION: (state, value) => {
      if (value) {
        state.examSection = value
      }
    },
    SET_EXAM_INFO: (state, value) => {
      if (value) {
        state.examInfo = value
      }
    },
    SET_EXAM_RECORD: (state, value) => {
      if (value) {
        state.examRecord = value
      }
    },
    SET_BASE_INFO: (state, value) => {
      if (value) {
        state.baseInfo = value
      }
    },
    SET_FAVOURITE: (state, value) => {
      var item = state.dbQuestions.filter(e => e.QuestionID === value.qid)
      if (item.length > 0) {
        item[0].IsFavorited = value.value
      }
    },
    SET_ANSWER_SHEET: (state, value) => {
      state.answerSheet = value
      // state.answerSheet.SheetItems = []
      state.questionIndexs = []
      let inx = 0
      if (value.SheetItems && value.SheetItems.length > 0) {
        value.SheetItems.forEach(item => {
          if (state.questionIndexs.indexOf(item.QID) === -1) {
            state.questionIndexs.push(item.QID)
          }
          // 添加 SheetItems
          item.Inx = inx
          inx++
          // state.answerSheet.SheetItems.push(item)
        })
      }
    },
    SET_ANSWER_SHEET_STEMS: (state, value) => {
      state.answerSheet.SheetItems = []
      state.questionIndexs = []
      let inx = 0
      if (value && value.length > 0) {
        value.forEach(item => {
          if (state.questionIndexs.indexOf(item.QID) === -1) {
            state.questionIndexs.push(item.QID)
          }
          // 添加 SheetItems
          item.Inx = inx
          inx++
          state.answerSheet.SheetItems.push(item)
        })
      }
    },
    SET_QUESTION_INDEXS: (state, value) => {
      state.questionIndexs = value
    },
    SET_CUR_STEM_GINDEX: (state, value) => {
      if (typeof (value) === 'object') {
        let QID = parseInt(value.QID)
        let c = state.answerSheet.SheetItems.filter(e =>
          e.QID === parseInt(value.QID) && e.QInx === parseInt(value.QInx)
        )
        if (c && c.length > 0) {
          state.curStemGindex = c[0].Inx
        }
        state.curQuestionID = QID
      } else {
        // 控制value范围 0 <= value <= length - 1
        if (value > state.answerSheet.SheetItems.length - 1) {
          value = state.answerSheet.SheetItems.length - 1
        }
        if (value < 0) {
          value = 0
        }
        state.curStemGindex = value
        let c = state.answerSheet.SheetItems[value]
        if (c) {
          state.curQuestionID = c.QID
        }
      }
    },
    SET_QUESTION_BEGIN_INDEX: (state, value) => {
      state.questionBeginIndex = value
    },
    SET_ANSWER: (state, value) => {
      let qid = parseInt(value.qid)
      let qinx = parseInt(value.qinx)
      let ainxs = []
      ainxs = ainxs.concat(value.ainxs)
      let curStem = state.answerSheet.SheetItems.filter(e => e.QID === qid && e.QInx === qinx)
      if (curStem.length > 0) {
        if (curStem[0].IsS) {
          curStem[0].IsD = true
        } else {
          curStem[0].UIs = ainxs
          curStem[0].IsD = true
          curStem[0].IsC = value.IsC
        }
      }
      console.log(state.answerSheet.SheetItems)
    },
    SET_GOTO_ANSWERSHEET: (state, value) => {
      state.gotoAnswerSheet = value
    },
    SET_REMOVE_COLLECTION: (state, value) => {
      state.removeCollection = value
    },
    SET_DO_REFRESH_NOTE: (state, value) => {
      state.doRefreshNote += value
    },
    SET_BIND_ANSWER_SRC: (state, value) => {
      state.bindAnswerSrc = value
    },
    // 根据试题数据，更新答题卡里题干的参数，比如是否主观题等
    UPDATE_ANSWERSHEET_STEM_PARAM: (state, value) => {
      if (state.answerSheet.SheetItems.length > 0) {
        value.forEach(question => {
          question.Stems.forEach(stem => {
            let sheet = state.answerSheet.SheetItems.filter(e1 => e1.QID === parseInt(question.QuestionID) && e1.QInx === stem.Index)
            if (sheet.length > 0) {
              // 更新是否主观题
              sheet[0].IsS = stem.Options.length === 0
            }
          })
        })
      }
    },
    ADD_ANSWER_SHEET_STEMS: (state, value) => {
      if (value.length > 0) {
        let Inx = 0
        if (state.answerSheet.SheetItems.length > 0) {
          Inx = state.answerSheet.SheetItems[state.answerSheet.SheetItems.length - 1].Inx + 1
        }
        value.forEach(item => {
          // 添加QuestionIndexs
          if (state.questionIndexs.indexOf(item.QID) === -1) {
            state.questionIndexs.push(item.QID)
          }
          // 添加 SheetItems
          item.Inx = Inx
          Inx++
          state.answerSheet.SheetItems.push(item)
        })
      }
    },
    SET_SUBJECT_INFO: (state, value) => {
      if (value) {
        state.subjectInfo = value
      }
    }
  }
}
export default qModule
