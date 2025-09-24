import { ref } from 'vue';
import type { Ref } from 'vue';
import type { TravelLocation } from '@/lib/types/TravelLocation';

// 📌 Declare global functions and types for Baidu Maps
declare global {
  const BMap: any;
  const BMAP_STATUS_SUCCESS: any;
  interface Window {
    // The global callback function called by the Baidu script after loading
    initBaiduMap: () => void;
  }
}

const BAIDU_API_KEY = 'GI05xbdCXRxzOE1dePEqJ7kN1Fx7K2Sf'
const BAIDU_SCRIPT_URL = `https://api.map.baidu.com/api?v=3.0&ak=${BAIDU_API_KEY}&s=1&callback=initBaiduMap`;

/**
 * Encapsulates all Baidu Map logic as a Vue Composable.
 */
export function useBaiduMap(
  travelLocations: Ref<TravelLocation[]>,
  useBaiduCoordinates: Ref<boolean>,
  activeMarkerId: Ref<number | null>,
  expandedLocationId: Ref<number[]>,
  dialogVisible: Ref<boolean>,
  dialogLocationDetails: Ref<TravelLocation | null>
) {
  const mapInstance = ref<any | null>(null);

  const getMapPoints = (locations: TravelLocation[]) => {
    return locations.map(loc => {
      const coords = useBaiduCoordinates.value && loc.baiduCoordinates
        ? loc.baiduCoordinates
        : loc.coordinates;
      if (coords) {
        return new BMap.Point(coords.lng, coords.lat);
      } else {
        return new BMap.Point(0, 0);
      }
    });
  }

  // Set the map viewport to fit all points
  const setMapViewPortFitAllPoints = (locations: TravelLocation[]) => {
    if (locations.length > 0) {
      mapInstance.value.setViewport(getMapPoints(locations));
    }
  }

  /**
   * Renders the route and markers on the map.
   * This function combines renderMarkers and renderDrivingRoute to ensure correct overlay stacking.
   */
  const updateMap = () => {
    if (!mapInstance.value) return;
    mapInstance.value.clearOverlays();
    renderMarkers(travelLocations.value);
    // renderDrivingRoute(travelLocations.value);
  };
  
  /**
   * Renders only the markers based on current coordinates preference.
   */
  const renderMarkers = (locations: TravelLocation[]) => {
    if (!mapInstance.value) return;

    // Clear only markers (useful if called independently)
    const overlays = mapInstance.value.getOverlays();
    overlays.forEach((overlay: any) => {
      // BMap.Marker is a standard marker object
      if (overlay instanceof BMap.Marker) {
        mapInstance.value.removeOverlay(overlay);
      }
    });

    locations.forEach((location, index) => {
      const coords = useBaiduCoordinates.value && location.baiduCoordinates
        ? location.baiduCoordinates
        : location.coordinates;
      const point = new BMap.Point(coords?.lng, coords?.lat);

      const marker = new BMap.Marker(point);

      // Custom marker label (number in a circle)
      const label = new BMap.Label(`${index + 1}`, { offset: new BMap.Size(10, -20) });
      label.setStyle({
        color: "white",
        backgroundColor: "blue",
        border: "1px solid white",
        borderRadius: "50%",
        fontSize: "12px",
        textAlign: "center",
        lineHeight: "20px",
        width: "20px",
        height: "20px"
      });
      marker.setLabel(label);

      // Marker click handler
      marker.addEventListener("click", () => {
        dialogLocationDetails.value = location;
        dialogVisible.value = true;
        activeMarkerId.value = location.id;
        if (location.id != null)
          expandedLocationId.value.push(location.id);
        mapInstance.value.panTo(point);
      });

      mapInstance.value.addOverlay(marker);
    });
  };

  /**
   * Renders the driving route between all locations.
   */
  const renderDrivingRoute = (locations: TravelLocation[]) => {
    if (!mapInstance.value || locations.length < 2) {
      // If we don't have enough points for a route, just render the markers
      mapInstance.value.clearOverlays();
      renderMarkers(locations);
      return;
    }

    // Clear all overlays first to remove previous routes and markers
    mapInstance.value.clearOverlays();

    const points = getMapPoints(locations);
    
    const drivingRoute = new BMap.DrivingRoute(mapInstance.value, {
      renderOptions: {
        map: mapInstance.value,
        autoViewport: true,
        panel: "r-result", // Placeholder
      },
      policy: BMap.BMAP_DRIVING_POLICY_LEAST_DISTANCE,
      onSearchComplete: (results: any) => {
        if (drivingRoute.getStatus() === BMAP_STATUS_SUCCESS) {
          // Re-render custom markers after the route is successfully drawn
          renderMarkers(travelLocations.value);
        } else {
             // If route fails, ensure markers are still displayed
             renderMarkers(travelLocations.value);
        }
      }
    });

    const startPoint = points[0];
    const endPoint = points[points.length - 1];
    const waypoints = points.slice(1, -1);
    
    if (waypoints.length > 0) {
      drivingRoute.search(startPoint, endPoint, { waypoints: waypoints });
    } else {
      drivingRoute.search(startPoint, endPoint);
    }
  };

  
  // 📌 Function to initialize the map
  const initBaiduMap = () => {
    if (typeof BMap === 'undefined' || typeof BMap.Convertor === 'undefined') {
      console.error('Baidu Maps API or Convertor not loaded.');
      return;
    }
    
    // Check if the map container exists in the currently active layout
    if (!document.getElementById("map-container")) {
        // If the container is not in the DOM yet, wait for the next tick.
        return; 
    }

    // Clean up any existing map instance before creating a new one
    if (mapInstance.value) {
      mapInstance.value.clearOverlays();
    }
    
    mapInstance.value = new BMap.Map("map-container");
    mapInstance.value.enableScrollWheelZoom(true);
    mapInstance.value.setZoom(10); // Set default zoom level

    // Create Baidu Map points from our locations' standard coordinates (WGS84)
    const pointsToConvert = travelLocations.value.map(loc => {
      if (loc.coordinates)
        new BMap.Point(loc.coordinates.lng, loc.coordinates.lat)
      else
        new BMap.Point(0, 0)
    });

    // Convert the points from WGS84 (standard GPS) to BD09 (Baidu's system)
    // BMap.Convertor.transMore(pointsToConvert, 0, (convertedPoints: any[]) => {
    //   if (convertedPoints && convertedPoints.length > 0) {
    //     // Store the converted coordinates back into the main state
    //     travelLocations.value.forEach((loc, index) => {
    //       loc.baiduCoordinates = { lat: convertedPoints[index].lat, lng: convertedPoints[index].lng };
    //     });
    //     mapInstance.value.setViewport(convertedPoints);
    //     updateMap();
    //   } else {
        console.error('Coordinate conversion failed. Using original coordinates for now.');
        // If conversion fails, use original points for viewport and map
        const originalPoints = travelLocations.value.map(loc => {
          if (loc.coordinates)
            new BMap.Point(loc.coordinates.lng, loc.coordinates.lat)
          else
            new BMap.Point(0, 0)
        });
        mapInstance.value.setViewport(originalPoints);
        updateMap();
      // }
    // });
  };

  /**
   * Loads the Baidu Map API script into the document head.
   */
  const loadBaiduScript = () => {
    if (document.getElementById('baidu-map-script')) return;

    const baiduScript = document.createElement('script');
    baiduScript.id = 'baidu-map-script';
    baiduScript.src = BAIDU_SCRIPT_URL;
    document.head.appendChild(baiduScript);
    
    // Set the global function that the script will call when it finishes loading
    window.initBaiduMap = initBaiduMap; 
  }

  return {
    mapInstance,
    updateMap,
    setMapViewPortFitAllPoints,
    loadBaiduScript,
    initBaiduMap
  };
}
