define(function(){
    var render = function(local,posion){
        getdivision(local); //行政区划
        var minguanstDataQuery = local.find('table[opt=minguanstDataQuery]');           //datagrid
        var divisiontree = local.find('input[opt=divisiontree]');               //行政区划
        var dwname = local.find('input[opt=dwname]');                      //单位名称
        var zuzhinum = local.find('input[opt=zuzhinum]');     //组织代码
        var fddbrname = local.find('input[opt=fddbrname]');     //法定代表人
        querybtn(local,minguanstDataQuery,divisiontree,dwname,zuzhinum,fddbrname);    //按条件查询

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
    var querybtn = function(local,minguanstDataQuery,divisiontree,dwname,zuzhinum,fddbrname){
        var query = local.find("[opt=query]");
        query.bind("click",function(){
            loaddate(local,minguanstDataQuery,divisiontree,dwname,zuzhinum,fddbrname);
        })
    }
    /*按条件加载数据*/
    var loaddate = function(local,minguanstDataQuery,divisiontree,dwname,zuzhinum,fddbrname){
        minguanstDataQuery.datagrid({
            url:preFixUrl+'jcfxs/selectjjh',
            queryParams:{
                districtid: divisiontree.combotree("getValue"),
                dwname:dwname.val(),
                zuzhinum:zuzhinum.val(),
                fddbrname:fddbrname.val()
            }
        })
    }

    return {
        render:render
    }
})