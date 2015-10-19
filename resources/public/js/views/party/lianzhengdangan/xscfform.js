define(function () {
    return {
        render: function (local,option) {
            local.find('div[opt=formcontentpanel]').panel({
                onResize: function (width, height) {
                    $(this).height($(this).height() - 35);
                }
            });
            local.find('[opt=cancel]').click(function(){
                layer.close(option.queryParams.poption.index);
            });
            cj.common_listFunc(local);//表单动态增减行


            var record = option.queryParams.poption.queryParams.record;
            local.find('[name=name]').val(record.name);
            local.find('[name=workunit]').val(record.workunit);
            local.find('[name=incumbent]').val(record.incumbent);

            var childdata_zf = [{xy_address:'xy_address',xy_area:'xy_area',xy_property:'xy_property',xy_source:'xy_source',xy_owner:'xy_owner'},
                {xy_address:'xy_address1',xy_area:'xy_area1',xy_property:'xy_property1',xy_source:'xy_source1',xy_owner:'xy_owner1'},
                {xy_address:'xy_address2',xy_area:'xy_area2',xy_property:'xy_property2',xy_source:'xy_source2',xy_owner:'xy_owner2'}];
            var childdata_cc = [{sf_address:'sf_address',sf_area:'sf_area',sf_property:'sf_property',sf_selltime:'2015-10-15',sf_money:'sf_money'},
                {sf_address:'sf_address1',sf_area:'sf_area1',sf_property:'sf_property1',sf_selltime:'2015-10-19',sf_money:'sf_money1'},
                {sf_address:'sf_address2',sf_area:'sf_area2',sf_property:'sf_property2',sf_selltime:'2015-10-10',sf_money:'sf_money2'}];

            var field1 = ['cf_name','cf_relation','cf_position','cf_punishtype'];//配偶、子女及其配偶受到执纪执法机关查处或涉嫌犯罪情况

            for(var i=0;i<field1.length;i++){
                local.find('[opt='+field1[i]+']').val(i);
            }

            cj.initTrData(local,'xscf_cc',childdata_zf,field1);
            //initTrData(local,'zfqk_cz',4,field3);
            //initTrData(local,'zfqk_jf',5,field4);


            /*保存*/
            local.find('[opt=save_xscf]').click(function () {
                var $this = $(this);
                $this.attr("disabled",true);//按钮禁用
                var zfqk_v1 = cj.commonGetValue(local,{field:field1});
                local.find('[opt=form_xscf]').form('submit', {
                    url: 'wwww1',
                    onSubmit: function (params) {
                        var isValid = $(this).form('validate');
                        if (isValid) {
                            layer.load();
                            params.zfqk_v1 = JSON.stringify(zfqk_v1);
                        }else{
                            layer.closeAll('loading');
                        }
                        return isValid;
                    },
                    success: function (data) {
                        $this.attr("disabled",false);//按钮启用
                        if (data == "true") {
                            layer.closeAll('loading');
                            cj.showSuccess('保存成功');
                            //option.queryParams.refresh();
                            //layer.close(option.index);
                        } else {
                            layer.closeAll('loading');
                            cj.showFail('保存失败');
                        }
                    }
                })
            })
        }
    }
})