define(function(){
    var render = function(local,option){
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
            console.log(111)
        })
    }

    return {
        render:render
    }
})