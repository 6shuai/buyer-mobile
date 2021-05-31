Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "../image/tab_bar_home.png",
      selectedIconPath: "../image/tab_bar_home_active.png",
      text: "抢购"
    }, {
      pagePath: "/pages/rank/rank",
      iconPath: "../image/tab_bar_rank.png",
      selectedIconPath: "../image/tab_bar_rank_active.png",
      text: "买手榜"
    }, {
      pagePath: "/pages/user/user",
      iconPath: "../image/tab_bar_my.png",
      selectedIconPath: "../image/tab_bar_my_active.png",
      text: "我的"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      // this.setData({
      //   selected: data.index
      // })
      wx.switchTab({url})

      console.log(data.index)
    }
  }
})