define(function(){
    function render(local,option){
        var divisiontree = local.find('[opt=districtid]'); //行政区划id
        var districtname = local.find('[opt=districtname]'); //行政区划id
        districtname.hide();
        getdivision(divisiontree,districtname);                                 //加载行政区划
        var rzrydlg = local.find('[opt=rzrydlg]');      //表单
        var determine = option.submitbtn                //确定按钮
        var actiontype = option.actiontype;             //操作方式

        /*if(actiontype == "update"){                     //编辑
//            rzrydlg.form('load', {departname:option.data.departname});  //填充
            determinefunc({determine:determine,rzrydlg:rzrydlg,actiontype:actiontype,option:option})
        }else if(actiontype == "add"){                  //新增
            determinefunc({determine:determine,rzrydlg:rzrydlg,actiontype:actiontype,option:option})
        }*/
        if(actiontype == "addrzry"){                     //添加入住人员
            rzrydlg.form('load', {departname:option.data.departname,dep_id:option.data.dep_id});  //填充机构名称、机构id
            determinefunc({determine:determine,rzrydlg:rzrydlg,actiontype:actiontype,option:option})
        }

        /*取消*/
        local.find('[opt=cancle]').click(function(){
            option.parent.trigger('close');
        })
        /*根据身份证获取基本信息*/
        local.find("[name=identityid]").change(function(){
            var val = local.find("[name=identityid]").val();
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
            if(birthdayValue == "" || birthdayValue == null){
                alert("请输入正确的身份证!")
            }else{
                /*根据身份证从老年人表中带出老年人信息*/
                $.ajax({
                    url:'pension/checkidentityid',
                    type:'post',
                    data:{
                        identityid:local.find("[name=identityid]").val()
                    },
                    success:function(data){
                        if(data.message){
                            console.log(data.opdate[0])
                            rzrydlg.form('load', data.opdate[0]);  //填充
                        }
                    },
                    dataType:'json'
                })
            }
        });
    }


    /*确定按钮*/
    var determinefunc = function(params){
        params.determine.click(function(e){
            if(params.actiontype == "addrzry"){         //新增入住人员
                params.rzrydlg.form('submit',{
                    url:'pension/addoldpeopledepart',
                    onSubmit: function (param) {
                        var flag = $(this).form('validate');
                        if (flag) {
                            param.deptype = params.option.data.deptype
                            param.dep_id = params.option.data.dep_id
                            param.departname = params.option.data.departname
                            showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                        }
                        return flag
                    },
                    success:function(data){
                        showProcess(false);
                        if(data == "true"){
                            cj.slideShow('成功添加入住人员');
                            params.option.parent.trigger('close');
//                            params.option.refresh.trigger('click'); //刷新
                        }else{
                            cj.slideShow('添加失败！老人已入住');
                        }
                    },
                    onLoadError: function () {
                        showProcess(false);
                        cj.slideShow('温馨提示', '由于网络或服务器太忙，提交失败，请重试！');
                    }
                });
            }else if(params.actiontype == "update"){     //修改
                params.rzrydlg.form('submit',{
                    url:'pension/updatedepartmentbyid',
                    success:function(data){
                        var data = eval('(' + data + ')');
                        if(data.success){
                            cj.slideShow("修改成功！")
                            params.option.parent.trigger('close');
                            params.option.refresh.trigger('click'); //刷新
                        }else{
                            cj.slideShow("修改失败！")
                        }
                    }
                });
            }
        });
    }

    return {
        render:render
    }

})