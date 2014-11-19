define(function(){
    var render = function(local,posion){
        getdivision(local);             //行政区划
        getdateway(local);              //时间方式
        var shegongtongji = local.find('table[opt=shegongtongji]');           //datagrid
        var divisiontree = local.find('input[opt=divisiontree]');               //行政区划
        var dateway = local.find("[opt=dateway]");                               //时间方式
        var shijian = local.find("[opt=shijian]");                               //时间()
        var shijian1 = local.find("[opt=shijian1]");                             //时间(1)
        var shijian2 = local.find("[opt=shijian2]");                             //时间(2)
        tongjibtn(local,shegongtongji,divisiontree,dateway,shijian,shijian1,shijian2);    //按条件查询
        window.setTimeout(function(){
            local.find("[opt=tongji]").trigger('click');
        },1000)

    }

    /*行政区划的树结构*/
    var getdivision = function(local){
        var divisiontree = local.find(':input[opt=divisiontree]') ;
        divisiontree.combotree({
            panelHeight:300,
            url:'../../civil/getdivision',
            method: 'get',
            onLoadSuccess:function(load,data){
                if(!this.firstloaded){
                    divisiontree.combotree('setValue', data[0].id)
                        .combotree('setText', data[0].text);
                    this.firstloaded=true;
                }
            },
            onBeforeExpand: function (node) {
                divisiontree.combotree("tree").tree("options").url
                    = '../../civil/getdivision?dvhigh=' + node.id;
            },
            onHidePanel: function () {
                divisiontree.combotree('setValue',
                        divisiontree.combotree('tree').tree('getSelected').id)
                    .combobox('setText',
                        divisiontree.combotree('tree').tree('getSelected').text);
            }
        });
    }
    /*时间格式化*/
    var formatter = function(date,type){
        var y = date.getFullYear();
        var m = date.getMonth()+1;
        var d = date.getDate();
        if(type != ""){
            if(type == "Y"){
                return y+'';
            }else if(type == "YM"){
                return y+'-'+(m<10?('0'+m):m);
            }
        }else{
            return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
        }
    }
    /*时间方式*/
    var getdateway = function(local){
        var dateway = local.find('[opt=dateway]'); //时间方式
        var dateall1 = local.find('[opt=dateall1]')
        var dateall2 = local.find('[opt=dateall2]')
        dateway.combobox({
            onChange:function(newValue, oldValue){
                var shijian = local.find('[opt=shijian]');
                var shijian1 = local.find('[opt=shijian1]');
                var shijian2 = local.find('[opt=shijian2]');

                if(newValue == "yyyy"){               //按年份
                    dateall1.show();
                    dateall2.hide()
                    shijian.datebox('setValue',null);
                    shijian1.datebox('setValue',null);
                    shijian2.datebox('setValue',null);
                    shijian.datebox({disabled:true})
                }else if(newValue == "md"){         //按具体月份统计
                    dateall1.show();
                    dateall2.hide();
                    shijian1.datebox('setValue',null);
                    shijian2.datebox('setValue',null);
                    shijian.datebox({disabled:false})
                    shijian.datebox({
                        onSelect: function(date){
                            shijian.datebox('setValue',formatter(date,"YM"));
                        }
                    });
                    shijian.datebox('setValue',formatter(new Date(),"YM"));
                }else if(newValue == "dd"){        //按时间段统计
                    dateall1.hide();
                    dateall2.show();
                    shijian.datebox('setValue',null);
                    shijian2.datebox('setValue',formatter(new Date(),""));
                }else{
                    dateall1.show();
                    dateall2.hide();
                    shijian1.datebox('setValue',null);
                    shijian2.datebox('setValue',null);
                    shijian.datebox({disabled:false})
                    shijian.datebox({
                        onSelect: function(date){
                            shijian.datebox('setValue',formatter(date,"Y"));
                        }
                    });
                    shijian.datebox('setValue',formatter(new Date(),"Y"));
                }
            }
        })
    }

    /*统计*/
    var tongjibtn = function(local,shegongtongji,divisiontree,dateway,shijian,shijian1,shijian2){
        var tongji = local.find("[opt=tongji]");
        tongji.bind("click",function(){
            loaddate(local,shegongtongji,divisiontree,dateway,shijian,shijian1,shijian2);
        })
    }
    /*按条件加载数据*/
    var loaddate = function(local,shegongtongji,divisiontree,dateway,shijian,shijian1,shijian2){
        var dvnames=[];
        dvnames.push({
            datename:'tname',valuename:'tsum'
        })
        shegongtongji.datagrid({
            url:preFixUrl+'jcfxs/zssg',
            queryParams:{
                districtid: divisiontree.combotree("getValue"),
                timefun:dateway.combobox("getValue"),
                typetime:shijian.datebox("getValue"),
                starttime:shijian1.datebox("getValue"),
                endtime:shijian2.datebox("getValue")
            },
            onLoadSuccess:function(data){
                var obj=format(data["rows"],"tttttttttttttt",dvnames);
                /*加载图形*/
                renderAchart(local,obj.seriesData, { titleText: '', seriesName:'bbbbb',yAxisTitleText:'数量',
                    categoriesDate:obj.categoriesDateX})
            },
            onDblClickRow:function(rowIndex, rowData){
                require(['commonfuncs/popwin/win','text!views/jcfx/SheGongTongJiDlg.htm','views/jcfx/SheGongTongJiDlg'],
                    function(win,htmfile,jsfile){
                        var obj = new Object();
                        obj = rowData;
                        console.log(rowData["tname"])
//                        var tname = obj['tname'].substring(0,1);
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
                                    districtid:divisiontree.combotree("getValue"),
                                    timefun:dateway.combobox("getValue"),
                                    colname:rowData["tname"],
                                    onCreateSuccess:function(data){
                                        parent.trigger('close');
                                    }
                                })
                            }
                        })
                    })
            }
        })
    }

    /*将x、y轴分别装入数组*/
    var existInArray=function(a,p){
        for(var i in a){
            if(a[i]['dname']==p){
                return a[i];
            }
        }
        return false;
    }
    var format=function(d,seriesName,series){
        var data=[];
        for(var i in d){
            for(var p in d[i]){
                var obj=existInArray(data,p);
                if(!obj){
                    data.push({dname:p,dvalue:[d[i][p]]})
                }else{
                    obj.dvalue.push(d[i][p])
                }
            }
        }
        var seriesData=[];
        for(var i in series){
            var se=series[i];
            var dateOjb=existInArray(data,se.datename);
            var valueOjb=existInArray(data,se.valuename);
            if(dateOjb){
                var tmparr=[];
                var categoriesDateX = [];
                for(var i=0;i< dateOjb.dvalue.length;i++){
                    tmparr.push([
                        dateOjb.dvalue[i],
                        valueOjb.dvalue[i]])
                    categoriesDateX.push(dateOjb.dvalue[i])
                }
                seriesData.push({
                    name : se.name,
                    data : tmparr,
                    tooltip: {
                        valueDecimals: 2
                    }
                });
            }
        }
        return {
            seriesName:seriesName,
            data:data,
            seriesData:seriesData,
            categoriesDateX:categoriesDateX
        }
    }
    /*初始化统计图*/
    function renderAchart(local,series,option){
        /*饼*/
        local.find('[opt=containerPie]').highcharts({
            chart: {
                type: "pie"/*,
                 options3d: {
                 enabled: true,
                 alpha: 45,
                 beta: 0
                 }*/
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
                text: option.titleText
            },
            subtitle: {
//                    text: option.subtitle
            },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>'
            },
            series :series
        });
    }


    return {
        render:render
    }
})