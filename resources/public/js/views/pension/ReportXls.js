define(function(){
    function render(local,option){
        var ppgrantmoneyissue = local.find("[opt=ppgrantmoneyissue]");
        ppgrantmoneyissue.datagrid({
            url:'audit/getcompleteqop',
            onLoadSuccess:function(data){
                var resendbtn=local.find('[action=resend]');
                var btns_arr=[resendbtn];
                var rows=data.rows;
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                if($(this).attr("action")=='resend'){
                                    $.messager.confirm('是否重发',
                                        '<label style="color: darkgray">姓名 :'+record.name+'<br>业务期 :'+record.bsnyue+'</label>',
                                        function(r){
                                            if (r){
                                                $.ajax({
                                                    url:"audit/resendmoney",
                                                    data:{
                                                        doleid:record.doleid,
                                                        bsnyue:""
                                                    },
                                                    type:"post",
                                                    dataType:"json",
                                                    success:function(data){
                                                        if(data){
                                                            cj.slideShow('重发成功!')
                                                            ppgrantmoneyissue.datagrid('reload')
                                                        }else{
                                                            cj.slideShow('<label style="color: red">重发失败!</label>')
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    );
                                }
                            });
                        })(i);
                    }
                }
            },
            toolbar:local.find('div[tb]')
        });
    }


    return {
        render:render
    }

})