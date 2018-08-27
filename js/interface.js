/**
 * 实例化地图，将地图鱼div关联
 * @param {String} id 展示地图div的id
 */
function createMap(id) {
	return L.map(id, {
		attributionControl: false,
		zoomControl: false,
		measureControl: true,
		//地图初始化位置中国
		center: [38, 113],
		zoom: 5,
		maxZoom: 30,
		minZoom: 3
	})
}

/**
 * 设置地图对象的中心
 * @param {Object} map 地图对象
 * @param {Number} lat 纬度
 * @param {Number} lng 经度
 */
function setCenter(map, lat, lng) {
	map.panTo([lat, lng]);
}
/**
 * 根据坐标范围调整经纬度
 * @param {Object} map 地图对象
 * @param {number} latMin 
 * @param {number} lngMin 
 * @param {number} latMax 
 * @param {number} lngMax 
 */
function setView(map, latMin, lngMin, latMax, lngMax) {
	map.fitBounds([
		[latMin, lngMin],
		[latMax, lngMax]
	]);
}
/**
 * 设置地图的缩放等级,默认1-30级
 * @param {Object} map 地图对象 
 * @param {Number} minZoom 最小缩放等级
 * @param {Number} maxZoom 最大缩放等级
 */
function setZoomLimit(map, minZoom, maxZoom) {
	map.setMinZoom(minZoom);
	map.setMaxZoom(maxZoom);
}
/**
 * 缩小
 * @param {Object} map 地图对象
 */
function zoomOut(map) {
	map.zoomOut(1);
}
/**
 * 放大
 * @param {Object} map 地图对象
 */
function zoomIn(map) {
	map.zoomIn(1);
}
/**
 * 获取当前视图经纬度范围
 * @param {Object} map
 * @return {Array} 地图当前视图经纬度范围
 */
function getBounds(map) {
	var bounds = map.getBounds();
	return [bounds._southWest.lat, bounds._southWest.lng, bounds._northEast.lat, bounds._northEast.lng];
}
/**
 * 设置地图缩放等级
 * @param {Object} map 地图对象
 * @param {number} level 
 */
function setZoom(map, level) {
	map.setZoom(level)
}
/**
 * 添加定位图标，
 * @param {Object} map 地图对象
 * @param {number} lat 纬度
 * @param {number} lng 经度
 * @param {number} rotate 图标旋转角度，默认箭头向下，顺时针旋转
 */
function addHighlight(map, lat, lng, rotate) {

    var myIcon = L.icon({
		iconUrl: 'lib/leaflet/images/locate.png',
		iconSize: [40, 40],
		iconAnchor: [20, 20]
	});
	L.marker([lat, lng], {
		icon: myIcon,
		zIndexOffset:1000,
		attribution: "高亮显示"
	}).addTo(map);
}
/**
 * 清除定位图标
 * @param {Object} map 地图对象
 */
function clearHighlight(map) {
	removeLayer(map, "高亮显示");
}
/**
 * 开启点击地图弹出经纬度
 * @param {Object} map 地图对象
 */
function showLatLng(map) {
	map.addEventListener("click", function(e) {
		if(hasLayer(map, "popup")) {
			clearShowLatLng()
		}
		L.popup({
				attribution: "popup"
			})
			.setLatLng([e.latlng.lat, e.latlng.lng])
			.setContent("纬度：" + e.latlng.lat + "<br/>经度：" + e.latlng.lng)
			.openOn(map);
	});
}
/**
 * 关闭点击地图弹出经纬度
 * @param {Object} map 地图对象
 */
function clearShowLatLng(map) {
	removeLayer(map, "popup");
	map.removeEventListener("click");
}
/**
 * 添加geoJson
 * @param {Object} map 地图对象
 * @param {obj} geoJSON 
 */
function addGeoJson(map, geoJSON) {
	L.geoJSON(geoJSON, {
		attribution: "geoJson"
	}).addTo(map);
}
/**
 * 添加带图标点
 * @param {Object} map 地图对象
 * @param {Number} lat 纬度
 * @param {Number} lng  经度
 * @param {String} icon 图标名称,图标放在icon目录下
 * @param {Number} id 点的id
 * @callback(纬度，经度，点id)； 
 */

function addIcon(map, lat, lng, icon, id, callback) {
	var myIcon = L.icon({
		iconUrl: 'icon/' + icon,
		iconSize: [34, 34],
		iconAnchor: [17, 17]
	});
	var marker = L.marker([lat, lng], {
		icon: myIcon,
		id: id,
		attribution: "mssmarker"
	}).addTo(map);
	if(callback != null && callback != undefined) {
		marker.addEventListener('click', function(e) {
			callback(e.latlng.lat, e.latlng.lng, e.target.options.id);
		});
	}
}
/**
 * 清除所有带图标点
 * @param {Object} map 地图对象
 */
