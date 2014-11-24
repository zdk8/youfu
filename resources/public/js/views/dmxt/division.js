/**
 * Created by Administrator on 2014/10/9.
 */
define(function(){
    return {
        render:function(local,option) {
            var divisiontree = local.find(':input[opt=divisiontree]') ;                               //行政区划的树结构

            divisiontree.combotree({
                url:'menutree',
                method: 'get',
                onLoadSuccess:function(load,data){
                    if(!this.firstloaded){
                        divisiontree.combotree('setValue', data[0].functionid)
                            .combotree('setText', data[0].title);
                        this.firstloaded=true;
                    }
                },
                onBeforeExpand2: function (node) {
                    divisiontree.combotree("tree").tree("options").url
                        = "menutree?id=" + node.parentid;
                },
                onHidePanel: function () {
                    divisiontree.combotree('setValue',
                        divisiontree.combotree('tree').tree('getSelected').functionid)
                        .combobox('setText',
                        divisiontree.combotree('tree').tree('getSelected').title);
                }
            });
        }
    }
})