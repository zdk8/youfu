/**
 * Created by Administrator on 2014/11/4.
 */
define(function(){

    var draw=function(container){
            $(container).highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    width:400,
                    margin:0
                },
                title: {
                    text: 'Browser market shares at a specific website, 2010'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            formatter: function() {
                                return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
                            }
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Browser share',
                    data: [
                        ['Firefox',   45.0],
                        ['IE',       26.8],
                        {
                            name: 'Chrome',
                            y: 12.8,
                            sliced: true,
                            selected: true
                        },
                        ['Safari',    8.5],
                        ['Opera',     6.2],
                        ['Others',   0.7]
                    ]
                }]
            });
    }
    var showDetail=function(){
        require(['commonfuncs/popwin/win','text!views/jcfx/TestC.htm','views/jcfx/TestC'],function(win,htmfile,jsfile){
            win.render({
                title:'测试弹出层功能',
                width:724,
                html:htmfile,
                buttons:[],
                renderHtml:function(local,submitbtn,parent){
                    console.log('888开始88')
                    console.log(local)
                    console.log('888结束88')
                    jsfile.render(local,{
                        submitbtn:submitbtn,
                        act:'c',
                        parent:parent,
                        onCreateSuccess:function(data){
                            parent.trigger('close');
                            localDataGrid.datagrid('reload');
                        }
                    })
                }
            })
        })
    }
    var a=function(local,option){
        var localDataGrid=
            local.find('.easyui-datagrid-noauto').remove('easyui-datagrid-noauto').addClass('easyui-datagrid')
                .datagrid({
                //view: cardview,
                url:'jsondata/testdata.json?version=1.1.1.1',
                method:'get',
                striped:true,
                onLoadSuccess:function(data){
                    var pageSize=$(this).datagrid('options').pageSize;

                    for(var i= 0,len=pageSize-data.rows.length;i<len;i++){
                        localDataGrid.datagrid('appendRow',{ productid: 'xxname' });
                    }

                    var merges = [{
                        index: 0,
                        rowspan:pageSize
                    }];
                    for(var i=0; i<merges.length; i++){
                        $(this).datagrid('mergeCells',{
                            index: merges[i].index,
                            field: 'productid',
                            rowspan: merges[i].rowspan
                        });
                    }
                    draw(local.find('td.datagrid-td-merged[field=productid]'));
                },
                onClickRow:function(index,row){
                    showDetail();
                }
            });
    }


    return {
        render:a
    }
})