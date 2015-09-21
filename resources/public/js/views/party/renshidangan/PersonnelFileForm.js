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


    /*查看并修改*/
    var actionInfo=function(local,option) {
        layer.closeAll('loading');
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

    
    /*学历学位添加*/
    var degreeForm = function (local) {
        var tdarr1 = '<td align="center"><input opt="edutype" class="easyui-combobox" opt2="educationtype" style="width: 100px"></td>'+
            '<td align="center"><input class="input-text" opt="college"></td>' +
            '<td align="center"><input class="input-text" opt="profession"></td>'+
            '<td><input size="8" opt="pp_id" type="hidden"><input size="8" opt="districtidval" type="hidden"><a opt="dellist_degree" style="cursor: pointer;">删除</a></td>';

        var _html1 = '<tr>' + tdarr1+ '</tr>';
        local.find('[opt=addlist_degree]').click(function () {
            var $this =$(this);
            var $tr = $this.parents('.list').find('tbody');
            $tr.append(_html1);
            var edutype = local.find('[opt=edutype]').last();
            edutype.combobox({
                loader:cj.getLoader('edutype'),
                valueField:'id',
                editable:false,
                textField:'text'
            });
            var lasttr = $tr.find('tr')[$tr.find('tr').length-1];
            $($($(lasttr).find('td')[0]).find('span.combo')[1]).remove();
            local.find('[opt=dellist_degree]').each(function () {
            }).click(function () {
                var _tr = $(this).parents('tr');
                if (_tr.attr('class') != "demo") {
                    var pp_id = _tr.find('[opt=pp_id]').val()
                    if(!pp_id){
                        _tr.remove();
                    }
                }
            })
        });
    }
    /*主要家庭成员添加*/
    var familyForm = function (local) {
        var tdarr2 = '<td align="center"><input class="input-text" opt="appellation" style="width: 100px;"></td>' +
            '<td align="center"><input class="input-text" opt="fm_name" style="width: 100px;"></td>' +
            '<td align="center"><input class="input-text" opt="fm_identityid" style="width: 100px;"></td>' +
            '<td align="center"><input opt="fm_politicalstatus" class="easyui-combobox " style="width: 100px"></td>' +
            '<td align="center"><input class="input-text" opt="fm_workunit" style="width: 100px;"></td>' +
            '<td align="center"><input class="input-text" opt="fm_position" style="width: 100px;"></td>' +
            '<td align="center"><input class="input-text" opt="fm_contactway" style="width: 100px;"></td>'+
            '<td><input size="8" opt="pp_id" type="hidden"><input size="8" opt="districtidval" type="hidden"><a opt="dellist_family" style="cursor: pointer;">删除</a></td>';;
        var _html2 = '<tr>' + tdarr2+ '</tr>';
        local.find('[opt=addlist_family]').click(function () {
            var $this =$(this);
            var $tr = $this.parents('.list').find('tbody');
            $tr.append(_html2);
            var fm_politicalstatus = local.find('[opt=fm_politicalstatus]').last();
            //var fm_politicalstatus = local.find('[opt=fm_politicalstatus]');
            fm_politicalstatus.combobox({
                loader:cj.getLoader('politicsstatus'),
                valueField:'id',
                editable:false,
                textField:'text'
            });
            var lasttr = $tr.find('tr')[$tr.find('tr').length-1];
            $($($(lasttr).find('td')[0]).find('span.combo')[1]).remove();
            local.find('[opt=dellist_family]').each(function () {
            }).click(function () {
                var _tr = $(this).parents('tr');
                if (_tr.attr('class') != "demo") {
                    var pp_id = _tr.find('[opt=pp_id]').val()
                    if(!pp_id){
                        _tr.remove();
                    }
                }
            })
        });
    }
    /*学位学历表单提交时值动态获取*/
    var getDegreeValue = function (local) {
        var edutype = local.find('[opt=edutype]');//教育类别
        var college = local.find('[opt=college]');      //毕业院校
        var profession = local.find('[opt=profession]');      //毕业院校
        var arr1 = new Array();
        var arr2 = new Array();
        var arr3 = new Array();
        edutype.each(function () {
            arr1.push($(this).combobox('getValue'))
        });
        college.each(function () {
            arr2.push($(this).val())
        });
        profession.each(function () {
            arr3.push($(this).val())
        });

        var arrall = new Array();
        for(var i=0;i<arr1.length;i++){
            var maparr = {};
            maparr['educationtype']=arr1[i];
            maparr['college']=arr2[i];
            maparr['profession']=arr3[i];
            arrall.push(maparr);
        }
        return arrall;
    }
    var getFamilyValue = function (local) {
        var appellation = local.find('[opt=appellation]');//称谓
        var fm_name = local.find('[opt=fm_name]');      //姓名
        var fm_identityid = local.find('[opt=fm_identityid]');      //身份证
        var fm_politicalstatus = local.find('[opt=fm_politicalstatus]');      //政治面貌
        var fm_workunit = local.find('[opt=fm_workunit]');      //工作单位
        var fm_position = local.find('[opt=fm_position]');      //职务
        var fm_contactway = local.find('[opt=fm_contactway]');      //联系方式
        var arr1 = new Array();
        var arr2 = new Array();
        var arr3 = new Array();
        var arr4 = new Array();
        var arr5 = new Array();
        var arr6 = new Array();
        var arr7 = new Array();
        appellation.each(function () {
            arr1.push($(this).val())
        });
        fm_name.each(function () {
            arr2.push($(this).val())
        });
        fm_identityid.each(function () {
            arr3.push($(this).val())
        });
        fm_politicalstatus.each(function () {
            arr4.push($(this).combobox('getValue'))
        });
        fm_workunit.each(function () {
            arr5.push($(this).val())
        });
        fm_position.each(function () {
            arr6.push($(this).val())
        });
        fm_contactway.each(function () {
            arr7.push($(this).val())
        });

        var arrall = new Array();
        for(var i=0;i<arr1.length;i++){
            var maparr = {};
            maparr['appellation']=arr1[i];
            maparr['fm_name']=arr2[i];
            maparr['fm_identityid']=arr3[i];
            maparr['fm_politicalstatus']=arr4[i];
            maparr['fm_workunit']=arr5[i];
            maparr['fm_position']=arr6[i];
            maparr['fm_contactway']=arr7[i];
            arrall.push(maparr);
        }
        return arrall;
    }
    /*新增数据时进入*/
    var saveFunc = function(local,option){
        degreeForm(local);//学位学历添加

        familyForm(local);/*主要家庭成员添加*/

        /*工作状况状态选择*/
        local.find('[opt=workstatus]').combobox({
            onSelect: function (record) {
                var timename;
                if(record.id == "0"){
                    timename = '工作时间';
                }else if(record.id == "1"){
                    timename = '离休时间';
                }else{
                    timename = '退休时间';
                }
                var ht = timename+'<label></label>&nbsp;';
                local.find('[opt=worktime]').html(ht)
            }
        });
        /*人员身份选择*/
        local.find('[opt=personnel]').combobox({
            onSelect: function (record) {
                if(record.id == "2"){       //事业处理
                    local.find('[opt=shiye]').slideDown('slow');
                    local.find('[opt=hetonggong]').slideUp('slow');
                }else if(record.id == "3"){ //岗位合同工处理
                    local.find('[opt=hetonggong]').slideDown('slow');
                    local.find('[opt=shiye]').slideUp('slow');
                }else{
                    local.find('[opt=shiye]').slideUp('slow');
                    local.find('[opt=hetonggong]').slideUp('slow');
                }
            }
        });

        option.submitbtn.click(function () {
            nameedu = getDegreeValue(local);//学位学历获取
            var namefamily = getFamilyValue(local);//家庭成员获取
            var $local = option.parent;
            $local.find('form').form('submit', {
                url: 'record/addpensonrecords',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    params.educationway = JSON.stringify(nameedu);
                    params.familymembers = JSON.stringify(namefamily);
                    if (!isValid) {
                        layer.closeAll('loading');
                    }
                    return isValid;
                },
                success: function (data) {
                    if (data == "true") {
                        layer.closeAll('loading');
                        layer.alert('保存成功!', {icon: 6, title: '温馨提示'});
                    } else {
                        layer.closeAll('loading');
                        layer.alert('保存失败!', {icon: 5, title: '温馨提示'});
                    }
                }
            })
        });

        /*图片上传*/
        local.find('[opt=personimg]').click(function(){
            require(['commonfuncs/popwin/win','text!views/party/fileupload/FileForm.htm','views/party/fileupload/FileForm'],
                function(win,htmfile,jsfile){
                    win.render({
                        title:"上传图片",
                        width:400,
                        height:200,
                        html:htmfile,
                        buttons:[
                            {text:'取消',handler:function(html,parent){
                                parent.trigger('close');
                            }},
                            {
                                text:'保存',
                                handler:function(html,parent){
                                }
                            }
                        ],
                        renderHtml:function(localc,submitbtn,parent){
                            jsfile.render(localc,{
                                submitbtn:submitbtn,
                                parent:parent,
                                plocal:local,
                                //filetype:filetype,
                                //refresh:refreshDatagrid,
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
            require(['commonfuncs/popwin/win','text!views/pension/pensioninfo/PensionPeopleAuditDlg.htm','views/pension/pensioninfo/PensionPeopleAuditDlg'],
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
        layer.closeAll('loading');
        if(o && o.queryParams) {
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