/**
 * 开始画线
 * @param {Object} map
 */
function startDrawLine(map) {
	drawOptions.map=map;
	//停止绘制设备
	stopDrawDevice();
	//设置鼠标样式
	map.getContainer().style.cursor = "crosshair";
    //生成默认线模版
	lineStyleTemplate = {
		color: '#3388ff',
		weight: 3,
		attribution: "tempLine"
	}
	var latLngs = [];
	//点击地图，添加设备点
	map.on('click', function(e) {
		if(latLngs.length == 0) {
			latLngs.push(e.latlng);
		} else if(latLngs.length == 1) {
			latLngs.push(e.latlng);
			delete lineStyleTemplate.attribution;
			var polyLine = L.polyline(latLngs, lineStyleTemplate).addTo(map);
			latLngs = [];
			drawOptions.lines.push(polyLine);
		}
	});
	//鼠标移动实时刷新线的位置
	map.on('mousemove', function(e) {
		if(latLngs.length == 1) {
			lineStyleTemplate.attribution = "tempLine"
			removeLayer(map, lineStyleTemplate.attribution);
			L.polyline([latLngs[0], e.latlng], lineStyleTemplate).addTo(map);
		}
	})
	//双击结束绘制
	map.on('contextmenu', function(e) {
		var json = exportLines();
		console.log(json);
		stopDrawLine(map);
	});

}

/**
 * 停止画线
 */
function stopDrawLine() {
	var map=drawOptions.map;
	//清空颜色模版
	lineStyleTemplate = null;
	//移除点击监听
	map.off('click');
	map.off('mousemove');
	map.off('contextmenu');
	//恢复鼠标样式
	map.getContainer().style.cursor = "auto";
}


/**
 * 以geoJson格式导出线信息
 * @return {JSON}
 */
function exportLines() {
	
}
/**
 * 开始绘制设备点，左键添加点，右键结束绘制
 * @param {Object} map
 */
function startDrawDevice(map) {
	drawOptions.map=map;
	//停止绘制线
	stopDrawLine(map);
	//设置鼠标样式
	map.getContainer().style.cursor = "crosshair";
    //设置默认样式
	setDeviceStyle();
	
	map.on("click", function(e) {
		var iconStyle=drawOptions.styleTemplate.device;
		var myIcon = L.icon({
		iconUrl: iconStyle.icon,
		iconSize: [iconStyle.height, iconStyle.width],
		iconAnchor: [iconStyle.height/2, iconStyle.width/2]
	});
		var marker = L.marker(e.latlng, {
			icon: myIcon
		}).addTo(map);
		drawOptions.devices.push(marker);
	})
	//右键停止绘制设备，移动端长按
	map.on("contextmenu", function(e) {
		console.log(exportDevices());
		stopDrawDevice(map)
	})
}

/**
 * 停止绘制设备
 */
function stopDrawDevice() {
	var map=drawOptions.map;
	//清空颜色模版
	lineStyleTemplate = null;
	//移除点击监听
	map.off('click');
	map.off('contextmenu');
	map.getContainer().style.cursor = "auto";
}
/**
 * 设置即将绘制的线图标的样式
 * @param {String} icon 图标url
 * @param {Number} width 图标宽度
 * @param {Number} height 图标高度
 */
function setDeviceStyle(icon,width,height){
	var _icon=icon||"icon/device/device1.svg";
	var _width=width||30;
	var _height=height||30;
	drawOptions.styleTemplate.device={
		icon:icon,
		height:_width,
		width:_height
	}
}
function setLineStyle(){
	drawOptions.styleTemplate.line={
		
	}
}
/**
 * 以geoJson格式导出设备信息
 * @return {JSON}
 */
function exportDevices() {
	return drawOptions.devices.toGeoJSON();
}

/**
 * 清楚绘制设备、线、样式
 * @param {Object} map
 */
function clearDraw(){
	var map=drawOptions.map;
	if(map==null){
		return
	}
	//清除图层
	drawOptions.devices.forEach(function(layer){
		map.removeLayer(layer)
	})
	
	drawOptions.lines.forEach(function(layer){
		map.removeLayer(layer)
	})
	drawOptions.devices=[];
	drawOptions.lines=[];
	//清除样式和属性模版
	drawOptions.attribute={};
	drawOptions.styleTemplate={};
	
	drawOptions.map=null
}
