define(function(){
    var render = function(local,posion){
        getdivision(local); //行政区划
        var jizhengcwhDataQuery = local.find('table[opt=jizhengcwhDataQuery]');           //datagrid
        var divisiontree = local.find('input[opt=divisiontree]');               //行政区划
        var cwh_name = local.find('input[opt=cwh_name]');                      //村委会名称
        querybtn(local,jizhengcwhDataQuery,divisiontree,cwh_name);    //按条件查询

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
    var querybtn = function(local,jizhengcwhDataQuery,divisiontree,cwh_name){
        var query = local.find("[opt=query]");
        query.bind("click",function(){
            loaddate(local,jizhengcwhDataQuery,divisiontree,cwh_name);
        })
    }
    /*按条件加载数据*/
    var loaddate = function(local,jizhengcwhDataQuery,divisiontree,cwh_name){
        var districtidvalue = divisiontree.combotree("getValue");
        jizhengcwhDataQuery.datagrid({
            url:preFixUrl+'jcfxs/selectcwh',
            queryParams:{
                districtid: districtidvalue.length > 9 ? districtidvalue.substring(0,9):districtidvalue,
                cwh_name:cwh_name.val()
            }
        })
    }

    return {
        render:render
    }
})