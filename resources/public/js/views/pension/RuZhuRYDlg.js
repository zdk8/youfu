define(function(){
    function render(local,option){
        var rzrydlg = local.find('[opt=rzrydlg]');      //表单
        var determine = local.find('[opt=determine]');      //确定按钮
        var actiontype = option.actiontype;             //操作方式

        /*if(actiontype == "update"){                     //编辑
//            rzrydlg.form('load', {departname:option.data.departname});  //填充
            determinefunc({determine:determine,rzrydlg:rzrydlg,actiontype:actiontype,option:option})
        }else if(actiontype == "add"){                  //新增
            determinefunc({determine:determine,rzrydlg:rzrydlg,actiontype:actiontype,option:option})
        }*/
        if(actiontype == "addrzry"){                     //添加入住人员
            rzrydlg.form('load', {departname:option.data.departname});  //填充机构名称
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
        params.determine.click(function(){
            if(params.actiontype == "addrzry"){         //新增入住人员
                params.rzrydlg.form('submit',{
                    url:'pension/addoldpeopledepart',
                    dataType:"json",
                    success:function(data){
                        var data = eval('(' + data + ')');
                        if(data.success){
                            alert("添加成功！");
                            params.option.parent.trigger('close');
                            params.option.refresh.trigger('click'); //刷新
                        }else{
                            alert("添加失败！")
                        }
                    }
                });
            }else if(params.actiontype == "update"){     //修改
                params.rzrydlg.form('submit',{
                    url:'pension/updatedepartmentbyid',
                    dataType:"json",
                    success:function(data){
                        var data = eval('(' + data + ')');
                        if(data.success){
                            alert("修改成功！");
                            params.option.parent.trigger('close');
                            params.option.refresh.trigger('click'); //刷新
                        }else{
                            alert("修改失败！")
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