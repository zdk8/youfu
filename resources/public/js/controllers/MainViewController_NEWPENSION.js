/**
 * Created by weipan on 14-10-28.
 */
define(['commonfuncs/LoadingMask','commonfuncs/TabRightClick','commonfuncs/FullCalendar','commonfuncs/validate/Init'],
    function(LoadingMask,TabRightClick,FullCalendar,validateInit){

        var firstclick=false;
        var genMenulevelonehtml=function(nodes){
            var mynodes=nodes;
            if(!$.isArray(nodes)){
                mynodes = [nodes];
            }

            var result=$('<ul></ul>');

            for(var i=0;i<mynodes.length;i++){
                var node = mynodes[i];
                if(!node){
                    continue;
                }
                var $li=$('<li class="leftli"> <ul> <li class="menulevelone"><a >'+node.title+'<span></span></a></li> <li class="dropdown"> </li> </ul> </li>')
                $li.find('li.menulevelone a').data("greeting",node );
                result.append($li);
                result.append('<li class="jianju"></li>');
            }
            return result;
        };

        var genMenuleveltwohtml=function(nodes){
            var resutl=$('<ul></ul>');
            for(var i=0;i<nodes.length;i++){
                var node = nodes[i];
                var $li=$('<li><a  opt="1">'+node.title+'</a></li>');
                $li.data("greeting",node );
                resutl.append($li);
            }
            return resutl;
        };


        function start(isswap){
            addAccordion(isswap);
            //window.setTimeout(function(){$('#currentDate').text(FullCalendar.RunGLNL())},1000);
            new validateInit();
        }
        function addAccordion(isswap) {

            var setMenuLevelTwoClickEvent=function($dropdownas){
                //var $dropdownas=$('#menu_newpension li.dropdown a');
                $dropdownas.click(function(e){
                    var me = $(this);
                    var $li = $(this).parent();
                    $dropdownas.each(function(){
                        $(this).removeClass('menuselected')
                            .parents('.dropdown').prev().find('a').removeClass('menulevelone-selected');
                    });
                    $(this).addClass('menuselected').parents('.dropdown').prev().find('a').addClass('menulevelone-selected');
                    require(['views/OpenPage'],function(js){
                        var node = $li.data('greeting');
                        js.open($.extend({},node,{title:node.title}))
                    })
                }).hover(function(e){
                    $dropdownas.removeClass('dropdown-li-a-hover');
                    $(this).addClass('dropdown-li-a-hover')
                },function(e){
                    $dropdownas.removeClass('dropdown-li-a-hover');
                });
            }



            var getAccordion = function (res) {
                //菜单切换
                $('#menu_newpension ul').html('');


                var one=genMenulevelonehtml(res);
                $('#menu_newpension .leftul').append(one);
                $('#menu_newpension li.menulevelone a').click(function (e) {
                    $me = $(this);
                    if(!$me.data('loadChildren')){
                        $me.data('loadChildren', true);
                        $.ajax(
                            {
                                url:'menutree',
                                data:{
                                    node:$me.data('greeting').functionid
                                },
                                success:function(res){
                                    var two=genMenuleveltwohtml(res);
                                    var dropDown = $me.parent().next();
                                    dropDown.append(two);
                                    $('.dropdown').not(dropDown).slideUp('slow');

                                    if(!firstclick) {
                                        firstclick = !firstclick;
                                        dropDown.slideDown('slow');
                                    }else{
                                        dropDown.slideToggle('slow');
                                    }
                                    setMenuLevelTwoClickEvent($(two).find('a'));
                                    e.preventDefault();
                                }
                            }
                        )
                    }else{
                        var dropDown = $me.parent().next();
                        $('.dropdown').not(dropDown).slideUp('slow');
                        dropDown.slideToggle('slow');
                        e.preventDefault();
                    }
                 });
                if(!isswap){
                    $('#menu_newpension li.menulevelone a').first().trigger('click');
                }else{
                    $('#menu_newpension li.menulevelone a').first().trigger('click').trigger('click');
                }


            }


            //加载抽屉
            var ajaxOption;
            if(customMenuRoot){
                ajaxOption={
                    url:'getFunctionById',//只加载一个目录
                    data:{node:customMenuRoot},
                    success:getAccordion
                }
            }else{
                ajaxOption={
                    url:'menutree',
                    data:{node:'dasffffffffffffffdsdsfs'},//养老
                    success:getAccordion
                }
            }
            $.ajax(ajaxOption);
        }

        swapFunction=start;
        return {
            start:function(){
                start();
            }
        }
    })





        //处理小图标
        /*
         $spans=$('#header .iconround>span>span,#fullscreenclose .iconround>span>span');
         $spans.each(function(){
         $(this).hover(function(){
         $spans.each(function(){
         var origin=$(this).attr('class').split(" ")[0];
         $(this).removeClass().addClass(origin);
         })
         $(this).addClass($(this).attr('class')+ '_n');
         $(this).parents('li').find('a.iconroundtext').addClass('iconroundtexthover');
         },function(){
         var origin=$(this).attr('class').split(" ")[0];
         $(this).removeClass().addClass(origin);
         $(this).parents('li').find('a.iconroundtext').removeClass('iconroundtexthover');
         })

         })

         */





