/**
 * Created with IntelliJ IDEA.
 * User: admin
 * Date: 8/1/14
 * Time: 12:40 PM
 * To change this template use File | Settings | File Templates.
 */

define(function(){
    var filepath='pensionweb/IntensiveCare';
    var render2=function(record){

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
                        for(var i=0;i< dateOjb.dvalue.length;i++){
                            tmparr.push([
                                new Date(dateOjb.dvalue[i].replace(/-/g,'/')).getTime(),
                                valueOjb.dvalue[i]])
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
                    seriesData:seriesData
                }
            }
        require(['text!views/trendchart/XueYYT.htm'],function(htm){
            var width=$(window).width()*0.9;
            width=width>1000?1000:width;

            $.webox({
                height:530,
                width:width,
                bgvisibel:true,
                title:'<<span style="color: green;">用户健康信息走势图</span>>',
                html:htm,
                afterRender:function(p){
                    /*$(p).cssCheckBox();
                        $(p).cssRadio();*/
                }
            })

            function showCont(){
                var monitype="";
                var url="";
                var dvnames=[];
                var scalename="";
                var plotLines=[];
                switch($("input[name=monitype]:checked").attr("value")){
                    case "xueyang":
                        dvnames.push({
                            datename:'sys_bomtime',valuename:'sys_bovalue',name:'血氧'
                        })
                        scalename="mmHg";
                        url=cj.getUrl(filepath,'mrbldo');
                        plotLines=[
                            { color: '#a8d3ec', value: 4.5, width: 150 },
                            { color: '#fef6ca', value: 1.2, width: 20 },
                            { color: '#ffeea5', value: 1, width: 20 },
                            { color: '#feb179', value: 0.2, width: 20 },
                            { color: '#ffd391', value: 0.6, width: 20 }];
                        break;
                    case "xueya":
                        dvnames.push({

                            datename:'sys_bpmtime',valuename:'sys_bspressure',name:'收缩压'
                        })
                        dvnames.push({
                            datename:'sys_bpmtime',valuename:'sys_bdpressure',name:'舒张压'
                        })
                        scalename="mmHg";
                        url=cj.getUrl(filepath,'mrbldp'); break;
                    case "xuetang":
                        dvnames.push({
                            datename:'sys_bsmtime',valuename:'sys_bsvalue',name:'血糖'
                        })
                        scalename="mmol/L";
                        url=cj.getUrl(filepath,'mrblds');
                        plotLines=[
                            { color: '#a8d3ec', value: 10, width: 150 },
                            { color: '#fef6ca', value: 7, width: 120 },
                            { color: '#ffeea5', value: 5, width: 27 },
                            { color: '#feb179', value: 4.3, width: 20 }];
                        break;
                    default:
                        break;
                }
                $.ajax({
                    url:url,
                    dataType: "json",//返回json格式的数据
                    data:{
                        sys_micard:record.sys_micard,
                        starttime:'2014-01-25 01:22:22',
                        endtime:'2014-10-01 22:22:22'
                    },
                    type:'post',
                    success:function(res){
                        var obj=format(res,"tttttttttttttt",dvnames);
                        var subtitle=(function(a){
                            var s='';
                            for(var i in a){
                                s+=a[i].name+" ";
                            }
                            return s;
                        })(dvnames);
                        console.log(JSON.stringify(obj))
                        renderYYTchart("",obj.seriesData, { titleText: '日常监测趋势图', seriesName:'bbbbb',yAxisTitleText:'值',
                            subtitle:subtitle,scalename:scalename,plotLines:plotLines})
                    }
                })
            }
            showCont();
            $("input[name=monitype]").click(function(){
                showCont();
            });

            function renderYYTchart(ele,series,option){

                $('#container').highcharts({
                    chart: {
                        type: 'spline',
                        backgroundColor: {
                            linearGradient: [0, 0, 0, 500],
                            stops: [
                                [0, 'rgb(255, 255, 255)'],
                                [1, 'rgb(255, 255, 255)']
                            ]
                        }
                    },
                    title: {
                        text: option.titleText
                    },
                    subtitle: {
                        text: option.subtitle
                    },
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: { // don't display the dummy year
                            month: '%e. %b',
                            year: '%b'
                        }
                    },
                    yAxis: {
                        title: {
                            text: option.yAxisTitleText
                        },
                        labels: {
                            formatter: function() {
                                return this.value +''
                            }
                        } ,
                        plotLines:option.plotLines
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.series.name +'</b><br>'+
                                new Date(this.x).pattern("yyyy-MM-dd hh:mm:ss")
                                 +'<br> '+ this.y +option.scalename;
                        }
                    },
                    series : series

                });
            }
        })


    }

    return {
        render:render2
    }

})