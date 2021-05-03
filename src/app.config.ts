export default {
  pages: [
    'pages/index/index', // 首页
    'pages/idle/index', // 二手闲置
    'pages/team/index', // 组队
    'pages/me/index', // 我的
    'pages/page/index', // 页面
    'pages/message/index', // 消息
    'pages/webview/index', // webview
  ],
  subPackages: [
    {
      root: 'packageMe',
      pages: [
        'pages/bind/index', // 绑定
        'pages/profile/index', // 个人信息
        'pages/profile/edit/index', // 个人信息编辑
        'pages/publish/index', // 我发布的商品
        'pages/team/index', // 我参与的队伍
        'pages/trade/index', // 我的交易
        'pages/collect/index' // 收藏
      ]
    },
    {
      root: 'packageSearch',
      pages: [
        'pages/idle/index', // 二手闲置搜索
        'pages/team/index', // 赛事搜索
      ]
    },
    {
      root: 'packageTeam',
      pages: [
        'pages/application/index', // 发起组队申请
        'pages/detail/index', // 赛事详情
        'pages/info/index', // 队伍详情
        'pages/join/index', // 加入队伍申请
      ]
    },
    {
      root: 'packageIdle',
      pages: [
        'pages/application/index', // 发布商品
        'pages/detail/index', // 闲置详情
        'pages/trade/index' // 交易
      ]
    },
    {
      root: 'packageLove',
      pages: [
        'pages/list/index', // 表白墙
        'pages/application/index', // 表白
      ]
    },
    {
      root: 'packageMessage',
      pages: [
        'pages/message/index', // 一对一的消息对话
      ]
    },
    {
      root: 'packageTopic',
      pages: [
        'pages/list/index', // 话题列表
        'pages/comment/index' // 话题评论
      ]
    }
  ],
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#486572',
    navigationBarTitleText: '有寻',
    navigationBarTextStyle: 'white',
  },
  tabBar: {
    selectedColor: '#486572',
    backgroundColor: '#ffffff',
    color: '#bfbfbf',
    list: [
      {
        pagePath: 'pages/index/index',
        text: "首页",
        iconPath: 'images/home-s.png',
        selectedIconPath: 'images/home.png'
      },
      {
        pagePath: 'pages/message/index',
        text: "消息",
        iconPath: 'images/message-s.png',
        selectedIconPath: 'images/message.png'
      },
      {
        pagePath: 'pages/me/index',
        text: '我的',
        iconPath: 'images/my-s.png',
        selectedIconPath: 'images/my.png'
      }
    ]
  },
  plugins: {
    wxparserPlugin: {
      version: "0.4.0",
      provider: "wx9d4d4ffa781ff3ac"
    }
  },
  usingComponents: {
    wxparser: "plugin://wxparserPlugin/wxparser"
  }
}
