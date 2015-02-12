define(function(){
    var keyarray = ['fwlx_jjyl','fwlx_fwj','fwlx_mftj','fwlx_dylnb','fwlx_jgyl','fwlx_tyfw','fwlx_hjj','fwlx_qt',//享受服务类型
        'jk_rcws_st','jk_rcws_xl','jk_rcws_xt','jk_rcws_sy','jk_rcws_xj','jk_rcws_tx','jk_rcws_xzj','jk_rcws_xy',//日常卫生
        'jk_bs_gaoxy','jk_bs_tangnb','jk_bs_fengs','jk_bs_xinzb','jk_bs_chid','jk_bs_guz','jk_bs_qit'];          //病史情况

    var addToolBar=function(local) {
        var toolBarHeight=35;
        var toolBar=cj.getFormToolBar([
            {text: '处理',hidden:'hidden',opt:'dealwith'},
            {text: '修改',hidden:'hidden',opt:'update'},
            {text: '删除',hidden:'hidden',opt:'delete'},
            {text: '保存',hidden:'hidden',opt:'save'},
            {text: '保存',hidden:'hidden',opt:'save2'}
//            {text: '操作日志',hidden:'hidden',opt:'log'}
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });
    };
    /*为Checkbox添加样式*/
    var addCheckboxCss = function(local) {
        var selectRadio = ":input[type=checkbox] + label";
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

    function create(local,option){
        addToolBar(local);
        /*为每个label注册收缩事件*/
        local.find('fieldset').find('legend').find('label').each(function(obj,fn,arg){
            var labelopt = fn.attributes[0].value.toString()
            var label_talbe = labelopt.substr(0,labelopt.lastIndexOf('_'));
            if(label_talbe != "baseinfo"){
                FieldSetVisual(local,label_talbe+'_table',label_talbe,label_talbe+'_img')
            }
        }).click(function(e){
                var labelopt = $(this)[0].attributes[0].value.toString();
                var label_talbe = labelopt.substr(0,labelopt.lastIndexOf('_'));
                FieldSetVisual(local,label_talbe+'_table',label_talbe,label_talbe+'_img')
            })

    }

    /*查看并修改*/
    var actionInfo=function(local,option) {
        addCheckboxCss(local);
        var districtid = local.find('[opt=districtid]');      //行政区划
        getdivision(districtid);
        local.find('[opt=dealwith]').hide();
        local.find('[opt=delete]').hide();
        local.find('[opt=save]').hide();
        local.find('[opt=save2]').hide();
        var datas = option.queryParams.data;
        var pensionform = local.find('[opt=pensionform]');      //老人信息主表
        pensionform.form('load',datas)        //填充表单
        var districtnameval = getDivistionTotalname(option.queryParams.data.districtid)
        districtid.combobox("setValue",districtnameval)  //填充行政区划
        /*填充checkbox*/
        for(var i=0;i<keyarray.length;i++){
            local.find('input[name='+keyarray[i]+'][type=checkbox][value='+datas[keyarray[i]]+']').attr("checked","checked");
            local.find('input[name='+keyarray[i]+'][type=checkbox][value='+datas[keyarray[i]]+']+label').addClass("checked");
        }
        local.find('[opt=update]').show().click(function(){
            pensionform.form('submit', {
                url:'updateold',
                dataType:"json",
                onSubmit: function (params) {
                    var isValid = $(this).form('validate');
                    if(isValid){
//                        showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                        if(!isNaN(local.find("[opt=districtid]").combobox("getValue"))){          //是否是数字
                            params.districtid = local.find("[opt=districtid]").combobox("getValue")
                        }else{
                            params.districtid = option.queryParams.data.districtid
                        }
                        params.lr_id = option.queryParams.data.lr_id
                    }
                    return isValid;
                },
                success: function (data) {
                    if(data == "true"){
                        showProcess(false);
                        cj.slideShow('修改成功');
                        if(showProcess(false)){
                            $("#tabs").tabs('close',option.queryParams.title)
                            var ref = option.queryParams.refresh;             //刷新
                            ref();
                        }
                    }else{
                        showProcess(false);
                        cj.slideShow('<label style="color: red">修改失败</label>');
                    }
                }
            });
        });
    };

    /*新增数据时进入*/
    var saveFunc = function(local,option){
        addCheckboxCss(local);
        var districtid = local.find('[opt=districtid]');      //行政区划
        getdivision(districtid);                    //加载行政区划
        local.find('[name=operators]').val(cj.getUserMsg().username);
        local.find('[opt=setdaytime]').datebox('setValue',new Date().pattern('yyyy-MM-dd'));
        /*根据身份证获取基本信息*/
        getBaseInfoByIdentityid({identityid:local.find("[opt=identityid]"),birthdate:local.find('[opt=birthdate]'),
            gender:local.find('[opt=gender]'),age:local.find('[opt=age]'),agetype:null});
        local.find('[opt=dealwith]').hide();
        local.find('[opt=update]').hide();
        local.find('[opt=delete]').hide();
        local.find('[opt=save2]').hide();
        var savebtn = local.find('[opt=save]');               //保存按钮
        savebtn.show().click(function(){
            local.find('[opt=save]').hide()
            local.find('[opt=save2]').show()
            local.find('[opt=pensionform]').form('submit', {
                url:'saveold',
                onSubmit: function (params) {
                    params.districtid = districtid.combobox("getValue")
                    /*var isValid = $(this).form('validate');
                    return isValid;*/
                },
                success: function (data) {
                    if(data == "true"){
                        cj.slideShow('保存成功');
                        local.find('[opt=save]').show()
                        local.find('[opt=save2]').hide()
                        $("#tabs").tabs("close","老年基本信息录入");
                    }else{
                        cj.slideShow('<label style="color: red">保存失败</label>');
                    }
                }
            });
        })
    }

    /*处理时进入页面(actionType=info)*/
    var dealwithInfoFunc = function(local,option){
        addCheckboxCss(local);
        var datas = option.queryParams.data;
        var pensionform = local.find('[opt=pensionform]');      //老人信息主表
        pensionform.form('load',datas)        //填充表单
        var districtid = local.find('[opt=districtid]');      //行政区划
        var districtnameval = getDivistionTotalname(option.queryParams.data.districtid)
        districtid.combobox("setValue",districtnameval)  //填充行政区划
        /*填充checkbox*/
        for(var i=0;i<keyarray.length;i++){
            local.find('input[name='+keyarray[i]+'][type=checkbox][value='+datas[keyarray[i]]+']').attr("checked","checked");
            local.find('input[name='+keyarray[i]+'][type=checkbox][value='+datas[keyarray[i]]+']+label').addClass("checked");
        }
        var dealwithbtn = local.find('[opt=dealwith]');            //处理按钮
        local.find('[opt=save]').hide();
        local.find('[opt=save2]').hide();
        local.find('[opt=update]').hide();
        local.find('[opt=delete]').hide();
        dealwithbtn.show().click(function(){
            require(['commonfuncs/popwin/win','text!views/pension/PensionPeopleAuditDlg.htm','views/pension/PensionPeopleAuditDlg'],
                function(win,htmfile,jsfile){
                    win.render({
                        title:'处理',
                        width:395,
                        height:250,
                        html:htmfile,
                        buttons:[
                            {text:'取消',handler:function(html,parent){
                                parent.trigger('close');
                            }},
                            {
                                text:'保存',
                                handler:function(html,parent){ }}
                        ],
                        renderHtml:function(local,submitbtn,parent){
                            jsfile.render(local,{
                                submitbtn:submitbtn,
                                act:'c',
                                refresh:option.queryParams.refresh,
                                data:option.queryParams.record,
                                title:option.queryParams.title,
                                parent:parent,
                                onCreateSuccess:function(data){
                                    parent.trigger('close');
                                }
                            })
                        }
                    })
                }
            )
        })
    }


    var render=function(l,o){
        create(l,o);
        if(o.queryParams) {
            switch (o.queryParams.actiontype){
                case 'update1':
                    (function(){alert('hahaha')})();
                    break;
                case 'info':
                    dealwithInfoFunc(l,o);
                    break;
                case 'update':
                    actionInfo(l, o);
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