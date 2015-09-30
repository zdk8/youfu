define(function(){
    var arr_combobox = ['gender','nation','marriage','politicalstatus','positiontype','edutype','fm_politicalstatus'];
    var arr_datebox = ['worktime','partytime'];
    var arr_validatebox = ['name','identityid'];

    /*添加功能按钮*/
    var addToolBar=function(local,option,li) {
        var li_func = ' <li>' +
            '<input type="button" value="取消" class="btns" opt="cancel">' +
            '</li>' +'&nbsp;'+li;

        var functool = local.find('.layui-layer-setwin');
        functool.after('<div class="funcmenu"><ul></ul></div>');
        var _toolbar = local.find('.funcmenu');
        _toolbar.css('display','block');
        _toolbar.find('ul').html(li_func);
        /*取消*/
        local.find('[opt=cancel]').click(function () {
            layer.close(option.index);
        });
    };
    /*easyui控件初始化*/
    var initControls = function (local) {
        for(var i=0;i<arr_combobox.length;i++){
            local.find('[opt='+arr_combobox[i]+']').combobox();
        }
        for(var i=0;i<arr_datebox.length;i++){
            local.find('[opt='+arr_datebox[i]+']').datebox();
        }
        for(var i=0;i<arr_validatebox.length;i++){
            local.find('[name='+arr_validatebox[i]+']').validatebox();
        }

    }

    /*学历学位添加*/
    var degreeForm = function (local) {
        var tdarr1 = '<td align="center"><input opt="edutype" class="easyui-combobox" opt2="educationtype" style="width: 100px"></td>'+
            '<td align="center"><input class="input-text" opt="college"></td>' +
            '<td align="center"><input class="input-text" opt="profession"></td>'+
            '<td><a opt="dellist_degree" style="cursor: pointer;"><!--删除--><img src="images/reduce.png"></a></td>';

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
        var tdarr2 = '<td align="center"><input class="input-text" opt="appellation" style="width: 70px;"></td>' +
            '<td align="center"><input class="input-text" opt="fm_name" style="width: 70px;"></td>' +
            '<td align="center"><input class="input-text" opt="fm_identityid" style="width: 130px;"></td>' +
            '<td align="center"><input opt="fm_politicalstatus" class="easyui-combobox " style="width: 80px"></td>' +
            '<td align="center"><input class="input-text" opt="fm_workunit" style="width: 100px;"></td>' +
            '<td align="center"><input class="input-text" opt="fm_position" style="width: 100px;"></td>' +
            '<td align="center"><input class="input-text" opt="fm_contactway" style="width: 100px;"></td>'+
            '<td><a opt="dellist_family" style="cursor: pointer;"><!--删除--><img src="images/reduce.png"></a></td>';
        var _html2 = '<tr>' + tdarr2+ '</tr>';
        local.find('[opt=addlist_family]').click(function () {
            var $this =$(this);
            var $tr = $this.parents('.list').find('tbody');
            $tr.append(_html2);
            var fm_politicalstatus = local.find('[opt=fm_politicalstatus]').last();
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
    
    /*学位学历数据加载*/
    var loadEducationData = function (local,educationway) {
        local.find('[opt=edutype]').combobox('setValue',educationway[0].educationtype);
        local.find('[opt=college]').val(educationway[0].college);
        local.find('[opt=profession]').val(educationway[0].profession);

        var tdarr1 = '<td align="center"><input opt="edutype" class="easyui-combobox" opt2="educationtype" style="width: 100px"></td>'+
            '<td align="center"><input class="input-text" opt="college"></td>' +
            '<td align="center"><input class="input-text" opt="profession"></td>'+
            '<td><a opt="dellist_degree" style="cursor: pointer;"><!--删除--><img src="images/reduce.png"></a></td>';

        for(var i=1;i<educationway.length;i++){
            var _html1 = '<tr>' + tdarr1+ '</tr>';
            var $edu = local.find('[opt=edu] tbody');
            $edu.append(_html1);
            var edutype = local.find('[opt=edutype]').last();
            edutype.combobox({
                loader:cj.getLoader('edutype'),
                valueField:'id',
                editable:false,
                textField:'text'
            });
            var lasttr = $edu.find('tr')[$edu.find('tr').length-1];
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
            local.find('[opt=edutype]').last().combobox('setValue',educationway[i].educationtype);
            local.find('[opt=college]').last().val(educationway[i].college);
            local.find('[opt=profession]').last().val(educationway[i].profession);
        }
    }
    /*主要家庭成员数据加载*/
    var loadFamilyData = function (local,familymembers) {
        for(var key in familymembers[0]){
            if(key == 'fm_politicalstatus'){
                local.find('[opt=fm_politicalstatus]').combobox('setValue',familymembers[0][key]);
            }else{
                local.find('[opt='+key+']').val(familymembers[0][key]);
            }
        }

        var tdarr2 = '<td align="center"><input class="input-text" opt="appellation" style="width: 70px;"></td>' +
            '<td align="center"><input class="input-text" opt="fm_name" style="width: 70px;"></td>' +
            '<td align="center"><input class="input-text" opt="fm_identityid" style="width: 130px;"></td>' +
            '<td align="center"><input opt="fm_politicalstatus" class="easyui-combobox " style="width: 80px"></td>' +
            '<td align="center"><input class="input-text" opt="fm_workunit" style="width: 100px;"></td>' +
            '<td align="center"><input class="input-text" opt="fm_position" style="width: 100px;"></td>' +
            '<td align="center"><input class="input-text" opt="fm_contactway" style="width: 100px;"></td>'+
            '<td><a opt="dellist_family" style="cursor: pointer;"><!--删除--><img src="images/reduce.png"></a></td>';

        for(var i=1;i<familymembers.length;i++){
            var _html2 = '<tr>' + tdarr2+ '</tr>';
            var $fam = local.find('[opt=fam] tbody');
            $fam.append(_html2);
            var fm_politicalstatus = local.find('[opt=fm_politicalstatus]').last();
            fm_politicalstatus.combobox({
                loader:cj.getLoader('politicsstatus'),
                valueField:'id',
                editable:false,
                textField:'text'
            });
            var lasttr = $fam.find('tr')[$fam.find('tr').length-1];
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
            for(var key in familymembers[0]){
                if(key == 'fm_politicalstatus'){
                    local.find('[opt=fm_politicalstatus]').last().combobox('setValue',familymembers[i][key]);
                }else{
                    local.find('[opt='+key+']').last().val(familymembers[i][key]);
                }
            }
        }
    }

    /*界面初始化，公共方法*/
    var initFunc = function (local,option) {
        degreeForm(local);//学位学历添加

        familyForm(local);/*主要家庭成员添加*/

        initControls(local);//控件初始化

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
                local.find('[opt=worktime_label]').html(ht)
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

        /*图片上传*/
        local.find('[opt=personimg]').click(function(){
            local.find('[opt=inputVal]').click();
        })
        /*附件选择动态事件*/
        local.find('[opt=inputVal]').bind('change',function(){
            //var file=$(this).val();
            //var strFileName=file.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi,"$1");  //正则表达式获取文件名，不带后缀
            //var FileExt='.'+file.replace(/.+\./,"");   //正则表达式获取后缀
            //local.find('[name=filenamemsg]').val(strFileName);
            //local.find('[name=fileext]').val(FileExt);
            cj.imgView(this,local);
        });
    }
    
    /*新增数据时进入*/
    var saveFunc = function(local,option){
        var li = '<li><input type="button" value="保存" class="btns" opt="save"></li>';
        addToolBar(local,option,li);

        /*保存*/
        local.find('[opt=save]').click(function () {
            var nameedu = getDegreeValue(local);//学位学历获取
            var namefamily = getFamilyValue(local);//家庭成员获取
            local.find('form').form('submit', {
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
                        cj.showSuccess('保存成功');
                        option.queryParams.refresh();
                        layer.close(option.index);
                    } else {
                        layer.closeAll('loading');
                        cj.showFail('保存失败');
                    }
                }
            })
        });
    }
    
    /*修改数据*/
    var updateFunc = function (local,option) {
        var li = '<li><input type="button" value="修改" class="btns" opt="update"></li>';
        addToolBar(local,option,li);
        var record = option.queryParams.record; //主表信息
        local.find('form').form('load',record);//主表数据填充
        var imgurl;
        record.photo == null ? imgurl = 'images/noperson.gif' : imgurl = record.photo;
        var imghtm = '<img style="width:150px;height:120px;" src="'+imgurl+'" />';//图片填充
        local.find('[opt=personimg]').html(imghtm);
        var childrecord = option.queryParams.childrecord;//子表信息
        var educationway =childrecord.educationway; //学位学历信息
        loadEducationData(local,educationway);//学位学历数据填充
        var familymembers =childrecord.familymembers; //主要家庭成员信息
        loadFamilyData(local,familymembers);//主要家庭成员数据填充

        local.find('[opt=update]').click(function () {
            var nameedu = getDegreeValue(local);//学位学历获取
            var namefamily = getFamilyValue(local);//家庭成员获取
            local.find('form').form('submit', {
                url: 'record/updaterecord',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    params.pr_id = record.pr_id;
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
                        cj.showSuccess('修改成功');
                        option.queryParams.refresh();
                        layer.close(option.index);
                    } else {
                        layer.closeAll('loading');
                        cj.showFail('修改失败');
                    }
                }
            })
        });
    }

    var render=function(l,o){
        layer.closeAll('loading');
        initFunc(l,o);//初始化
        if(o && o.queryParams) {
            switch (o.queryParams.actiontype){
                case 'update':
                    updateFunc(l, o);
                    break;
                case 'add':
                    saveFunc(l, o);
                    break;
                default :
                    break;
            }
        }
    }
    return {
        render:render
    }

})