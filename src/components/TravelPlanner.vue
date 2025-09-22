
<template>
<div class="travel-planner">
  <div>
    <button class="toggle-btn" @click="togglePlanner">
      {{ showPlanner ? '< 目的地列表' : '目的地列表 >' }}
    </button>
    <button class="toggle-btn" @click="openIframeInNewTab">
      打开大地图
    </button>
  </div>
  <div class="travel-planner-body">
    <div class="locations-panel" v-show="showPlanner">
      <h2> 🎉2025十一旅行 </h2>
      <ol class="locations-list">
        <li
          v-for="(location) in travelLocations"
          :key="location.id"
          @click="selectLocation(location)"
          :class="{ selected: selectedLocationId === location.id }"
        >
          <span class="order-number">{{ location.id }}.</span>
          {{ location.tl_date }} 📌 {{ location.name }}

          <!-- render multiple thumbnails -->
          <div class="thumbnails" v-if="location.images?.length">
            <img
              v-for="(img, idx) in location.images"
              :key="idx"
              :src="img.thumb"
              alt="thumbnail"
              class="thumbnail"
              @click.stop="openImage(img.full)"
            />
          </div>

          <!-- render multiple video thumbnails -->
          <div class="thumbnails" v-if="location.videos?.length">
            <video
              v-for="(vid, idx) in location.videos"
              :key="'vid-' + idx"
              class="thumbnail"
              muted
              playsinline
              @click.stop="openVideo(vid)"
            >
              <source :src="vid" type="video/mp4" />
            </video>
          </div>
        </li>
      </ol>
    </div>

    <!-- full-size image modal -->
    <div v-if="showImage" class="modal" @click.self="closeImage">
      <div class="modal-content">
        <button class="close-btn" @click="closeImage">✖</button>
        <img :src="currentImage" alt="large preview" class="large-image" />
      </div>
    </div>

    <!-- full-size video modal -->
    <div v-if="showVideo" class="modal" @click.self="closeVideo">
      <div class="modal-content">
        <button class="close-btn" @click="closeVideo">✖</button>
        <video controls autoplay class="large-video">
          <source :src="currentVideo" type="video/mp4" />
        </video>
      </div>
    </div>

    <div class="map-placeholder">
      <div v-if="isLoading" class="loading-overlay">
        <p>Loading map, please wait... ⏳</p>
      </div>
      <iframe 
      :src="embeddedUrl"
      class="embedded-webpage"
      title="Embedded Map"
      sandbox="allow-scripts allow-same-origin allow-popups"
      :style="{ visibility: isLoading ? 'hidden' : 'visible' }"
      @load="handleIframeLoad"
      >
        Your browser does not support iframes.
      </iframe>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Images {
  thumb?: string
  full?: string
}

interface Location {
  id: number
  tl_date: string
  name: string
  latitude: number
  longitude: number
  mapurl: string
  images?: Images[]
  videos?: string[]
}

