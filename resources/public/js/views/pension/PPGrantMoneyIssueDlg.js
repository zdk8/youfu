define(function(){
    function render(local,option){
        lazgrantold(local);


    }

    /*加载未进行资金发放人员*/
    function lazgrantold(local){

        var ppgrantmoneyissuedlg = local.find('[opt=ppgrantmoneyissuedlg]');
        ppgrantmoneyissuedlg.datagrid({
            url:'get-cangrantmoney'/*,
            queryParams:{
                bsnyue:
            }*/
        });

        var bsnyue = local.find('[opt=bsnyue]');        //业务期
        bsnyue.searchbox('setValue',formatterYM(new Date()))
        var searchbtn = local.find('[opt=searchbtn]')   //搜索
        searchbtn.click(function(){
            ppgrantmoneyissuedlg.datagrid('load',{
                bsnyue:bsnyue.searchbox('getValue')
            })
            console.log(bsnyue.searchbox('getValue'))
        })
    }

    return {
        render:render
    }

})