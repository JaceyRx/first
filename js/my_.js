function load (){  
   
    document.addEventListener('touchstart',touch, false);  
    document.addEventListener('touchmove',touch, false);  
    document.addEventListener('touchend',touch, false);  
    document.addEventListener('mousedown', touch, false)
    document.addEventListener('mousemove', touch, false)
    document.addEventListener('mouseup', touch, false)

    function touch (event){  
        var event = event || window.event;  
           
        var oInp = document.getElementById("inp");  
        
        switch(event.type){  
            case "touchstart":  
                oInp.innerHTML = "Touch started (" + event.touches[0].clientX + "," + event.touches[0].clientY + ")";  
                break;  
            case "touchend":  
                oInp.innerHTML = "<br>Touch end (" + event.changedTouches[0].clientX + "," + event.changedTouches[0].clientY + ")";  
                break;  
            case "touchmove":  
                event.preventDefault();  
                oInp.innerHTML = "<br>Touch moved (" + event.touches[0].clientX + "," + event.touches[0].clientY + ")";  
                break;
            case "mousedown":  
                oInp.innerHTML = "Mouse started (" + (event.clientX || event.touches[0].clientX) + "," + (event.clientY || event.touches[0].clientY) + ")";  
                break;  
            case "mousemove":  
                oInp.innerHTML = "<br>Mouse move (" + (event.clientX || event.touches[0].clientX) + "," + (event.clientX || event.touches[0].clientX) + ")";  
                break;  
            case "mouseup":  
                event.preventDefault();  
                oInp.innerHTML = "<br>Mouse end(" + event.clientX + "," + event.clientY + ")";  
                break; 
        }  
    } 

}  
//window.addEventListener('load',load, false);

function load2 () {
	
	document.addEventListener('touchstart',touch, false);  
    document.addEventListener('touchmove',touch, false);  
    document.addEventListener('touchend',touch, false); 
    document.addEventListener('mousedown', touch, false)
    document.addEventListener('mousemove', touch, false)
    document.addEventListener('mouseup', touch, false)
    
	var startX = null;
	var startY = null;
	
	var _x = null;
	var _y = null;
	
	var selList = [];
	var isSelect = false;
	var ispc = IsPC();
	
	function touch (event) {
		var event = event || window.event;
		
		var selDiv = null;
		
		// 临时显示
		var oInp = document.getElementById("inp")
		
		var fileNodes = document.getElementsByTagName("div");
		
		// 屏幕触摸事件
		if (event.type == "touchstart" || event.type == "mousedown") {
			isSelect = true;
			if (ispc) {
				// 鼠标按下的坐标
				startX = (event.x || event.clientX);
				startY = (event.y || event.clientY);
			} else {
				//获取触摸点的坐标
				startX = (event.touches[0].x || event.touches[0].clientX);
				startY = (event.touches[0].y || event.touches[0].clientY);
			}
			
			
			oInp.innerHTML = "<br>Touch Start(" + startX + "," + startY + ")";
			//获取需要被选中的DIV
			for (var i = 0; i < fileNodes.length; i++) {
				if (fileNodes[i].className.indexOf("fileDiv") != -1) {
					
					fileNodes[i].className = "fileDiv";

					selList.push(fileNodes[i]);
				}
			}
			//创建选择框			
			var selDiv = document.createElement("div");
			selDiv.style.cssText = "position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:10000;filter:alpha(opacity:60);opacity:0.6;display:none;";
			selDiv.id = "selectDiv";
			document.body.appendChild(selDiv);
			// 设置选择框与窗口的距离
			selDiv.style.left = startX + "px";
			selDiv.style.top = startY + "px";
			
			clearEventBubble(event);
		}
		
		// 触摸移动事件
		if (event.type == "touchmove" || event.type == "mousemove") {
		
			selDiv = document.getElementById("selectDiv");
	
			if (isSelect) {
				//让选择框显示
				if (selDiv.style.display == "none") {
					selDiv.style.display = "";
				}
				
				if (ispc) {
					_x = (event.x || event.clientX);
					_y = (event.y || event.clientY);
				} else {
					// 获取触摸移动的坐标
					_x = (event.touches[0].x || event.touches[0].clientX);
					_y = (event.touches[0].y || event.touches[0].clientY);
				}
				
				// 显示
				oInp.innerHTML = "<br>Touch Move (" + Math.min(_x, startX) + "," + Math.min(_y, startY) + ")";  
				
				selDiv.style.left = Math.min(_x, startX) + "px";
				selDiv.style.top = Math.min(_y, startY) + "px";
				selDiv.style.width = Math.abs(_x - startX) + "px";
				selDiv.style.height = Math.abs(_y - startY) + "px";

			// ---------------- 关键算法 --------------------- 
				// offset 返回该选择框 在页面中的定位，和其宽高
				var _l = selDiv.offsetLeft,		// 选择框到 窗口左边的距离
					_t = selDiv.offsetTop;		// 选择框到 窗口顶部的距离

				var _w = selDiv.offsetWidth,	// 选择框的宽
					_h = selDiv.offsetHeight;   // 选择框的高
					
				for(var i = 0; i < selList.length; i++) {
					//获取每个小DIV的宽 高+ 与窗口的距离
					var sl = $(selList[i]).width() + $(selList[i]).offset().left;			// 小div的 宽 + 小div到左 窗口的距离
					var st = $(selList[i]).height() + $(selList[i]).position().top;			// 小div的 高 + 小div到顶部  窗口的距离
					// core
					if(sl > _l && st > _t && $(selList[i]).offset().left < _l + _w && $(selList[i]).offset().top < _t + _h) {

						if(selList[i].className.indexOf("seled") == -1) {

							selList[i].className = selList[i].className + " seled";

						}

					} else {

						if(selList[i].className.indexOf("seled") != -1) {

							selList[i].className = "fileDiv";

						}
					}
				}
			}
			
			clearEventBubble(event);
		}
		
		// 触摸移除事件
		if(event.type == "touchend" || event.type == "mouseup") {
			isSelect = false;
			selDiv = document.getElementById("selectDiv");
			if(selDiv) {
				document.body.removeChild(selDiv);
//				showSelDiv(selList);
			}
			clearEventBubble(event);
//			selList = null, _x = null, _y = null, selDiv = null, startX = null, startY = null, evt = null;
				
		}

	}

}

// 關閉事件  
function clearEventBubble(evt) {

	if (evt.stopPropagation)

		evt.stopPropagation();

	else

		evt.cancelBubble = true;

	if (evt.preventDefault)

		evt.preventDefault();

	else

		evt.returnValue = false;
}

// 判断是否是PC
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

window.addEventListener("load", load2, false);