const travelLocations = ref<Location[]>([
  { id: 1, tl_date: '10/2', name: '骆加为超市', longitude: 117.89, latitude: 33.50,
    mapurl: '/@13123277.55,3937885.06,19z?uid=8bd8fdef84b12ad19d95de29',
    images: [
      { thumb: 'images/thumbs/loc1-1.jpg' , full: 'images/fulls/loc1-1.jpg' }
    ]
  },
  { id: 2, tl_date: '10/2', name: '聊城海源阁宾馆', longitude: 115.98, latitude: 36.45,
    mapurl: '/@12910538.866422899,4336814.831504,19z?uid=5508504d01e1eccac7f025f2',
  },
  { id: 3, tl_date: '10/3', name: '肥城速朋商务酒店', longitude: 116.53, latitude: 36.21,
    mapurl: '/@12972595.53,4304345.59,19z?uid=520875496d42f21cb11e3623',
  },
  { id: 4, tl_date: '10/4', name: '肥城泰山世界地质公园(陶山园区)', longitude: 116.62, latitude: 36.28,
    mapurl: '/@12981862.51,4314171.09,19z?uid=4eb3b533141f38744302454e',
    images: [
      { thumb: 'images/thumbs/loc4-1.jpg', full: 'images/fulls/loc4-1.jpg' },
      { thumb: 'images/thumbs/loc4-2.jpg', full: 'images/fulls/loc4-2.jpg' },
    ]
  },
  { id: 5, tl_date: '10/4', name: '青岛悦海星宸酒店', longitude: 120.10, latitude: 36.10,
    mapurl: '/@13369860.65651165,4289189.09798015,19z?uid=ff02560a88709c0bf5b91637',
    images: [
      { thumb: 'images/thumbs/loc5-1.jpg', full: 'images/fulls/loc5-1.jpg' }
    ]
  },
  { id: 6, tl_date: '10/5', name: '青岛金沙滩', longitude: 120.26, latitude: 35.97,
    mapurl: '/@13386889.08759955,4270801.52714545,16z?uid=651536a1db32afa148cc4a44',
  },
  { id: 7, tl_date: '10/5', name: '骆加为超市', longitude: 117.89, latitude: 33.50,
    mapurl: '/@13123277.55,3937885.06,19z?uid=8bd8fdef84b12ad19d95de29',
  },
])

