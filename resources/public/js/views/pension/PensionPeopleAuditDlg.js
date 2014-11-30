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
        var determine = local.find('[opt=determine]');      //确定按钮
        ppauditdlg.form('load', {aulevel:approvalProcess[option.data.aulevel]});
        /*取消*/
        local.find('[opt=cancle]').click(function(){
            option.parent.trigger('close');
        })
        determineFunc(local);       //确定

    }

    /*确定方法*/
    var determineFunc = function(local){
        local.find('[opt=determine]').click(function(){
            /*for(var i=0;i<$('[name=flag]').length;i++){
                if($('[name=flag]')[i].checked){
                    var intHot = $('[name=flag]').val();
                }
            }*/
            local.find('[opt=ppauditdlg]').form('submit',{
                url:'qqqqqqq',
                dataType:"json",
                success:function(data){
                    var data = eval('(' + data + ')');
                    if(data.success){
                        alert("添加成功！");
//                        params.option.parent.trigger('close');
//                        params.option.refresh.trigger('click'); //刷新
                    }else{
                        alert("添加失败！")
                    }
                }
            });
        })
    }

    return {
        render:render
    }

})