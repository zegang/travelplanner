import type { TravelLocation } from "@/lib/types/TravelLocation"
import type { Travel } from "@/lib/types/Travel"

const travelLocationsDemo: TravelLocation[] = [
  {
    id: 1,
    title: '骆加为超市',
    date: 'Oct 2, 2025',
    duration: '2 hours',
    description: '骆加为超市',
    notes: '地址：宿州市泗县宿州市泗县泗州大道泗县第三中学西南侧.',
    images: ['images/thumbs/loc1-1.jpg' , 'images/fulls/loc1-1.jpg'],
    coordinates: { lat: 33.498467, lng: 117.887125 },
    baiduCoordinates: null, 
    weblinks: [
      {
        label: '百度',
        url: 'https://map.baidu.com/poi/%E9%AA%86%E5%8A%A0%E4%B8%BA%E8%B6%85%E5%B8%82/\
        @13123277.55,3937885.06,19z?uid=8bd8fdef84b12ad19d95de29&ugc_type=3&ugc_ver=1\
        &device_ratio=1&compat=1&pcevaname=pc4.1&querytype=detailConInfo&da_src=shareurl'
      }
    ],
  },
  {
    id: 2,
    title: '聊城海源阁宾馆-东门',
    date: 'Oct 2, 2025',
    duration: '5小时',
    description: '地址：聊城市东昌府区聊城市东昌府区楼南大街9号',
    notes: '聊城海源阁宾馆.',
    images: [],
    coordinates: { lat: 36.448263, lng: 115.976324 },
    baiduCoordinates: null,
    weblinks: [
      { label: '携程', url: 'https://hotels.ctrip.com/hotels/4026143.html' }
    ],
  },
  {
    id: 3,
    title: '速朋商务酒店（肥城石横店）',
    date: 'Oct 3, 2025',
    duration: '2 hours',
    description: '地址：泰安市肥城市泰安市肥城市石横镇钢厂路西首001号(镇政府东388米)',
    notes: '开业：2024本酒店位于肥城西部经济开发区周围，镇政府东侧中国邮政银行北侧.',
    images: [],
    coordinates: { lat: 36.211722, lng: 116.533540 },
    baiduCoordinates: null,
    weblinks: [
      {
        label: '携程',
        url: 'https://hotels.ctrip.com/hotels/117001267.html?cityid=1884#ctm_ref=www_hp_bs_lst'
      }
    ],
  },
  {
    id: 4,
    title: '肥城泰山世界地质公园(陶山园区)',
    date: 'Oct 4, 2025',
    duration: '2 hours',
    description: '泰山世界地质公园陶山园区游客服务中心',
    notes: '地址：泰安市肥城市山东省泰安市肥城市肥矿二院附近泰山世界地质公园',
    images: [],
    coordinates: { lat: 36.282609, lng: 116.616513 },
    baiduCoordinates: null,
    weblinks: [
      { label: '携程', url: 'https://hotels.ctrip.com/hotels/4026143.html' }
    ],
  },
  {
    id: 5,
    title: '青岛悦海星宸酒店',
    date: 'Oct 4, 2025',
    duration: '1天',
    description: '青岛黄岛区红柳河路与龙门山路交叉口北约200米处青岛悦海星宸酒店',
    notes: '地址：青岛市黄岛区红石崖街道龙门山路5号',
    images: ['images/thumbs/loc5-1.jpg'],
    coordinates: { lat: 36.101302, lng: 120.102197 },
    baiduCoordinates: null,
    weblinks: [
      { label: '携程', url: 'https://hotels.ctrip.com/hotels/114940294.html' }
    ],
  },
  {
    id: 6,
    title: '青岛金沙滩',
    date: 'Oct 5, 2025',
    duration: '1天',
    description: '地址：青岛市黄岛区山东省青岛市黄岛区金沙滩路烟台前对面',
    notes: '金沙滩位于开发区东南，南濒黄海，呈月牙形东西伸展，\
    全长3500多米，宽300米。金沙滩水清滩平，沙细如粉，沙质为金黄色，”。\
    因为水清滩平，沙细如粉，色泽如金，所以得到了金沙滩这个响亮的名字。\
    金沙滩海面有一石蛙，头东尾西，随潮起潮落若隐若现，称为“隐身石蛙”。\
    清代诗云：“岛屿婉蜓傍海隈，沧茫万倾水天开，潮声如吼摇山岳，疑是将军拥众来。”\
    “金沙滩头平，遥望天水涌。冲浪水盈盈，踏歌万里行”。一曲古老的歌谣，\
    一叠金沙滩的故事，在这雄浑的《金沙滩》诗赋中，剥离开锁在深闺的惆怅，\
    揭开了神秘的面纱。金沙滩位于胶州湾西海岸黄岛区境内与团岛隔海相望，\
    其间距离仅2.26海里。东、南、北三面环海，海岸线54公里，古称“凤凰岛”。\
    明永乐年间膘骑将军薛禄为辅佐明成帝定都北京有功，被多次封官加爵，\
    死后葬于故里今薛家岛村东南，现该处仍有高冢巍立。',
    images: [],
    coordinates: { lat: 35.965575, lng: 120.255171 },
    baiduCoordinates: null,
    weblinks: [
      {
        label: '携程',
        url: 'https://you.ctrip.com/sight/qingdao5/141097.html?renderPlatform=#ctm_ref=www_hp_bs_lst'
      },
      {
        label: '百度地图',
        url: 'https://map.baidu.com/poi/%E9%87%91%E6%B2%99%E6%BB%A9/\
        @13386889.001477465,4270777.007020412,16.14z?\
        uid=651536a1db32afa148cc4a44&ugc_type=3&ugc_ver=1\
        &device_ratio=1&compat=1&pcevaname=pc4.1&querytype=detailConInfo&da_src=shareurl'
      },
      {
        label: '路人视频',
        url: 'https://www.bing.com/videos/riverview/relatedvideo?\
        &q=%e5%b0%8f%e7%ba%a2%e4%b9%a6%e9%9d%92%e5%b2%9b%e9%87%91%e6%b2%99%e6%bb%a9\
        &&mid=9C6A4D8634870949C5699C6A4D8634870949C569&&FORM=VRDGAR'
      }
    ],
  },
  {
    id: 7,
    title: '骆加为超市',
    date: 'Oct 5, 2025',
    duration: '6小时',
    description: '骆加为超市',
    notes: '地址：宿州市泗县宿州市泗县泗州大道泗县第三中学西南侧.',
    images: ['images/thumbs/loc1-1.jpg' , 'images/fulls/loc1-1.jpg'],
    coordinates: { lat: 33.498467, lng: 117.887125 },
    baiduCoordinates: null,
    weblinks: [
      {
        label: '百度',
        url: 'https://map.baidu.com/poi/%E9%AA%86%E5%8A%A0%E4%B8%BA%E8%B6%85%E5%B8%82/\
        @13123277.55,3937885.06,19z?uid=8bd8fdef84b12ad19d95de29&ugc_type=3&ugc_ver=1\
        &device_ratio=1&compat=1&pcevaname=pc4.1&querytype=detailConInfo&da_src=shareurl'
      }
    ],
  },
]

const travelsDemo: Travel[] = [
  {
    id: 1,
    title: '五一旅行',
    dateStart: new Date("2025-05-02T15:00:00"),
    dateEnd: new Date("2025-05-05T18:00:00"),
    description: '2025五十一旅行',
    images: [
      'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
    ],
    locations: travelLocationsDemo
  }, 
  {
    id: 2,
    title: '十一旅行',
    dateStart: new Date("2025-10-02T15:00:00"),
    dateEnd: new Date("2025-10-05T18:00:00"),
    description: '2025年十一旅行',
    images: [],
    locations: travelLocationsDemo
  },
]

export { travelsDemo, travelLocationsDemo }
