define(function(){
    var arr_combobox = ['sex','nation','marriage','hktype','eachtype','disdegree','healthstatus','lifestatus','awardlevel',
        'caretype','laborability','lifeability','employment','grantstatus','ispsychosis'];
    var arr_datebox = ['birthday','joindate','retiredate','stopdate','opiniondate','reviewdate','auditdate'];
    var arr_validatebox = ['name','identityid'];

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

    /*界面初始化，公共方法*/
    var initFunc = function (local,option) {

        cj.getdivision(local.find('[opt=districtid]'));

        /*图片上传*/
        local.find('[opt=personimg]').click(function(){
            local.find('[opt=inputVal]').click();
        })
        /*附件选择动态事件*/
        local.find('[opt=inputVal]').bind('change',function(){
            cj.imgView(this,local);
        });
    }

    /*新增数据时进入*/
    var saveFunc = function(local,option){
        local.find('div[opt=panel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - 35);
            }
        });
        var btns = '<div id="ft_ssry" style="padding:5px;" align="center">' +
            '<input type="button" value="取消" class="btns" opt="cancel">&nbsp;' +
            '<input type="button" value="保存" class="btns" opt="save">&nbsp;' +
            '<input type="button" value="上报" class="btns" opt="report">' +
            '</div>';
        local.find('[opt=foot]').html(btns);
        local.find('div[opt=panel]').panel({
            footer:'#ft_ssry'
        })

        local.find('[opt=cancel]').click(function(){
            layer.close(option.index);
        });
        cj.shieldingSH(local);
        cj.shieldingSP(local);
        /*保存*/
        local.find('[opt=save]').click(function () {
            var $this = $(this);
            $this.attr("disabled",true);//按钮禁用
            local.find('form').form('submit', {
                url: 'hyshy/savesoilder',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    params.districtid = local.find("[opt=districtid]").combotree("getValue");
                    params.persontype = '215';
                    if (!isValid) {
                        layer.closeAll('loading');
                        $this.attr("disabled",false);//按钮启用
                    }
                    return isValid;
                },
                success: function (data) {
                    layer.closeAll('loading');
                    $this.attr("disabled",false);//按钮启用
                    if (data == "true") {
                        cj.showSuccess('保存成功');
                        option.queryParams.refresh();
                        layer.close(option.index);
                    } else {
                        cj.showFail('保存失败');
                    }
                }
            })
        });
        var districtid = local.find("[opt=districtid]").combotree("getValue");
        cj.reportFunc(local,option,districtid,'215','');
    }

    /*修改数据*/
    var updateFunc = function (local,option) {
        local.find('div[opt=panel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height());
            }
        }).css({'border':'none'});
        var li = '<li><input type="button" value="修改" class="btns" opt="update"></li>&nbsp;'+
            '<li><input type="button" value="上报" class="btns" opt="report"></li>';
        if(option.queryParams.type == 'report'){
            //local.find('[opt=update]').hide();
            li =  '<li><input type="button" value="上报" class="btns" opt="report"></li>';
        }else if (option.queryParams.type == 'chakan'){
            li =  '';
        }
        addToolBar(local,option,li);
        initControls(local);
        cj.shieldingSH(local);
        cj.shieldingSP(local);

        var record = option.queryParams.record; //主表信息
        local.find('form').form('load',record);//主表数据填充
        var imgurl;
        record.photo == null ? imgurl = 'images/noperson.gif' : imgurl = record.photo;
        var imghtm = '<img style="width:150px;height:120px;" src="../photofile/'+imgurl+'" />';//图片填充
        local.find('[opt=personimg]').html(imghtm);

        var districtnameval = cj.getDivisionTotalname(record.districtid);
        local.find('[opt=districtid]').combotree("setValue",districtnameval);  //填充行政区划

        local.find('[opt=update]').click(function () {
            local.find('form').form('submit', {
                url: 'hyshy/updatesoilder',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    params.sc_id = record.sc_id;
                    params.name = encodeURI(local.find('[name=name]').val());
                    params.identityid = encodeURI(local.find('[name=identityid]').val());
                    params.comments = encodeURI(local.find('[name=comments]').val());
                    params.idaddress = encodeURI(local.find('[name=idaddress]').val());
                    params.phone = encodeURI(local.find('[name=phone]').val());
                    params.household = encodeURI(local.find('[name=household]').val());
                    params.insured = encodeURI(local.find('[name=insured]').val());
                    params.pension = encodeURI(local.find('[name=pension]').val());
                    params.armyname = encodeURI(local.find('[name=armyname]').val());
                    params.specialty = encodeURI(local.find('[name=specialty]').val());
                    params.retirenumber = encodeURI(local.find('[name=retirenumber]').val());
                    params.workunit = encodeURI(local.find('[name=workunit]').val());
                    params.disituation = encodeURI(local.find('[name=disituation]').val());
                    params.stopdate = encodeURI(local.find('[name=stopdate]').val());
                    params.bankaccount = encodeURI(local.find('[name=bankaccount]').val());
                    params.holder = encodeURI(local.find('[name=holder]').val());
                    params.armycode = encodeURI(local.find('[name=armycode]').val());
                    params.certificateid = encodeURI(local.find('[name=certificateid]').val());
                    params.community = encodeURI(local.find('[name=community]').val());
                    params.communityopinion = encodeURI(local.find('[name=communityopinion]').val());
                    params.streeter = encodeURI(local.find('[name=streeter]').val());
                    params.streetreview = encodeURI(local.find('[name=streetreview]').val());
                    params.county = encodeURI(local.find('[name=county]').val());
                    params.countyaudit = encodeURI(local.find('[name=countyaudit]').val());
                    params.preparer = encodeURI(local.find('[name=preparer]').val());
                    params.filenumber = encodeURI(local.find('[name=filenumber]').val());
                    params.districtid = encodeURI(local.find('[name=districtid]').val());
                    params.photo = encodeURI(local.find('[name=photo]').val());
                    params.deadcertificate = encodeURI(local.find('[name=deadcertificate]').val());
                    params.honor = encodeURI(local.find('[name=honor]').val());
                    params.familyname = encodeURI(local.find('[name=familyname]').val());
                    params.familyphone = encodeURI(local.find('[name=familyphone]').val());
                    params.familyaddress = encodeURI(local.find('[name=familyaddress]').val());
                    params.familyunit = encodeURI(local.find('[name=familyunit]').val());
                    params.armyphone = encodeURI(local.find('[name=armyphone]').val());
                    params.trainarea = encodeURI(local.find('[name=trainarea]').val());
                    params.position = encodeURI(local.find('[name=position]').val());
                    params.party = encodeURI(local.find('[name=party]').val());
                    params.culture = encodeURI(local.find('[name=culture]').val());
                    params.troop = encodeURI(local.find('[name=troop]').val());
                    params.fname = encodeURI(local.find('[name=fname]').val());
                    params.fidentityid = encodeURI(local.find('[name=fidentityid]').val());
                    params.mname = encodeURI(local.find('[name=mname]').val());
                    params.midentityid = encodeURI(local.find('[name=midentityid]').val());
                    params.photo = encodeURI(local.find('[name=photo]').val());
                    if(!isNaN(local.find("[opt=districtid]").combotree("getValue"))){          //是否是数字
                        params.districtid = local.find("[opt=districtid]").combotree("getValue");
                    }else{
                        params.districtid = record.districtid;
                    }
                    if (!isValid) {
                        layer.closeAll('loading');
                    }
                    return isValid;
                },
                success: function (data) {
                    layer.closeAll('loading');
                    if (data == "true") {
                        cj.showSuccess('修改成功');
                        option.queryParams.refresh();
                        layer.close(option.index);
                    } else {
                        cj.showFail('修改失败');
                    }
                }
            })
        });
        var districtid='';
        if(!isNaN(local.find("[opt=districtid]").combotree("getValue"))){          //是否是数字
            districtid = local.find("[opt=districtid]").combotree("getValue");
        }else{
            districtid = record.districtid;
        }
        cj.reportFunc(local,option,districtid,'215',record.sc_id);
    }

    /*审核*/
    var auditFunc = function (local,option) {
        local.find('div[opt=panel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height());
            }
        }).css({'border':'none'});
        initControls(local);
        var li = '<li><input type="button" value="同意" class="btns" opt="agreed"></li>&nbsp;'+
            '<li><input type="button" value="退回" class="btns" opt="back"></li>';
        addToolBar(local,option,li);

        cj.shieldingSP(local);

        var record = option.queryParams.record; //主表信息
        local.find('form').form('load',record);//主表数据填充
        var imgurl;
        record.photo == null ? imgurl = 'images/noperson.gif' : imgurl = record.photo;
        var imghtm = '<img style="width:150px;height:120px;" src="'+imgurl+'" />';//图片填充
        local.find('[opt=personimg]').html(imghtm);

        var districtnameval = cj.getDivisionTotalname(record.districtid);
        local.find('[opt=districtid]').combotree("setValue",districtnameval);  //填充行政区划

        /*审核*/
        local.find('[opt=agreed]').click(function () {
            cj.auditClick(local,option,record,'1');
        });

        /*退回*/
        local.find('[opt=back]').click(function () {
            cj.auditClick(local,option,record,'0');
        })
    }
    /*审批*/
    var approveFunc = function (local,option) {
        local.find('div[opt=panel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height());
            }
        }).css({'border':'none'});
        initControls(local);
        var li = '<li><input type="button" value="同意" class="btns" opt="agreed"></li>&nbsp;'+
            '<li><input type="button" value="退回" class="btns" opt="back"></li>';
        addToolBar(local,option,li);

        var record = option.queryParams.record; //主表信息
        local.find('form').form('load',record);//主表数据填充
        var imgurl;
        record.photo == null ? imgurl = 'images/noperson.gif' : imgurl = record.photo;
        var imghtm = '<img style="width:150px;height:120px;" src="'+imgurl+'" />';//图片填充
        local.find('[opt=personimg]').html(imghtm);

        var districtnameval = cj.getDivisionTotalname(record.districtid);
        local.find('[opt=districtid]').combotree("setValue",districtnameval);  //填充行政区划

        /*审批*/
        local.find('[opt=agreed]').click(function () {
            cj.approveClick(local,option,record,'1');
        });

        /*退回*/
        local.find('[opt=back]').click(function () {
            cj.approveClick(local,option,record,'0');
        })
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
                case 'audit':
                    auditFunc(l, o);
                    break;
                case 'approve':
                    approveFunc(l, o);
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