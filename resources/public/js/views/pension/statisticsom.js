define(function(){
  var a={
    render:function(local,option){
      var localDataGrid=
            local.find('.easyui-datagrid-noauto').datagrid({
              url:'datagrid_data1.json',
              method:'get',
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

                if(local.find('input[name=date]:checked').val()>0){
                  console.log('>>>>>>>>>>>>>>>>');
                  fields.push('productid');
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


                  //分组


                  //                  doGroupMerge(prevgroup,i,'productid');

                  for(var j in myGroups){
                    doGroupMerge(myGroups[j].g,i,myGroups[j].field);      
                  }
                  //


                  //console.log(local.find('.datagrid-body>table tr').eq(i).css({color:'red',height:'50px'}));
                  
                  /*
                   if(prevgroup.name==rows[i].productid){

                   console.log(i+'分组:'+rows[i].productid)
                   prevgroup.len++;
                   }else{

                   console.log(rows[i].productid+' new start :why:'+prevgroup.name)
                   if(prevgroup.len>1){

                   $(this).datagrid('mergeCells', { index: prevgroup.start, field: 'productid', rowspan: prevgroup.len });
                   }

                   prevgroup={name:rows[i].productid,len:1,start:i}

                   }

                   */

                }
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

                console.log(len);
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

      
      local.find('button[opt=query]').bind('click',function(){
        localDataGrid.datagrid('reload',{a:'b',c:'d'});
        ieMaxRowHeight();
      });


      //清除所有条件
      local.find('[opt=clear]').bind('click',function(){
        local.find('[opt=districtid]').combotree('clear');
        local.find('[opt=sex]').combobox('clear');
        local.find('[opt=date1]').datebox('setValue','');
        local.find('[opt=date2]').datebox('setValue','');
        

      })
    }

  }

  return a;
})
