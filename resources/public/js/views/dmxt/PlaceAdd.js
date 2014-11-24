/**
 * Created by Administrator on 2014/10/10.
 */

define(function(){
    return {
        render:function(local,option){
            local.find('a').bind('click',function(){
                require(['commonfuncs/popwin/win','text!views/dmxt/PrePlaceAdd.htm','views/dmxt/PrePlaceAdd'],
                    function(win,htmfile,jsfile){
                    win.render({
                        title:'新增地名',
                        width:724,
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
})