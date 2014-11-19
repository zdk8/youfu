/**
 * User: weipan
 * Date: 7/16/14
 * Time: 1:22 PM
 * desc:pop intelligent search window and send form ,maybe close the window if user needed
 */


define(function(){
   var htms=(function(){
       var a=[
            'DailyMonitoring','FmlMemInfo','MedicalInstitutionInfo','FamilyInfo',
           'BloodSugar','Hypertension','HealthExaminationInfo','Machine'
       ]
       var o={};
       for(var i in a){
           o[a[i]]='text!views/intelligent/'+a[i]+'_.htm';
       }
       return o;
   })()

  var operater={
      eq:'=',like:'like'
  }
   var optexam={
       local:$('test'),
       title:'ttttt',
       width:300,
       height:300,
       onClose:function(){},
       jsfile:'test',
       htmfile:'text',
       getIntelligentsp:function(params){}
   }
   var pop=function(option){
       require([option.htmfile,option.js],function(htmfile,js){
           var id='w'+new Date().getTime();
           var jid='#'+id;
           $('body').append('<div id="'+id+'"></div>');
           $(jid).append(htmfile)
           if(js){
               js.poprender($(id),option.local)
           }
           $(jid).window({
               width:option.width||600,
               height:option.height||400,
               modal:true,
               title:option.title||'查询条件',
               minimizable:false,
               maximizable:false
           });

           $.parser.parse($(jid));  //xuanran
           myform=$(jid).find('form');
           $(jid).find('a[action=close]').bind('click',function(){
               $(jid).window('close');
           })
           $(jid).find('a[action=search]').bind('click',function(){
               var a=(function($form){
                   var arr=[];
                   $form.find('input').each(function(){
                       if($(this).attr('name')){
                           if($(this).val()){
                               var op=operater[$(this).attr('operate')]||operater[$form.find('input[comboname='+$(this).attr('name')+']').attr('operate')];
                               var val=$(this).val();
                               if(op==operater.like){
                                   val='%'+val+'%';
                               }
                               arr.push({
                                   name:$(this).attr('name'),
                                   operate:op,
                                   value:val,
                                   logic:'and'
                               })
                           }

                       }

                   })
                   return arr;
               })($($(this).parents('form')[0]));
               if(option.getIntelligentsp){
                   option.getIntelligentsp({
                       intelligentsp:JSON.stringify(a),
                       rows:10,
                       page:1
                   })
               }
           })

       })
   }

    return {pop:pop,htms:htms}
})
