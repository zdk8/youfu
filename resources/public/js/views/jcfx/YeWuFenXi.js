define(function(){
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
    /*业务类型*/
    var getbilltype = function(local){
        var billtype = local.find(':input[opt=billtype]');
        billtype.combotree({
            panelHeight:300,
            url:'../../civil/getenums?id=parent',       //"parent 所有业务"
            method: 'get',
            onLoadSuccess:function(load,data){
                if(!this.firstloaded){
                    billtype.combotree('setText', data[0].text);
                    this.firstloaded=true;
                 }
            },
            onBeforeExpand: function (node) {
                billtype.combotree("tree").tree("options").url
                    = '../../civil/getenums';
            },
            onHidePanel: function () {
                billtype.combotree('setValue',
                        billtype.combotree('tree').tree('getSelected').id)
                    .combobox('setText',
                        billtype.combotree('tree').tree('getSelected').text);
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
//                console.log('新值'+newValue+',旧值'+oldValue);
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

    var render = function(local,posion){
        getdivision(local); //行政区划
        getbilltype(local); //业务类型
        getdateway(local);  //时间方式
        var division = local.find("[opt=divisiontree]");
        var billtype = local.find("[opt=billtype]");
        var billstatus = local.find("[opt=billstatus]");
        var dateway = local.find("[opt=dateway]");
        var shijian = local.find("[opt=shijian]");
        var shijian1 = local.find("[opt=shijian1]");
        var shijian2 = local.find("[opt=shijian2]");
        /*存放统计时的条件*/
        var divisionvalue;
        var billtypevalue;
        var billstatusvalue;
        var datewayvalue;
        /*统计*/
        var url = preFixUrl+"jcfxs/ywfx";
        var tongji =
        local.find("[opt=tongji]").bind("click",function(){
            console.log("1111111111111111111111-->"+division.combotree("getValue"))
            divisionvalue=division.combotree("getValue");
            billtypevalue=billtype.combotree("getText") == "所有业务" ? "all":
                            billtype.combotree("getText") == "地名类型" ? "dm":
                                  billtype.combobox('getValue');
            billstatusvalue=billstatus.combobox("getValue");
            datewayvalue = dateway.combobox("getValue");
            showCont(url);
        })
        /*页面加载完成触发事件*/
//        local.ready(function(){

        window.setTimeout(function(){
            local.find("[opt=tongji]").trigger('click');
        },1000)
//        })
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
        function showCont(url){
            var billtypetext = billtype.combobox("getText");
            var dvnames=[];
            dvnames.push({
                datename:'tname',valuename:'tsum'
            })
            /*数据加载*/
            var datatuxing = local.find('[opt=datatuxing]');
            datatuxing.datagrid({
                url:url,
                type:'post',
                dataType:'json',
                queryParams:{
                    districtid:division.combotree("getValue"),
                    placetype:billtypetext == "所有业务" ? "all":billtypetext == "地名类型" ? "dm":billtype.combobox('getValue'),
                    status:billstatus.combobox("getValue"),
                    timefun:dateway.combobox("getValue"),
                    timetype:shijian.datebox("getValue"),
                    starttime:shijian1.datebox("getValue"),
                    endtime:shijian2.datebox("getValue")
                },
                onDblClickRow:function(rowIndex, rowData){
                    require(['commonfuncs/popwin/win','text!views/jcfx/YeWuFenXiDlg.htm','views/jcfx/YeWuFenXiDlg'],
                        function(win,htmfile,jsfile){
                            var obj = new Object();
                            obj = rowData;
                            var tname = obj['tname'].substring(0,1);
                            if(divisionvalue.length <= 6 && tname != "界"){
                                win.render({
                                    title:'详细信息',
                                    width:724,
                                    html:htmfile,
                                    renderHtml:function(local,submitbtn,parent){
                                        jsfile.render(local,{
                                            submitbtn:submitbtn,
                                            parent:parent,
                                            thead:obj,
                                            divisionvalue:divisionvalue,
                                            billtypevalue:billtypevalue,
                                            billstatusvalue:billstatusvalue,
                                            timefunvalue:datewayvalue,
                                            onCreateSuccess:function(data){
                                                parent.trigger('close');
                                            }
                                        })
                                    }
                                })
                            }
                        })
                },
                onLoadSuccess:function(data){
//                    console.log(data["rows"])
                    var obj=format(data["rows"],"tttttttttttttt",dvnames);
//                    console.log(JSON.stringify(obj))
                    /*加载图形*/
                    renderAchart(obj.seriesData, { titleText: '', seriesName:'bbbbb',yAxisTitleText:'数量',
                        categoriesDate:obj.categoriesDateX})
                }
            })
        }

        /*保留两位小数*/
        function changeTwoDecimal(x){
            var f_x = parseFloat(x);
            if (isNaN(f_x)){
                return false;
            }
            var f_x = Math.round(x*100)/100;
            return f_x;
        }
        /*按钮样式变换*/
       /* local.find('input[action=changebutton]').bind("mouseover",function(){
            this.style.background="url(../../../img/button2.jpg)";
        });
        local.find('input[action=changebutton]').bind("mouseout",function(){
            this.style.background="url(../../../img/button1.jpg)";
        })*/



        /*初始化统计图*/
        function renderAchart(series,option){
            /*曲线*/
            local.find('[opt=containerLine]').highcharts({
                chart: {
                    type: "line"/*,
                    borderColor:"#EBBA95",
                    borderWidth:2,
                    borderRadius:10,    //边框弧度
                    plotBorderColor: '#346691',     //char边框
                    plotBorderWidth: 2*/
                },
                legend: {
                    enabled: false
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
                navigation: {
                    buttonOptions: {
                        align: 'left'
                    }
                },
                xAxis: {
                    title:{
                        text:"时间"
                    },
                    categories: option.categoriesDate,
                    labels:{
                        rotation:90
                    }
                },
                yAxis: {
                    title: {
                        text: option.yAxisTitleText
                    },
                    min:0,
                    labels: {
                        formatter: function() {
                            return this.value/10000 +"万"
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var yValue = this.y/10000;
                        var y = yValue >= 1 ?changeTwoDecimal(yValue)+"万" : this.y
                        return  this.x+","+'<b>'+ y +'</b>';
                    }
                },
                series :series
            });
            /*柱*/
            local.find('[opt=containerColumn]').highcharts({
                chart: {
                    type: "column"
//                    borderColor:"#EBBA95",
                    /*options3d: {
                        enabled: true,
                        alpha: 10,
                        beta: 10
                    }*/
                },
                legend: {
                    enabled: false
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
                navigation: {
                    buttonOptions: {
                        align: 'left'
                    }
                },
                xAxis: {
                    title:{
                        text:"时间"
                    },
                    categories: option.categoriesDate,
                    labels:{
                        rotation:90
                    }
                },
                yAxis: {
                    title: {
                        text: option.yAxisTitleText
                    },
                    min:0,
                    labels: {
                        formatter: function() {
                            return this.value/10000 +"万"
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var yValue = this.y/10000;
                        var y = yValue >= 1 ?changeTwoDecimal(yValue)+"万" : this.y
                        return  this.x+","+'<b>'+ y +'</b>';
                    }
                },
                series :series
            });
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
                /*legend: {
                    enabled: false
                },*/
                credits:{       //右下角图标
                    enabled:false
                },
                title: {
                    text: option.titleText
                },
                subtitle: {
//                    text: option.subtitle
                },
                /*xAxis: {
                    title:{
                        text:"时间"
                    },
                    categories: option.categoriesDate
                },
                yAxis: {
                    title: {
                        text: option.yAxisTitleText
                    },
                    min:0,
                    labels: {
                        formatter: function() {
                            return this.value/10000 +"万"
                        }
                    }
                },*/
                tooltip: {
                    pointFormat: '<b>{point.percentage:.1f}%</b>'
                    /*formatter: function() {
                        var yValue = this.y/10000;
                        var y = yValue >= 1 ?changeTwoDecimal(yValue)+"万" : this.y
                        return  '<b>{point.percentage:.1f}%</b>';
                    }*/
                },
                series :series
            });
        }

    }

    return {
        render:render
    }
})