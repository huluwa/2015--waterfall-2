/**
 * Created with JetBrains WebStorm.
 * User: LXJ
 * Date: 12-7-6
 * Time: 上午9:18
 * To change this template use File | Settings | File Templates.
 */
;(function($){
    var waterfall = function(elems,config){
        var self = this;
        if (!(self instanceof waterfall)) {
            return new waterfall(elems,config);
        }
        this.init(elems,config);
        this.config.fullScreen && $(window).bind('resize',this.resize=function(){
            self.resizetime && clearTimeout(self.resizetime);
            self.resizetime=setTimeout(function(){
                if(self.winWidth!=$(window).width()){
                    self.reAlign();
                    self.winWidth =$(window).width();
                };
            },100);
        });
    };
    $.extend(waterfall.prototype,{
        "init" : function(elems,config){
            var defaut ={
                "contenter" : "",
                "itemWidth":"",
                "fullScreen":1,//1为铺满全屏。此时当浏览器大小有所改变时就得重新调整所有items的位置
                "spaceLevel" : "15px",
                "spaceVertical" : "15px",
                "elemsAdjust" : function(){},
                "callBack" : function(){},//瀑布流定位完成后回调
                "itemBack" : function(){}
            };
            this.winWidth = 0;
            this.elems = $(elems).toArray();
            this.config = $.extend(defaut,config || {});
            this.contenter = $(this.config.contenter);
            this.spaceLevel = parseInt(this.config.spaceLevel);
            this.spaceVertical = parseInt(this.config.spaceVertical);
            this.lastnub = 0;
            this.hasScroll = $("body").height() > $(window).height() ? 1 : 0;
            this.layoutInit();
            this.adjustPosition();
            this.hasScroll && this.config.fullScreen && this.reAlign();
            this.winWidth = $(window).width();
        },
        "layoutInit" : function(){
            this.cssHeight = [];
            this.cssWidth = [];
            this.itemCount = [];
            var _this = this,
                contenter = this.contenter.outerWidth(),
                itemWidth = parseInt(this.config.itemWidth || $(this.elems).eq(0).outerWidth()),
                itemOuterWidth = itemWidth + this.spaceLevel,
                cols,
                cssHeight = this.cssHeight,
                cssWidth = this.cssWidth,
                spinLevel;
            cols = Math.floor((contenter+this.spaceLevel)/itemOuterWidth);
            spinLevel = Math.floor((contenter - cols*itemOuterWidth+this.spaceLevel) /2);
            $(new Array(cols)).each(function(index){
                _this.itemCount.push(0);
                cssWidth.push(spinLevel+index*(itemWidth+_this.spaceLevel));
                cssHeight.push(0);
            });
            this.cols = cols;
        },
        "getMin":function(arr){
            if(!arr) return false;
            //Math.min.apply(Math,[1,2,3,4,5])
            var min={};
            min.value = arr[0];
            min.index = 0;
            for(var i= 0,ii=arr.length;i<ii;i++){
                if(min.value > arr[i]){
                    min.value =  arr[i];
                    min.index =  i;
                }
            };
            return min
        },
        "adjustPosition":function(elems){
            var self=this,
                config = this.config,
                cssHeight = this.cssHeight,
                cssWidth = this.cssWidth,
                contenter = this.contenter,
                spaceVertical = this.spaceVertical,
                callBack = config.callBack,
                itemBack = config.itemBack,
                els,
                elemPosition = function(elem,min){
                    var elem = $(elem);
                    if(elem[0]){
                       elem.css({"left":cssWidth[min.index]+'px',"top":min.value+'px'});
                       cssHeight[min.index] = cssHeight[min.index] +elem.outerHeight()+spaceVertical;
                    };
                    self.itemCount[min.index]++;
                };
                this.insertItems = [];
            elems && (this.elems = this.elems.length == 0 ? elems : this.elems.concat($(elems).toArray()));
            els = elems || this.elems;
            config.elemsAdjust && config.elemsAdjust.call(this);
            if(this.elems.length > 0){
                $(els).each(function(index,value){
                    var _this = $(this);
                    if(value){
                        var min = self.getMin(cssHeight);
                        $(self.insertItems).each(function(i,v){
                            if(v.cols === "last") v.cols = self.cols;
                            if(min.index===(parseInt(v.cols)-1) && self.itemCount[min.index]===(parseInt(v.n)-1)){
                                $(v.elem).css({display:'block',visibility:'visible'});
                                elemPosition(v.elem,min);
                                self.insertItems.splice(i,1);
                                min = self.getMin(cssHeight);
                            }
                        });
                        elemPosition(_this,min);
                        itemBack && itemBack.call(_this);
                    };
                });
            };
            //条目少而未能插入时
            $(self.insertItems).each(function(i,v){
                if(v.cols === "last") v.cols = self.cols;
                var cols = parseInt(v.cols)-1
                if(self.itemCount[cols] < v.n){
                    self.itemCount[cols] = v.n-1;
                    $(v.elem).css({display:'block',visibility:'visible'});
                    elemPosition(v.elem,{index:cols,value:cssHeight[cols]});
                }
            });
             //条目少而未能插入时
            contenter.css({"height":this.maxHeight()+'px'});
            callBack && callBack.call(this);
            if(!this.hasScroll){
                this.hasScroll = $("body").height() > $(window).height() ? 1 : 0;
            }
        },
        'maxHeight' : function(){
            return this.cssHeight.concat().sort(function(a,b){return parseInt(a) > parseInt(b) ? -1 : 1})[0];
        },
        'reAlign' : function(){
            this.layoutInit();
            this.adjustPosition();
        },
        'addItem' : function(cols,n,elem){
            /**
             * cols number 表示第cols列
             * n number 表示第cols列的第n个
             * elem dom 要插入的对象
             * self.addItem(1,1,user_nfo);
             * self.addItem({cols:1,n:1,elem:user_nfo});
             * self.addItem([{cols:1,n:1,elem:user_nfo},{cols:2,n:1,elem:J_attention}]);
             */
            if(arguments.length == 1){
                $.isPlainObject(arguments[0]) && this.insertItems.push(arguments[0]);
                $.isArray(arguments[0]) && arguments[0].length >0 && $.isPlainObject(arguments[0][0]) && (this.insertItems = this.insertItems.concat(arguments[0]));
            };
            if(arguments.length == 3){
                this.insertItems.push({cols:cols,n:n,elem:elem});
            };
        },
        'clearBefore' : function(){
            this.elems = [];
            this.lastnub = 0;
            this.fristInt = false;
            this.layoutInit();
        },
        'clear' : function(){
            this.config.fullScreen && $(window).unbind('resize',this.resize);
        }
    });
    $.waterfall = waterfall;
    $.fn.waterfall = function(config){
        return waterfall(this,config);
    }
})(jQuery);