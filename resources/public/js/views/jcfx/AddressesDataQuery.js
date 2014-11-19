define(function(){
    var render = function(local,posion){
        getdivision(local); //所属街道
        var placeDataQuery = local.find('table[opt=placeDataQuery]');           //datagrid
        var divisiontree = local.find('input[opt=divisiontree]');               //所属街道
        var chanquanren = local.find('input[opt=chanquanren]');                 //产权人
        var menpai = local.find('input[opt=menpai]');                            //门牌
        var menpaizhenghao = local.find('input[opt=menpaizhenghao]');           //门牌证号
        var datastate = local.find('select[opt=datastate]');                     //数据库
        querybtn(local,placeDataQuery,divisiontree,chanquanren,menpai,menpaizhenghao,datastate);    //按条件查询
        /*复选框选中状态*/
        /*chanquanren.bind('click',function(){
            local.find('input[name=chanquanren]:checkbox').attr("checked",true);
        });
        menpai.bind('click',function(){
            local.find('input[name=menpai]:checkbox').attr("checked",true);
        });
        menpaizhenghao.bind('click',function(){
            local.find('input[name=menpaizhenghao]:checkbox').attr("checked",true);
        });
        datastate.combobox({
            onSelect: function (date) {
                local.find('input[name=datastate]:checkbox').attr("checked",true);
            }
        });*/

        /*门牌数据查询datagrid*/
        placeDataQuery.datagrid({
            url:preFixUrl+'jcfxs/mpcx',
            onLoadSuccess:function(data){
                console.log(data)
            }
        })

    }

    /*所属街道的树结构*/
    var getdivision = function(local){
        var divisiontree = local.find(':input[opt=divisiontree]') ;
        divisiontree.combotree({
            panelHeight:300,
            url:'../../civil/getdivision',
            method: 'get',
            onLoadSuccess:function(load,data){
                if(!this.firstloaded){
                    divisiontree.combotree('setValue', data[0].id)
                        .combotree('setText', data[0].text);
                    this.firstloaded=true;
                }
            },
            onBeforeExpand: function (node) {
                divisiontree.combotree("tree").tree("options").url
                    = '../../civil/getdivision?dvhigh=' + node.id;
            },
            onHidePanel: function () {
                divisiontree.combotree('setValue',
                        divisiontree.combotree('tree').tree('getSelected').id)
                    .combobox('setText',
                        divisiontree.combotree('tree').tree('getSelected').text);
            }
        });
    }

    /*查询*/
    var querybtn = function(local,placeDataQuery,divisiontree,chanquanren,menpai,menpaizhenghao,datastate){
        var query = local.find("[opt=query]");
        query.bind("click",function(){
            loaddate(local,placeDataQuery,divisiontree,chanquanren,menpai,menpaizhenghao,datastate);
        })
    }
    /*按条件加载数据*/
    var loaddate = function(local,placeDataQuery,divisiontree,chanquanren,menpai,menpaizhenghao,datastate){
        placeDataQuery.datagrid('load',{
            districtid: divisiontree.combotree("getValue"),
            cqr:chanquanren.val(),
            doorplate:menpai.val(),
            plate_num:menpaizhenghao.val(),
            datastate:datastate.combotree("getValue")
        })
        console.log(datastate.combotree("getValue"))
    }

    return {
        render:render
    }
})