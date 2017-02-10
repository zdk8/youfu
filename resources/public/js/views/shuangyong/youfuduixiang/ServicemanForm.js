define(function(){
    var arr_combobox = ['sex','nation','marriage','hktype','eachtype','awardlevel','caretype','train','medicalinsurance'];
    var arr_datebox = ['birthday','joindate','retiredate','opiniondate','reviewdate','auditdate'];
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

    /*界面初始化，公共方法*/
    var initFunc = function (local,option) {
        initControls(local);//控件初始化

        var districtvalue = false;
        if(option.queryParams.record){
            districtvalue = option.queryParams.record.districtid;
        }
        cj.getdivision(local.find('[opt=districtid]'),districtvalue);

        //图片上传
        local.find('[opt=personimg]').click(function(){
            local.find('[opt=inputVal]').click();
        })
       // 附件选择动态事件
        local.find('[opt=inputVal]').bind('change',function(){
            cj.imgView(this,local);
        });
    }

    /*屏蔽审核信息*/
    var shieldingSH = function (local) {
        local.find('[name=streetreview]').attr('readonly',true).css({'background-color':'#F5F5F5'});
        local.find('[name=streeter]').attr('readonly',true).css({'background-color':'#F5F5F5'});
        local.find('[opt=reviewdate]').datebox({disabled:true});
    }
    /*屏蔽审批信息*/
    var shieldingSP = function (local) {
        local.find('[name=countyaudit]').attr('readonly',true).css({'background-color':'#F5F5F5'});
        local.find('[name=county]').attr('readonly',true).css({'background-color':'#F5F5F5'});
        local.find('[opt=auditdate]').datebox({disabled:true});
    }

    /*新增数据时进入*/
    var saveFunc = function(local,option){
        var li = '<li><input type="button" value="保存" class="btns" opt="save"></li>&nbsp;'+
            '<li><input type="button" value="上报" class="btns" opt="report"></li>';
        addToolBar(local,option,li);
        shieldingSH(local);
        shieldingSP(local);
        //根据身份证号填充性别和出生日期
        cj.getBaseInfoByIdentityid(
            {
                identityid:local.find("[opt=identityid]"),
                birthdate:local.find('[opt=birthday]'),
                gender:local.find('[opt=sex]'),
                age:local.find('[opt=age]'),
                agetype:null
            }
        );
        /*保存*/
        local.find('[opt=save]').click(function () {
            var $this = $(this);
            $this.attr("disabled",true);//按钮禁用
            local.find('form').form('submit', {
                url: 'hyshy/savesoilder',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
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
                    //params.workunit = encodeURI(local.find('[name=workunit]').val());
                    //params.disituation = encodeURI(local.find('[name=disituation]').val());
                    //params.stopdate = encodeURI(local.find('[name=stopdate]').val());
                    //params.bankaccount = encodeURI(local.find('[name=bankaccount]').val());
                    //params.holder = encodeURI(local.find('[name=holder]').val());
                    params.armycode = encodeURI(local.find('[name=armycode]').val());
                    //params.certificateid = encodeURI(local.find('[name=certificateid]').val());
                    params.community = encodeURI(local.find('[name=community]').val());
                    params.communityopinion = encodeURI(local.find('[name=communityopinion]').val());
                    params.streeter = encodeURI(local.find('[name=streeter]').val());
                    params.streetreview = encodeURI(local.find('[name=streetreview]').val());
                    params.county = encodeURI(local.find('[name=county]').val());
                    params.countyaudit = encodeURI(local.find('[name=countyaudit]').val());
                    //params.preparer = encodeURI(local.find('[name=preparer]').val());
                    //params.filenumber = encodeURI(local.find('[name=filenumber]').val());
                    params.districtid = encodeURI(local.find('[name=districtid]').val());
                    params.photo = encodeURI(local.find('[name=photo]').val());
                    //params.deadcertificate = encodeURI(local.find('[name=deadcertificate]').val());
                    params.honor = encodeURI(local.find('[name=honor]').val());
                    //params.familyname = encodeURI(local.find('[name=familyname]').val());
                    params.familyphone = encodeURI(local.find('[name=familyphone]').val());
                    params.familyaddress = encodeURI(local.find('[name=familyaddress]').val());
                    params.familyunit = encodeURI(local.find('[name=familyunit]').val());
                    params.armyphone = encodeURI(local.find('[name=armyphone]').val());
                    //params.trainarea = encodeURI(local.find('[name=trainarea]').val());
                    params.position = encodeURI(local.find('[name=position]').val());
                    params.party = encodeURI(local.find('[name=party]').val());
                    params.culture = encodeURI(local.find('[name=culture]').val());
                    params.troop = encodeURI(local.find('[name=troop]').val());
                    params.fname = encodeURI(local.find('[name=fname]').val());
                    params.fidentityid = encodeURI(local.find('[name=fidentityid]').val());
                    params.mname = encodeURI(local.find('[name=mname]').val());
                    params.midentityid = encodeURI(local.find('[name=midentityid]').val());
                    if (!isValid) {
                        layer.closeAll('loading');
                        $this.attr("disabled",false);//按钮启用
                    }
                    params.districtid = local.find("[opt=districtid]").combotree("getValue");
                    params.persontype = '100';
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

        local.find('[opt=report]').click(function(){
            var districtid = local.find("[opt=districtid]").combotree("getValue");
            cj.reportFunc(local,option,districtid,'100','');
        });

    }
    
    /*修改数据*/
    var updateFunc = function (local,option) {
        var li = '<li><input type="button" value="修改" class="btns" opt="update"></li>&nbsp;'
            //+'<li><input type="button" value="上报" class="btns" opt="report"></li>';
        if(option.queryParams.type == 'report'){
            //local.find('[opt=update]').hide();
            li =  '<li><input type="button" value="上报" class="btns" opt="report"></li>';
        }else if (option.queryParams.type == 'chakan'){
            li =  '';
        }

        /*if(option.queryParams.type == 'view'){
            local.find('[opt=update]').hide();
            local.find('[opt=report]').hide();
            li = '<li><input type="button" value="打印" class="btns" opt="print"></li>';
            //local.find('.common-form').find('fieldset').not($('.common-form').find('fieldset')[0]).remove();
            //local.find('.common-form').find('fieldset>legend').remove();
        }*/

        addToolBar(local,option,li);


        shieldingSH(local);
        shieldingSP(local);

        var record = option.queryParams.record; //主表信息
        local.find('form').form('load',record);//主表数据填充
        var imgurl;
        record.photo == null ? imgurl = 'images/noperson.gif' : imgurl = record.photo;
        var imghtm = '<img style="width:150px;height:120px;" src="../photofile/'+imgurl+'" />';//图片填充
        local.find('[opt=personimg]').html(imghtm);
        var districtnameval = cj.getDivisionTotalname(record.districtid);
        local.find('[opt=districtid]').combotree("setValue",districtnameval);  //填充行政区划

        /*打印*/
        /*local.find('[opt=print]').click(function () {
            local.find('table').jqprint();
        });*/

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
                    //params.workunit = encodeURI(local.find('[name=workunit]').val());
                    //params.disituation = encodeURI(local.find('[name=disituation]').val());
                    //params.stopdate = encodeURI(local.find('[name=stopdate]').val());
                    //params.bankaccount = encodeURI(local.find('[name=bankaccount]').val());
                    //params.holder = encodeURI(local.find('[name=holder]').val());
                    params.armycode = encodeURI(local.find('[name=armycode]').val());
                    //params.certificateid = encodeURI(local.find('[name=certificateid]').val());
                    params.community = encodeURI(local.find('[name=community]').val());
                    params.communityopinion = encodeURI(local.find('[name=communityopinion]').val());
                    params.streeter = encodeURI(local.find('[name=streeter]').val());
                    params.streetreview = encodeURI(local.find('[name=streetreview]').val());
                    params.county = encodeURI(local.find('[name=county]').val());
                    params.countyaudit = encodeURI(local.find('[name=countyaudit]').val());
                    //params.preparer = encodeURI(local.find('[name=preparer]').val());
                    //params.filenumber = encodeURI(local.find('[name=filenumber]').val());
                    params.districtid = encodeURI(local.find('[name=districtid]').val());
                    params.photo = encodeURI(local.find('[name=photo]').val());
                    //params.deadcertificate = encodeURI(local.find('[name=deadcertificate]').val());
                    params.honor = encodeURI(local.find('[name=honor]').val());
                    //params.familyname = encodeURI(local.find('[name=familyname]').val());
                    params.familyphone = encodeURI(local.find('[name=familyphone]').val());
                    params.familyaddress = encodeURI(local.find('[name=familyaddress]').val());
                    params.familyunit = encodeURI(local.find('[name=familyunit]').val());
                    params.armyphone = encodeURI(local.find('[name=armyphone]').val());
                    //params.trainarea = encodeURI(local.find('[name=trainarea]').val());
                    params.position = encodeURI(local.find('[name=position]').val());
                    params.party = encodeURI(local.find('[name=party]').val());
                    params.culture = encodeURI(local.find('[name=culture]').val());
                    params.troop = encodeURI(local.find('[name=troop]').val());
                    params.fname = encodeURI(local.find('[name=fname]').val());
                    params.fidentityid = encodeURI(local.find('[name=fidentityid]').val());
                    params.mname = encodeURI(local.find('[name=mname]').val());
                    params.midentityid = encodeURI(local.find('[name=midentityid]').val());
                    params.photo = encodeURI(local.find('[name=photo]').val());
                    if (!isValid) {
                        layer.closeAll('loading');
                    }
                    if(!isNaN(local.find("[opt=districtid]").combotree("getValue"))){          //是否是数字
                        params.districtid = local.find("[opt=districtid]").combotree("getValue");
                    }else{
                        params.districtid = record.districtid;
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

        local.find('[opt=report]').click(function(){
            var districtid='';
            if(!isNaN(local.find("[opt=districtid]").combotree("getValue"))){          //是否是数字
                districtid = local.find("[opt=districtid]").combotree("getValue");
            }else{
                districtid = record.districtid;
            }
            cj.reportFunc(local,option,districtid,'100',record.sc_id);
        });

    }

    var auditClick = function (local,option,record,issuccess) {
        var streetreview = local.find('[name=streetreview]').val();
        var streeter = local.find('[name=streeter]').val();
        var reviewdate = local.find('[opt=reviewdate]').datebox('getValue');
        var msg = [];
        streetreview.trim().length <=0 ? msg.push('街道审核意见'):null;
        streeter.trim().length <=0 ? msg.push('街道审核人'):null;
        reviewdate.trim().length <=0 ? msg.push('街道审核日期'):null;
        if(streetreview.trim().length <=0 || streeter.trim().length <=0 || reviewdate.trim().length <=0){
            layer.alert('请填写['+msg+']', {title:'温馨提示',icon: 6});
            local.find('[name=streetreview]').focus();
        }else{
            var $this = $(this);
            $this.attr("disabled",true);//按钮禁用
            local.find('form').form('submit', {
                url: 'hyshy/auditsoilder',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
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
                    //params.workunit = encodeURI(local.find('[name=workunit]').val());
                    //params.disituation = encodeURI(local.find('[name=disituation]').val());
                    //params.stopdate = encodeURI(local.find('[name=stopdate]').val());
                    //params.bankaccount = encodeURI(local.find('[name=bankaccount]').val());
                    //params.holder = encodeURI(local.find('[name=holder]').val());
                    params.armycode = encodeURI(local.find('[name=armycode]').val());
                    //params.certificateid = encodeURI(local.find('[name=certificateid]').val());
                    params.community = encodeURI(local.find('[name=community]').val());
                    params.communityopinion = encodeURI(local.find('[name=communityopinion]').val());
                    params.streeter = encodeURI(local.find('[name=streeter]').val());
                    params.streetreview = encodeURI(local.find('[name=streetreview]').val());
                    params.county = encodeURI(local.find('[name=county]').val());
                    params.countyaudit = encodeURI(local.find('[name=countyaudit]').val());
                    //params.preparer = encodeURI(local.find('[name=preparer]').val());
                    //params.filenumber = encodeURI(local.find('[name=filenumber]').val());
                    params.districtid = encodeURI(local.find('[name=districtid]').val());
                    params.photo = encodeURI(local.find('[name=photo]').val());
                    //params.deadcertificate = encodeURI(local.find('[name=deadcertificate]').val());
                    params.honor = encodeURI(local.find('[name=honor]').val());
                    //params.familyname = encodeURI(local.find('[name=familyname]').val());
                    params.familyphone = encodeURI(local.find('[name=familyphone]').val());
                    params.familyaddress = encodeURI(local.find('[name=familyaddress]').val());
                    params.familyunit = encodeURI(local.find('[name=familyunit]').val());
                    params.armyphone = encodeURI(local.find('[name=armyphone]').val());
                    //params.trainarea = encodeURI(local.find('[name=trainarea]').val());
                    params.position = encodeURI(local.find('[name=position]').val());
                    params.party = encodeURI(local.find('[name=party]').val());
                    params.culture = encodeURI(local.find('[name=culture]').val());
                    params.troop = encodeURI(local.find('[name=troop]').val());
                    params.fname = encodeURI(local.find('[name=fname]').val());
                    params.fidentityid = encodeURI(local.find('[name=fidentityid]').val());
                    params.mname = encodeURI(local.find('[name=mname]').val());
                    params.midentityid = encodeURI(local.find('[name=midentityid]').val());
                    if (!isValid) {
                        layer.closeAll('loading');
                        $this.attr("disabled",false);//按钮启用
                    }
                    params.sc_id = record.sc_id;
                    params.ishandle = record.ishandle;
                    params.issuccess = issuccess;
                    return isValid;
                },
                success: function (data) {
                    layer.closeAll('loading');
                    $this.attr("disabled",false);//按钮启用
                    if (data == "true") {
                        cj.showSuccess('审核完成');
                        option.queryParams.refresh();
                        layer.close(option.index);
                    } else {
                        cj.showFail('审核失败');
                    }
                }
            })
        }
    }
    /*审核*/
    var auditFunc = function (local,option) {
        var li = '<li><input type="button" value="同意" class="btns" opt="agreed"></li>&nbsp;'+
            '<li><input type="button" value="退回" class="btns" opt="back"></li>';
        addToolBar(local,option,li);

        shieldingSP(local);

        var record = option.queryParams.record; //主表信息
        local.find('form').form('load',record);//主表数据填充
        var imgurl;
        record.photo == null ? imgurl = 'images/noperson.gif' : imgurl = record.photo;
        var imghtm = '<img style="width:150px;height:120px;" src="../photofile/'+imgurl+'" />';//图片填充
        local.find('[opt=personimg]').html(imghtm);

        var districtnameval = cj.getDivisionTotalname(record.districtid);
        local.find('[opt=districtid]').combotree("setValue",districtnameval);  //填充行政区划

        /*审核*/
        local.find('[opt=agreed]').click(function () {
            auditClick(local,option,record,'1');
        });

        /*退回*/
        local.find('[opt=back]').click(function () {
            auditClick(local,option,record,'0');
        })
    };

    var approveClick = function (local,option,record,issuccess) {
        var streetreview = local.find('[name=countyaudit]').val();
        var streeter = local.find('[name=county]').val();
        var reviewdate = local.find('[opt=auditdate]').datebox('getValue');
        var msg = [];
        streetreview.trim().length <=0 ? msg.push('民政局审批意见'):null;
        streeter.trim().length <=0 ? msg.push('民政局审核人'):null;
        reviewdate.trim().length <=0 ? msg.push('民政局审核日期'):null;
        if(streetreview.trim().length <=0 || streeter.trim().length <=0 || reviewdate.trim().length <=0){
            layer.alert('请填写['+msg+']', {title:'温馨提示',icon: 6});
            local.find('[name=countyaudit]').focus();
        }else{
            var $this = $(this);
            $this.attr("disabled",true);//按钮禁用
            local.find('form').form('submit', {
                url: 'hyshy/auditsoilder',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
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
                    //params.workunit = encodeURI(local.find('[name=workunit]').val());
                    //params.disituation = encodeURI(local.find('[name=disituation]').val());
                    //params.stopdate = encodeURI(local.find('[name=stopdate]').val());
                    //params.bankaccount = encodeURI(local.find('[name=bankaccount]').val());
                    //params.holder = encodeURI(local.find('[name=holder]').val());
                    params.armycode = encodeURI(local.find('[name=armycode]').val());
                    //params.certificateid = encodeURI(local.find('[name=certificateid]').val());
                    params.community = encodeURI(local.find('[name=community]').val());
                    params.communityopinion = encodeURI(local.find('[name=communityopinion]').val());
                    params.streeter = encodeURI(local.find('[name=streeter]').val());
                    params.streetreview = encodeURI(local.find('[name=streetreview]').val());
                    params.county = encodeURI(local.find('[name=county]').val());
                    params.countyaudit = encodeURI(local.find('[name=countyaudit]').val());
                    //params.preparer = encodeURI(local.find('[name=preparer]').val());
                    //params.filenumber = encodeURI(local.find('[name=filenumber]').val());
                    params.districtid = encodeURI(local.find('[name=districtid]').val());
                    params.photo = encodeURI(local.find('[name=photo]').val());
                    //params.deadcertificate = encodeURI(local.find('[name=deadcertificate]').val());
                    params.honor = encodeURI(local.find('[name=honor]').val());
                    //params.familyname = encodeURI(local.find('[name=familyname]').val());
                    params.familyphone = encodeURI(local.find('[name=familyphone]').val());
                    params.familyaddress = encodeURI(local.find('[name=familyaddress]').val());
                    params.familyunit = encodeURI(local.find('[name=familyunit]').val());
                    params.armyphone = encodeURI(local.find('[name=armyphone]').val());
                    //params.trainarea = encodeURI(local.find('[name=trainarea]').val());
                    params.position = encodeURI(local.find('[name=position]').val());
                    params.party = encodeURI(local.find('[name=party]').val());
                    params.culture = encodeURI(local.find('[name=culture]').val());
                    params.troop = encodeURI(local.find('[name=troop]').val());
                    params.fname = encodeURI(local.find('[name=fname]').val());
                    params.fidentityid = encodeURI(local.find('[name=fidentityid]').val());
                    params.mname = encodeURI(local.find('[name=mname]').val());
                    params.midentityid = encodeURI(local.find('[name=midentityid]').val());
                    if (!isValid) {
                        layer.closeAll('loading');
                        $this.attr("disabled",false);//按钮启用
                    }
                    params.sc_id = record.sc_id;
                    params.ishandle = record.ishandle;
                    params.issuccess = issuccess;
                    return isValid;
                },
                success: function (data) {
                    layer.closeAll('loading');
                    $this.attr("disabled",false);//按钮启用
                    if (data == "true") {
                        cj.showSuccess('审批完成');
                        option.queryParams.refresh();
                        layer.close(option.index);
                    } else {
                        cj.showFail('审批失败');
                    }
                }
            })
        }
    }
    /*审批*/
    var approveFunc = function (local,option) {
        var li = '<li><input type="button" value="同意" class="btns" opt="agreed"></li>&nbsp;'+
            '<li><input type="button" value="退回" class="btns" opt="back"></li>';
        addToolBar(local,option,li);

        var record = option.queryParams.record; //主表信息
        local.find('form').form('load',record);//主表数据填充
        var imgurl;
        record.photo == null ? imgurl = 'images/noperson.gif' : imgurl = record.photo;
        var imghtm = '<img style="width:150px;height:120px;" src="../photofile/'+imgurl+'" />';//图片填充
        local.find('[opt=personimg]').html(imghtm);

        var districtnameval = cj.getDivisionTotalname(record.districtid);
        local.find('[opt=districtid]').combotree("setValue",districtnameval);  //填充行政区划

        /*审批*/
        local.find('[opt=agreed]').click(function () {
            approveClick(local,option,record,'1');
        });

        /*退回*/
        local.find('[opt=back]').click(function () {
            approveClick(local,option,record,'0');
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