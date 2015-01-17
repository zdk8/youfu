define(function(){
    var addToolBar=function(local) {
        var toolBarHeight=30;
        var toolBar=cj.getFormToolBar([
            {text: '处理',hidden:'hidden',opt:'dealwith'},
            {text: '保存',hidden:'hidden',opt:'save'},
            {text: '提交',hidden:'hidden',opt:'commit'}
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });
    };
    /*为radio添加样式*/
    var addRadioCss = function(local) {
        var selectRadio = ":input[type=radio] + label";
        local.find(selectRadio).each(function () {
            if ($(this).prev()[0].checked){
                $(this).addClass("checked"); //初始化,如果已经checked了则添加新打勾样式
            }
        }).click(function () {               //为第个元素注册点击事件
                var s = $($(this).prev()[0]).attr('name')
                s = ":input[name=" + s + "]+label"
                var isChecked=$(this).prev()[0].checked;
                local.find(s).each(function (i) {
                    $(this).prev()[0].checked = false;
                    $(this).removeClass("checked");
                    $($(this).prev()[0]).removeAttr("checked");
                });
                if(isChecked){
                    //如果单选已经为选中状态,则什么都不做
                }else{
                    $(this).prev()[0].checked = true;
                    $(this).addClass("checked");
                    $($(this).prev()[0]).attr("checked","checked");
                }
            })
            .prev().hide();     //原来的圆点样式设置为不可见
    }
    /*获取机构名称*/
    var getDepartName = function(local){
        local.find("input[opt=servicemgt]").combogrid({
            panelWidth:330,
            panelHeight:350,
            url:'audit/getalljjyldepart',
            method:'post',
            idField:'departname',
            textField:'departname',
            fitColumns:true,
            pagination:true,
            mode:'remote',
            columns:[[
                {field:'departname',title:'机构名称',width:80},
                {field:'responsible',title:'负责人',width:35},
                {field:'telephone',title:'联系电话',width:60}
            ]],
            onClickRow:function(index,row){}
        })
    }
    /*评估*/
    var assessmentFunc = function(local,option){
        local.find('[opt=dealwith]').hide()
        /*保存*/
        local.find('[opt=save]').show().click(function(){
            var jjfenl = local.find('[name=jj_fenl]');//经济条件提交时判断
            var tsgx = local.find('table[opt=PAtsgx]');//特殊贡献提交时判断
            local.find('[opt=mainform]').form('submit',{
                url:"audit/addassessmessage",
                onSubmit: function(params){
                    var isvalidate = $(this).form('validate');
                    if (isvalidate) {
                        if(jjfenl.length){
                            jjfenl.each(function(i){
                                if($(this)[0].checked){
                                    var score = $(this)[0].value
                                    if(score != 30){
                                        params.jj_shour = local.find('[opt=jj_shour'+score+']').val()
                                    }else if(score == 30){
                                        var jjleix = local.find('[opt=jj_leix]')
                                        jjleix.each(function(j){
                                            if($(this)[0].checked){
                                                params.jj_leix = $(this)[0].value
                                            }
                                            return;
                                        })
                                    }
                                    return;
                                }
                            })
                        }
                        if(tsgx.length){
                            var gxlaomCheck = tsgx.find(':input[opt=gx_laom]')[0];
                            var gxyoufCheck = tsgx.find(':input[opt=gx_youf]')[0];
                            gxlaomCheck.checked?params.gx_laom=gxlaomCheck.value:params.gx_laom=''
                            gxyoufCheck.checked?params.gx_youf=gxyoufCheck.value:params.gx_youf=''
                        }
                        showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                    }
                    return isvalidate
                },
                success:function(data){
                    if(data == "true"){
                        showProcess(false);
                        cj.slideShow("保存成功!")
                        if(showProcess(false)){
                            $("#tabs").tabs('close',option.queryParams.title)
                            var ref = option.queryParams.refresh;
                            ref();
                        }
                    }else{
                        showProcess(false);
                        cj.slideShow('<label style="color: red">保存失败！</label>')
                    }
                },
                onLoadError: function () {
                    showProcess(false);
                    cj.slideShow('<label style="color: red">由于网络或服务器太忙，提交失败，请重试！</label>')
                }
            })
        })
        /*提交*/
        local.find('[opt=commit]').show().click(function(){
            var communityopinionval = local.find('textarea[name=communityopinion]').val()
            if(communityopinionval == "" || communityopinionval == null){
                $.messager.alert('温馨提示','请填写社区(村)意见！',"",function(r){
                    local.find('textarea[name=communityopinion]').focus();
                });
            }else{
                local.find('[opt=mainform]').form('submit', {
                    url:"audit/assesscomplete",
                    dataType:'json',
                    onSubmit: function(param){
                        var isvalidate = $(this).form('validate');
                        if (isvalidate) {
                            showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                        }
                        return isvalidate
                    },
                    success:function(data){
                        if(data == "true"){
                            showProcess(false);
                            cj.slideShow("评估完成!")
                            if(showProcess(false)){
                                $("#tabs").tabs('close',option.queryParams.title)
                                var refresh = option.queryParams.refresh;
                                refresh();
                            }
                        }else{
                            showProcess(false);
                            cj.slideShow('<label style="color: red">评估失败！</label>')
                        }
                    },
                    onLoadError: function () {
                        showProcess(false);
                        cj.slideShow('<label style="color: red">由于网络或服务器太忙，提交失败，请重试！</label>')
                    }
                 });
            }
        })
    }
    /*处理*/
    var viewInfoFunc = function(local,option){
        local.find('[opt=dealwith]').hide()
        local.find('[opt=save]').hide()
        local.find('[opt=commit]').hide()
        console.log(11)
    }
    return {
      render:function(local,option){
          addToolBar(local);
          addRadioCss(local)
//          datas = eval('('+local.find('[opt=jsondata]').val()+')');
          var info1_table =  local.find('[opt=info1_table]');        //主要参数
          var result1_table =  local.find('[opt=result1_table]');    //result1
          var result2_table =  local.find('[opt=result2_table]');    //result2
          var isfirst = true;
          /*为每个label注册收缩事件*/
          local.find('legend').find('label').each(function(obj,fn,arg){
              var labelopt = fn.attributes[0].value.toString()
              var label_talbe = labelopt.substr(0,labelopt.lastIndexOf('_'));
              if(label_talbe != "info0" && label_talbe != "result3"){
                  FieldSetVisual(local,label_talbe+'_table',label_talbe,label_talbe+'_img')
              }
          }).click(function(e){
                  var labelopt = $(this)[0].attributes[0].value.toString();
                  var label_talbe = labelopt.substr(0,labelopt.lastIndexOf('_'));
                  FieldSetVisual(local,label_talbe+'_table',label_talbe,label_talbe+'_img')
                  if(label_talbe == "info1"){
                      /*初次进来*/
                      var titleFirst = info1_table.tabs('getSelected').panel('options').title;
                      var currTabFirst=info1_table.tabs('getTab',titleFirst);
                      if(!currTabFirst.data('mytest')){
                          currTabFirst.data('mytest',true)
                          var htmname = info1_table.tabs('getSelected').panel('options').id;
                          var htmlurl = 'gethtml?name='+htmname+'.html';
                          info1_table.tabs('getSelected').panel('refresh', htmlurl);
                          var timer = window.setInterval(function () {
                              if (local.find('[opt='+htmname+']').length) {
                                  addRadioCss(currTabFirst)
                                  window.clearInterval(timer);
                                  require(['views/pension/leaveshtm/'+htmname],function(jsfile){
                                      jsfile.render(currTabFirst,{plocal:local})
                                  })
                              }else{
                                  console.log('oops....HTML is not ready ')
                              }
                          }, 20);
                      }
                      info1_table.tabs({
                          border:false,
                          onSelect:function(title){
                              var currTab=$(this).tabs('getTab',title);
                              if(!currTab.data('mytest')){
                                  currTab.data('mytest', true);
                                  var htmname = $(this).tabs('getSelected').panel('options').id
                                  var htmlurl = 'gethtml?name='+htmname+'.html'
                                  $(this).tabs('getSelected').panel('refresh', htmlurl);
                                  var timer = window.setInterval(function () {
                                      if (local.find('[opt='+htmname+']').length) {
                                          addRadioCss(currTab)
                                          window.clearInterval(timer);
                                          require(['views/pension/leaveshtm/'+htmname],function(jsfile){
                                              jsfile.render(currTab,{plocal:local})
                                          })
                                      }else{
                                          console.log('oops....HTML is not ready ')
                                      }
                                  }, 20);
                              }
                          }
                      });
                  }else if(label_talbe == "result2"){
                      if(isfirst){
                          require(['text!views/pension/leaveshtm/PAresult2.htm','views/pension/leaveshtm/PAresult2'],
                              function(htmfile,jsfile){
                                  result2_table.html(htmfile)
                                  addRadioCss(result2_table)
                                  jsfile.render(result2_table,{plocal:local})
                              })
                          isfirst = false;
                      }
                  }
              })
          calculate(local);     //计算评估总分
          if(option.queryParams.actionType == "assessment"){      //评估
              getDepartName(local);     //加载服务机构
              local.find('[opt=districtid]').val(getDivistionTotalname(local.find('[opt=districtidval]').val()))//填充行政区划
              assessmentFunc(local,option);
          }else if(option.queryParams.actionType == "view"){  //查看详细信息
              local.find('[opt=districtid]').val(getDivistionTotalname(local.find('[opt=districtidval]').val()))//填充行政区划
              viewInfoFunc(local,option)
          }




      }
  }
})