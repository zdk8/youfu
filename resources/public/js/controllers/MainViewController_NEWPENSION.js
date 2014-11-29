/**
 * Created by weipan on 14-10-28.
 */
define(['commonfuncs/LoadingMask','commonfuncs/TabRightClick','commonfuncs/FullCalendar','commonfuncs/validate/Init'],
    function(LoadingMask,TabRightClick,FullCalendar,validateInit){
        var firstclick=false;

        var notes={
            1:{
                location:'jcfx.YeWuFenXi',
                type:'1'
            },
            2:{
                location:'jcfx.PlaceDataQuery',
                type:'1'
            },
            3:{
                location:'jcfx.AddressesDataQuery',
                type:'1'
            },
            4:{
                location:'jcfx.JieZhuangDianDataQuery',
                type:'1'
            },5:{
                location:'jcfx.JieXianDataQuery',
                type:'1'
            },6:{
                location:'jcfx.SheGongTongJi',
                type:'1'
            },"6-1":{
                location:'jcfx.SheGongDataQuery',
                type:'1'
            },7:{
                location:'jcfx.JiCengZhengQuanTongJi',
                type:'1'
            },"7-1":{
                location:'jcfx.JiZhengCSDataQuery',
                type:'1'
            },"7-2":{
                location:'jcfx.JiZhengCWHDataQuery',
                type:'1'
            },"7-3":{
                location:'jcfx.JiZhengJJHZSDataQuery',
                type:'1'
            },"7-4":{
                location:'jcfx.JiZhengYNCDataQuery',
                type:'1'
            },8:{
                location:'jcfx.MinGuanYeWuFenXi',
                type:'1'
            },"8-1":{
                location:'jcfx.MinGuanSTDataQuery',
                type:'1'
            },"8-2":{
                location:'jcfx.MinGuanMFDataQuery',
                type:'1'
            },"8-3":{
                location:'jcfx.MinGuanJJHDataQuery',
                type:'1'
            }
        }



        var genMenulevelonehtml=function(nodes){
            var result="";
            for(var i=0;i<nodes.length;i++){
                result+='<li class="leftli"> <ul> <li class="menulevelone"><a >'+nodes[i].title+'<span></span></a></li> <li class="dropdown"> </li> </ul> </li>';
                result+='<li class="jianju"></li>';
            }
            return result;
        };

        var genMenuleveltwohtml=function(nodes){
            console.log(nodes);
            var resutl='';
            for(var i=0;i<nodes.length;i++){
                var node = nodes[i];
                $li='<li><a  opt="1">'+node.title+'</a></li>';
                $li.otherOpt={};
                for(var p in node) {
                    $li.otherOpt[p] = node[p];
                }
                console.log($li.otherOpt);
                resutl+=$li;
            }
            return '<ul> '+resutl+' </ul>';
        };


        function start(){
            addAccordion();
            //window.setTimeout(function(){$('#currentDate').text(FullCalendar.RunGLNL())},1000);
            new validateInit();
        }
        function addAccordion() {
            var menu_pension = $('#menu_newpension');
            var test=function(){
                var $dropdownas=$('#menu_newpension li.dropdown a');
                $dropdownas.click(function(e){
                    var me = $(this);
                    $dropdownas.each(function(){
                        $(this).removeClass('menuselected')
                            .parents('.dropdown').prev().find('a').removeClass('menulevelone-selected');
                    });
                    $(this).addClass('menuselected').parents('.dropdown').prev().find('a').addClass('menulevelone-selected');
                    require(['views/OpenPage'],function(js){
                        js.open($.extend({},notes[$(me).attr('opt')],{title:$(me).text()}))
                    })
                }).hover(function(e){
                    $dropdownas.removeClass('dropdown-li-a-hover');
                    $(this).addClass('dropdown-li-a-hover')
                },function(e){
                    $dropdownas.removeClass('dropdown-li-a-hover');
                });
            }

            var getAccordion = function (res) {
                var one=genMenulevelonehtml(res);
                $('#menu_newpension .leftul').append(one);



                $('#menu_newpension li.menulevelone a').click(function (e) {
                    $me = $(this);
                    $.ajax(
                        {
                            url:'menutree',
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
                                test();
                                e.preventDefault();
                            }
                        }
                    )

                 });

                return;
                var isselected = true;
                $(res).each(function (i) {
                    var me = $(this);
                    if (me.attr('leaf'))return;//如果是叶子,则没有这个抽屉

                    menu_pension.accordion('add', {
                        title: me.attr('text'),
                        selected: isselected
                    }).children(':last').attr('functionid', me.attr('id'));
                    if (isselected) {
                        isselected = false;//第一个叶子默认打开
                    }
                })

            }


            //加载抽屉
            $.ajax(
                {
                    url:'menutree',
                    success:getAccordion
                }
            )
        }

        return {
            start:start
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





