define(function(){
    var render = function(local,posion){
        getdivision(local); //行政区划
        var jizhengjjhzsDataQuery = local.find('table[opt=jizhengjjhzsDataQuery]');           //datagrid
        var divisiontree = local.find('input[opt=divisiontree]');               //行政区划
        var xzm = local.find('input[opt=xzm]');                      //合作社名称
        querybtn(local,jizhengjjhzsDataQuery,divisiontree,xzm);    //按条件查询

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
    var querybtn = function(local,jizhengjjhzsDataQuery,divisiontree,xzm){
        var query = local.find("[opt=query]");
        query.bind("click",function(){
            loaddate(local,jizhengjjhzsDataQuery,divisiontree,xzm);
        })
    }
    /*按条件加载数据*/
    var loaddate = function(local,jizhengjjhzsDataQuery,divisiontree,xzm){
        var districtidvalue = divisiontree.combotree("getValue");
        jizhengjjhzsDataQuery.datagrid({
            url:preFixUrl+'jcfxs/selectjjhzs',
            queryParams:{
                districtid:districtidvalue.length > 9 ? districtidvalue.substring(0,9):districtidvalue,
                xzm:xzm.val()
            }
        })
    }

    return {
        render:render
    }
})