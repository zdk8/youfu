define(function(){
    var filepath='followup/BloodSugar';
    var add=function(){
        cj.showContent({
            title:'AddBloodSugar',
            htmfile:'text!views/followup/BloodSugar.htm',
            jsfile:'views/followup/BloodSugar'
        })
    }
    var update=function(option,row){
        cj.showContent({
            act:'u',
            title:'修改222',
            htmfile:'text!views/followup/BloodSugar.htm',
            jsfile:'views/followup/BloodSugar',
            queryParams:{
                sys_bfinfosid: row.sys_bfinfosid
            }
        })
    }
    var logout=function(option,row,local){
        cj.question(
            "您准备要注销信息",
            function(){
                $.ajax({
                    url:cj.getUrl(filepath,'d'),
                    type:'post',
                    data:{
                        sys_bfinfosid:row.sys_bfinfosid
                    },
                    success:function(res){
                        local.find('.easyui-datagrid-noauto').datagrid('reload');
                    }
                })
            }
        )
    }
    var a={
        render:function(local,option){
            var localDataGrid=
                local.find('.easyui-datagrid-noauto').datagrid({
                    url:cj.getUrl(filepath,'mr'),
                    queryParams: {
                        intelligentsp:null
                    },

                    onLoadSuccess:function(data){
                        var updatebtns=local.find('[action=update]');
                        var logoutbtns=local.find('[action=logout]');
                        var btns_arr=[updatebtns,logoutbtns];
                        var rows=data.rows;
                        for(var i=0;i<rows.length;i++){
                            for(var j=0;j<btns_arr.length;j++){

                                (function(index){
                                    var record=rows[index];
                                    $(btns_arr[j][i]).click(function(){

                                        if($(this).attr("action")=='logout'){
                                            logout(option,record,local)
                                        }else if($(this).attr("action")=='update'){
                                            update(option,record)
                                        }
                                    });

                                })(i);
                            }
                        }
                    },
                    striped:true,
                    toolbar:local.find('div[tb]')
                })

            $('div[tb] [action=add]').bind('click',add);
            require(['commonfuncs/searchKeyWord'],function(js){
                js.bindEvent(local,localDataGrid,['sys_micard'])
            })
            local.find('a[action=intelligentsearch]').bind('click',function(){
                require(['commonfuncs/intelligentsearch'],function(intelligent){
                    intelligent.pop({
                        local:local,
                        width:500,
                        height:250,
                        htmfile:intelligent.htms['BloodSugar'],
                        getIntelligentsp:(function(){
                            return function(param){
                                localDataGrid.datagrid('load',param);
                            }
                        })()
                    })
                })
            })

        }

    }

    return a;
})