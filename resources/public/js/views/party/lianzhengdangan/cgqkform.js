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

            var field1 = ['qy_name','qy_businessscope','qy_registercapital','qy_address','qy_legalperson','qy_contact'];//干部经商办企业情况
            var field2 = ['relationship'];//主要社会关系经商办企业情况
            var field3 = ['jz_departname','jz_property','jz_position','jz_docnumber','jz_yearreward'];//在企事业单位、社会团 体或其他营利性组织中兼职情况
            var field4 = ['rg_departname','rg_property','rg_way','rg_money','rg_yearincome'];//干部投资或入股情况

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

            cj.initTrData(local,'cgqk_gb',childdata_zf,field1);
            cj.initTrData(local,'cgqk_sh',childdata_cc,field2);
            //initTrData(local,'zfqk_cz',4,field3);
            //initTrData(local,'zfqk_jf',5,field4);


            /*保存*/
            local.find('[opt=save_cgqk]').click(function () {
                var $this = $(this);
                $this.attr("disabled",true);//按钮禁用
                var zfqk_v1 = cj.commonGetValue(local,{field:field1});
                var zfqk_v2 = cj.commonGetValue(local,{field:field2});
                var zfqk_v3 = cj.commonGetValue(local,{field:field3});
                var zfqk_v4 = cj.commonGetValue(local,{field:field4});
                local.find('[opt=form_cgqk]').form('submit', {
                    url: 'wwww1',
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
            });
        }
    }
})