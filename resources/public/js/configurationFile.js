approvalProcess=['打回重审','提交未审核','审核未审批','审批通过','保存未提交'];    //流程状态
approvalProcessService=['打回重审','提交未审核','审核未审批','审批通过'];    //流程状态
getGender=['女','男']             //性别
/*日期时间*/
var myformatter = function(date){
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
}
var myparser = function(s){
    if (!s) return new Date();
    var ss = (s.split('-'));
    var y = parseInt(ss[0],10);
    var m = parseInt(ss[1],10);
    var d = parseInt(ss[2],10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
        return new Date(y,m-1,d);
    } else {
        return new Date();
    }
}
/*取当前年月为业务期*/
function formatterYM(date){
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    return y+''+(m<10?('0'+m):m);
}

/*行政区划的树结构*/
var getdivision = function(divisiontree){
    divisiontree.combotree({
        panelHeight:300,
        url:'getdivisiontree',
        method: 'get',
        onLoadSuccess:function(load,data){
            /*if(!this.firstloaded){
             divisiontree.combotree('setValue', data[0].id)
             .combotree('setText', data[0].text);
             this.firstloaded=true;
             }*/
        },
        onBeforeExpand: function (node) {
            divisiontree.combotree("tree").tree("options").url
                = 'getdivisiontree?dvhigh=' + node.id;
        },
        onHidePanel: function () {
            divisiontree.combotree('setValue',
                    divisiontree.combotree('tree').tree('getSelected').id)
                .combobox('setText',
                    divisiontree.combotree('tree').tree('getSelected').totalname);
        }
    });
}
/*获取行政区划全名*/
var getDivistionTotalname = function(districtid){
    var name;
    $.ajax({
        url:"getdistrictname",
        type:"post",
        dataType:"json",
        async:false,
        data:{
            districtid:districtid
        },
        success:function(data){
            if(data.length){
                name = data[0].totalname
            }
        }
    })
    return name
}
/*获取服务机构全名*/
var getServicemgtTotalname = function(jdepid){
    var name;
    $.ajax({
        url:"audit/getjjyldepartbyid",
        type:"post",
        dataType:"json",
        async:false,
        data:{
            jdep_id:jdepid
        },
        success:function(data){
            name = data[0].departname
        }
    })
    return name
}
/*获取服务机构人员全名*/
var getServicepeoplevalTotalname = function(sid){
    var name;
    $.ajax({
        url:"audit/getdepservicebyid",
        type:"post",
        dataType:"json",
        async:false,
        data:{
            s_id:sid
        },
        success:function(data){
            name = data[0].servicername
        }
    })
    return name
}
/*进度框*/
var showProcess = function(isShow, title, msg) {
    if (!isShow) {
        $.messager.progress('close');
        return true;
    }
    var win = $.messager.progress({
        title: title,
        msg: msg
    });
}

/*fieldset的收缩
 * pTableID 表格(table)
 * pFieldSetID 框架(fieldset)
 * pImageID 要显示的图片(image)
 * */
var FieldSetVisual = function(local, pTableID, pFieldSetID, pImageID ){
    var objTable = local.find('[opt='+pTableID+']');
    var objFieldSet = local.find('[opt='+pFieldSetID+']');
    var objImage = local.find('[opt='+pImageID+']')[0];
    var heightTable;
    if(objTable.is(":hidden")){
        heightTable = parseInt( objTable.height())+24 ;
        objTable.show();
        objFieldSet.height(heightTable+"px");
        objImage.src="img/reduction.png" ;        //打开
    }else{
        objTable.hide() ;
        objFieldSet.height("24px");
        objImage.src="img/add.png" ;       //收缩
    }
}
/*根据身份证获取基本信息*/
var getBaseInfoByIdentityid = function(params){
    params.identityid.change(function(){
        var val = params.identityid.val();
        var sex;
        var birthdayValue;
        var age;
        var sexcode;
        if (15 == val.length) { //15位身份证号码
            birthdayValue = val.charAt(6) + val.charAt(7);
            if (parseInt(birthdayValue) < 10) {
                birthdayValue = '20' + birthdayValue;
            }
            else {
                birthdayValue = '19' + birthdayValue;
            }
            age = Date.getFullYear()-parseInt(birthdayValue); //年龄
            birthdayValue = birthdayValue + '-' + val.charAt(8) + val.charAt(9) + '-' + val.charAt(10) + val.charAt(11);
            if (parseInt(val.charAt(14) / 2) * 2 != val.charAt(14)) {
                sex = '男';
                sexcode = '1';
            }
            else{
                sex = '女';
                sexcode = '0';
            }
        }
        if (18 == val.length) { //18位身份证号码
            birthdayValue = val.charAt(6) + val.charAt(7) + val.charAt(8) + val.charAt(9) + '-' + val.charAt(10) + val.charAt(11)
                + '-' + val.charAt(12) + val.charAt(13);
            if (parseInt(val.charAt(16) / 2) * 2 != val.charAt(16)){
                sex = '男';
                sexcode = '1';
            }
            else{
                sex = '女';
                sexcode = '0';
            }
            age =(new Date()).getFullYear()-parseInt((val.charAt(6) + val.charAt(7) + val.charAt(8) + val.charAt(9)));
        }
        params.birthdate.datebox('setValue',birthdayValue) ;
        params.gender.combobox('setValue',sexcode) ;
        if(params.agetype == "span"){
            params.tip_age[0].innerText = age+"岁";
        }else{
            params.age.val(age);
        }
    });
}
/*计算评估总分*/
var calculate=function(local){
    var value=0;
    local.find('table[opt=result1_table] td>:input[class=pingfen]').each(function(){
        value+=Number($(this).val())
    })
    local.find('table[opt=result1_table] :input[name=pinggusum]').val(value)
    local.find(':input[opt=pinggusum]').val(value)
}
/*为radio添加样式*/
var addRadioCssComm = function(local) {
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
    }).prev().hide();     //原来的圆点样式设置为不可见
}