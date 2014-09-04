/**
 * Created by JetBrains WebStorm.
 * User: LXJ
 * Date: 11-10-17 ÉÏÎç8:57
 * Mail: louxiaojian@gmail.com
 */
        function addEvent(node, type, listener ) {
            if (node.addEventListener) {
                node.addEventListener( type, listener, false );
                return true;
            } else if(node.attachEvent) {
                node['e'+type+listener] = listener;
                node[type+listener] = function(){node['e'+type+listener]( window.event );}
                node.attachEvent( 'on'+type, node[type+listener] );
                return true;
            }
            return false;
        };
        function removeEvent(node, type, listener ) {
            if (node.removeEventListener) {
                node.removeEventListener( type, listener, false );
                return true;
            } else if (node.detachEvent) {
                // MSIE method
                node.detachEvent( 'on'+type, node[type+listener] );
                node[type+listener] = null;
                return true;
            }
            // Didn't have either so return false
            return false;
        };
        function $$(node, name, type) {
            var r = [], re = new RegExp("(^|\\s)" + name + "(\\s|$)"), e = (node || document).getElementsByTagName(type || "*");
            for ( var i = 0,len=e.length; i < len; i++ ) {
                if(re.test(e[i].className) )
                    r.push(e[i]);
            }
            return r;
        };
        function offset(obj){
            var x = y = 0;
            if (obj.getBoundingClientRect){ //for IE,FF3.0+,Opera9.5+ ,google

                var box = obj.getBoundingClientRect();
                var D = document.documentElement;
                x = box.left + Math.max(D.scrollLeft, document.body.scrollLeft) - D.clientLeft;
                y = box.top + Math.max(D.scrollTop, document.body.scrollTop) - D.clientTop;

            } else {

                for(; obj != document.body; x += obj.offsetLeft, y += obj.offsetTop, obj = obj.offsetParent );
            }
            return {'x':x, 'y':y,'left':x, 'top':y};
        }