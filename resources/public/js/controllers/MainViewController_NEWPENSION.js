/**
 * Created by weipan on 14-10-28.
 */
/*
define(['commonfuncs/LoadingMask','commonfuncs/TabRightClick','commonfuncs/FullCalendar','commonfuncs/validate/Init'],
    function(LoadingMask,TabRightClick,FullCalendar,validateInit){

        return {
            start:function(){
                new validateInit();
            }
        }
    })
*/


define(['commonfuncs/LoadingMask','commonfuncs/validate/Init'],
    function(LoadingMask,validateInit){

        return {
            start:function(){
                new validateInit();
                require(['views/OpenPage'],function(js){
                    leftMenuClick=function($li) {
                        var node = $li.data('greeting');
                        js.open($.extend({},node,{title:node.title}))
                    };
                })
            }
        }
    })






