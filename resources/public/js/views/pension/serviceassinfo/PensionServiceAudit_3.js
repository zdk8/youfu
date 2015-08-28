define(function(){
    var addToolBar=function(local) {
        var toolBarHeight=30;
        var toolBar=cj.getFormToolBar([
            {text: '处理',hidden:'hidden',opt:'dealwith'}
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });
    };
    /*显示机构*/
    var showServicemgt = function(local){
        var servicemgtval = local.find('[opt=servicemgtval]').val()
        var servicepeopleval = local.find('[opt=servicepeopleval]').val()
        if(servicemgtval != ""){
            local.find('[opt=servicemgt]').combobox('setValue',getServicemgtTotalname(servicemgtval))
        }
        if(servicepeopleval != ""){
            local.find('[opt=servicepeople_div]').show();
            local.find('[opt=servicepeople]').combobox('setValue',getServicepeoplevalTotalname(servicepeopleval))
        }
    }
    /*启用Radio*/
    var RadioCssEnabel = function(local,radioname){
        var selectRadio = ":input[name="+radioname+"][type=radio] + label";
        local.find(selectRadio).each(function () {
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
            .prev().hide();
    }
    /*为radio添加样式*/
    var addRadioCss = function(local) {
        var selectRadio = ":input[type=radio] + label";
        local.find(selectRadio).each(function () {
            if ($(this).prev()[0].checked){
                $(this).addClass("checked"); //初始化,如果已经checked了则添加新打勾样式
            }
        }).prev().hide();     //原来的圆点样式设置为不可见
    }
    /*根据aulevel等级判断传参意见*/
    function paramsOpinion(local,option,optionarea,issuccess){
        showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
        $.ajax({
            url:"audit/assessauditsubmit",
            data:{
                audesc:local.find('textarea[name='+optionarea+']').val(),     //意见
                aulevel:option.queryParams.record.aulevel,       //流程标示
                appoperators:option.queryParams.record.appoperators,
                bstablename:option.queryParams.record.bstablename,
                bstablepk:option.queryParams.record.bstablepk,
                bstablepkname:option.queryParams.record.bstablepkname,
                messagebrief:option.queryParams.record.messagebrief,
                sh_id:option.queryParams.record.sh_id,
                dvcode:option.queryParams.record.dvcode,
                issuccess:issuccess == "" ? "":issuccess
            },
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.success){
                    showProcess(false);
                    cj.slideShow('处理成功!')
                    if(showProcess(false)){
                        $("#tabs").tabs('close',option.queryParams.title)
                        var refresh = option.queryParams.refresh;
                        refresh();
                    }
                }else{
                    showProcess(false);
                    cj.slideShow('<label style="color: red">处理失败!</label>')
                }
            }
        })
    }
    /*处理*/
    var dealwithInfoFunc = function(local,option){
        /*var status = '<li class="step-first step-pass"><div class="step-name">新增申请</div><div class="step-no">&nbsp;</div></li>' +
            '<li class="step-pass"><div class="step-name">已评估</div><div class="step-no">&nbsp;</div></li>' +
            '<li><div class="step-name step-name-b">待街道审核</div><div class="step-no">3</div></li>' +
            '<li class="step-last"><div class="step-name ">待民政局审核</div><div class="step-no">4</div></li>';*/
        require(['text!commonfuncs/process/status.htm','commonfuncs/process/status'], function (htm,js) {
            //local.find('.flowstep-6').html(htm);
            js.render(local,{aulevel:option.queryParams.record.aulevel});
        });
        //local.find('.flowstep-6').html(status);

        var aulevel = option.queryParams.record.aulevel;              //评估信息流程等级
        var streetreview = local.find('textarea[name=streetreview]'); //审核框
        var countyaudit = local.find('textarea[name=countyaudit]'); //审批框
        local.find('[opt=dealwith]').show().click(function(){
            if(aulevel == "1" || aulevel == "4"){              //审核
                if(streetreview.val() == "" || streetreview.val() == null){
                    $.messager.alert('温馨提示','请填写【街镇审查】意见！',"",function(r){
                        streetreview.focus();
                    });
                }else{
                    var shengheval = "";
                    local.find(':input[type=radio][name=shenghe]').each(function(){
                        if($(this)[0].checked){
                            shengheval = $(this)[0].value
                        }
                    })
                    if(shengheval == ""){
                        $.messager.alert('温馨提示','请勾【街道审查】结果！');
                    }else{
                        paramsOpinion(local,option,"streetreview",shengheval)
                    }
                }
            }else if(aulevel == "2" || aulevel == "5"){           //审批
                if(countyaudit.val() == "" || countyaudit.val() == null){
                    $.messager.alert('温馨提示','请填写【民政局审核】意见！',"",function(r){
                        countyaudit.focus();
                    });
                }else{
                    var shengpival = "";
                    local.find(':input[type=radio][name=shengpi]').each(function(){
                        if($(this)[0].checked){
                            shengpival = $(this)[0].value
                        }
                    })
                    if(shengpival == ""){
                        $.messager.alert('温馨提示','请勾选【民政局审核】结果！');
                    }else{
                        paramsOpinion(local,option,"countyaudit",shengpival)
                    }
                }
            }
        })
    }

    return {
      render:function(local,option){
          addToolBar(local);
          addRadioCss(local);
          var datas = eval('('+local.find('[opt=jsondata]').val()+')');
          var districtid = local.find('[opt=districtid]');      //行政区划值
          var districtnameval = getDivistionTotalname(datas.districtid)
          districtid.combotree("setValue",districtnameval)  //填充行政区划
          local.find('input[name=old_type][type=radio][value='+datas.old_type+']').attr("checked","checked");
          local.find('input[name=old_type][type=radio][value='+datas.old_type+']+label').addClass("checked");
          local.find('input[name=live_type][type=radio][value='+datas.live_type+']').attr("checked","checked");
          local.find('input[name=live_type][type=radio][value='+datas.live_type+']+label').addClass("checked");
          local.find('input[name=life_ability][type=radio][value='+datas.life_ability+']').attr("checked","checked");
          local.find('input[name=life_ability][type=radio][value='+datas.life_ability+']+label').addClass("checked");
          local.find('input[name=household][type=radio][value='+datas.household+']').attr("checked","checked");
          local.find('input[name=household][type=radio][value='+datas.household+']+label').addClass("checked");
          local.find('input[name=gt_isretire1][type=radio][value='+datas.gt_isretire1+']').attr("checked","checked");
          local.find('input[name=gt_isretire1][type=radio][value='+datas.gt_isretire1+']+label').addClass("checked");
          local.find('input[name=gt_isretire2][type=radio][value='+datas.gt_isretire2+']').attr("checked","checked");
          local.find('input[name=gt_isretire2][type=radio][value='+datas.gt_isretire2+']+label').addClass("checked");
          local.find('input[name=gt_isretire3][type=radio][value='+datas.gt_isretire3+']').attr("checked","checked");
          local.find('input[name=gt_isretire3][type=radio][value='+datas.gt_isretire3+']+label').addClass("checked");
          local.find('input[name=sy_isretire1][type=radio][value='+datas.sy_isretire1+']').attr("checked","checked");
          local.find('input[name=sy_isretire1][type=radio][value='+datas.sy_isretire1+']+label').addClass("checked");
          local.find('input[name=sy_isretire2][type=radio][value='+datas.sy_isretire2+']').attr("checked","checked");
          local.find('input[name=sy_isretire2][type=radio][value='+datas.sy_isretire2+']+label').addClass("checked");
          local.find('input[name=sy_isretire3][type=radio][value='+datas.sy_isretire3+']').attr("checked","checked");
          local.find('input[name=sy_isretire3][type=radio][value='+datas.sy_isretire3+']+label').addClass("checked");

          local.find('[opt=gender]').combobox('setValue',datas.gender);
          local.find('[opt=nation]').combobox('setValue',datas.nation);

          /*类别证号处理*/
          var oldtype = local.find('input[name=old_type][type=radio]:checked').val();
          if(oldtype == '0'){//低保
              local.find('[name=allowanceid]').val(datas.allowanceid);
              local.find('[name=lowmarginid]').val('');
          }else if(oldtype == '1'){//低保边缘户
              local.find('[name=allowanceid]').val('');
              local.find('[name=lowmarginid]').val(datas.lowmarginid);
          }else{
              local.find('[name=allowanceid]').val('');
              local.find('[name=lowmarginid]').val('');
          }
          var result2_table =  local.find('[opt=result2_table]');    //result2
          var result2_div=local.find('[opt=result2_div]');
          result2_div.show();
          var isfirst = true;
          /*为每个label注册收缩事件*/
          local.find('legend').find('label').each(function(obj,fn,arg){
          }).click(function(e){
                  var labelopt = $(this)[0].attributes[0].value.toString();
                  var label_talbe = labelopt.substr(0,labelopt.lastIndexOf('_'));
                  FieldSetVisual(local,label_talbe+'_table',label_talbe,label_talbe+'_img')
                  if(label_talbe == "result2"){
                      if(isfirst){
                          require(['text!views/pension/leaveshtm/PAresult2.htm','views/pension/leaveshtm/PAresult2'],
                              function(htmfile,jsfile){
                                  result2_table.html(htmfile)
                                  addRadioCss(result2_table)
                                  jsfile.render(result2_table,{plocal:local,option:option})
                              })
                          isfirst = false;
                      }
                  }
              })
          //calculate(local);     //计算评估总分
          if(option.queryParams.actionType == "dealwith"){  //处理
              var datas = eval('('+local.find('[opt=jsondata]').val()+')');

              /*var districtid = local.find('[opt=districtid]');      //行政区划值
              var districtnameval = getDivistionTotalname(datas.districtid)
              districtid.combotree("setValue",districtnameval)  //填充行政区划*/
              //showServicemgt(local);
              var aulevel = option.queryParams.record.aulevel;   //审核审批等级
              if(aulevel == "1" || aulevel == "4"){
                  local.find('textarea[name=countyaudit]').attr("readonly","readonly");
                  RadioCssEnabel(local,"shenghe");
              }else if(aulevel == "2" || aulevel == "5"){
                  local.find('textarea[name=streetreview]').attr("readonly","readonly");
                  RadioCssEnabel(local,"shengpi");
              }
              dealwithInfoFunc(local,option)   //审核审批方法
              //local.find('input[name=assesstype][type=radio][value='+datas.assesstype+']').attr("checked","checked");
              //local.find('input[name=assesstype][type=radio][value='+datas.assesstype+']+label').addClass("checked");

              var arrs = ['old_type','live_type','life_ability','household','gt_isretire1','gt_isretire2','gt_isretire3',
                        'sy_isretire1','sy_isretire2','sy_isretire3'];
              /*for(var i=0;i<arrs.length;i++){
                  local.find('input[name='+arrs[i]+'][type=radio][value='+datas.old_type+']').attr("checked","checked");
                  local.find('input[name='+arrs[i]+'][type=radio][value='+datas.old_type+']+label').addClass("checked");
              }*/




          }




      }
  }
})