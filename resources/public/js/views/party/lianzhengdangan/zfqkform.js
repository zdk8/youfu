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

            var datas = option.queryParams.datas;
            if(datas == "false"){

            }

            var childdata_zf = [{xy_address:'xy_address',xy_area:'xy_area',xy_property:'xy_property',xy_source:'xy_source',xy_owner:'xy_owner'},
                {xy_address:'xy_address1',xy_area:'xy_area1',xy_property:'xy_property1',xy_source:'xy_source1',xy_owner:'xy_owner1'},
                {xy_address:'xy_address2',xy_area:'xy_area2',xy_property:'xy_property2',xy_source:'xy_source2',xy_owner:'xy_owner2'}];
            var childdata_cc = [{sf_address:'sf_address',sf_area:'sf_area',sf_property:'sf_property',sf_selltime:'2015-10-15',sf_money:'sf_money'},
                {sf_address:'sf_address1',sf_area:'sf_area1',sf_property:'sf_property1',sf_selltime:'2015-10-19',sf_money:'sf_money1'},
                {sf_address:'sf_address2',sf_area:'sf_area2',sf_property:'sf_property2',sf_selltime:'2015-10-10',sf_money:'sf_money2'}];

            var field1 = ['xy_address','xy_area','xy_property','xy_source','xy_owner'];//本人、配偶及共同生活的子女现有住房情况
            var field2 = ['sf_address','sf_area','sf_property','sf_selltime','sf_money'];//房屋出售情况
            var field3 = ['cz_address','cz_area','cz_property','cz_deadline','cz_annualrent'];//房屋出租情况
            var field4 = ['jz_address','jz_area','jz_unit','jz_totalamount','jz_payment'];//参加集资建房情况

            for(var i=0;i<field1.length;i++){
                local.find('[opt='+field1[i]+']').val(i);
            }
            for(var j=0;j<field2.length;j++){
                if(local.find('[opt='+field2[j]+']').hasClass('easyui-datebox')){
                    local.find('[opt='+field2[j]+']').datebox('setValue','2015-10-13');
                }else{
                    local.find('[opt='+field2[j]+']').val(j);
                }
            }
            for(var k=0;k<field3.length;k++){
                local.find('[opt='+field3[k]+']').val(k);
            }
            for(var l=0;l<field4.length;l++){
                local.find('[opt='+field4[l]+']').val(l);
            }

            cj.initTrData(local,'zfqk_zf',childdata_zf,field1);
            cj.initTrData(local,'zfqk_cc',childdata_cc,field2);
            //initTrData(local,'zfqk_cz',4,field3);
            //initTrData(local,'zfqk_jf',5,field4);




            /*保存*/
            local.find('[opt=save_zfqk]').click(function () {
                var $this = $(this);
                $this.attr("disabled",true);//按钮禁用
                var zfqk_v1 = cj.commonGetValue(local,{field:field1});
                var zfqk_v2 = cj.commonGetValue(local,{field:field2});
                var zfqk_v3 = cj.commonGetValue(local,{field:field3});
                var zfqk_v4 = cj.commonGetValue(local,{field:field4});
                local.find('[opt=form_zfqk]').form('submit', {
                    url: 'party/addhousestatus',
                    onSubmit: function (params) {
                        var isValid = $(this).form('validate');
                        if (isValid) {
                            layer.load();
                            params.zfqk_v1 = JSON.stringify(zfqk_v1);
                            params.zfqk_v2 = JSON.stringify(zfqk_v2);
                            params.zfqk_v3 = JSON.stringify(zfqk_v3);
                            params.zfqk_v4 = JSON.stringify(zfqk_v4);
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