define(function(){
    function myformatter(date){
        var y = date.getFullYear();
        var m = date.getMonth()+1;
        var d = date.getDate();
        return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
    }
    function myparser(s){
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


    function mybirthdate(val){
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

        return {
            sex: sex,
            birthdayValue: birthdayValue,
            age: age,
            sexcode: sexcode
        }

    }



    function render(local,option){
        var obj={};

        var toolBarHeight=30;

        var toolBar=cj.getFormToolBar([
            {text: '处理',hidden:'hidden',opt:'dealwith'},
            {text: '修改',hidden:'hidden',opt:'update'},
            {text: '删除',hidden:'hidden',opt:'delete'},
            {text: '保存',hidden:'hidden',opt:'save'},
            {text: '操作日志',hidden:'hidden',opt:'log'}
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });




        var districtid = local.find('[opt=districtid]');      //行政区划
        getdivision(districtid);                                          //加载行政区划
        var pensionform = local.find('[opt=pensionform]');      //老人信息主表
        var familymembersgrid = local.find('[opt=familymembersgrid]');      //老人信息子表
        var dealwith = toolBar.find('[opt=dealwith]');            //处理按钮
        //showProcess(true, '温馨提示', '数据处理中，请稍后...');   //进度框加载

        /*加载老年人子表信息*/
        function famillylist(lr_id){
            $.post(
                'get-oldsocrel',
                {
                    lr_id:lr_id
                },
                function(data){
                    alert('加载老年人子表信息:' + lr_id);
                    var addflag = 0;
                    if(data.length >0){
                        for(i=0;i<data.length;i++){
                            familymembersgrid.datagrid('appendRow', {name: "", relationship: ""});
                            var editIndex = familymembersgrid.datagrid('getRows').length-1;
                            familymembersgrid.datagrid('selectRow', editIndex)
                                .datagrid('beginEdit', editIndex);
                            addflag+=1;
                        }
                    }
                    if(addflag > 0){
                        for(d=0;d<data.length;d++){
                            obj = data[d];
                            for(var key in obj){
                                var value = obj[key];
                                var data1 =  familymembersgrid.datagrid('getEditor',{index:d,field:key});
                                if(data1.type == "combobox"){
                                    $(data1.target).combobox("setValue",value);
                                }else{
                                    $(data1.target).val(value);
                                }
                            }
                        }
                    }
                });
        }


        if(option.queryParams && option.queryParams.actiontype == "info"){            //处理
            dealwith.show();                                        //显示处理按钮
            local.find('[opt=newfamilymemeradd_btn]').hide()   //隐藏子表新增按钮
            local.find('[opt=delfamilymemer_btn]').hide()      //隐藏子表删除按钮
            for(var i=0;i<pensionform[0].length;i++){             //禁用表单
                var element = pensionform[0].elements[i];
                element.disabled = true
            }
            disabledForm(local);                                //禁用easyui框
            $.ajax({
                url:"searchid",                                //查询老人表
                data:{
                    id:option.queryParams.data.lr_id
                },
                type:"post",
                dataType:"json",
                success:function(data){
                    pensionform.form('load',data)        //填充主表
                    //famillylist(option.queryParams.data.lr_id)     //填充子表
                    dealwithFunc({dealwith:dealwith,data:option.queryParams.data,refresh:option.queryParams.refresh}) //数据处理
                    showProcess(false);
                }
            })
        }else{

            var queryflag = 0;   //存放查询出的家庭成员数据条数
            var flag = 0; //记录数据条数
            /*家庭成员列表添加*/
            $("#newfamilymemeraddid").click(function(){
                flag +=1;
                $("#familymembersgrid1").datagrid('appendRow', {name: "", relationship: ""});
                var editIndex = $("#familymembersgrid1").datagrid('getRows').length-1;
                $("#familymembersgrid1").datagrid('selectRow', editIndex)
                    .datagrid('beginEdit', editIndex);
            });
            /*家庭成员列表删除*/
            $("#delfamilymemerid").click(function(){
                flag -=1;
                var selectrow= $("#familymembersgrid1").datagrid('getSelected');
                var index=$("#familymembersgrid1").datagrid('getRowIndex',selectrow);
                //删除家庭成员表
                var datach  =  $("#familymembersgrid1").datagrid('getEditor',{index:index,field:'lrgx_id'});
                var lrgxid = $(datach.target).val();
                if(lrgxid != ""){
                    $.post(
                        'dele-oldsorel',
                        {
                            lrgx_id:lrgxid
                        },
                        function(data){
                            console.log(data)
                        }
                    )
                    flag+=1;
                }
                //删除显示在界面上的行
                $("#familymembersgrid1").datagrid('deleteRow', index);
                queryflag-=1;
            });
            /*加载地区树*/
            var divisiontree = local.find('[opt=divisiontree]') ;
            divisiontree.combotree({
                url:'get-divisionlist?dvhigh=330424',
                method: 'get',
                onBeforeExpand: function (node) {
                    divisiontree.combotree("tree").tree("options").url
                        ="get-divisionlist?dvhigh=" + node.parentid;
                },
                onHidePanel: function () {
                    divisiontree.combotree('setValue',
                        divisiontree.combotree('tree').tree('getSelected').divisionpath);
                }
            });
            /*根据身份证获取基本信息*/
            $("#identityid").change(function(){
                var myobj=mybirthdate($(this).val());
                $('#birthd').datebox('setValue',myobj.birthdayValue) ;
                $('#gender').combobox('setValue',myobj.sexcode) ;
                $('#age').val(myobj.age);
            });


            $(document).ready(function(){

                $("#operator_date").datebox("setValue",myformatter(new Date())); //填充当前时间
                /*填充表单*/
                for(var key in obj ){
                    var name = key;
                    var value = obj[key];
                    if($("#"+name).hasClass("easyui-combobox"))
                        $("#"+name).combobox("setValue",value);
                    else if($("#"+name).hasClass("easyui-datebox"))
                        $("#"+name).datebox("setValue", value);
                    else if($("#"+name).hasClass("easyui-combotree")){
                        $("#"+name).combotree("setValue", value);
                    }else if(value){
                        $("[name = "+name+"]:checkbox").click();
                        $("#"+name).val(value);
                    }
                }

                var status = $("#status").val();
                /*修改操作*/
                local.find('[opt=update]').click(function(){
                    $('#ff').form({
                        success:function(){
                            alert("操作成功！");
                            //修改家庭成员信息
                            editFimalyCel();
                            var str = $("#name").val();
                            var jq = top.jQuery;
                            jq('#tabs').tabs('close', str+'详细信息');
                        }
                    });
                    if (status == "自由"|| status == "驳回"){
                        var returnVal = window.confirm("是否修改？", "标题");
                        if(returnVal){
                            $("form").submit();
                        }
                    }else
                        alert("该信息还在审核中，不能修改！");
                });
                if (status == "驳回")
                    $("#delete").show();
                /*删除操作*/
                $("[opt=delete]").click(function(){
                    $('#ff').form({
                        success:function(){
                            alert("操作成功！");
                            var str = $("#name").val();
                            var jq = top.jQuery;
                            jq('#tabs').tabs('close', str+'详细信息');
                        }
                    });
                    var id = $("#lr_id").val();
                    alert("id:"+id);
                    var returnVal = window.confirm("是否删除？", "标题");
                    if(returnVal){
                        $("form").attr("action","/deleteold");
                        $("form").submit();
                    }
                });

            });





            /*新增家庭成员信息*/
            var familly_key = 0;      //存放家庭成员信息表主键
            $.post(
                'oldsocrelkey',
                function(data){
                    familly_key = parseInt(data);
                }
            );
            function addFimalyCel(addfalg,editflag,func){
                var familrelfields = $("#familymembersgrid1").datagrid("getColumnFields");  //获取全部元素的字段名
                var famildata_all = new Array();   //存放新增数据条
                //若有新增数据
                if(addfalg>0){
                    for(i=0;i<addfalg;i++){
                        var datach = "data"+i;
                        var famildata = new Array();    //存放新增数据
                        for(j=0;j<familrelfields.length;j++){
                            datach  =  $("#familymembersgrid1").datagrid('getEditor',{index:i,field:familrelfields[j]});
                            if(datach.type == "combobox"){
                                famildata.push($(datach.target).combobox('getValue'));
                            }else{
                                famildata.push($(datach.target).val());
                            }
                        }
                        famildata_all.push(famildata);
                    }
                }
                if(editflag > 0){
                    for(i=queryflag;i<editflag+queryflag;i++){
                        var datach = "data"+i;
                        var famildata = new Array();    //存放新增数据
                        for(j=0;j<familrelfields.length;j++){
                            datach  =  $("#familymembersgrid1").datagrid('getEditor',{index:i,field:familrelfields[j]});
                            if(datach.type == "combobox"){
                                famildata.push($(datach.target).combobox('getValue'));
                            }else{
                                famildata.push($(datach.target).val());
                            }
                        }
                        famildata_all.push(famildata);
                    }
                }
                //数据条不为空
                if(famildata_all.length > 0){
                    for(a=0;a<famildata_all.length;a++){
                        var famildata_all_child = famildata_all[a];   //取出每条数据
                        for(b=0;b<famildata_all_child.length;b++){
                            $("#"+familrelfields[b]+"_rel").val(famildata_all_child[b]);  //将值设置到上面定义的div中
                        }
                        //若为修改，则将主表主键取出
                        if(func == "editadd-oldsocrel"){
                            $("#lr_id_rel").val(obj["lr_id"]);
                        }
                        $.post(
                            func,
                            {
                                lrgx_id:familly_key++,
                                lr_id:$("#lr_id_rel").val(),
                                guanx:$("#guanx_rel").val(),
                                gx_name:$("#gx_name_rel").val(),
                                gx_identityid:$("#gx_identityid_rel").val(),
                                gx_gender:$("#gx_gender_rel").val(),
                                gx_birth:$("#gx_birth_rel").val(),
                                gx_telephone:$("#gx_telephone_rel").val(),
                                gx_mobilephone:$("#gx_mobilephone_rel").val(),
                                gx_economy:$("#gx_economy_rel").val(),
                                gx_culture:$("#gx_culture_rel").val(),
                                gx_registration:$("#gx_registration_rel").val(),
                                gx_nation:$("#gx_nation_rel").val(),
                                gx_work:$("#gx_work_rel").val()
                            },
                            function(data){
                                console.log("editadd:"+data)
                            }
                        );
                    }
                }
            }
            /*修改家庭成员信息*/
            function editFimalyCel(){
                console.log("queryflag:"+queryflag);
                console.log("flag:"+flag);

                var familrelfields = $("#familymembersgrid1").datagrid("getColumnFields");  //获取全部元素的字段名
                var famildata_all = new Array();   //存放已有或修改后数据条
                //数据库已有家庭成员数据条数
                if(queryflag>0){
                    for(i=0;i<queryflag;i++){
                        var datach = "data"+i;
                        var famildata = new Array();    //存放已有或修改后数据
                        for(j=0;j<familrelfields.length;j++){
                            datach  =  $("#familymembersgrid1").datagrid('getEditor',{index:i,field:familrelfields[j]});
                            if(datach.type == "combobox"){
                                famildata.push($(datach.target).combobox('getValue'));
                            }else{
                                famildata.push($(datach.target).val());
                            }
                        }
                        famildata_all.push(famildata);
                    }
                }
                //数据条不为空
                if(famildata_all.length > 0){
                    for(a=0;a<famildata_all.length;a++){
                        var famildata_all_child = famildata_all[a];   //取出每条数据
                        for(b=0;b<famildata_all_child.length;b++){
                            $("#"+familrelfields[b]+"_rel").val(famildata_all_child[b]);  //将值设置到上面定义的div中
                        }
                        $.post(
                            'update-oldsorel',
                            {
                                lrgx_id:$("#lrgx_id_rel").val(),
                                lr_id:$("#lr_id_rel").val(),
                                guanx:$("#guanx_rel").val(),
                                gx_name:$("#gx_name_rel").val(),
                                gx_identityid:$("#gx_identityid_rel").val(),
                                gx_gender:$("#gx_gender_rel").val(),
                                gx_birth:$("#gx_birth_rel").val(),
                                gx_telephone:$("#gx_telephone_rel").val(),
                                gx_mobilephone:$("#gx_mobilephone_rel").val(),
                                gx_economy:$("#gx_economy_rel").val(),
                                gx_culture:$("#gx_culture_rel").val(),
                                gx_registration:$("#gx_registration_rel").val(),
                                gx_nation:$("#gx_nation_rel").val(),
                                gx_work:$("#gx_work_rel").val()
                            },
                            function(data){
                                console.log(data)
                                if(data == "true"){
                                    /*$.messager.alert("提示","修改成功!");
                                     }else{
                                     $.messager.alert("提示","修改失败!");
                                     }*/
                                }
                            }
                        );
                    }
                }
                /*若有再次新增的数据则调用新增方法*/
                if(flag > 0){
//            alert("ok")
                    addFimalyCel(0,flag,"editadd-oldsocrel");
                }
            }


            local.find('[opt=save]').show().bind('click',function(){
                local.find('[opt=pensionform]').form('submit', {
                    url:'/saveold',
                    onSubmit: function () {
                        var isValid = $(this).form('validate');
                        cj.slideShow('表单验证结果:' + isValid);
                        return isValid;
                    },
                    success: function (data) {
                        cj.slideShow('操作成功');
                        addFimalyCel(flag, 0, "insert-oldsocrel");
                    }
                });


            });
        }

    }

    var dealwithFunc = function(params){
        params.dealwith.click(function(){
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
                                refresh:params.refresh,
                                data:params.data,
                                parent:parent,
//                                actiontype:'add',       //操作方式
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

    return {
        render:render
    }

})