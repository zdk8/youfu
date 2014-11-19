define(function(){
    var render = function(local,posion){
        getdivision(local); //行政区划
        var jicengzhengquantongji = local.find('table[opt=jicengzhengquantongji]');           //datagrid
        var divisiontree = local.find('input[opt=divisiontree]');               //行政区划

        jicengzhengquantongji.datagrid({
            url:preFixUrl+'jcfxs/zsjzh',
            onLoadSuccess:function(data){
                var cs_nums = 0;         //城市社区总数
                var cwh_nums = 0;        //村委会总数
                var jjhzs_nums = 0;      //经济合作社总数
                var ync_nums = 0;        //渔农村总数
                for(var i in data["rows"]){
                    cs_nums += data["rows"][i]["cs"];
                    cwh_nums += data["rows"][i]["cwh"];
                    jjhzs_nums += data["rows"][i]["jjhzs"];
                    ync_nums += data["rows"][i]["ync"];
                }
                jicengzhengquantongji.datagrid('appendRow',{
                    enum_name: '全市',
                    cs: cs_nums,
                    cwh: cwh_nums,
                    jjhzs:jjhzs_nums,
                    ync:ync_nums
                });
                var seriesdata = [['城市社区',cs_nums],
                                    ['村委会',cwh_nums],
                                    ['经济合作社',jjhzs_nums],
                                    ['渔农村',ync_nums]]
                renderAchart(local,seriesdata);     //加载图形
            },
            onClickRow:function(rowIndex, rowData){
                var seriesrowdata = [['城市社区',rowData["cs"]],
                                        ['村委会',rowData["cwh"]],
                                        ['经济合作社',rowData["jjhzs"]],
                                        ['渔农村',rowData["ync"]]]
                renderAchart(local,seriesrowdata);          //加载图形
            },
            onDblClickRow:function(rowIndex, rowData){
                require(['commonfuncs/popwin/win','text!views/jcfx/JiCengZhengQuanTongJiDlg.htm','views/jcfx/JiCengZhengQuanTongJiDlg'],
                    function(win,htmfile,jsfile){
                        var obj = new Object();
                        obj = rowData;
                        win.render({
                            title:'详细信息',
                            width:724,
                            height:425,
                            html:htmfile,
                            renderHtml:function(local,submitbtn,parent){
                                jsfile.render(local,{
                                    submitbtn:submitbtn,
                                    parent:parent,
                                    thead:obj,
                                    districtid:rowData["districtid"],
                                    onCreateSuccess:function(data){
                                        parent.trigger('close');
                                    }
                                })
                            }
                        })
                    })
            }
        })
        tongjibtn(local,jicengzhengquantongji,divisiontree);
    }

    /*行政区划的树结构*/
    var getdivision = function(local){
        var divisiontree = local.find(':input[opt=divisiontree]') ;
        divisiontree.combotree({
            panelHeight:300,
            url:'../../civil/getdivision1?dvlength=6',
            method: 'get',
            onLoadSuccess:function(load,data){
                console.log(data)
                if(!this.firstloaded){
                    divisiontree.combotree('setValue', data[0].id)
                        .combotree('setText', data[0].text);
                    this.firstloaded=true;
                }
            },
            onBeforeExpand: function (node) {
                divisiontree.combotree("tree").tree("options").url
                    = '../../civil/getdivision1?dvlength=6&dvhigh=' + node.id;
            },
            onHidePanel: function () {
                divisiontree.combotree('setValue',
                        divisiontree.combotree('tree').tree('getSelected').id)
                    .combobox('setText',
                        divisiontree.combotree('tree').tree('getSelected').text);
            }
        });
    }
    /*统计*/
    var tongjibtn = function(local,jicengzhengquantongji,divisiontree){
        var tongji = local.find("[opt=tongji]");
        tongji.bind("click",function(){
            loaddate(local,jicengzhengquantongji,divisiontree);
        })
    }
    var loaddate = function(local,jicengzhengquantongji,divisiontree){
        jicengzhengquantongji.datagrid("load",{
            districtid: divisiontree.combotree("getValue")
        })
    }
    /*初始化统计图*/
    function renderAchart(local,series){
        /*饼*/
        local.find('[opt=containerPie]').highcharts({
            chart: {
                type: "pie"
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    }
                }
            },
            navigation: {
                buttonOptions: {
                    align: 'left'
                }
            },
            credits:{       //右下角图标
                enabled:false
            },
            title: {
                text: ""
            },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>'
            },
//            series :series
            series :[{
                data:series
            }]
        });
    }


    return {
        render:render
    }
})