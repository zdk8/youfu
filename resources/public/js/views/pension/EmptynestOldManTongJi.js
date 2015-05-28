define(function(){
    /*将x、y轴分别装入数组*/
    var existInArray=function(a,p){
        for(var i in a){
            if(a[i]['dname']==p){
                return a[i];
            }
        }
        return false;
    }
    var format=function(d,series){
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
        for(var i in series[0]){
            var se=series[0];
            var dateOjb=existInArray(data,se.datename);
            var dateType=existInArray(data,se.datatype);
            var dateSex=existInArray(data,se.sex);
            var dateAge=existInArray(data,se.age);
            var valueOjb=existInArray(data,se.valuename);
            if(dateOjb){
                var tmparr=[];
                var categoriesDateX = [];
                dd =dateSex
                for(var i=0;i< dateOjb.dvalue.length;i++){
                    var istype =dateType.dvalue[i] == null?"":"-"+dateType.dvalue[i];
                    //var issex =dateSex.dvalue[i] == null?"":"-"+dateSex.dvalue[i];
                    var issex ="2";
                    var isage ="3";
                    //var isage =dateAge.dvalue[i] == null?"":"-"+dateAge.dvalue[i];
                    tmparr.push([
                        "【"+dateOjb.dvalue[i]+istype+"】:"+valueOjb.dvalue[i]+"(人)",
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
            //seriesName:seriesName,
            data:data,
            seriesData:seriesData,
            categoriesDateX:categoriesDateX
        }
    }
    /*初始化统计图*/
    function renderAchart(series,option,local){
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
    var a={
        render:function(local,option){
            addRadioCssComm(local);
            var dvnames=[];
            dvnames.push({
                datename:'dvname',valuename:'sum',datatype:'statictype',sex:'gender',age:'agevalue'
            })
            var localDataGrid=
                local.find('.easyui-datagrid-noauto').datagrid({
                    url:'old/enpeoplestatistic',
                    onLoadSuccess:function(data){
                        var detailbtns=local.find('[action=detail]');
                        var xueyangbtns=local.find('[action=xueyang]');
                        var trendgbtns=local.find('[action=trend]');
                        var btns_arr=[detailbtns,xueyangbtns,trendgbtns];
                        var rows=data.rows;

                        var fields=[];
                        if(local.find('input[name=diqu]:checked').val()>0){
                            fields.push('itemid');
                        }

                        var myGroups=(function(a){
                            var b=[];
                            for(var i in a){
                                b.push({g:{name:rows[0][a[i]],len:0,start:0},field:a[i]})
                            }
                            return b;
                        })(fields);

                        var dg=$(this);

                        var doGroupMerge=function(g,i,field){
                            if(g.name==rows[i][field]){
                                g.len++;
                            }else{
                                if(g.len>1){
                                    dg.datagrid('mergeCells', { index: g.start, field:field, rowspan: g.len });
                                }
                                g.name=rows[i][field],g.len=1,g.start=i;
                            }
                        };

                        for(var i=0;i<rows.length;i++){
                            for(var j=0;j<btns_arr.length;j++){

                                (function(index){
                                    var record=rows[index];
                                    $(btns_arr[j][i]).click(function(){

                                        if($(this).attr("action")=='xueyang'){
                                        }else if($(this).attr("action")=='detail'){
                                        }else if($(this).attr("action")=='trend'){
                                        }
                                    });
                                })(i);
                            }

                            for(var j in myGroups){
                                doGroupMerge(myGroups[j].g,i,myGroups[j].field);
                            }


                        }

                        dd  =data
                        var obj  = format(data.rows,dvnames)

                        /*加载图形*/
                        renderAchart(obj.seriesData, { titleText: '', seriesName:'bbbbb',yAxisTitleText:'数量'},local)
                    },
                    onClickRow:function(index,row){
                        var table=local.find('.datagrid-body>table');
                        var currentTR=table.find('tr').eq(index);
                        var myfirsttd=function(p,i){
                            if(p.find('td').eq(0).is(':hidden') &&  i>=0){
                                return myfirsttd(p.prev(),--i);
                            }else{
                                return p;
                            }
                        };


                        var myrowsaction=function(r,i){
                            if(i==0)return;
                            $(r).addClass('highGroupRow');
                            myrowsaction(r.next(),--i);
                        }
                        var mygroupfirstrow=$(myfirsttd(currentTR,index));
                        var len=mygroupfirstrow.find('td').eq(0).attr('rowspan')||1;

                        table.find('tr').removeClass('highGroupRow');
                        myrowsaction(mygroupfirstrow,len);

                    },
                    onDblClickRow: function (index,row) {
                        rro = row;
                        var type_tjval = local.find('[opt=type_tj]').combobox('getValue').trim();
                        var districtidval = local.find('[opt=districtid]').combobox('getValue').trim();
                        var genderval = local.find('[opt=gender]').combobox('getValue').trim();
                        var minage = local.find('[opt=minage]').val().trim();
                        var maxage = local.find('[opt=maxage]').val().trim();
                        require(['commonfuncs/popwin/win','text!views/pension/EmptynestOldManTongJiInfo.htm','views/pension/EmptynestOldManTongJiInfo'],
                            function(win,htmfile,jsfile){
                                win.render({
                                    title:'详细信息',
                                    width:620,
                                    height:435,
                                    html:htmfile,
                                    renderHtml:function(local,submitbtn,parent){
                                        jsfile.render(local,{
                                            parent:parent,
                                            type_tjval:type_tjval,
                                            districtidval:districtidval,
                                            genderval:genderval,
                                            minage:minage,
                                            maxage:maxage,
                                            rowval:row
                                        })
                                    }
                                })
                            }
                        )
                    },
                    toolbar:local.find('div[tb]')
                });

            var ieMaxRowHeight=function(){

                //window.setInterval
                var count=0;
                var timer=window.setInterval(function(){
                    var f=local.find('.datagrid-body>table tr').css({height:'25px'});
                    if(count++>20){
                        window.clearInterval(timer);
                    }
                },100);

            }

            ieMaxRowHeight();
            var districtid = local.find('[opt=districtid]');      //行政区划值
            getdivision(districtid);




            /*统计*/
            local.find('[opt=query]').bind('click',function(){
                var type_tjval = local.find('[opt=type_tj]').combobox('getValue').trim();
                var districtidval = local.find('[opt=districtid]').combobox('getValue').trim();
                var genderval = local.find('[opt=gender]').combobox('getValue').trim();
                var minage = local.find('[opt=minage]').val().trim();
                var maxage = local.find('[opt=maxage]').val().trim();

                var colsfields = {
                    type_tj:type_tjval.length == 0 ?null:"type_tj"
                }
                var data={
                    statictype:type_tjval,
                    districtid:districtidval,
                    gender:genderval,
                    minage:minage,
                    maxage:maxage
                }

               /* localDataGrid.datagrid({
                    columns:[[
                        {field:'dvname',title:'地区1',width:100},
                        {field:'gender',title:'性别1',width:100},
                        {field:'agevalue',title:'年龄1',width:100},
                        {field:'opsum',title:'人数',width:100,align:'right'}
                    ]]
                });*/
                localDataGrid.datagrid('reload',data);
                ieMaxRowHeight();


            });



            //清除所有条件
            local.find('[opt=clear]').bind('click',function(){
                local.find('[opt=districtid]').combobox('clear');
                local.find('[opt=type_tj]').combobox('clear')
                local.find('[opt=gender]').combobox('clear');
                local.find('[opt=minage]').val('');
                local.find('[opt=maxage]').val('');
            })
            //高级统计
            /*local.find('[opt=seniortj]').click(function () {
                require(['commonfuncs/popwin/win','text!views/pension/EmptynestOldManSeniorFields.htm','views/pension/EmptynestOldManSeniorFields'],
                    function(win,htmfile,jsfile){
                        win.render({
                            title:'高级统计',
                            width:620,
                            height:435,
                            html:htmfile,
                            buttons:[
                                {text:'取消',handler:function(html,parent){
                                    parent.trigger('close');
                                }},{
                                    text:'确定',
                                    handler:function(html,parent){
                                        parent.find('[opt=formfields]').form('submit',{
                                            url:'old/enpeoplestatistic',
                                            onSubmit: function (param) {
                                                var type_tjval = local.find('[opt=type_tj]').combobox('getValue').trim();
                                                var districtidval = local.find('[opt=districtid]').combobox('getValue').trim();
                                                var genderval = local.find('[opt=gender]').combobox('getValue').trim();
                                                var minage = local.find('[opt=minage]').val().trim();
                                                var maxage = local.find('[opt=maxage]').val().trim();
                                                param.statictype = type_tjval;
                                                param.districtid = districtidval;
                                                param.gender = genderval;
                                                param.minage = minage;
                                                param.maxage = maxage;
                                            },
                                            success: function (data) {
                                                var datas = eval('('+data+')')
                                                parent.trigger('close');
                                                localDataGrid.datagrid('loadData',datas);
                                            }
                                        })

                                    }
                                }
                            ],
                            renderHtml:function(local,submitbtn,parent){
                                jsfile.render(local,{
                                    parent:parent,
                                    closobj:closobj
                                })
                            }
                        })
                    }
                )
            })*/
        }

    }

    return a;
})
