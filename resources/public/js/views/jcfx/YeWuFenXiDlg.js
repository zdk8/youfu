define(function(){
    var render = function(local,option){
        op = option;
        var tname = option.thead["tname"]

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
                console.log(dateOjb)
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
        /*子网格*/
        var yewufenxidlg = local.find('[opt=yewufenxidlg]');
//        if(tname != null){
        var dvnames=[];
        dvnames.push({
            datename:'enum_name',valuename:'zsum'
        })
        yewufenxidlg.treegrid({
            url:preFixUrl+'jcfxs/jxcxzj',
            queryParams:{
                districtid:option.divisionvalue,
                placetype:option.billtypevalue,
                status:option.billstatusvalue,
                timefun:option.timefunvalue,
                colname:option.thead["tname"]
            },
            method:'get',
            idField:'enum_name',
            treeField:'enum_name',
            onLoadSuccess:function(row,data){
                var obj=format(data,"tttttttttttttt",dvnames);
                renderAchart(obj.seriesData, { titleText: '', seriesName:'bbbbb',yAxisTitleText:'数量',
                    categoriesDate:obj.categoriesDateX})
                console.log(obj)
            }/*,
            onDblClickRow:function(rowIndex, rowData){
                console.log($.toJSON(rowIndex)+"-------------"+rowData)
                *//*$.ajax({
                 url:preFixUrl+"jcfxs/ywfx",
                 dataType: "json",//返回json格式的数据
                 data:{
                 districtid:division.combotree("getValue"),
                 placetype:billtypetext == "所有业务" ? "all":billtypetext == "地名类型" ? "dm":billtype.combobox('getValue'),
                 status:billstatus.combobox("getValue"),
                 timefun:dateway.combobox("getValue"),
                 timetype:shijian.datebox("getValue"),
                 starttime:shijian1.datebox("getValue"),
                 endtime:shijian2.datebox("getValue")
                 },
                 type:'post',
                 success:function(res){
                 var obj=format(res,"tttttttttttttt",dvnames);
                 //                    console.log(JSON.stringify(obj))
                 renderAchart(obj.seriesData, { titleText: '', seriesName:'bbbbb',yAxisTitleText:'数量',
                 categoriesDate:obj.categoriesDateX})
                 }
                 })*//*
                *//* renderAchart(obj.seriesData, { titleText: '', seriesName:'bbbbb',yAxisTitleText:'数量',
                 categoriesDate:obj.categoriesDateX})*//*
            }*/

        })
//        }

        local.find('[opt=guanbi]').bind('click',function(){
            option.parent.trigger('close');
        })
        /*初始化统计图*/
        function renderAchart(series,option){
            /*饼*/
            local.find('[opt=containerPie]').highcharts({
                chart: {
                    type: "pie",
                    options3d: {
                        enabled: true,
                        alpha: 45,
                        beta: 0
                    },
                    height:268
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

    }

    return {
        render:render
    }
})