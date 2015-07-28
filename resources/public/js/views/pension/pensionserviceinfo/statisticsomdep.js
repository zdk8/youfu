define(function(){
    /*获取机构名称*/
    var getDepartName = function(local){
        var servicemgt = local.find("input[opt=servicemgt]");
        servicemgt.combogrid({
            panelWidth:servicemgt.width()+1,
            panelHeight:300,
            url:'pension/getalldepartment2',
            queryParams:{
                deptype:'jigou'
            },
            method:'post',
            idField:'dep_id',
            textField:'departname',
            mode:'remote',
            columns:[[
                {field:'departname',title:'机构名称',width:servicemgt.width()-2}
            ]],
            onBeforeLoad:function(params){
                params.departname = local.find('[opt=servicemgt]').combobox('getValue')
            },
            onClickRow:function(index,row){
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
            var dateDepartname=existInArray(data,se.departname);
            var dateType=existInArray(data,se.datatype);
            var dateSex=existInArray(data,se.sex);
            var dateAge=existInArray(data,se.age);
            var valueOjb=existInArray(data,se.valuename);
            if(dateOjb){
                var tmparr=[];
                var categoriesDateX = [];
                for(var i=0;i< dateOjb.dvalue.length;i++){
                    var isdepartname =dateDepartname.dvalue[i] == null?"":"-"+dateDepartname.dvalue[i];
                    var istype =dateType.dvalue[i] == null?"":"-"+dateType.dvalue[i];
                    var issex =dateSex.dvalue[i] == null?"":"-"+dateSex.dvalue[i];
                    var isage =dateAge.dvalue[i] == null?"":"-"+dateAge.dvalue[i];
                    tmparr.push([
                     "【"+dateOjb.dvalue[i]+isdepartname+istype+issex+isage+"】:"+valueOjb.dvalue[i]+"(人)",
                     valueOjb.dvalue[i]])
                    /*tmparr.push([
                        "【"+dateOjb.dvalue[i]+"】:"+valueOjb.dvalue[i]+"(人)",
                        valueOjb.dvalue[i]])*/
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
        getDepartName(local);
        var dvnames=[];
        dvnames.push({
            datename:'dvname',valuename:'opsum',departname:'departname',datatype:'oldtype',sex:'gender',age:'agevalue'
        })
      var localDataGrid=
          local.find('.easyui-datagrid-noauto').datagrid({
            url:'depart/departstatistic',
            queryParams: {
              intelligentsp:null
            },
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

                var obj  = format(data.rows,dvnames)
                /*加载图形*/
                renderAchart(obj.seriesData, { titleText: '', seriesName:'bbbbb',yAxisTitleText:'数量'},local);
                local.find('[opt=refresh]').click(function () {
                    renderAchart(obj.seriesData, { titleText: '', seriesName:'bbbbb',yAxisTitleText:'数量'},local);
                });

            },
            //striped:true,
            rowStyler2: function(index,row){
              if (row.listprice>80){
                return 'background-color:#6293BB;color:#fff;'; // return inline style
                // the function can return predefined css class and inline style
                // return {class:'r1', style:{'color:#fff'}};
              }
              return 'background-color:#fff;';
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

              //console.log(len);
              table.find('tr').removeClass('highGroupRow');
              myrowsaction(mygroupfirstrow,len);

            },
            toolbar:local.find('div[tb]')
          });


      /*          require(['commonfuncs/searchKeyWord'],function(js){
                  js.bindEvent(local,localDataGrid,['sys_mname'])
                  })
      */




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

      
      local.find('[opt=query]').bind('click',function(){
        var data={
          districtid:districtid.combotree('getValue'),
          departname:local.find('[opt=servicemgt]').combobox('getText'),
            datatype:local.find('[opt=ppselect]').val(),
            gender:local.find('[opt=sex]').combobox('getValue'),
            minage:local.find('[opt=minage]').val(),
            maxage:local.find('[opt=maxage]').val(),
            dq:local.find('input[name=diqu]:checked').val(),
            jg:local.find('input[name=jigou]:checked').val(),
            lb:local.find('input[name=leibie]:checked').val(),
            xb:local.find('input[name=sex]:checked').val(),
            nl:local.find('input[name=age]:checked').val()
        }

        localDataGrid.datagrid('reload',data);
        ieMaxRowHeight();

        
//        $.post('/old/opstatistic',data)
      });

      

      //清除所有条件
      local.find('[opt=clear]').bind('click',function(){
        local.find('[opt=districtid]').combotree('clear');
          local.find('[opt=servicemgt]').combobox('clear')
          local.find('[opt=ppselect]').val('clear')
        local.find('[opt=sex]').combobox('clear');
        local.find('[opt=minage]').val('');
        local.find('[opt=maxage]').val('');
          local.find(':input[type=radio] + label').each(function () {
              $(this).prev()[0].checked = false;
              $(this).removeClass("checked");
          })
      })
    }

  }

  return a;
})