const directionBtwLocations = ref<{ [key : string ] : string }>({
  '1to2' : 'https://map.baidu.com/dir/%E9%AA%86%E5%8A%A0%E4%B8%BA%E8%B6%85%E5%B8%82/%E6%B5%B7%E6%BA%90%E9%98%81/@12891828.965,4135871.69,9z?querytype=nav&c=366&sn=2$$$$$$%E9%AA%86%E5%8A%A0%E4%B8%BA%E8%B6%85%E5%B8%82$$0$$$$&en=2$$$$$$%E8%81%8A%E5%9F%8E%E6%B5%B7%E6%BA%90%E9%98%81%E5%AE%BE%E9%A6%86$$0$$$$&sc=366&ec=366&pn=0&rn=5&mrs=1&version=4&route_traffic=1&sy=0&da_src=shareurl',
  '2to3' : 'https://map.baidu.com/dir/%E6%B5%B7%E6%BA%90%E9%98%81/%E9%80%9F%E6%9C%8B%E5%95%86%E5%8A%A1%E9%85%92%E5%BA%97(%E8%82%A5%E5%9F%8E%E7%9F%B3%E6%A8%AA%E5%BA%97)/@12929334.965,4315739.625,12z?querytype=nav&c=366&sn=2$$$$$$%E6%B5%B7%E6%BA%90%E9%98%81$$0$$$$&en=2$$$$$$%E8%82%A5%E5%9F%8E%E9%80%9F%E6%9C%8B%E5%95%86%E5%8A%A1%E9%85%92%E5%BA%97$$0$$$$&sc=366&ec=366&pn=0&rn=5&mrs=1&version=4&route_traffic=1&sy=0&da_src=shareurl',
  '3to4' : 'https://map.baidu.com/dir/%E9%80%9F%E6%9C%8B%E5%95%86%E5%8A%A1%E9%85%92%E5%BA%97(%E8%82%A5%E5%9F%8E%E7%9F%B3%E6%A8%AA%E5%BA%97)/%E6%B3%B0%E5%B1%B1%E4%B8%96%E7%95%8C%E5%9C%B0%E8%B4%A8%E5%85%AC%E5%9B%AD(%E9%99%B6%E5%B1%B1%E5%9B%AD%E5%8C%BA)/@12974055.55,4309235.935,14z?querytype=nav&c=366&sn=1$$520875496d42f21cb11e3623$$12972582.13,4304337.27$$%E9%80%9F%E6%9C%8B%E5%95%86%E5%8A%A1%E9%85%92%E5%BA%97(%E8%82%A5%E5%9F%8E%E7%9F%B3%E6%A8%AA%E5%BA%97)$$0$$$$&en=2$$$$$$%E8%82%A5%E5%9F%8E%E6%B3%B0%E5%B1%B1%E4%B8%96%E7%95%8C%E5%9C%B0%E8%B4%A8%E5%85%AC%E5%9B%AD(%E9%99%B6%E5%B1%B1%E5%9B%AD%E5%8C%BA)$$0$$$$&sc=366&ec=366&pn=0&rn=5&mrs=1&version=4&route_traffic=1&sy=0&da_src=shareurl',
  '4to5' : 'https://map.baidu.com/dir/%E6%B3%B0%E5%B1%B1%E4%B8%96%E7%95%8C%E5%9C%B0%E8%B4%A8%E5%85%AC%E5%9B%AD(%E9%99%B6%E5%B1%B1%E5%9B%AD%E5%8C%BA)/%E6%82%A6%E6%B5%B7%E6%98%9F%E5%AE%B8%E9%85%92%E5%BA%97/@13072716.79,4304940.32,9z?querytype=nav&c=325&sn=1$$4eb3b533141f38744302454e$$12981873.58,4314134.6$$%E6%B3%B0%E5%B1%B1%E4%B8%96%E7%95%8C%E5%9C%B0%E8%B4%A8%E5%85%AC%E5%9B%AD(%E9%99%B6%E5%B1%B1%E5%9B%AD%E5%8C%BA)$$0$$$$&en=2$$$$$$%E9%9D%92%E5%B2%9B%E6%82%A6%E6%B5%B7%E6%98%9F%E5%AE%B8%E9%85%92%E5%BA%97$$0$$$$&sc=325&ec=325&pn=0&rn=5&mrs=1&version=4&route_traffic=1&sy=0&da_src=shareurl',
  '5to6' : 'https://map.baidu.com/dir/%E6%82%A6%E6%B5%B7%E6%98%9F%E5%AE%B8%E9%85%92%E5%BA%97/%E9%87%91%E6%B2%99%E6%BB%A9/@13370692.98,4279442.445,13z?querytype=nav&c=8&sn=1$$ff02560a88709c0bf5b91637$$13369827.95,4289227.92$$%E6%82%A6%E6%B5%B7%E6%98%9F%E5%AE%B8%E9%85%92%E5%BA%97$$0$$$$&en=2$$$$$$%E9%9D%92%E5%B2%9B%E9%87%91%E6%B2%99%E6%BB%A9$$0$$$$&sc=8&ec=8&pn=0&rn=5&mrs=1&version=4&route_traffic=1&sy=0&da_src=shareurl',
  '6to7' : 'https://map.baidu.com/dir/%E9%9D%92%E5%B2%9B%E9%87%91%E6%B2%99%E6%BB%A9/%E9%AA%86%E5%8A%A0%E4%B8%BA%E8%B6%85%E5%B8%82/@13152191.065000001,4112768.31,9z?querytype=nav&c=370&sn=2$$$$$$%E9%9D%92%E5%B2%9B%E9%87%91%E6%B2%99%E6%BB%A9$$0$$$$&en=1$$8bd8fdef84b12ad19d95de29$$13123276.698399,3937869.143041$$%E9%AA%86%E5%8A%A0%E4%B8%BA%E8%B6%85%E5%B8%82$$0$$$$&sc=370&ec=370&pn=0&rn=5&mrs=1&version=4&route_traffic=1&sy=0&da_src=shareurl'
})

const showPlanner = ref(true)
const embeddedUrl = ref()
const isLoading = ref(true); 
const selectedLocationId = ref<number | null>(null)
const showImage = ref(false)
const currentImage = ref<string | undefined>(undefined)
const showVideo = ref(false)
const currentVideo = ref<string | undefined>(undefined)

function openImage(img : string | undefined) {
  currentImage.value = img
  showImage.value = true
}

function closeImage() {
  showImage.value = false
  currentImage.value = undefined
}

