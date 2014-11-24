define(function(){
    var render = function(local,option){
        /*var yljggl = local.find('[opt=yljggl]');        //养老机构管理
        yljggl.bind('click',function(){
            require(['text!views/pension/YangLaoJGgl.htm','views/pension/YangLaoJGgl'],function(htmfile,jsfile){
                local.find('[opt=ylcenter]').append(htmfile)
            })

        });*/


        local.find('[opt=addyljg]').click(function(){
            /*local.find('[opt=addjg]').dialog({
                title: '添加养老机构',
                width: 400,
                height: 400,
                closed: false,
                cache: false,
                href: 'YangLaoJGDlg',
                modal: true
            });*/
            require(['commonfuncs/popwin/win','text!views/pension/YangLaoJGDlg.htm','views/pension/YangLaoJGDlg'],
                function(win,htmfile,jsfile){
                    win.render({
                        title:'添加养老机构',
                        width:350,
                        height:200,
                        html:htmfile,
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