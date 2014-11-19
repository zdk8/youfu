define(function(){
    var render = function(local,posion){
        getdivision(local); //行政区划
        var shegongDataQuery = local.find('table[opt=shegongDataQuery]');           //datagrid
        var divisiontree = local.find('input[opt=divisiontree]');               //行政区划
        var sg_name = local.find('input[opt=sg_name]');                      //社工姓名
        var sg_workdep = local.find('input[opt=sg_workdep]');     //社工工作单位
        querybtn(local,shegongDataQuery,divisiontree,sg_name,sg_workdep);    //按条件查询

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
    var querybtn = function(local,shegongDataQuery,divisiontree,sg_name,sg_workdep){
        var query = local.find("[opt=query]");
        query.bind("click",function(){
            loaddate(local,shegongDataQuery,divisiontree,sg_name,sg_workdep);
        })
    }
    /*按条件加载数据*/
    var loaddate = function(local,shegongDataQuery,divisiontree,sg_name,sg_workdep){
        shegongDataQuery.datagrid({
            url:preFixUrl+'jcfxs/selectsg',
            queryParams:{
                districtid: divisiontree.combotree("getValue"),
                sg_name:sg_name.val(),
                sg_workdep:sg_workdep.val()
            }
        })
    }

    return {
        render:render
    }
})