function openVideo(vid: string | undefined) {
  currentVideo.value = vid
  showVideo.value = true
}
function closeVideo() {
  showVideo.value = false
  currentVideo.value = undefined
}

onMounted(() => {
  selectedLocationId.value = travelLocations.value[0].id
  loadDirectionOnMap(travelLocations.value[0])
})

function togglePlanner() {
  showPlanner.value = !showPlanner.value
}

function selectLocation(location: any) {
  selectedLocationId.value = location.id
  loadDirectionOnMap(location)
}

const handleIframeLoad = () => {
  isLoading.value = false;
};

const loadDirectionOnMap = (locationA : Location | undefined) => {
  if (locationA == undefined) {
    return;
  }
  isLoading.value = true;
  const dirKey = `${locationA.id}to${locationA.id + 1}`
  console.log("To load dir key: " + dirKey)
  const url = directionBtwLocations.value[dirKey]
  console.log("To load map url: " + url)
  embeddedUrl.value = url;
};

function openIframeInNewTab() {
  window.open(embeddedUrl.value, '_blank')
}
</script>

<style scoped>
.travel-planner {
  display: block;
}

/* Beautiful toggle button */
.toggle-btn {
  background: linear-gradient(135deg, #6b73ff, #272ea0);
  color: white;
  font-weight: bold;
  font-size: 10px;
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  margin-right: 5px;
}

.toggle-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.toggle-btn:active {
  transform: scale(0.95);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

/* --- General Layout (Flexbox) --- */
.travel-planner-body {
  display: flex;
  flex: 3;
  height: 100%;
}

/* Headings */
.travel-planner-body h2 {
  font-size: 18px; /* smaller than before */
  margin-bottom: 0.5rem;
}

/* --- Left Section: Location List --- */
.locations-panel {
  width: 20vh;
  padding: 20px;
  border-right: 1px solid #eee;
  overflow-y: auto;
}

.locations-panel ol {
  padding-left: 0;
  list-style-type: none; /* Remove default bullet/number */
}

.locations-panel li {
  margin-bottom: 15px;
  border-radius: 5px;
  background-color: white;
  font-size: 14px; /* smaller, readable size */
}

/* --- List Item Styling (Adding the Line) --- */
.locations-list li {
  cursor: pointer;
  padding: 15px 0;
  margin: 0;
  /* 📌 Key change: Add a subtle bottom border to act as a separator */
  border-bottom: 1px solid #ddd; 
  transition: background-color 0.2s ease, color 0.2s ease;
  border-radius: 5px;
}

/* 📌 Key change: Remove the border from the last item */
.locations-list li.last-item {
  border-bottom: none;
}

/* Optional: Add hover effect for better UX */
.locations-list li:hover {
    background-color: #ededed;
}

.locations-list li.selected {
  background-color: #007bff;
  color: white;
}

.order-number {
  font-weight: bold;
  color: #e91e63; /* Pink accent for the number */
  margin-right: 10px;
}

/* --- Right Section: Map View --- */
.map-placeholder {
  flex: 7;
  height: 90vh;
  position: relative;
  background-color: #e0f2f1; /* Light cyan map background */
  border: 3px solid #00796b; /* Teal map border */
  border-radius: 8px;
  overflow: hidden;
}

/* --- Loading Overlay Styling --- */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.95); /* Semi-transparent white */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100; /* Ensure it covers the iframe */
  font-size: 1.2em;
  color: #333;
  z-index: 90;
}

.embedded-webpage {
  width: 100%;
  height: 100%;
  border: none; /* Remove default iframe border */
}

.thumbnail {
  width: 50px;
  height: 50px;
  margin: 4px;
  cursor: pointer;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.thumbnails {
  display: flex;
  flex-wrap: wrap;
  margin-top: 6px;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  position: relative;
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
}

.large-image {
  max-width: 80vw;
  max-height: 80vh;
  display: block;
}

.large-video {
  max-width: 80vw;
  max-height: 80vh;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #f44336;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 16px;
  cursor: pointer;
}
</style>
