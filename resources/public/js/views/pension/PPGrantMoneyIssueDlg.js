define(function(){
    function render(local,option){
        var ppgrantmoneyissuedlg = local.find('[opt=ppgrantmoneyissuedlg]');
        ppgrantmoneyissuedlg.datagrid({
            url:'audit/getqualifyop',
            queryParams:{
                bsnyue: ""
            },
            onLoadSuccess:function(){},
            toolbar:local.find('div[tb]')
        });
        var bsnyue = local.find('[opt=bsnyue]');        //业务期
        bsnyue.datebox({
            formatter:function(date){
                var y = date.getFullYear();
                var m = date.getMonth()+1;
                return y+''+(m<10?('0'+m):m);
            }
        })
        var name = local.find('[opt=name]');        //姓名
        var identityid = local.find('[opt=identityid]');        //身份证
        bsnyue.datebox('setValue',formatterYM(new Date()))
        //搜索
        local.find('[opt=searchbtn]').click(function(){
            ppgrantmoneyissuedlg.datagrid('load',{
                bsnyue:bsnyue.datebox('getValue'),
                name:name.searchbox('getValue'),
                identityid:identityid.searchbox('getValue')
            })
        })
        window.setTimeout(function(){
            ppgrantmoneyissuedlg.datagrid('reload')
        },1000)
    }


    return {
        render:render
    }

})