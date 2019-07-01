//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    // 任务名字
    name: '',
    // 剩余任务数量
    leftCount: 0,
    //任务数据
    list: [
      { id: 1, name: '今天吃了没', completed: true },
      { id: 2, name: '今天喝了没', completed: true },
      { id: 3, name: '今天敲了没', completed: false },
    ],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //删除任务
  delItem(e){
    let id = e.currentTarget.dataset.id;

    let index = this.data.list.findIndex(item => item.id === id)
    this.data.list.splice(index, 1)
    this.setData(this.data)

    this.setLeftCount()
  },
  // 切换任务状态
  toggleState(e){
    let id = e.currentTarget.dataset.id;

    let index = this.data.list.findIndex(item => item.id === id)
    this.data.list[index].completed = !this.data.list[index].completed

    this.setData(this.data)

    this.setLeftCount()
  },
  // 切换所有任务状态
  toggleAll() {
    let flag = this.data.list.every(item => item.completed)

    this.data.list.forEach(item => item.completed = !flag)
    this.setData(this.data)

    this.setLeftCount()
  },
  //添加任务 1,双向数据绑定
  getName(e) {
    // 获取到文本框的value值
    this.data.name = e.detail.value
    this.setData(this.data)
  },
  //添加任务  2，添加任务
  addItem(){
    this.data.list.push({
      id: this.data.list.length + 1,
      name: this.data.name,
      completed: false
    })

    this.data.name = ''
    this.setData(this.data)

    this.setLeftCount()
  },
  // 清除已完成的任务
  clearCompleted(){
    this.data.list = this.data.list.filter(item => !item.completed)
    this.setData(this.data)
  },
  onShow(){
    this.setLeftCount()
  },
  // 显示剩余任务
  setLeftCount(){
    this.data.leftCount = this.data.list.filter(item => !item.completed).length
    this.setData(this.data)
  },
  // 显示隐藏清空按钮
})
