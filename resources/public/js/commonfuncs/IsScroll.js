/**
 * Created by jack on 14-1-6.
 */

define(function(){

    var a={

        isYscroll:function(id,$obj){
            var eDiv=$obj||$('#'+id);
            if(eDiv.css("overflow-y")!="hidden"
                &&eDiv.css("overflow-y")!="visible"
                &&eDiv.css("scroll")!="no"
                &&eDiv.prop("scrollHeight")>eDiv.prop("clientHeight"))
            {
                return true
            }else {
                return false;
            }

        }
    }

    return a;
});
