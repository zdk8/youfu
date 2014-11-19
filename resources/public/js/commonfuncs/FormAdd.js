/**
 * Created by jack on 14-1-6.
 */

define(function(){

    var a={

        addnewchild:function(lookupname,folder,ajaxloading,isbottom,res,callback){
            if(isbottom)ajaxloading.ajaxLoading();
            var length=$('#mainform').children().length;
            //alert(length);
            //alert(lookupname);
            if(length==applyformviews[lookupname].length){

                return;
            }
            var formname=applyformviews[lookupname][length];
            formhtml='text!'+folder+formname+'.htm';
            formjs=folder+formname;
            require([formhtml,formjs],function(formhtml,formjs){
                $('#mainform').append(formhtml);

                if(res&&res.signature.length>0){
                    var signatures=res.signature;
                    if($('#signatures').parent().scrollTop()<=parseInt(signatures[0].y)&&
                        parseInt(signatures[0].y)<=$('#signatures').parent().scrollTop()
                            +$('#signatures').parent().height()){
                        require(['jqueryplugin/raphael-min'],function(js){
                            $('#signatures').html('');
                            var paper = Raphael('signatures',200, 200);
                            var c = paper.image(signatures[0].signaturepath,50,50,200,200);
                            $('#signatures').offset({top:50,
                                left:50
                            });
                            $('#signatures').draggable();
                            $('#signatures').offset({top:parseInt(signatures[0].y)-$('#signatures').parent().scrollTop(),
                                left:parseInt(signatures[0].x)
                            });

                        });
                    }
                }

                var newform=$('#mainform').children()[length];
                formjs.render(newform,res);
                if(isbottom)ajaxloading.ajaxLoadEnd();
                require(['jqueryplugin/jquery-scrollto'], function (jqueryscroll) {
                    if(isbottom)$('#formcontentpanel').parent().scrollTo($(newform));
                    //if(isbottom)$('#formcontentpanel').parent().scrollTo($('#appformmore'));
                    //$('#formcontentpanel').scrollTo($(newform));
                });
                if($('#mainform').children().length==applyformviews[lookupname].length){
                    $('#appformmore').hide();
                    $('#appformsubmit').show();
                    $('#appformsubmitcancel').show();
                }
                if(callback)callback();
            });
        }
    }

    return a;
});
