define(function(){
    var render = function(local,option){
        local.find('[opt=addyljj]').click(function(){
            require(['commonfuncs/popwin/win','text!views/pension/YangLaoJJDlg.htm','views/pension/YangLaoJJDlg'],
                function(win,htmfile,jsfile){
                    win.render({
                        title:'添加养老设施',
                        width:350,
                        height:385,
                        html:htmfile,
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