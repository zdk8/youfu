define(function(){
    var render = function(local,posion){
        getdivision(local); //行政区划
        var jizhengcsDataQuery = local.find('table[opt=jizhengcsDataQuery]');           //datagrid
        var divisiontree = local.find('input[opt=divisiontree]');               //行政区划
        var sq_name = local.find('input[opt=sq_name]');                      //社区名称
        querybtn(local,jizhengcsDataQuery,divisiontree,sq_name);    //按条件查询

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
    var querybtn = function(local,jizhengcsDataQuery,divisiontree,sq_name){
        var query = local.find("[opt=query]");
        query.bind("click",function(){
            loaddate(local,jizhengcsDataQuery,divisiontree,sq_name);
        })
    }
    /*按条件加载数据*/
    var loaddate = function(local,jizhengcsDataQuery,divisiontree,sq_name){
        var districtidvalue = divisiontree.combotree("getValue");
        jizhengcsDataQuery.datagrid({
            url:preFixUrl+'jcfxs/selectcssq',
            queryParams:{
                districtid: districtidvalue.length > 9 ? districtidvalue.substring(0,9):districtidvalue,
                sq_name:sq_name.val()
            }
        })
    }

    return {
        render:render
    }
})