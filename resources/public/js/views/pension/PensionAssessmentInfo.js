define(function(){

    var addToolBar=function(local) {
        var toolBarHeight=30;
        var toolBar=cj.getFormToolBar([
            {text: '处理',hidden:'hidden',opt:'dealwith'},
            {text: '修改',hidden:'hidden',opt:'update'},
            {text: '删除',hidden:'hidden',opt:'delete'},
            {text: '保存',hidden:'hidden',opt:'save'},
            {text: '提交',hidden:'hidden',opt:'commit'},
            {text: '操作日志',hidden:'hidden',opt:'log'}
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });
    };

    function initPage(local,option){
        addToolBar(local);
        var districtid = local.find('[opt=districtid]');      //行政区划
        getdivision(districtid);                               //加载行政区划

        initRadioEvent(local);                                 //初始化radio
        loadOldByIdentityid(local);                                 //通过身份证号加载老年人
        scoreFunc(local);                                   //评分
        local.find(':input[name=sh_zongf]').attr("readonly","readonly").val(100); //生活自理能力info1总分
        /*为每个label注册收缩事件*/
        local.find('fieldset').find('legend').find('label').each(function(){
        }).click(function(e){
                var labelopt = $(this)[0].attributes[0].value.toString();
                var label_talbe = labelopt.substr(0,labelopt.lastIndexOf('_'));
                FieldSetVisual(local,label_talbe+'_table',label_talbe,labelopt)
            })
    }

    /*初始化radio,并加载radio事件*/
    var initRadioEvent = function(local){
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
        /*处理特殊贡献这块*/
        local.find(":input[type=checkbox] + label").each(function () {
            if ($(this).prev()[0].checked) {
                $(this).addClass("checked");
            }
        }).toggle(function () {
                $(this).prev()[0].checked = true;
                $(this).addClass("checked");
                $($(this).prev()[0]).attr("checked","checked");
            },
            function () {
                $(this).prev()[0].checked = false;
                $(this).removeClass("checked");
                $($(this).prev()[0]).removeAttr("checked");
            }).prev().hide();
    }
    /*通过身份证号加载老年人*/
    var loadOldByIdentityid = function(local){
        local.find("[opt=identityid]").combogrid({
            panelWidth:350,
            panelHeight:350,
            url:'oldid',
            method:'post',
            idField:'identityid',
            textField:'identityid',
            fitColumns:true,
            pagination:true,
            mode:'remote',
            columns:[[
                {field:'name',title:'姓名',width:60},
                {field:'identityid',title:'身份证',width:80},
                {field:'address',title:'地址',align:'right',width:60}
            ]],
            onClickRow:function(index,row){
                $.ajax({
                    url:'searchid',
                    data:{
                        id:row.lr_id
                    },
                    type:'get',
                    success:function(res){
                        if(res){
                            local.find('form[opt=mainform]').form('load',res);
                            local.find('[opt=csrq]').datebox('setValue',res.birthd);
                            var date = $(':input[opt=csrq]').datebox('getValue');
                            var age = res.age;
                            if (age >= 60 && age < 80){
                                local.find('input[name=nl_fenl]:eq(0)').attr("checked","checked");
                                local.find('input[name=sum_nl_fenl]:eq(0)').attr("checked","checked");
                                local.find('input[name=nl_fenl]:eq(0)+label').addClass("checked");
                                local.find('input[name=sum_nl_fenl]:eq(0)+label').addClass("checked");
                                local.find('input[name=nl_pingguf]').attr("readonly","readonly").val(0);
                                local.find('input[name=sum_nl_pingguf]').attr("readonly","readonly").val(0);
                            } else if(age >= 80 && age <= 90){
                                local.find('input[name=nl_fenl]:eq(1)').attr("checked","checked");
                                local.find('input[name=sum_nl_fenl]:eq(1)').attr("checked","checked");
                                local.find('input[name=nl_fenl]:eq(1)+label').addClass("checked");
                                local.find('input[name=sum_nl_fenl]:eq(1)+label').addClass("checked");
                                local.find('input[name=nl_pingguf]').attr("readonly","readonly").val(5);
                                local.find('input[name=sum_nl_pingguf]').attr("readonly","readonly").val(5);
                            }else if(age >90){
                                local.find('input[name=nl_fenl]:eq(2)').attr("checked","checked");
                                local.find('input[name=sum_nl_fenl]:eq(2)').attr("checked","checked");
                                local.find('input[name=nl_fenl]:eq(2)+label').addClass("checked");
                                local.find('input[name=sum_nl_fenl]:eq(2)+label').addClass("checked");
                                local.find('input[name=nl_pingguf]').attr("readonly","readonly").val(10);
                                local.find('input[name=sum_nl_pingguf]').attr("readonly","readonly").val(10);
                            }
                        }else{
                            alert('无数据')
                        }
                    }
                })
            }
        })
    }
    /*新增数据时进入*/
    var saveFunc = function(local,option){
        var savebtn = local.find('[opt=save]');               //保存按钮
        savebtn.show()
        savebtn.click(function(){
            local.find('[opt=mainform]').form('submit', {
                url:"wwwwwwww",
                onSubmit: function(){
                },
                success:function(data){
                    console.log(data)
                }
            });
        })
    }
    /*查看详细信息并判断是否可修改(actionType=update)*/
    var updateInfoFunc = function(local,option){
        var updatebtn = local.find('[opt=update]');            //处理按钮
        var deletebtn = local.find('[opt=delete]');            //删除按钮
        updatebtn.show()
        data = option.queryParams.data
        local.find('form').form('load',option.queryParams.data)
    }
    /*处理时进入页面(actionType=info)*/
    var dealwithInfoFunc = function(local,option){
        var dealwithbtn = local.find('[opt=dealwith]');            //处理按钮
        dealwithbtn.show()
        data = option.queryParams.data
        local.find('form').form('load',option.queryParams.data)
    }
    /*评估*/
    var assessmentFunc = function(local,option){
        var savebtn = local.find('[opt=save]');            //保存按钮
        var commitbtn = local.find('[opt=commit]');            //提交按钮
        savebtn.show()
        commitbtn.show()
        disabledForm(local);                                  //禁用表单
        dd = option.queryParams.data
        /*通过id查询申请人员，若有评估信息也一并加载*/
        $.ajax({
            url:"audit/getassessbyid",
            type:"post",
            data:{
                jja_id:option.queryParams.data.jja_id
            },
            dataType: 'json',
            success:function(data){
                if(data){
                    local.find('form').form('load',data[0]);
                    for(var key in data[0] ){
                        var name = key;
                        var value = data[0][key];
                        if($('input[name='+name+']:radio').val()){
                            $('input[name='+name+'][type=radio][value='+value+']').attr("checked","checked");
                            $('input[name='+name+'][type=radio][value='+value+']+label').addClass("checked");
                        }else if($('input[name='+name+']:checkbox').val()){
                            $('input[name='+name+'][type=checkbox][value='+value+']').attr("checked","checked");
                            $('input[name='+name+'][type=checkbox][value='+value+']+label').addClass("checked");
                        }
                    }
                    $('[opt=csrq]').datebox('setValue',$('[opt=birthdate]').datebox('getValue'));
                    $(':input[name=sh_zongf]').attr("readonly","readonly").val(100);
                    $(':input[name=sum_sh_pingguf]').attr("readonly","readonly").val($(':input[name=sh_pingguf]').val());
                    $(':input[name=sum_jj_pingguf]').attr("readonly","readonly").val($(':input[name=jj_pingguf]').val());
                    $(':input[name=sum_jz_pingguf]').attr("readonly","readonly").val($(':input[name=jz_pingguf]').val());
                    $(':input[name=sum_nl_pingguf]').attr("readonly","readonly").val($(':input[name=nl_pingguf]').val());
                    $(':input[name=sum_gx_pingguf]').attr("readonly","readonly").val($(':input[name=gx_pingguf]').val());
                    $('fieldset[opt=info1]')
                        .find(':input[type=radio]+label').each(function(i){
                            var radioValue=0;
                            if($(this).prev()[0].checked){
                                radioValue= ($(this).prev()).val();
                                $($(this).parent().parent().children().last().children()[0]).val(radioValue);
                            }
                            $('fieldset[opt=info1]').find(':input[opt=info1pingfeng]').each(function(){
                                $(this).attr("readonly","readonly");
                            })
                        })
                }
                local.find(':input[name=sh_zongf]').attr("readonly","readonly").val(100); //生活自理能力info1总分
            }
        })

        /*保存*/
        savebtn.click(function(){
            local.find('[opt=mainform]').form('submit', {
                url:"audit/addassessmessage",
                onSubmit: function(){
                },
                success:function(data){
                    console.log(data)
                }
            });
        })
        commitbtn.click(function(){
            console.log('commitbtn')
        })
    }
    /*评分*/
    var scoreFunc = function(local){
        /*生活自理能力info1评分*/
        local.find('fieldset[opt=info1] :input[type=radio]+label').each(function(i){
                $(this).bind('click',function(){
                    var radioValue=0;
                    if($(this).prev()[0].checked){
                        radioValue= ($(this).prev()).val();
                        $($(this).parent().parent().children().last().children()[0]).val(radioValue);
                    }else{
                        $($(this).parent().parent().children().last().children()[0]).removeAttr("value");
                    }
                    var sh_zongf=0;
                    local.find('fieldset[opt=info1]').find(':input[opt=info1pingfeng]').each(function(){
                        $(this).attr("readonly","readonly");
                        sh_zongf+=Number($(this).val())
                    })
                    local.find(':input[name=sh_pingguf]').attr("readonly","readonly").val(sh_zongf)
                    local.find('fieldset[opt=result1]').find(':input[name=sum_sh_pingguf]').attr("readonly","readonly").val(sh_zongf)
                    local.find(':input[name=sh_jiel]+label').removeClass("checked");
                    local.find(':input[name=sh_jiel]').removeAttr("checked");
                    local.find('fieldset[opt=result1]').find(':input[name=sum_sh_jiel]+label').removeClass("checked");
                    local.find('fieldset[opt=result1]').find(':input[name=sum_sh_jiel]').removeAttr("checked");
                    if(sh_zongf <= 25){
                        local.find(':input[name=sh_jiel]:eq(0)').attr("checked","checked");
                        local.find('fieldset[opt=result1]').find(':input[name=sum_sh_jiel]:eq(0)').attr("checked","checked");
                        local.find(':input[name=sh_jiel]:eq(0)+label').addClass("checked");
                        local.find('fieldset[opt=result1]').find(':input[name=sum_sh_jiel]:eq(0)+label').addClass("checked");
                    }else if(sh_zongf > 25 &&sh_zongf <= 50){
                        local.find(':input[name=sh_jiel]:eq(1)').attr("checked","checked");
                        local.find('fieldset[opt=result1]').find(':input[name=sum_sh_jiel]:eq(1)').attr("checked","checked");
                        local.find(':input[name=sh_jiel]:eq(1)+label').addClass("checked");
                        local.find('fieldset[opt=result1]').find(':input[name=sum_sh_jiel]:eq(1)+label').addClass("checked");
                    }else if(sh_zongf > 50 &&sh_zongf <= 75){
                        local.find(':input[name=sh_jiel]:eq(2)').attr("checked","checked");
                        local.find('fieldset[opt=result1]').find(':input[name=sum_sh_jiel]:eq(2)').attr("checked","checked");
                        local.find(':input[name=sh_jiel]:eq(2)+label').addClass("checked");
                        local.find('fieldset[opt=result1]').find(':input[name=sum_sh_jiel]:eq(2)+label').addClass("checked");
                    }else{
                        local.find(':input[name=sh_jiel]:eq(3)').attr("checked","checked");
                        local.find('fieldset[opt=result1]').find(':input[name=sum_sh_jiel]:eq(3)').attr("checked","checked");
                        local.find(':input[name=sh_jiel]:eq(3)+label').addClass("checked");
                        local.find('fieldset[opt=result1]').find(':input[name=sum_sh_jiel]:eq(3)+label').addClass("checked");
                    }
                })
            })
        /*生活自理能力info2评分*/
        local.find('[opt=info2] :input[name=jj_shour]+label').each(function(i){
            $(this).bind('click',function(){
                local.find('fieldset[opt=result1]').find(':input[name=sum_jj_shour]+label').removeClass("checked");
                local.find('fieldset[opt=result1]').find(':input[name=sum_jj_shour]').removeAttr("checked");
                if($(this).hasClass("checked")){
                    var v=$(this).prev().val();
                    local.find('fieldset[opt=result1]').find(':input[name=sum_jj_shour][value='+ v +']+label').addClass("checked");
                    local.find('fieldset[opt=result1]').find(':input[name=sum_jj_shour][value='+ v +']').attr("checked","checked");
                }else
                    var v = 0;
                local.find(':input[name=jj_pingguf]').attr("readonly","readonly").val(v)
                local.find('fieldset[opt=result1] :input[name=sum_jj_pingguf]').attr("readonly","readonly").val(v)
            })
        })
        /*居住环境info3评分*/
        local.find('fieldset[opt=info3] :input[name=jz_fenl]+label').each(function(i){
            $(this).bind('click',function(){
                local.find('fieldset[opt=result1]').find(':input[name=sum_nl_fenl]+label').removeClass("checked");
                local.find('fieldset[opt=result1]').find(':input[name=sum_nl_fenl]').removeAttr("checked");
                if($(this).hasClass("checked")){
                    var v=$(this).prev().val();
                    local.find('fieldset[opt=result1]').find(':input[name=sum_jz_fenl][value='+ v +']+label').addClass("checked");
                    local.find('fieldset[opt=result1]').find(':input[name=sum_jz_fenl][value='+ v +']').attr("checked","checked");
                }else
                    var v = 0;
                local.find(':input[name=jz_pingguf]').attr("readonly","readonly").val(v);
                local.find('fieldset[opt=result1] :input[name=sum_jz_pingguf]').attr("readonly","readonly").val(v);
            })
        })
        /*年龄情况评分*/
        local.find('fieldset[opt=info4] :input[name=nl_fenl]+label').each(function(){
            $(this).bind('click',function(){
                local.find('fieldset[opt=result1]').find(':input[name=sum_nl_fenl]+label').removeClass("checked");
                local.find('fieldset[opt=result1]').find(':input[name=sum_nl_fenl]').removeAttr("checked");
                if($(this).hasClass("checked")){
                    var v=$(this).prev().val();
                    local.find('fieldset[opt=result1]').find(':input[name=sum_nl_fenl][value='+ v +']+label').addClass("checked");
                    local.find('fieldset[opt=result1]').find(':input[name=sum_nl_fenl][value='+ v +']').attr("checked","checked");
                }else
                    var v = 0;
                local.find(':input[name=nl_pingguf]').attr("readonly","readonly").val(v)
                local.find('fieldset[opt=result1] :input[name=sum_nl_pingguf]').attr("readonly","readonly").val(v)
            })
        })
        /*特殊贡献评分info5*/
        var checks = [];
        local.find('fieldset[opt=info5] :input[type=checkbox]+label').each(function(i){
            checks.push($(this));
            $(this).bind('click',function(){
                var sum=0;
                for(var i=0;i<checks.length;i++){
                    if(checks[i].prev()[0].checked){
                        sum+=Number(checks[i].prev().val());
                    }
                }
                local.find( 'input[name=gx_pingguf]').attr("readonly","readonly").val(sum);
                //同步到result1
                local.find('input[name=sum_gx_pingguf]').attr("readonly","readonly").val(sum);
                var ischecked= $(this).prev()[0].checked;
                var sum_gx_label=local.find('input[name=sum_'+$(this).prev()[0].name+']+label');
                if(ischecked){
                    local.find(sum_gx_label).prev()[0].checked = true;
                    local.find(sum_gx_label).addClass("checked");
                }else{
                    local.find(sum_gx_label).prev()[0].checked = false;
                    local.find(sum_gx_label).removeClass("checked");
                }
            })
        })
        /*智障情况评分*/
        var radioLables=[];
        local.find('fieldset[opt=info6] :input[type=radio]+label').each(function(i){
            radioLables.push($(this))
            $(this).bind('click',function(){
                var text='';
                var v = 0;
                for(var i=0;i<radioLables.length;i++){
                    var title=local.find(radioLables[i].parent().parent().parent().parent().children()[0]).text()
                    if(radioLables[i].prev()[0].checked){
                        text+='-'+title+' : '+ radioLables[i].text()+'-';
                        v+=Number(local.find(radioLables[i].prev()[0]).val());
                    }
                }
                local.find('input[name=cz_pingguf]').attr("readonly","readonly").val(v);
                local.find('[opt=canzhangqingkuang]').val(text);
            })
        })
        /*住房情况评分*/
        var radioLable = [];
        var getMessage=function(){
            var text='';
            var v = 0;
            for(var i=0;i<radioLable.length;i++){
                if(radioLable[i].prev()[0].checked){
                    var title=$(radioLable[i].parent().children()[0]).text().substr(2);
                    var youwu=radioLable[i].parent().children('label[class=checked]').text();
                    var tao=radioLable[i].parent().children(':input[class=pingfen]').val();
                    tao1=tao?tao+'套':'';
                    tao2=tao?Number(tao):1;
                    text+='<'+title+youwu+tao1+'>';
                    v+=Number($(radioLable[i].prev()[0]).val()) * tao2;
                }
            }
            var qita= $('input[name=zf_qit]').val();
            if(qita){
                text+='<其他'+qita+'>'
                v+=1;
            }
            local.find('[opt=zhufangqingkuang]').val(text);
            local.find('input[name=zf_pingguf]').attr("readonly","readonly").val(v);
        }
        local.find('fieldset[opt=info7] :input[type=radio]+label').each(function(i){
            radioLable.push($(this))
            local.find(this).bind('click',getMessage)
            local.find(this).next(':input').bind('change',getMessage)
            local.find(this).parent().parent().find(':input[name=zf_qit]').bind('change',getMessage)
        })
        /*重大疾病评分*/
        var info=local.find('fieldset[opt=info8]')
        $('ol:first>li').css({'line-height':'21px'});
        var zhongdajibing=info.find('tr[opt=zhongdajibing]');
        var titles=[];
        var qks=['','医生诊断','在接受治疗','结束治疗'];
        local.find(zhongdajibing.children()[0]).find('li').each(function(){
            titles.push($(this).text()+":")
        })
        for(var i=1;i<zhongdajibing.children().length;i++){
            local.find(zhongdajibing.children()[i]).find('li').each(function(index){
                $(this).attr('opt1',i).attr('opt2',index)
                var title=titles[$(this).attr('opt2')] ;
                var v = 0;
                $(this).find(':input+label').attr('title',title).attr('qk',qks[i]).bind('click',function(){
                    var sum_text='';
                    zhongdajibing.find(':input[type=radio]+label').each(function(){
                        if($(this).prev()[0].checked){
                            sum_text+="<"+$(this).attr('title')+  $(this).attr('qk')+">"
                            v+=Number($($(this).prev()[0]).val());
                        }
                    })
                    local.find('textarea[opt=zhongdajibing]').val(sum_text);
                    local.find('input[name=jb_pingguf]').attr("readonly","readonly").val(v);
                })
            })
        }
        /*评估报告一:评估总分计算*/
        var result=local.find('fieldset[opt=result1]') ;
        var calculate=function(){
            var value=0;
            result.find('td>:input[class=pingfen]').each(function(){
                value+=Number($(this).val())
            })
            result.find(':input[name=pinggusum]').val(value)
        }
        result.find('td>:input[class=pingfen]').each(function(){
            $(this).bind('change',calculate)
        })
        result.find('a[opt=recalculate]').bind('click',calculate)
    }

    var render=function(l,o){
        initPage(l,o);                //初始化页面
        if(o.queryParams) {
            switch (o.queryParams.actiontype){
                case 'info':
                    dealwithInfoFunc(l,o);
                    break;
                case 'update':
                    updateInfoFunc(l, o);
                    break;
                case 'assessment':
                    assessmentFunc(l, o);
                    break;
                default :
                    break;
            }
        }else{
            saveFunc(l, o);
        }
    }

    return {
        render:render
    }

})