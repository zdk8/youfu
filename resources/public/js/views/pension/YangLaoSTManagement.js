define(function(){
    var render = function(local,option){
        local.find('[opt=addylst]').click(function(){
            require(['commonfuncs/popwin/win','text!views/pension/YangLaoSTDlg.htm','views/pension/YangLaoSTDlg'],
                function(win,htmfile,jsfile){
                    win.render({
                        title:'添加老年人食堂',
                        width:350,
                        height:385,
                        html:htmfile,
                        /*buttons:[
                            {text:'取消',handler:function(html,parent){
                                parent.trigger('close');
                            }},
                            {text:'保存',handler:function(html,parent){ }}
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