function removeIcons(map) {
	removeLayer(map, "mssmarker");
}
/**
 * 清除geoJson图层
 * @param {Object} map 地图对象
 */
function removeGeoJson(map) {
	removeLayer(map, "geoJson");
}
/**
 * 添加WMS图层
 * @param {Object} map 地图对象
 * @param {String} url 服务地址
 * @param {String} layers 图层名称
 * @param {String} format 格式
 * @param {String} name 自定义名称
 * @param {Number} minZoom 最小缩放等级
 * @param {Number} maxZoom 最大缩放等级
 */
function addWMSLayer(map, url, layers, format, name, minZoom, maxZoom) {
	L.tileLayer.wms(url, {
		layers: layers,
		format: format,
		transparent: true,
		attribution: name,
		minZoom: minZoom,
		maxZoom: maxZoom,
		zIndex: 3
	}).addTo(map);
}
/**
 * 通过图层名称移除名字
 * @param {Object} map 地图对象
 * @param {String} name 图层名称
 */
function removeLayerByName(map, name) {
	removeLayer(map, name);
}
/**
 * 添加WMTS图层
 * @param {Object} map 地图对象
 * @param {String} url wms服务地址
 * @param {String} layer 图层名称
 * @param {String} tilematrixSet 切片使用的网格名称
 * @param {String} format 图片格式
 * @param {String} name 自定义图层名称
 * @param {Number} minZoom 最小缩放等级
 * @param {Number} maxZoom 最大缩放等级
 * @param {Number} tileSize 切片大小
 */
function addWMTSLayer(map, url, layer, tilematrixSet, format, name, minZoom, maxZoom, tileSize) {
	var ign = new L.TileLayer.WMTS(url, {
		layer: layer,
		tilematrixSet: tilematrixSet,
		tileSize: tileSize,
		format: format,
		maxZoom: maxZoom,
		minZoom: minZoom,
		attribution: name,
		zIndex: 3
	});
	map.addLayer(ign);
}
/**
 * 切换地图底图
 * @param {Object} map 地图对象
 * @param {String} source 来源-MapBox/高德/谷歌/天地图
 * @param {String} type 地图类型-道路图/卫星图
 * 特殊高德——卫星图无注记，天地图——卫星图无注记
 */
function switchBaseLayer(map, source, type) {
	removeLayer(map, "mssBaseLayer");
	switch(source) {
		case "高德":
			if(type == "卫星图") {
				L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {
					maxZoom: 22,
					minZoom: 1,
					attribution: "mssBaseLayer"
				}).addTo(map);
				L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion', {
					maxZoom: 22,
					minZoom: 1,
					attribution: "mssBaseLayer"
				}).addTo(map);
			}else if(type=="卫星图无注记"){
			L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {
            					maxZoom: 22,
            					minZoom: 1,
            					attribution: "mssBaseLayer"
            				}).addTo(map);
			} else {
				L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
					maxZoom: 22,
					minZoom: 1,
					attribution: "mssBaseLayer"
				}).addTo(map);
			}
			break;
		case "天地图":
			if(type == "卫星图") {
				L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
					maxZoom: 22,
					minZoom: 1,
					attribution: "mssBaseLayer"
				}).addTo(map);
				L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', {
					maxZoom: 22,
					minZoom: 1,
					attribution: "mssBaseLayer"
				}).addTo(map);
			}else if(type=="卫星图无注记"){
				L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
            					maxZoom: 22,
            					minZoom: 1,
            					attribution: "mssBaseLayer"
            				}).addTo(map);
			} else {
				L.tileLayer.chinaProvider('TianDiTu.Normal.Map', {
					maxZoom: 22,
					minZoom: 1,
					attribution: "mssBaseLayer"
				}).addTo(map);
				L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion', {
					maxZoom: 22,
					minZoom: 1,
					attribution: "mssBaseLayer"
				}).addTo(map);
			}
			break;
		case "谷歌":
			if(type == "卫星图") {
				L.tileLayer.chinaProvider('Google.Satellite.Map', {
					maxZoom: 22,
					minZoom: 1,
					attribution: "mssBaseLayer"
				}).addTo(map);
			} else {
				L.tileLayer.chinaProvider('Google.Normal.Map', {
					maxZoom: 22,
					minZoom: 1,
					attribution: "mssBaseLayer"
				}).addTo(map);
			}
			break;
		case "MapBox":
			if(type == "卫星图") {
				L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
					attribution: 'mssBaseLayer',
					maxZoom: 22,
					minZoom: 1,
					id: 'mapbox.streets-satellite',
					accessToken: 'pk.eyJ1IjoiaGFtYnVnZXJkZXZlbG9wIiwiYSI6ImNqNXJtZzczcDB6aHgycW1scXZqd3FpNmcifQ.d4p32JmAhTek8BUIt3WGLw'
				}).addTo(map);
			} else {
				L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
					attribution: 'mssBaseLayer',
					maxZoom: 22,
					minZoom: 1,
					id: 'mapbox.streets',
					accessToken: 'pk.eyJ1IjoiaGFtYnVnZXJkZXZlbG9wIiwiYSI6ImNqNXJtZzczcDB6aHgycW1scXZqd3FpNmcifQ.d4p32JmAhTek8BUIt3WGLw'
				}).addTo(map);
			}
			break;
		default:
			break;
	}
}
/**
 * 添加标准Tms地图
 * @param {Object} map 地图对象
 * @param {Object} path Tms路径
 * @param {Object} maxZoom 最大图层缩放等级
 * @param {Object} minZoom 最小图层缩放等级
 */
