/**
 * Created by cm on 2015/5/13.
 */
;!function(win, $, undefined){
      $.fn.dataGrid=function(options){
        var defaults={
            width:'',//表格宽度，默认auto
            //height:300,//表格高度，默认300
            height:'',//表格高度，默认300
            url:'',
            dataParam:{},//向后台传的参数
            autoWidth:true,
            columns:[],
            sortType: 'local',//ajax是请求后台排序，local是本页表格内容排序
            ajaxCallback: function(data, self){},
            // loadingMsg: '数据加载中。。。',  			//加载提示语
            timeout: 300,             				//设置超时时间
            timeoutMsg: '数据量太大，暂时无法查询出来！',  //查询超时提示
            initCallback:function(self){},//表格加载完毕后执行的回调函数
            pageRow:10,//每页现实的行数
            showPaging:true//是否显示分页
            };
          var opt= $.extend({},defaults,options);
          var _self=$(this);

          var widthArr = [],
              widthSum = 0,
              fieldArr = [],
              formatterArr = [],
              alignArr = [],
              dgWidth = 0;
          var dataGrid={
              /**************初始化***************/
              init:function(){
//                  初始化宽高
                  _self.width(opt.width);
                  _self.height(opt.height);
                  console.log(opt.height)
                  var headerTdStr="";
                  for(var i=0;i<opt.columns.length;i++){
                      $.each(opt.columns[i],function(k,v){
                          if(k=='width'){
                              widthArr.push(v);
                              widthSum+=v;
                          }
                      })
                  }
//                  构造表格头部
                    for(var i=0;i<opt.columns.length;i++){
                        var fieldStr="",titleStr="",widthStr="",alignStr="",dataTypeStr="",sortableStr="";
                        var _formatterHas = 0;

                      $.each(opt.columns[i],function(k,v){
                          if(k=='field'){fieldArr.push(v);}
                          if(k=='align'){alignArr.push(v);}
                          if(k=='formatter'){formatterArr.push(v)}

                          fieldStr+=k=='field'?'field='+v:'';
                          titleStr+=k=='title'?v:'';
                          alignStr+=k=='align'?'text-align:'+v+';':'';
                          dataTypeStr+=k=='dataType'?'dataType="'+v+'"':'';
                          sortableStr+=k=='sortable'?'sortable':'';
                          if(k=='width'){
                              var temWidthArr=[];
                              temWidthArr.push(v);
                              widthStr+='width:'+v/widthSum*100+'%;';
                              }
                            })

                        headerTdStr += '<td '+fieldStr+dataTypeStr+' style="'+widthStr+'"><div class="headerTdDiv'+sortableStr+'" style="'+alignStr+'">'+titleStr+'</div></td>';

                  }
                  var headerStructure='<div class="topDG" style="width: 80%;"><table cellpadding="0" cellspacing="0" border="0" class="tableHeader"><tr class="headerTR">'+headerTdStr+'</tr></table></div>';
                  _self.append(headerStructure);
                  //初始化表格内容
                  _self.append(' <div class="containDG" style="width: 80%;"><table cellspacing="0" cellpadding="0" border="0" class="tableCon"></table></div>');
                  //初始化表格底部
                  var footerStructure='<div class="pagingDG" style="width: 80%;border: 1px solid red;">'+
                                           '<div class="totalNum" style="border: 1px solid red;width: 50px;">共<span class="totalNumber" style="color: orange;padding: 5px;">100</span>条数据</div>'+
                                           '<div class="pageChose" style="border: 1px solid red;width: 200px;">'+
                                              '<span class="firstP"><a class="btnPage firstPage">首页</a></span>'+
                                              '<span class="previousP"><a class="btnPage perPage">上一页</a></span>'+
                                              '<span class="nowPageNum">2</span>'+
                                              '<span class="nextP"><a class="btnPage nextPage">下一页</a></span>'+
                                              '<span class="lastP"><a class="btnPage lastPage">尾页</a></span>'+
                                           '</div>'+
                                           '<div class="GOPage" style="width: auto;border: 1px solid red;float: right;">共<em class="totalPageNum">20</em>页&nbsp;&nbsp;&nbsp;跳转到<input type="number" min="1" class="goPage">页&nbsp;&nbsp;<span><a class="btnPage goPageChose">GO</a></span></div>'+
                                     '</div>';
                  _self.append(footerStructure);
                  if(opt.showPaging){
                      _self.find('.pagingDG').show();
                      //$('.pagingDG').css('width',opt.width-2);
                  }
              },
              /*************排序&分页****************/
              addEvent:function(){
                  //排序
                  _self.delegate('.sortable','click',function(){
                      _self.find('.sortable').removeClass('sortableasc sortabledesc');
                      if($(this).attr('sortRule') == 'desc'){
                          $(this).removeClass('sortabledesc');
                          $(this).addClass('sortableasc');
                          $(this).attr('sortRule', 'asc');
                          opt.sortRule = 'asc';
                      }else{
                          $(this).removeClass('sortableasc');
                          $(this).addClass('sortabledesc');
                          $(this).attr('sortRule', 'desc');
                          opt.sortRule = 'desc';
                      }
                      opt.sortOrderBy = $(this).parent().attr('field');
                      if(opt.sortType == 'ajax'){
                          dataGrid.AddAsyncData(1, opt.pageRow,'');
                      }else{
                          var dataType = $(this).parent().attr('dataType');
                          var colIndex = _self.find('.dgHeader .dgHeaderTr td').index($(this).parent());
                          dataGrid.sortTableLocal(colIndex, opt.sortRule, dataType);
                      }
                      return false;


                  });

                  //翻页
                  //跳转到某页
                 _self.find('.goPageChose').die().live('click',function(){
                      var r = /^\+?[1-9][0-9]*$/; //正整数
                      var goPageNum=_self.find('.goPage').val();
                      var pageTotal=_self.find('.totalPageNum').text();
                      if(r.test(goPageNum)==false){
                          alert('页码输入格式不正确，请输入数字类型！！！');
                          _self.find('.goPage').val('1');
                          return ;
                      }else{
                          if(parseInt(goPageNum)>parseInt(pageTotal)){
                              alert('超过最大页码数，请重新输入！！！');
                              _self.find('.goPage').val('1');
                              return;
                          }
                          if(parseInt(goPageNum)<parseInt(pageTotal)){
                              dataGrid.AddAsyncData(parseInt(goPageNum),opt.pageRow);
                              _self.find('.nowPageNum').text(goPageNum);
                          }
                      }
                      return false;

                  });
                  //首页
                  _self.find('.firstPage').die().live('click',function(){
                     dataGrid.AddAsyncData(1,opt.pageRow);
                      _self.find('.nowPageNum').text(1);
                      return false;
                  });
                  //上一页
                  _self.find('.perPage').die().live('click',function(){
                      var _nowPageNum=_self.find('.nowPageNum').text();
                      if(_nowPageNum>1){
                          dataGrid.AddAsyncData(parseInt(_nowPageNum-1),opt.pageRow);
                          _self.find('.nowPageNum').text(parseInt(_nowPageNum-1));
                      }else{
                          dataGrid.AddAsyncData(1,opt.pageRow);
                          _self.find('.nowPageNum').text(1);
                      }
                       return false;
                  });
                  //下一页
                  _self.find('.nextPage').die().live('click',function(){
                    var nowPageNumber=parseInt(_self.find('.nowPageNum').text());
                    var pageTotal=parseInt(_self.find('.totalPageNum').text())
                      if(nowPageNumber<pageTotal){
                          dataGrid.AddAsyncData(parseInt(nowPageNumber+1),opt.pageRow);
                          _self.find('.nowPageNum').text(parseInt(nowPageNumber+1));
                      }else{
                          dataGrid.AddAsyncData(parseInt(pageTotal),opt.pageRow);
                      }
                      return false;
                  });
                  //尾页
                  _self.find('.lastPage').die().live('click',function(){
                      var pageTotal=_self.find('.totalPageNum').text();
                      dataGrid.AddAsyncData(parseInt(pageTotal),opt.pageRow);
                      _self.find('.nowPageNum').text(pageTotal);
                      return false;
                  });

              },
              /*****************************/
              sortTableLocal:function(colIndex, sortRule, dataType){
                  var trArr = [];
                  var contentTableTr = _self.find('.tableCon tr');
                  $.each(contentTableTr,function(){
                      trArr.push($(this).html());
                  });
                  this.judge(trArr, colIndex, sortRule, dataType);
              },
              judge: function(trArr, colIndex, sortRule, dataType) {
//                  if(colIndexStatic == colIndex){
//                      trArr.reverse();
//                  }else{
                      trArr.sort(this.getSort(colIndex, sortRule, dataType));
//                  }
                  this.reBulidDom(trArr);
//                  colIndexStatic = colIndex;//用作后面判断用
              },
              getSort: function(colIndex, sortRule, dataType) {
                  return function createSort(a,b) {
                      var first = $(a).eq(colIndex).text();
                      var second = $(b).eq(colIndex).text();
                      var value1 = convert(first,dataType);
                      var value2 = convert(second,dataType);
                      if(value1 < value2) {
                          return sortRule == 'desc' ? 1 : -1;
                      } else if(value1 > value2) {
                          return sortRule == 'desc' ? -1 : 1;
                      } else {
                          return 0;
                      }
                  };
                  function convert(value,type){
                      switch(type) {
                          case 'int': return parseInt(value);break;
                          case 'float': return parseFloat(value);break;
                          case 'string': return value.toString();break;
                          case 'data': return new Date(Date.parse(value));break;
                          default: return value.toString();break;
                      }
                  }
              },
              reBulidDom: function(trArr){
                  var dgContentTalbeTbody = _self.find('.tableCon tbody');
                  dgContentTalbeTbody.html('');
                  $.each(trArr,function(index,val){
                      dgContentTalbeTbody.append('<tr>'+val+'</tr>');
                  });
                  //表格点击变色
                  dgContentTalbeTbody.find('tr').filter(':odd').addClass('trOdd');
              },
              /*****************************/
              /*************向后台请求数据****************/
              AddAsyncData:function(pageNow, rowNum, getDataTotal){
                  var newWidthArr=[];
                 for(var m=0;m<widthArr.length;m++){
                     var newWidth=widthArr[m]/widthSum*100;
                     newWidthArr.push(newWidth);
                 }
//                  var hearTableTr=_self.find('.topDG .tableHeader .headerTR td .headerTdDiv');
//                  widthArr=[];
//                  hearTableTr.each(function(index){
//                      widthArr.push(parseInt($(this).css('width')));
//                  });
                  var _param={'pageNow':pageNow,'getTotal':getDataTotal};
                  if(opt.dataParam){
                      $.extend(_param,opt.dataParam);
                  }
                  if(opt.sortType){
                      $.extend(_param,{"sortRule":opt.sortRule,"sortOrderBy":opt.sortOrderBy});
                  }
                  //第一次加载数据时获得数据的条数
                  getDataTotal && $.extend(_param, {'getDataTotal': 1});
                  $.ajax({
                      url:opt.url,
                      type:opt.method,
                      data:_param,
                      dataType:"text",
                      success:function(data){
                          data = eval('('+data+')');
                          var rowContent='';
                          _self.find('.pagingDG .totalNumber').html(data.total);
                          console.log(opt.pageRow)
                          _self.find('.totalPageNum').text(Math.round(data.total/opt.pageRow));
                          $.each(data.row,function(key,val){
                              var rowSpanName={};
                              rowContent+='<tr>';
                              for(var i=0; i<fieldArr.length;i++){
                                  var j=0;
                                  $.each(val,function(k,V){
                                      if(k==fieldArr[i]){
                                          var _display = (widthArr[i] == 0) ? ' style="display:none;"' : '';
                                          var _val = (formatterArr[i] == 0) ? V: formatterArr[i](val);
                                          rowContent+='<td field="'+fieldArr[i]+'"'+_display+' style="width:'+newWidthArr[i]+'%;"><div class="dgContentInnerDiv" style=" text-align:'+alignArr[i]+';">'+_val+'</div></td>';
                                          j=1
                                      }
                                  });
                                  if(j == 0){
                                      rowContent += '<td field="'+fieldArr[i]+'" style="width:'+newWidthArr[i]+'%;"><div class="dgContentInnerDiv" style=" text-align:'+alignArr[i]+';">'+formatterArr[i](val)+'</div></td>';
                                  }

                              }
                              rowContent+='</tr>';
                          });
                        _self.find('.containDG .tableCon').html(rowContent);
                          $('.containDG .tableCon tr').each(function(){
                              $(this).mouseenter(function(){
                                  $(this).addClass('hoverTr');
                              });
                              $(this).mouseleave(function(){
                                  $(this).removeClass('hoverTr');
                              });

                          });

                          //如果是第一次请求数据则获得分页总数，翻页之类的数据则从total里面得到。
                          var dataTotal = getDataTotal ? data.total : _self.find('.totalNumber').html();
                          _self.find('.nowPageNum').val(data.pageNow);
                          _self.find('.totalNumber').html(dataTotal);
//                          _self.find('.pageTotal').html(Math.ceil(dataTotal/opt.pageRow));
//                          _self.find('.itemStart').html((pageNow-1)*_rowNum + 1);
//                          if(pageNow*_rowNum < dataTotal){
//                              _self.find('.itemEnd').html(pageNow*_rowNum);
//                          }else{
//                              _self.find('.itemEnd').html(dataTotal);
//                          }
//                          if(data.pageNow == 1){
//                              _self.find('.pageFirst').removeClass('pageFirstAble');
//                              _self.find('.pagePrev').removeClass('pagePrevAble');
//                          }else{
//                              _self.find('.pageFirst').addClass('pageFirstAble');
//                              _self.find('.pagePrev').addClass('pagePrevAble');
//                          }
//
//                          if(data.pageNow == _self.find('.pageTotal').html()){
//                              _self.find('.pageNext').removeClass('pageNextAble');
//                              _self.find('.pageLast').removeClass('pageLastAble');
//                          }else{
//                              _self.find('.pageNext').addClass('pageNextAble');
//                              _self.find('.pageLast').addClass('pageLastAble');
//                          }
                          //表格加载完毕后的执行
                          opt.ajaxCallback(data, _self);

                      }
                  })

              }
         }
//          window.onload(function(){
              dataGrid.init();
              dataGrid.addEvent();
              dataGrid.AddAsyncData(1, opt.pageRow,true);
          _self.find('.nowPageNum').text(1);
              //表格加载完毕后的执行
              opt.initCallback(_self);
//          });

        }



      }(this, jQuery)