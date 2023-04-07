/*----------------------------- swipe_menu -----------------------------*/
(function($){
	const 
	defaults = {
		eleMenuContents:{}, 
		eleOpenTrigger:{}, 
		eleCloseTrigger:{}, 
		maxWinSize:900, 
		slideSpeed:300, 
		//callback
		funcOpenStartCallback:() => {}, 
		funcOpenEndCallback:() => {}, 
		funcCloseStartCallback:() => {}, 
		funcCloseEndCallback:() => {} 
	};
	$.fn.swipeMenu = function(options){
		let 
		el = this, 
		lenEl = el.length;
		if(lenEl === 0)return this;
		if(lenEl > 1){
			el.each(function(){
				$(this).swipeMenu(options);
			});
			return this;
		}
		let 
		configs = {}, 
		cssWidthElChild, 
		posTouch, 
		flagExecuteDirection = 0, 
		flagExecute = true, 
		funcInit = () => {
			configs = $.extend({}, defaults, options);
			if(!configs.eleOpenTrigger[0])
			return false;
			configs.eleOpenTrigger.on({
				'click':el.funcOpenInit 
			});
			configs.eleCloseTrigger.on({
				'click':el.funcCloseExecute 
			});
			el.on({
				'touchstart':(e) => {
					posTouch = e.originalEvent.changedTouches[0].screenX;
					flagExecuteDirection = 0;
				}, 
				'touchmove':(e) => {
					if(posTouch - e.originalEvent.changedTouches[0].screenX > 70){
						flagExecuteDirection = -1;
					}else 
					if(posTouch - e.originalEvent.changedTouches[0].screenX < -70){
						flagExecuteDirection = 1;
					}else{
						flagExecuteDirection = 0;
					}
					if(posTouch - e.originalEvent.changedTouches[0].screenX <= 0)
					configs.eleMenuContents.css({'right':posTouch - e.originalEvent.changedTouches[0].screenX});
				}, 
				'touchend':(e) => {
					switch(flagExecuteDirection){
						case 1:
							el.funcCloseExecute();
						break;
						case 0:
							el.funcOpenExecute();
						break;
					}
				} 
			});
		}, 
		funcCustomEvents = () => {
			el.on({
				'swipeMenu.open':el.funcOpenInit, 
				'swipeMenu.close':el.funcCloseExecute 
			});
		};
		el.funcOpenInit = () => {
			if(flagExecute === false)
			return false;
			flagExecute = false;
			cssWidthElChild = parseInt(configs.eleMenuContents.width());
			configs.eleMenuContents.css({
				'right':(cssWidthElChild * -1) + 'px' 
			});
			$('body').css({
				'overflow':'hidden' 
			});
			el.show();
			el.funcOpenExecute(() => {
				flagExecute = true;
			});
		}, 
		el.funcOpenExecute = (callback) => {
			configs.eleMenuContents
			.stop()
			.show()
			.animate(
				{
					'right':'0' 
				}, 
				configs.slideSpeed, 
				() => {
					if(typeof callback === 'function')
					callback();
				} 
			);
		}, 
		el.funcCloseExecute = () => {
			if(flagExecute === false)
			return false;
			flagExecute = false;
			configs.eleMenuContents
			.stop()
			.animate(
				{
					'right':(cssWidthElChild * -1) + 'px' 
				}, 
				configs.slideSpeed, 
				() => {
					configs.eleMenuContents.hide();
					el.hide();
					$('body').css({
						'overflow':'visible' 
					});
					flagExecute = true;
				} 
			);
		};
		funcInit();
		return this;
	};
})(jQuery);
/*----------------------------- /swipe_menu -----------------------------*/