function addTms(map, path, maxZoom, minZoom) {
	console.log(path);
	var options = {
		minZoom: minZoom,
		maxZoom: maxZoom,
		opacity: 1.0,
		attribution: 'mssTms',
		tms: false,
		zIndex: 2
	};
	layer = L.tileLayer(path, options).addTo(map);
}
/**
 * 移除TMS图层
 * @param {Object} map 地图对象
 */
function removeTms(map) {
	removeLayer(map, "mssTms");
}

/**
 * 添加城市统计结果
 * @param {Object} map 地图对象
 * @param {Number} lat
 * @param {Number} lng
 * @param {String} city
 * @param {Number} number
 */
function addPopup(map, lat, lng, city, number) {
	L.popup({
			attribution: 'mssPopup',
			className: 'mssPopup',
			closeOnClick: false,
			autoClose: false,
			closeButton: false,
			maxWidth: 600,
			minWidth: 100,
			autoPan: false
		})
		.setLatLng([lat, lng])
		.setContent('<div class="city">' + city + '</div>' + '<div class="number">' + number + '</div>')
		.openOn(map);
}
/**
 * 移除城市统计结果
 * @param {Object} map 地图对象
 */
function removePopup(map) {
	removeLayer(map, "mssPopup");
}
/**
 * 添加热力图
 * 18级以下不展示热力图，热力图最大展示等级越大，变化效果越不清晰
 * @param {Object} map 地图对象
 * @param {Array} heatData 热力图数据，支持[[纬度，经度]...]和[[纬度，经度，密度（0-1）]...]两种格式，第二种格式适合于做统计之后的点
 */
function addHeatMap(map, heatData) {
	L.heatLayer(heatData, {
		maxZoom: 18,
		attribution: 'mssHeatMap'
	}).addTo(map);
}

/**
 * 移除热力图
 * @param {Object} map 地图对象
 */
function removeHeatMap(map) {
	removeLayer(map, "mssHeatMap");
}
/**
 * 添加地图缩放等级变化监听
 * @param {Object} map 地图对象
 * @callback(zoomLevel) 回调函数，参数为当前缩放等级
 */
function addZoomListner(map, callback) {
	map.on("zoomend", function(e) {
		callback(e.target.getZoom());
	})
}
/**
 * 移除地图缩放等级变化监听
 * @param {Object} map 地图对象
 */
function removeZoomListner(map) {
	map.off("zoomend");
}
/**
 * 添加地图中心变化监听
 * @param {Object} map 地图对象
 * @callback(纬度，经度)
 */
function addCenterListener(map, callback) {
	map.on("moveend", centerChange);
	map.on("zoomend", centerChange);

	function centerChange(e) {
		var center = e.target.getCenter();
		callback(center.lat, center.lng)
	}
}
/**
 * 移除地图中心变化监听
 * @param {Object} map 地图对象
 */
function removeCenterListner(map) {
	map.off("zoomend");
	map.off("moveend");
}
/**
 * 
 * @param {Object} map  地图对象
 * @param {Function} callback 回调函数，参数为(latMin,lngMin,latMax,lngMax);
 */
function addBoundsListener(map, callback) {
	map.on("moveend", function(e) {
		var bounds = e.target.getBounds();
		callback(bounds._southWest.lat, bounds._southWest.lng, bounds._northEast.lat, bounds._northEast.lng);
	})
}
/**
 * 移除地图边界变化监听
 * @param {Object} map 地图对象
 */
function removeBoundsListner(map) {
	map.off("moveend");
}