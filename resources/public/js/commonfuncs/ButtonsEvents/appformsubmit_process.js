/**
 * Created by jack on 14-1-6.
 */

define(function(){

    var a={
        render:function(item,datares){
            var record=datares.record;
            this.record=record;
            var processswindiv=$('#processwin');
            if(processswindiv.length>0){
                processswindiv.window('open');
            }
            else{
                var me=this;
                require(['text!views/dbgl/dbglprocesswin.htm','text!views/dbgl/dbglapplyhistoryfieldset.htm'],
                    function(div,table){
                    $('body').append(div);
                    $('#processwin').prepend($(table).find('div .siglecontent').html());



                    $('#processwin').window({
                        title: '流程状态',
                        width: 650,
                        height: 370,
                        closed: false,
                        cache: false,
                        onOpen:function(){
                            $.parser.parse($('#processwin').parent());
                            var grid=$('#processwin').find('.easyui-datagrid');
                            var options = grid.datagrid('options');
                            $('#process_vector').html('');
                            //console.log(options);
                            grid.datagrid(
                                {
                                    onBeforeLoad: function (params) {
                                        params.businessid =me.record.id;
                                        params.start = (options.pageNumber - 1) * options.pageSize;
                                        params.limit = options.pageSize;
                                        params.totalname = "total";
                                        params.rowsname = "rows";
                                    }
                                });

                            require(['jqueryplugin/raphael-min'],function(js){


                                var paper = Raphael("process_vector", $('#process_vector').width(), 100);
                                var ellipse1= paper.ellipse(50, 30, 50, 30);
                                var text1=paper.text(45,30,'开始流程');
                                var path1=paper.path('M100 28  L150 28 L150 25 L155 30 L150 35 L150 32 L100 32 Z');
                                var ellipse2=paper.ellipse(205, 30, 50, 30);
                                var text2=paper.text(208,30,'街道/乡镇审核');
                                var path2=paper.path('M255 28  L305 28 L305 25 L310 30 L305 35 L305 32 L255 32 Z');
                                var ellipse3= paper.ellipse(360, 30, 50, 30);
                                var text3=paper.text(357,30,'区/县/市审批');
                                var path3=paper.path('M410 28  L460 28 L460 25 L465 30 L460 35 L460 32 L410 32 Z');

                                var ellipse4=paper.ellipse(515, 30, 50, 30);
                                var text4=paper.text(510,30,'结束流程');
                                if(me.record['processstatus']==processdiction.stepone){
                                    //alert(1);
                                    var path_process=paper.path('M195 35  L205 45 L220 28');
                                    var split_process=paper.path('M265 60  L265 80 L260 80 L270 90 L280 80 L275 80 L275 60 Z');
                                    var text_process=paper.text(195,80,me.record['displayname']);
                                    //path_process.attr("fill", "red");
                                    path_process.attr("stroke", "red");
                                    split_process.attr("stroke", "red");
                                    split_process.attr("stroke-width", 2);
                                    path_process.attr("stroke-width", 2);

                                    //path_process

                                }else if(me.record['processstatus']==processdiction.steptwo){
                                    var path_process=paper.path('M350 35  L360 45 L375 28');
                                    var split_process=paper.path('M420 60  L420 80 L415 80 L425 90 L435 80 L430 80 L430 60 Z');
                                    var text_process=paper.text(330,80,me.record['displayname']);
                                    //path_process.attr("fill", "red");
                                    path_process.attr("stroke", "red");
                                    split_process.attr("stroke", "red");
                                    split_process.attr("stroke-width", 2);
                                    path_process.attr("stroke-width", 2);

                                }else if(me.record['processstatus']==processdiction.stepthree){
                                    var path_process=paper.path('M505 35  L515 45 L530 28');
                                    path_process.attr("stroke", "red");
                                    path_process.attr("stroke-width", 2);

                                }

                                //var circle = paper.circle(50, 40, 10);
                                //circle.attr("fill", "#f00");
                                //circle.attr("stroke", "#fff");
                            });
                        },
                        modal: true
                    });


                });
            }
        }

    }

    return a;
});
