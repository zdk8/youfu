define(function(){
    var render = function(local,option){
        local.find('[opt=addrzry]').click(function(){
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
                        title:'添加入住人员',
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