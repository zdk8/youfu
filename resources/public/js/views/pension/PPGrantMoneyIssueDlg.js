define(function(){
    function render(local,option){
        lazgrantold(local);
        opp = option

    }


    /*加载未进行资金发放人员*/
    function lazgrantold(local){
        var ppgrantmoneyissuedlg = local.find('[opt=ppgrantmoneyissuedlg]');
        ppgrantmoneyissuedlg.datagrid({
//            url:'get-cangrantmoney',/*,
            url:'audit/getqualifyop',
            queryParams:{
                bsnyue: ""
            },
            onLoadSuccess:function(){},
            toolbar:local.find('div[tb]')
        });

        var bsnyue = local.find('[opt=bsnyue]');        //业务期
        /*bsnyue.datebox().datebox('calendar').calendar({
            validator: function (date) {
                console.log(111)
                return date.getDay()==5;
            }
        });*/
        bsnyue.datebox({
            formatter:function(date){
                var y = date.getFullYear();
                var m = date.getMonth()+1;
                return y+''+(m<10?('0'+m):m);
            }
        })

        var name = local.find('[opt=name]');        //姓名
        var identityid = local.find('[opt=identityid]');        //身份证
//        bsnyue.searchbox('setValue',formatterYM(new Date()))
        bsnyue.datebox('setValue',formatterYM(new Date()))
        //搜索
        local.find('[opt=searchbtn]').click(function(){
            ppgrantmoneyissuedlg.datagrid('load',{
                bsnyue:bsnyue.datebox('getValue'),
                name:name.searchbox('getValue'),
                identityid:identityid.searchbox('getValue')
            })
        })
    }

    return {
        render:render
    }

})