define(function(){
    var render = function(local,posion){
        getdivision(local); //行政区划
        var minguanstDataQuery = local.find('table[opt=minguanstDataQuery]');           //datagrid
        var divisiontree = local.find('input[opt=divisiontree]');               //行政区划
        var prneu_name = local.find('input[opt=prneu_name]');                      //民非名称
        var or_number = local.find('input[opt=or_number]');     //组织机构代码
        var corporation = local.find('input[opt=corporation]');     //法定代表人
        querybtn(local,minguanstDataQuery,divisiontree,prneu_name,or_number,corporation);    //按条件查询

        window.setTimeout(function(){
            local.find("[opt=query]").trigger('click');
        },500)
    }

    /*行政区划的树结构*/
    var getdivision = function(local){
        var divisiontree = local.find(':input[opt=divisiontree]') ;
        divisiontree.combotree({
            panelHeight:300,
            url:'../../civil/getdivision',
            method: 'get',
            onLoadSuccess:function(load,data){
                console.log(data)
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
    var querybtn = function(local,minguanstDataQuery,divisiontree,prneu_name,or_number,corporation){
        var query = local.find("[opt=query]");
        query.bind("click",function(){
            loaddate(local,minguanstDataQuery,divisiontree,prneu_name,or_number,corporation);
        })
    }
    /*按条件加载数据*/
    var loaddate = function(local,minguanstDataQuery,divisiontree,prneu_name,or_number,corporation){
        minguanstDataQuery.datagrid({
            url:preFixUrl+'jcfxs/selectmf',
            queryParams:{
                districtid: divisiontree.combotree("getValue"),
                prneu_name:prneu_name.val(),
                or_number:or_number.val(),
                corporation:corporation.val()
            }
        })
    }

    return {
        render:render
    }
})