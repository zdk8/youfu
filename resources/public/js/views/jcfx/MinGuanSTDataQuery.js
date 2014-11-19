define(function(){
    var render = function(local,posion){
        getdivision(local); //行政区划
        var minguanstDataQuery = local.find('table[opt=minguanstDataQuery]');           //datagrid
        var divisiontree = local.find('input[opt=divisiontree]');               //行政区划
        var sg_name = local.find('input[opt=sg_name]');                      //社团名称
        var or_number = local.find('input[opt=or_number]');     //组织机构代码
        var lr_name = local.find('input[opt=lr_name]');     //法定代表人
        querybtn(local,minguanstDataQuery,divisiontree,sg_name,or_number,lr_name);    //按条件查询

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
    var querybtn = function(local,minguanstDataQuery,divisiontree,sg_name,or_number,lr_name){
        var query = local.find("[opt=query]");
        query.bind("click",function(){
            loaddate(local,minguanstDataQuery,divisiontree,sg_name,or_number,lr_name);
        })
    }
    /*按条件加载数据*/
    var loaddate = function(local,minguanstDataQuery,divisiontree,sg_name,or_number,lr_name){
        minguanstDataQuery.datagrid({
            url:preFixUrl+'jcfxs/selectst',
            queryParams:{
                districtid: divisiontree.combotree("getValue"),
                sg_name:sg_name.val(),
                or_number:or_number.val(),
                lr_name:lr_name.val()
            }
        })
    }

    return {
        render:render
    }
})