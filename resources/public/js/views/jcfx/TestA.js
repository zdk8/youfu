/**
 * Created by weipan on 2014/10/23.
 * desc:一个highcharts的测试练习页面
 */

define(function(){
    var colorArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e','f'];
    var getRandomColor=function(){
        var result="";
        var len=colorArray.length-1;
        for(var i=0;i<6;i++){
            var index=Math.round(Math.random()*len,1);
            result+=colorArray[index];
        }
        return '#'+result;
    }
    var render=function(local,option){
            var chart=new Highcharts.Chart({
                chart: {
                    renderTo: 'container',
                    type: 'spline',
                    backgroundColor:'rgba(245, 232, 233, .1)',
                    plotBorderColor:'red',
                    borderColor: '#EBBA95',
                    borderWidth: 2,
                    borderRadius:5,
                    height:450,
                    spacingBottom: 10,
                    zoomType: 'x',
                    panning: true,
                    panKey: 'shift',
                    events:{
                        click: function(e) {
                            console.log(
                                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', e.xAxis[0].value),
                                e.yAxis[0].value
                            )
                        },
                        load: function () {
                            var label = this.renderer.label('Chart loaded(表格加载完毕)', 100, 120)
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
                            }, 3000);
                        },drilldown:function(e){
                            //例子地址 http://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/highcharts/drilldown/async/
                            console.log('test drilldown..........');
                            if (!e.seriesOptions) {
                                var chart = this,
                                    drilldowns = {
                                        'Animals': {
                                            name: 'Animals',
                                            data: [
                                                ['Cows', 2],
                                                ['Sheep', 3]
                                            ]
                                        },
                                        'Fruits': {
                                            name: 'Fruits',
                                            data: [
                                                ['Apples', 5],
                                                ['Oranges', 7],
                                                ['Bananas', 2]
                                            ]
                                        },
                                        'Cars': {
                                            name: 'Cars',
                                            data: [
                                                ['Toyota', 1],
                                                ['Volkswagen', 2],
                                                ['Opel', 5]
                                            ]
                                        }
                                    },
                                    series = drilldowns[e.point.name];
                                chart.showLoading('Simulating Ajax ...');
                                setTimeout(function () {
                                    chart.hideLoading();
                                    chart.addSeriesAsDrilldown(e.point, series);
                                }, 1000);
                            }
                        }
                    }
                },
                loading: {
                    hideDuration: 1000,
                    showDuration: 1000,
                    labelStyle: {
                        top: '45%',color:getRandomColor()
                    },
                    style: {
                        position: 'absolute',
                        backgroundColor: getRandomColor(),
                        opacity: 0.5,
                        textAlign: 'center'
                    }
                },
                credits:{
                    enabled:false
                },
                legend: {
                    backgroundColor: '#FCFFC5',
                    borderRadius: 5,
                    borderWidth: 1
                },
                title: {
                    text: '张三的血糖数据',
                    x: -20 //center
                },
                subtitle: {
                    text: 'zhangsan\'s suger data',
                    x: -20
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: { // don't display the dummy year
                        month: '%e. %b',
                        year: '%b'
                    },
                    plotLines: [{
                        color: '#FF0000',
                        width: 2,
                        value: 5.5
                    }]
                },
                yAxis: {
                    title: {
                        text: 'Snow depth (m)'
                    },
                    lineColor: '#FF0000',
                    lineWidth: 1,
                    labels: {
                        formatter: function() {
                            return this.value / 10000 +'万';
                        }
                    },
                    min: 0,
                    plotBands: [{
                        from: 0,
                        to: 1,
                        color: 'rgba(30, 110, 213, .2)'
                    },{
                        from: 1,
                        to: 1.5,
                        color: 'rgba(68, 170, 213, .2)'
                    },{
                        from: 1.5,
                        to: 2.5,
                        color: 'rgba(255, 170, 213, .2)'
                    }]
                },
                tooltip: {
                    formatter: function() {
                        return '<b>'+ this.series.name +'</b><br>'+
                            Highcharts.dateFormat('%e. %b', this.x) +': '+ this.y +' m';
                    }
                },

                series: [{
                    name: 'Winter 2007-2008',
                    // Define the data points. All series have a dummy year
                    // of 1970/71 in order to be compared on the same x axis. Note
                    // that in JavaScript, months start at 0 for January, 1 for February etc.
                    data: [
                        [Date.UTC(1970,  9, 27), 0   ],
                        [Date.UTC(1970, 10, 10), 0.6 ],
                        [Date.UTC(1970, 10, 18), 0.7 ],
                        [Date.UTC(1970, 11,  2), 0.8 ],
                        [Date.UTC(1970, 11,  9), 0.6 ],
                        [Date.UTC(1970, 11, 16), 0.6 ],
                        [Date.UTC(1970, 11, 28), 0.67],
                        [Date.UTC(1971,  0,  1), 0.81],
                        [Date.UTC(1971,  0,  8), 0.78],
                        [Date.UTC(1971,  0, 12), 0.98],
                        [Date.UTC(1971,  0, 27), 1.84],
                        [Date.UTC(1971,  1, 10), 1.80],
                        [Date.UTC(1971,  1, 18), 1.80],
                        [Date.UTC(1971,  1, 24), 1.92],
                        [Date.UTC(1971,  2,  4), 2.49],
                        [Date.UTC(1971,  2, 11), 2.79],
                        [Date.UTC(1971,  2, 15), 2.73],
                        [Date.UTC(1971,  2, 25), 2.61],
                        [Date.UTC(1971,  3,  2), 2.76],
                        [Date.UTC(1971,  3,  6), 2.82],
                        [Date.UTC(1971,  3, 13), 2.8 ],
                        [Date.UTC(1971,  4,  3), 2.1 ],
                        [Date.UTC(1971,  4, 26), 1.1 ],
                        [Date.UTC(1971,  5,  9), 0.25],
                        [Date.UTC(1971,  5, 12), 0   ]
                    ]
                }, {
                    name: 'Winter 2008-2009',
                    data: [
                        [Date.UTC(1970,  9, 18), 0   ],
                        [Date.UTC(1970,  9, 26), 0.2 ],
                        [Date.UTC(1970, 11,  1), 0.47],
                        [Date.UTC(1970, 11, 11), 0.55],
                        [Date.UTC(1970, 11, 25), 1.38],
                        [Date.UTC(1971,  0,  8), 1.38],
                        [Date.UTC(1971,  0, 15), 1.38],
                        [Date.UTC(1971,  1,  1), 1.38],
                        [Date.UTC(1971,  1,  8), 1.48],
                        [Date.UTC(1971,  1, 21), 1.5 ],
                        [Date.UTC(1971,  2, 12), 1.89],
                        [Date.UTC(1971,  2, 25), 2.0 ],
                        [Date.UTC(1971,  3,  4), 1.94],
                        [Date.UTC(1971,  3,  9), 1.91],
                        [Date.UTC(1971,  3, 13), 1.75],
                        [Date.UTC(1971,  3, 19), 1.6 ],
                        [Date.UTC(1971,  4, 25), 0.6 ],
                        [Date.UTC(1971,  4, 31), 0.35],
                        [Date.UTC(1971,  5,  7), 0   ]
                    ]
                }, {
                    name: 'Winter 2009-2010',
                    data: [
                        [Date.UTC(1970,  9,  9), 0   ],
                        [Date.UTC(1970,  9, 14), 0.15],
                        [Date.UTC(1970, 10, 28), 0.35],
                        [Date.UTC(1970, 11, 12), 0.46],
                        [Date.UTC(1971,  0,  1), 0.59],
                        [Date.UTC(1971,  0, 24), 0.58],
                        [Date.UTC(1971,  1,  1), 0.62],
                        [Date.UTC(1971,  1,  7), 0.65],
                        [Date.UTC(1971,  1, 23), 0.77],
                        [Date.UTC(1971,  2,  8), 0.77],
                        [Date.UTC(1971,  2, 14), 0.79],
                        [Date.UTC(1971,  2, 24), 0.86],
                        [Date.UTC(1971,  3,  4), 0.8 ],
                        [Date.UTC(1971,  3, 18), 0.94],
                        [Date.UTC(1971,  3, 24), 0.9 ],
                        [Date.UTC(1971,  4, 16), 0.39],
                        [Date.UTC(1971,  4, 21), 0   ]
                    ]
                }],
                navigation: {
                    buttonOptions:{
                        text:'点我导出',
                        title:'ssssssssssssss',
                        theme: {
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
                    menuItemStyle: {
                        padding: '0 5px',
                        background: getRandomColor(),
                        color: '#303030'
                    },
                    menuItemHoverStyle: {
                        background: getRandomColor(),
                        color: '#FFFFFF'
                    }
                },
                exporting: {
                    buttons: {
                        contextButton: {
                            menuItems: [{
                                text: '<span style="color:red;">在线编辑</span>',
                                onclick: function () {
                                    window.open('/test/index.php?from=demo&p=88');
                                }
                            }, {
                                separator: true
                            }]
                                .concat(Highcharts.getOptions().exporting.buttons.contextButton.menuItems)
                                .concat([{
                                    separator: true
                                }, {
                                    text: '<a href="http://www.highcharts.me">Highcharts中文网</a>'
                                }, {
                                    text: 'Highcharts中文网',
                                    onclick:function() {
                                        alert("Highcharts中文网");
                                    }
                                },{
                                    separator: true
                                }, {
                                    text: '英文官网API',
                                    onclick:function() {
                                        window.open('http://api.highcharts.com/');
                                    }
                                }])
                        }
                    }
                }
            });


            var subtitle = {
                style:{
                    color:"red",
                    fontWeight:"bold"
                }
            };

            //var chart1 = new Highcharts.Chart(chart);
            chart.setTitle(null,subtitle);     //设置副标题，第一个参数设置为null
            var renderer = chart.renderer;
            var ele_cir=renderer.circle(50, 100, 50);
            ele_cir.on('click', function () {
                ele_cir.animate({
                    x: 150,
                    y: 50,
                    'stroke-width': 10
                }).attr({
                    'stroke-width': 2,
                    stroke: 'gray',
                    fill: 'silver',
                    zIndex: 3
                })

            });

            var ele_rect1=renderer.rect(0, 0, $(window).width()-50, 100, 5)
                .attr({
                    'stroke-width': 2,
                    stroke: 'red',
                    fill: 'gray'
                });
            var ele_rect2=renderer.rect(0, 110, $(window).width()-50, 100, 5)
                .attr({
                    'stroke-width': 2,
                    stroke: 'green',
                    fill: 'gray'
                });

            var ele_rect3=renderer.rect(0, 220, $(window).width()-50, 100, 5)
                .attr({
                    'stroke-width': 2,
                    stroke: 'yellow',
                    fill: 'gray'
                });

            //ele_rect1.add();
            //ele_rect2.add();
            //ele_rect3.add();
            ele_cir.add();

            local.find('a[opt=plotbackgroundcolor]').bind('click',function(){
                var color=getRandomColor();
                alert(color)
                chart.chart.plotBackgroundColor=color;
            });
        local.find('a[opt=showloading]').toggle(
            function () {
                chart.showLoading();
                $(this).html('显示加载');
            },
            function () {
                chart.hideLoading();
                $(this).html('隐藏加载');
            }
        );
            local.find('a[opt=randomcolor]').bind('click',function(){
                console.log(getRandomColor());
            })
    }


    return {
        render:render
    }
})