/**
 * Created by Administrator on 2014/9/24.
 */
define(function(){

    var filepath='dmxt/DanWei';

    var add=function(option,row){
        cj.showContent({
            htmfile:'text!views/pensionweb/Machine.htm',
            jsfile:'views/pensionweb/Machine',
            title:'addMachine'
        })
    }
    var update=function(option,row){
        cj.showContent({
            act:'u',
            title:'修改Machine',
            htmfile:'text!views/pensionweb/Machine.htm',
            jsfile:'views/pensionweb/Machine',
            queryParams:{
                sys_mequipmentid: row.sys_mequipmentid
            }
        })
    }
    var dodelete=function(option,row,local){
        cj.question(
            "您准备要注销",
            function(){
                $.ajax({
                    url:cj.getUrl(filepath,'d'),
                    type:'post',
                    data:{sys_mequipmentid:row.sys_mequipmentid},
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
                    striped:true,
                    onLoadSuccess:function(data){
                        var updatebtns=local.find('[action=update]');
                        var deletebtns=local.find('[action=delete]');
                        var btns_arr=[updatebtns,deletebtns];
                        var rows=data.rows;
                        for(var i=0;i<rows.length;i++){
                            for(var j=0;j<btns_arr.length;j++){
                                (function(index){
                                    var record=rows[index];
                                    $(btns_arr[j][i]).click(function(){

                                        if($(this).attr("action")=='update'){
                                            update(option,record)
                                        }else if($(this).attr("action")=='delete'){
                                            dodelete(option,record,local)
                                        }
                                    });

                                })(i);
                            }
                        }
                    },
                    toolbar:local.find('div[tb]')
                })


            local.find('div[tb] a[action=add]').bind('click',add);
            require(['commonfuncs/searchKeyWord'],function(js){
                js.bindEvent(local,localDataGrid,['sys_mequipmentid'])
            })
            local.find('a[action=intelligentsearch]').bind('click',function(){
                require(['commonfuncs/intelligentsearch'],function(intelligent){
                    intelligent.pop({
                        local:local,
                        width:500,
                        height:250,
                        htmfile:intelligent.htms['Machine'],
                        getIntelligentsp:(function(){
                            return function(param){
                                localDataGrid.datagrid('load',param);
                            }
                        })()
                    })
                })
            })

            local.find('a[action=testpopwin]').bind('click',function(){
                require(['commonfuncs/popwin/win','text!views/dmxt/DanWei2.htm','views/dmxt/DanWei'],function(win,htmfile,jsfile){
                    win.render({
                        title:'测试弹出层功能',
                        width:1024,
                        html:$(htmfile).eq(0),
                        buttons:[
                            {text:'取消',handler:function(html,parent){
                                parent.trigger('close');
                            }},
                            {text:'保存',handler:function(html,parent){ }}
                        ],
                        renderHtml:function(local,submitbtn,parent){
                            jsfile.render(local,{
                                submitbtn:submitbtn,
                                act:'c',
                                parent:parent,
                                onCreateSuccess:function(data){
                                    parent.trigger('close');
                                    localDataGrid.datagrid('reload');
                                }
                            })
                        }
                    })
                })
            })

        }

    }

    return a;
})