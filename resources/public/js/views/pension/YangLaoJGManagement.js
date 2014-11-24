define(function(){
    var render = function(local,option){
        /*var yljggl = local.find('[opt=yljggl]');        //养老机构管理
        yljggl.bind('click',function(){
            require(['text!views/pension/YangLaoJGgl.htm','views/pension/YangLaoJGgl'],function(htmfile,jsfile){
                local.find('[opt=ylcenter]').append(htmfile)
            })

        });*/


        local.find('[opt=addyljg]').click(function(){
            require(['commonfuncs/popwin/win','text!views/pension/YangLaoJGDlg.htm','views/pension/YangLaoJGDlg'],
                function(win,htmfile,jsfile){
                    win.render({
                        title:'添加养老机构',
                        width:350,
                        height:385,
                        html:htmfile,
                        /*buttons:[
                            {text:'取消',handler:function(html,parent){
                                parent.trigger('close');
                            }},
                            {
                                text:'保存1',
                                handler:function(html,parent){
//                                    local.find(html+'[opt=yljgdlg]')
                                    console.log(local.find(html+'[opt=yljgdlg]'))
                                }
                            }
                        ],*/
                        renderHtml:function(local,submitbtn,parent){
                            jsfile.render(local,{
                                submitbtn:submitbtn,
                                act:'c',
                                parent:parent,
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