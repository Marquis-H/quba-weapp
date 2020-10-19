export default {
  pages: [
    'pages/index/index', // 首页
    'pages/idle/index', // 二手闲置
    'pages/team/index', // 组队
    'pages/me/index' // 我的
  ],
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#ffb400',
    navigationBarTitleText: 'ClickFarm',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    selectedColor: '#ff8c00',
    backgroundColor: '#000000',
    color: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: "首页",
        iconPath: 'images/home-s.png',
        selectedIconPath: 'images/home.png'
      },
      {
        pagePath: 'pages/idle/index',
        text: "二手闲置",
        iconPath: 'images/idle-s.png',
        selectedIconPath: 'images/idle.png'
      },
      {
        pagePath: 'pages/team/index',
        text: "组队",
        iconPath: 'images/team-s.png',
        selectedIconPath: 'images/team.png'
      },
      {
        pagePath: 'pages/me/index',
        text: '我的',
        iconPath: 'images/my.png',
        selectedIconPath: 'images/my-s.png'
      }
    ]
  },
  plugins: {
    wxparserPlugin: {
      version: "0.3.1",
      provider: "wx9d4d4ffa781ff3ac"
    }
  },
  usingComponents: {
    wxparser: "plugin://wxparserPlugin/wxparser"
  }
}
