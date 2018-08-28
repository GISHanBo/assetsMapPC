/**
 * 开始画线
 * @param {Object} map
 */
function startDrawLine(map) {
    drawOptions.map = map;
    //停止绘制设备
    stopDrawDevice();
    //设置鼠标样式
    map.getContainer().style.cursor = "crosshair";
    //生成默认线模版
    setLineStyle();
    //生成线默认属性
    setLineAttribute();

    //给点设备点图标添加捕捉事件
    drawOptions.markerMove=function(e){
        drawOptions.target=e.latlng;
    };
    drawOptions.markerOut=function(e){
        drawOptions.target=null;
        map.getContainer().style.cursor = "crosshair";
    };
    drawOptions.devices.forEach(function (marker) {
        marker.on("mouseover",drawOptions.markerMove);
        marker.on("mouseout",drawOptions.markerOut);
        //关闭点击事件
        marker.off("click")
    });


    var latLngs = [];
    //点击地图，添加设备点
    map.on('click', function (e) {
        if (latLngs.length == 0) {
            if(drawOptions.target!=null){
                latLngs.push(drawOptions.target);
            }
        } else if (latLngs.length == 1) {
            if(drawOptions.target==null){
                return
            }
            latLngs.push(drawOptions.target);
            delete drawOptions.styleTemplate.line.attribution;
            var polyLine = L.polyline(latLngs, drawOptions.styleTemplate.line).addTo(map);
            latLngs = [];
            //求解线长
            var points=polyLine.getLatLngs();
            var dis=points[0].distanceTo(points[1]);
            //设置线默认属性
            var lineAttr=drawOptions.attribute.line;
            polyLine.size=lineAttr.size;
            polyLine.state=lineAttr.state;
            polyLine.type=lineAttr.type;
            polyLine.length=dis.toFixed(1);
            polyLine.manufacturer=lineAttr.manufacturer;
            polyLine.name=lineAttr.name;
            polyLine.id=Date.now();
            drawOptions.lines.push(polyLine);
            polyLine.on("click",function (e) {
                if(drawOptions.lineClick){
                    drawOptions.lineClick(e.target);
                }
            })
            removeLayer(map, "tempLine");
        }
    });
    //鼠标移动实时刷新线的位置
    map.on('mousemove', function (e) {
        if (latLngs.length == 1) {
            drawOptions.styleTemplate.line.attribution = "tempLine";
            removeLayer(map, "tempLine");
            L.polyline([latLngs[0], e.latlng], drawOptions.styleTemplate.line).addTo(map);
        }
    })
    //双击结束绘制
    map.on('contextmenu', function (e) {
        stopDrawLine(map);
    });
}

/**
 * 停止画线
 */
function stopDrawLine() {
    drawOptions.styleTemplate.line=null;
    var map = drawOptions.map;
    //移除点击监听
    map.off('click');
    map.off('mousemove');
    map.off('contextmenu');
    //恢复鼠标样式
    map.getContainer().style.cursor = "auto";

    drawOptions.markerMove=null;
    drawOptions.markerOut=null;
    drawOptions.target=null;

    drawOptions.devices.forEach(function (marker) {
        //移除每个点标记事件
        marker.off("mouseover");
        marker.off("mouseout");
        //恢复标记的点击
        marker.on("click",function (e) {
            if(drawOptions.deviceClick){
                drawOptions.deviceClick(e.target);
            }
        })
    });

}

/**
 * 以JsonArray格式导出线信息
 * @return {Array}
 */
function exportLines() {
    var lines = [];
    drawOptions.lines.forEach(function (line) {
        var position = line.getLatLngs();
        var deviceLine = {
            lat0: position[0].lat,
            lng0: position[0].lng,
            lat1: position[1].lat,
            lng1: position[1].lng,
            type: line.type,
            name: line.name,
            state: line.state,
            length: line.length,
            size: line.size,
            manufacturer: line.manufacturer
        };
        lines.push(deviceLine);
    })
    return lines;
}

/**
 * 开始绘制设备点，左键添加点，右键结束绘制
 * @param {Object} map
 */
function startDrawDevice(map) {
    drawOptions.map = map;
    //停止绘制线
    stopDrawLine(map);
    //设置鼠标样式
    map.getContainer().style.cursor = "crosshair";
    //设置默认样式
    setDeviceStyle();
    //设置默认属性
    setDeviceAttribute();
    map.on("click", function (e) {
        //设置图标样式
        var iconStyle = drawOptions.styleTemplate.device;
        var myIcon = L.icon({
            iconUrl: iconStyle.icon,
            iconSize: [iconStyle.height, iconStyle.width],
            iconAnchor: [iconStyle.height / 2, iconStyle.width / 2],
            className:"mssDevices"
        });
        //生成点
        var marker = L.marker(e.latlng, {
            icon: myIcon
        }).addTo(map);
        //设置点属性
        var deviceAttr=drawOptions.attribute.device;
        marker.id=Date.now();
        marker.name=deviceAttr.name;
        marker.type=deviceAttr.type;
        marker.state=deviceAttr.state;
        marker.category=deviceAttr.category;
        marker.size=deviceAttr.size;
        marker.manufacturer=deviceAttr.manufacturer;
        drawOptions.devices.push(marker);

        marker.on("click",function (e) {
            if(drawOptions.deviceClick){
                drawOptions.deviceClick(e.target);
            }
        })
    })
    //右键停止绘制设备，移动端长按
    map.on("contextmenu", function (e) {
        stopDrawDevice(map)
    })
}

