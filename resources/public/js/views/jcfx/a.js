define(function(){
    function render(local,option){
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
            console.log(series)
            for(var i in series){
                var se=series[i];
                var dateOjb=existInArray(data,se.datename);
                var valueOjb=existInArray(data,se.valuename);
                console.log(dateOjb)
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
                    },{
                        type:"column",
                        name:"柱状",
                        data:[12.3999,11.725,11.0414,10.3517,9.6577,8.9608,8.2617,7.8464,7.3444,7.2072,6.8999,6.4735,6.3892,6.1188,5.7182,5.2264,5.0962]
                    });
                }
            }
            return {
                seriesName:seriesName,
                data:data,
                seriesData:seriesData
            }
        }

            function showCont(){
                var url= 'auth/proxy?urldest=http://112.124.50.195:8080/pensionwebbg/pension/getbsbytime';
                var dvnames=[];
                var scalename="";
                var plotLines=[];
                dvnames.push({
                    datename:'sys_bsmtime',valuename:'sys_bsvalue',name:'血糖'
                })
                scalename="mmol/L";
                plotLines=[
                    { color: '#a8d3ec', value: 10, width: 2},
                    { color: '#fef6ca', value: 7, width: 2}]
                $.ajax({
                    url:url,
                    dataType: "json",//返回json格式的数据
                    data:{
                        sys_micard:'330502193712070219',
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
//                        console.log(JSON.stringify(obj))
                        console.log(obj.seriesData)
                        renderAchart("",obj.seriesData, { titleText: '日常监测趋势图', seriesName:'bbbbb',yAxisTitleText:'值',
                            subtitle:subtitle,scalename:scalename,plotLines:plotLines})
                    }
                })
            }
            showCont();

            function renderAchart(ele,series,option){
                local.find('[opt=container]').highcharts({
                    chart: {
//                        type: 'spline',
                        type: 'area',
//                        inverted: true,             //反转
//                        alignTicks:false,
//                        animation: false,
                        backgroundColor: {
                            linearGradient: [0, 0, 0, 500],
                            stops: [
                                [0, 'rgb(255, 255, 255)'],
                                [1, 'rgb(255, 255, 255)']
                            ]
                        },
                        borderColor:"#EBBA95",
                        borderWidth:2,
                        borderRadius:20,    //边框弧度
//                        height:400,         //char的高度
//                        width:1200,
//                        ignoreHiddenSeries:true,
//                        margin: [0, 0, 0, 0],      //外缘之间的差距的图表和图形区。
//                        marginBottom: 100,         //series 与下方的间隔 marginLeft......
                        options3d:{                 //3d形式
                            enabled:true,
                            alpha: 15,
                            beta: 15,
                            depth: 50,
                            viewDistance: 25
                        },
//                        panKey: 'shift',
                        zoomType: 'x',          //对series进行缩放 x：左右拖y:上下
                        resetZoomButton:{      //重置缩放
                            /*position:{          //位置
                                x :10,
                                y:20
                            },*/
                            relativeTo: 'chart',
                            theme: {
                                fill: 'white',
                                stroke: 'silver',
                                r: 0,
                                states: {
                                    hover: {
                                        fill: '#41739D',
                                        style: {
                                            color: 'white'
                                        }
                                    }
                                }
                            }
                        },
                        panning: true,          //允许平移一个图像
//                        plotBackgroundColor: '#FCFFC5',    //背景色
                        plotBorderColor: '#346691',     //char边框
                        plotBorderWidth: 2,
//                        plotShadow:false,           //是否显示chart边框
                        events:{
                            /*单击事件*/
                            click: function(e) {
                                console.log("chartEvents------------("+
                                    "X:"+Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',e.xAxis[0].value)+
                                    "  Y:"+ e.yAxis[0].value+
                                    ")-------------chartEvents")
                            },
                            /*可调用事件*/
                            addSeries: function () {
                                /*提示标签*/
                                var label = this.renderer.label('添加一个series', 100, 120)
                                    .attr({
                                        fill: Highcharts.getOptions().colors[0],
                                        padding: 10,
                                        r: 5,
                                        zIndex: 8
                                    }).css({
                                        color: '#FFFFFF'
                                    }).add();
                                setTimeout(function () {
                                    label.fadeOut();
                                }, 1000);
                            },
                            /*series加载时事件*/
                            load: function () {
                                var label = this.renderer.label('图标加载中............', 100, 120)
                                    .attr({
                                        fill: Highcharts.getOptions().colors[0],
                                        padding: 10,
                                        r: 5,
                                        zIndex: 8
                                    })
                                    .css({
                                        color: '#FFFFFF'
                                    })
                                    .add();
                                setTimeout(function () {
                                    label.fadeOut();
                                }, 5000);
                            },
                            /*每次series加载时事件*/
                            redraw: function () {
                                var label = this.renderer.label('series加载................', 100, 120)
                                    .attr({
                                        fill: Highcharts.getOptions().colors[0],
                                        padding: 10,
                                        r: 5,
                                        zIndex: 8
                                    })
                                    .css({
                                        color: '#fffddd'
                                    })
                                    .add();
                                setTimeout(function () {
                                    label.fadeOut();
                                }, 1000);
                            }
                        }
                    },
                    credits:{       //右下角图标
                        enabled:true,
                        text:"决策管理系统",
                        href:'http://localhost:3000/dm',
                        style: {
                            cursor: 'pointer',
                            color: '#909090',
                            fontSize: '10px'

                        }
                    },

                    title: {
                        text: option.titleText
                    },
                    subtitle: {
                        text: option.subtitle
                    },
                    xAxis: {
                        /*type: 'datetime',
                        dateTimeLabelFormats: { // don't display the dummy year
                            month: '%e. %b',
                            year: '%b'
                        }*/
                    },
                    yAxis: {
                        title: {
                            text: option.yAxisTitleText+"("+option.scalename+")"
                        },
                        labels: {
                            formatter: function() {
                                return this.value +""
                            }
                        } ,
                        plotBands: [{ // mark the weekend
                            color: '#FCFFC5',
                            from: 5,
                            to: 10
                        }]
//                        alternateGridColor: '#FDFFD5',
//                        plotLines:option.plotLines
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.series.name +'</b><br>'+
                                new Date(this.x).pattern("yyyy-MM-dd hh:mm:ss")
                                +'<br> '+ this.y +" "+option.scalename;
                        }
                    },
                    series :series,
                    drilldown: {                       //扩展出子series
                        drillUpButton: {
                            relativeTo: 'spacingBox',
                            position: {
                                y: 0,
                                x: 0
                            },
                            theme: {
                                fill: 'white',
                                'stroke-width': 1,
                                stroke: 'silver',
                                r: 0,
                                states: {
                                    hover: {
                                        fill: '#bada55'
                                    },
                                    select: {
                                        stroke: '#039',
                                        fill: '#bada55'
                                    }
                                }
                            }
                        },
                        series: [{
                            id: 'animals',
                            type:"column",
                            data: [
                                ['Cats', 4],
                                ['Dogs', 2],
                                ['Cows', 1],
                                ['Sheep', 2],
                                ['Pigs', 1]
                            ]
                        }, {
                            id: 'fruits',
                            type:"pie",
                            data: [
                                ['Apples', 4],
                                ['Oranges', 2]
                            ]
                        }, {
                            id: 'cars',
                            type:"line",
                            data: [
                                ['Toyota', 4],
                                ['Opel', 2],
                                ['Volkswagen', 2]
                            ]
                        }]
                    }
                });

                var chart = $('#container').highcharts();
                $('#add').click(function () {
                    chart.addSeries({
                        name:"新增的series",
                        type:"line",
                        data: [216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5]
                    });
                    $(this).attr('disabled', true);
                });
                $("#addchar").click(function(){
                    chart.addSeries({
                        name: 'Things',
                        type:"column",
                        colorByPoint: true,
                        data: [{
                            name: 'Animals',
                            y: 5,
                            drilldown: 'animals'
                        }, {
                            name: 'Fruits',
                            y: 2,
                            drilldown: 'fruits'
                        }, {
                            name: 'Cars',
                            y: 4,
                            drilldown: 'cars'
                        }]
                    })
                });
                $('#hiden').click(function(){
                    console.log(chart.series)
                    chart.series[0].hide()
                })
                /*3d*/
                function showValues() {
                    $('#R0-value').html(chart.options.chart.options3d.alpha);
                    $('#R1-value').html(chart.options.chart.options3d.beta);
                }
                $('#R0').on('change', function () {
                    chart.options.chart.options3d.alpha = this.value;
                    showValues();
                    chart.redraw(false);
                });
                $('#R1').on('change', function () {
                    chart.options.chart.options3d.beta = this.value;
                    showValues();
                    chart.redraw(false);
                });
            }


    }

    return {
        render:render
    }
})