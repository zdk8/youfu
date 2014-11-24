define(function(){
    var render = function(local,option){
        local.find('[opt=addylxg]').click(function(){
            require(['commonfuncs/popwin/win','text!views/pension/YangLaoXGDlg.htm','views/pension/YangLaoXGDlg'],
                function(win,htmfile,jsfile){
                    win.render({
                        title:'添加星光老年之家机构',
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