/**
 * 绘制样式模版
 */

var drawOptions={
	//样式模版
	styleTemplate:{
		
		line:{
			
		},//线样式
//		device:{//设备样式
//		  icon:"icon/device/device1.svg",//图标位置
//		  height:30,//图标高度
//		  width:30//图标宽度
//		}
	},
	//属性模版
	attribute:{
//		line:{
//			type:"电缆井",//线路类型
//			name:1,//设备名称
//			state:"新立",//设备状态
//			length:"",//长度
//			size:"空",//设备规格
//			manufacturer:""//线路厂家
//		},
//		device:{
//			type:"电缆井",//设备类型
//			name:1,//设备名称
//			state:"新立",//设备状态
//			category:"直线井",//设备类别
//			size:"空",//设备规格
//			manufacturer:""//生产厂家
//		}
	}
	devices:[],//设备
	lines:[],//线
	map:null
}


/**
 * 查询是否有指定图层
 *  @param {Object} map 地图对象
 * @param {string} name 
 */
function hasLayer(map,name){
    map.eachLayer(function (layer) {
        if (layer.getAttribution() == name) {
            return true;
        }
    });
    return undefined;
}
/**
 * 根据名字移除图层
 *  @param {Object} map 地图对象
 * @param {string} name  图层名称
 */
function removeLayer(map,name) {
    map.eachLayer(function (layer) {
        if (layer.getAttribution() == name) {
            map.removeLayer(layer);
        }
    });
}
