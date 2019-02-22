<template>
  <div>
      <popup v-model="mShow" @on-hide="close">
        <div class="share-icon clearfix">
          <button type="button" @click="shareQ(1)"><img src="../images/wx-icon.png"/><i>微信</i></button>
          <button type="button" @click="shareQ(3)"><img src="../images/friend-icon.png"/><i>朋友圈</i></button>
          <button type="button" @click="shareQ(2)"><img src="../images/qq-icon.png"/><i>QQ</i></button>
          <button type="button" @click="shareQ(5)"><img src="../images/wb-icon.png"/><i>新浪微博</i></button>
        </div>
        <x-button @click.native="close">取消</x-button>
      </popup>
    </div> 
</template>

<script>
import { Popup } from 'vux'
import qktutils from '../js/qtkutils'
import { mapGetters } from 'vuex'
export default {
  name: 'SharePopup',
  directives: {},
  components: {
    Popup
  },
  props: {
    PopupShow: {
      type: Boolean,
      required: true
    },
    qid: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      mShow: false
    }
  },
  watch: {
    PopupShow () {
      // console.log('PopupShow change')
      this.mShow = this.PopupShow
    }
  },
  computed: {
    ...mapGetters('uiModule', ['appSkin'])
  },
  methods: {
    shareQ (dist) {
      console.log(`share ${this.qid} to ${dist}`)
      let url = 'https://tikuh5.wendu.com/question/share?s=' + qktutils.Encrypt(this.qid) + '&skin=' + this.appSkin
      // let url = process.env.H5_HOST + 'question/share?s=' + qktutils.Encrypt(this.qid) + '&skin=' + this.appSkin
      if (window.jsbridge) {
        window.jsbridge.shareQ(dist, url)
      }
      if (window.webkit) {
        var dict = {Dist: dist, Url: url}
        window.webkit.messageHandlers.shareQ.postMessage(dict)
      }
    },
    close () {
      this.$emit('close')
    }
  },
  created () {},
  mounted () {}
}
</script>

<style lang="less" scoped>
.share-icon {
  button {
    width: 25%;
    margin-top: 4%;
    line-height: 36px;
    font-size: 12px;
    color: #666666;
    text-align: center;
    outline: none;
    border: none;
    background: none;
    float: left;
    img {
      width: 40%;
      margin: 0 auto;
    }
    i {
      font-style: normal;
    }
  }
}
.vux-popup-dialog {
  background: #fff;
}
.weui-btn {
  line-height: 48px;
  border-radius: 0;
  font-size: 16px;
  color: #333;
  background: #fff;
}
</style>
