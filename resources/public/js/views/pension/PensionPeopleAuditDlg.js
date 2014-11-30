define(function(){
    function render(local,option){
       /* radios = local.find('[name=flag]')
        for(var i=0;i<radios.length;i++)
        {
            radios[i].onclick=function(){
//                console.log(radios[i])

                alert("id:"+this.id+" is checked?"+this.checked);
                document.getElementById("opinion").style.display=""
//                local.find('[opt=opinion]')
            }
        }*/
        var ppauditdlg = local.find('[opt=ppauditdlg]');      //表单
        var determine = option.submitbtn;                   //确定按钮
        ppauditdlg.form('load', {auuser:option.data.loginuser,bstime:myformatter(new Date())});
        /*取消*/
        local.find('[opt=cancle]').click(function(){
            option.parent.trigger('close');
        })
        determineFunc({determine:determine,ppauditdlg:ppauditdlg,data:option.data,option:option});       //确定

    }

    /*确定方法*/
    var determineFunc = function(params){
        params.determine.click(function(){
            params.ppauditdlg.form('submit',{
                url:'pension/auditfunction',
                onSubmit: function(param){
                    param.aulevel = params.data.aulevel;
                    param.bstablepk = params.data.lr_id;
                    param.bstablename = "t_oldpeople";
                    param.operators = params.data.operators;
                },
                dataType:"json",
                success:function(data){
                    var data = eval('(' + data + ')');
                    if(data.success){
                        alert("处理完成！");
                        params.option.parent.trigger('close');
                        params.option.refresh.datagrid("reload"); //刷新
                    }else{
                        alert("处理失败！")
                    }
                }
            });
        })
    }

    return {
        render:render
    }

})