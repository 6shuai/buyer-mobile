export default {
    pages: [
      'pages/index/index',
      'pages/index/buyer/buyer',
      'pages/rank/rank',
      'pages/user/user',
      'pages/user/order/order',
      'pages/user/order/detail',
      'pages/user/subscription/subscription',
    ],
    tabBar: {
      "color": "#7A7E83",
      "selectedColor": "#3cc51f",
      "borderStyle": "black",
      "backgroundColor": "#ffffff",
      custom: true,
      "list": [
        {
          "pagePath": "pages/index/index",
          "iconPath": "./image/tab_bar_home.png",
          "selectedIconPath": "./image/tab_bar_home_active.png",
          "text": "抢购"
        },
        {
          "pagePath": "pages/index/index",
          "iconPath": "./image/tab_bar_home.png",
          "selectedIconPath": "./image/tab_bar_home_goback.png",
          "text": "抢购"
        },
        {
					"pagePath": "pages/rank/rank",
					"iconPath": "./image/tab_bar_rank.png",
					"selectedIconPath": "./image/tab_bar_rank_active.png",
					"text": "买手榜",
				},
        {
          "pagePath": "pages/user/user",
          "iconPath": "./image/tab_bar_my.png",
          "selectedIconPath": "./image/tab_bar_my_active.png",
          "text": "我的"
        }
      ]
    },
    "usingComponents": {},
    window: {
      navigationStyle: 'custom',
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '极限买手',
      navigationBarTextStyle: 'black'
    },
    "permission": {
      "scope.userLocation": {
        "desc": "你的位置信息将用于小程序位置接口的效果展示" 
      }
    }
}