/**
 * 停止绘制设备
 */
function stopDrawDevice() {
    var map = drawOptions.map;
    //移除点击监听
    map.off('click');
    map.off('contextmenu');
    map.getContainer().style.cursor = "auto";
    drawOptions.styleTemplate.device=null;
}

/**
 * 移除设备
 * @param {Object} device
 */
function removeDevice(device) {
    for(var i=0;i<drawOptions.devices.length;i++){
        if(drawOptions.devices[i].id==device.id){
            drawOptions.devices.splice(i,1);
            break
        }
    }
    drawOptions.map.removeLayer(device);
}

/**
 * 移除设备
 * @param {Object} line
 */
function removeLine(line) {
    for(var i=0;i<drawOptions.lines.length;i++){
        if(drawOptions.lines[i].id==line.id){
            drawOptions.lines.splice(i,1);
            break
        }
    }
    drawOptions.map.removeLayer(line);
}
/**
 * 设置即将绘制的线图标的样式
 * @param {String} icon 图标url
 * @param {Number} width 图标宽度
 * @param {Number} height 图标高度
 */
function setDeviceStyle(icon, width, height) {
    var _icon = icon || "icon/device/device1.svg";
    var _width = width || 30;
    var _height = height || 30;
    drawOptions.styleTemplate.device = {
        icon: _icon,
        height: _width,
        width: _height
    }
}

/**
 * 设置接下来要绘制的线的样式
 * @param {String} color 线颜色
 * @param {Number} width 线宽
 * @param {Number} opacity 0-1的透明度
 */
function setLineStyle(color, width, opacity) {
    var _color = color || "#3388ff";
    var weight = width || 3;
    var _opacity = opacity || 1;
    drawOptions.styleTemplate.line = {
        color: _color,
        weight: weight,
        opacity: _opacity,
        attribution: "tempLine"
    }
}

/**
 *设置即将绘制的设备的默认属性
 * @param {String} type 设备类型
 * @param {String} name 设备名称
 * @param {String} state 设备状态
 * @param {String} category 设备类别
 * @param {String} size 设备规格
 * @param {String} manufacturer 生产厂家
 */
function setDeviceAttribute(type, name, state, category, size, manufacturer) {
    drawOptions.attribute.device = {
        type: type||"",
        name: name||"",//设备名称
        state: state||"",//设备状态
        category: category||"",//设备类别
        size: size||"",//设备规格
        manufacturer: manufacturer||""
    }
}

/**
 *设置即将绘制的设备的默认属性
 * @param {String} type 线路类型
 * @param {String} name 线路名称
 * @param {String} state 线路状态
 * @param {Number} length 线路长度
 * @param {String} size 线路规格
 * @param {String} manufacturer 线路厂家
 */
function setLineAttribute(type, name, state, size, manufacturer) {
    drawOptions.attribute.line = {
			type:type||"",//线路类型
			name:name||"",//设备名称
			state:state||"",//设备状态
			// length:length||0,//长度
			size:state||"",//设备规格
			manufacturer:manufacturer||""//线路厂家
    }
}

/**
 * 以JsonArray格式导出设备信息
 * @return {Array} 设备信息
 */
function exportDevices() {
    var devices = [];
    drawOptions.devices.forEach(function (marker) {
        var position = marker.getLatLng();
        var device = {
            lat: position.lat,
            lng: position.lng,
            type: marker.type,
            name: marker.name,//设备名称
            state: marker.state,//设备状态
            category: marker.category,//设备类别
            size: marker.size,//设备规格
            manufacturer: marker.manufacturer//生产厂家
        };
        devices.push(device);
    })
    return devices;
}

/**
 * 清楚绘制设备、线、样式
 * @param {Object} map
 */
function clearDraw() {
    var map = drawOptions.map;
    if (map == null) {
        return
    }
    //清除图层
    drawOptions.devices.forEach(function (layer) {
        map.removeLayer(layer)
    })

    drawOptions.lines.forEach(function (layer) {
        map.removeLayer(layer)
    })
    drawOptions.devices = [];
    drawOptions.lines = [];
    //清除样式和属性模版
    drawOptions.attribute = {};
    drawOptions.styleTemplate = {};

    drawOptions.map = null;
    drawOptions.target=null;
    drawOptions.markerOut=null;
    drawOptions.markerMove=null;
    drawOptions.lineClick=null;
    drawOptions.deviceClick=null;
    //清除事件
    map.off('click');
    map.off('mousemove');
    map.off('contextmenu');
    //恢复鼠标样式
    map.getContainer().style.cursor = "auto";
}
