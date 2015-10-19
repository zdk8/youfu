define(function () {
    return {
        render: function (local,option) {
            layer.closeAll('loading');
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
            local.find('[name=otherincome]').val(datas[0].otherincome);

            var field1 = ['qy_name','qy_businessscope','qy_registercapital','qy_address','qy_legalperson','qy_contact'];//干部经商办企业情况
            var field2 = ['relationship'];//主要社会关系经商办企业情况
            var field3 = ['jz_departname','jz_property','jz_position','jz_docnumber','jz_yearreward'];//在企事业单位、社会团 体或其他营利性组织中兼职情况
            var field4 = ['rg_departname','rg_property','rg_way','rg_money','rg_yearincome'];//干部投资或入股情况

            for(var i=0;i<field1.length;i++){
                local.find('[opt='+field1[i]+']').val(datas[0].field1[0][field1[i]]);
            }
            for(var j=0;j<field2.length;j++){
                if(local.find('[opt='+field2[j]+']').hasClass('easyui-datebox')){
                    local.find('[opt='+field2[j]+']').datebox('setValue',datas[0].field2[0][field2[j]]);
                }else{
                    local.find('[opt='+field2[j]+']').val(datas[0].field2[0][field2[j]]);
                }
            }
            for(var k=0;k<field3.length;k++){
                local.find('[opt='+field3[k]+']').val(datas[0].field3[0][field3[k]]);
            }
            for(var l=0;l<field4.length;l++){
                local.find('[opt='+field4[l]+']').val(datas[0].field4[0][field4[l]]);
            }

            local.find('[name=zf_id]').val(datas[0].zf_id);

            if(datas != "false"){
                var data = datas[0];
                var childdata_gb = data.field1;
                var childdata_sg = data.field2;
                var childdata_qt = data.field3;
                var childdata_rg = data.field4;
                cj.initTrData(local,'cgqk_gb',childdata_gb,field1);
                cj.initTrData(local,'cgqk_sh',childdata_sg,field2);
                cj.initTrData(local,'cgqk_qt',childdata_qt,field3);
                cj.initTrData(local,'cgqk_rg',childdata_rg,field4);
            }

            /*保存*/
            local.find('[opt=save_cgqk]').click(function () {
                var $this = $(this);
                $this.attr("disabled",true);//按钮禁用
                var cgqk_v1 = cj.commonGetValue(local,{field:field1});
                var cgqk_v2 = cj.commonGetValue(local,{field:field2});
                var cgqk_v3 = cj.commonGetValue(local,{field:field3});
                var cgqk_v4 = cj.commonGetValue(local,{field:field4});
                local.find('[opt=form_cgqk]').form('submit', {
                    url: 'wwww1',
                    onSubmit: function (params) {
                        var isValid = $(this).form('validate');
                        if (isValid) {
                            layer.load();
                            params.pr_id = record.pr_id;
                            params.field1 = JSON.stringify(cgqk_v1);
                            params.field2 = JSON.stringify(cgqk_v2);
                            params.field3 = JSON.stringify(cgqk_v3);
                            params.field4 = JSON.stringify(cgqk_v4);
                        }else{
                            layer.closeAll('loading');
                        }
                        return isValid;
                    },
                    success: function (data) {
                        $this.attr("disabled",false);//按钮启用
                        layer.closeAll('loading');
                        if (data == "true") {
                            cj.showSuccess('保存成功');
                        } else {
                            cj.showFail('保存失败');
                        }
                    }
                })
            });
        }
    }
})