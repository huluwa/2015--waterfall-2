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
            self.resizetime && clearTimeout(self.resizetime)
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
                cssWidth.push(spinLevel+index*(itemWidth+_this.spaceLevel));
                cssHeight.push(0);
            });
            this.cols = cols;
        },
        "adjustPosition":function(elems){
            var self=this,
                config = this.config,
                cssHeight = this.cssHeight,
                cssWidth = this.cssWidth,
                contenter = this.contenter,
                cols = this.cols,
                spaceVertical = this.spaceVertical,
                itemBack = config.itemBack,
                els;
            elems && (this.elems = this.elems.length == 0 ? elems : this.elems.concat($(elems).toArray()));
            els = elems || this.elems;
            config.elemsAdjust && config.elemsAdjust.call(this);
            if(this.elems.length == 0) return false;
            $(els).each(function(index,value){
                var nub = (elems ? (index+self.lastnub) : index)%cols,//如果elems存在，则追加调整元素位置时就从上一次最后结果的那列开始
                    _this = $(this);
                if(value && $(value)[0]){
                    _this.css({"left":cssWidth[nub]+'px',"top":cssHeight[nub]+'px'});
                    itemBack && itemBack.call(_this);
                    cssHeight[nub] = cssHeight[nub] +_this.outerHeight()+spaceVertical;
                };
                if(index==$(els).length-1){
                    self.lastnub = (nub==cols-1) ? 0 : nub+1;//记住最后一个元素是在第几列，好知道下次开始是从哪列开始
                }
            });
            contenter.css({"height":cssHeight.concat().sort(function(a,b){return parseInt(a) > parseInt(b) ? -1 : 1})[0]+'px'});
            if(!this.hasScroll){
                this.hasScroll = $("body").height() > $(window).height() ? 1 : 0;
            }
        },
        'reAlign' : function(){
            this.layoutInit();
            this.adjustPosition();
        },
        'addItem' : function(m,n,elem,under){
            /**
             * m number 表示第几行
             * n number 表示第m行的第几个
             * elem dom 要插入的对象
             */
            var self=this,
                elems = this.elems,
                mm = this.cols*(m-1)+((n==='last' ? this.cols : n)-1),
                elem = $(elem)[0];
            if(n > this.cols) return false;
            elems.remove(elem);
            elems.remove("placeholder");
            this.fristInt===under && mm > elems.length && (this.fristInt = elems.length);//用!this.fristInt来判断时就把等于0的情况给排除掉了，所以当elems.length=0时，就不正确了
            if(this.fristInt!==under && this.fristInt > 0 && this.fristInt < mm){
                $(new Array(mm-this.fristInt)).each(function(index){
                    elems.splice(index+self.fristInt,0,"placeholder");
                });
            };
            elems.splice(mm,0,elem);
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