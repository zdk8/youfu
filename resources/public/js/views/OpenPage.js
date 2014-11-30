/**
 * Created by weipan on 2014/10/29.
 * desc open a page by click a link
 */

define(function(){
    var f=function(node){
        var value=node.value||node.location;
        var htmlfile, jsfile;
        var nodelocaltion=node.location;
        if(nodelocaltion){
            var widget=nodelocaltion.replace(/\./g,'/');
            htmlfile='text!views/'+widget+'.htm';
            jsfile='views/'+widget;
        }
        var title=node.text||node.title;
        require(['commonfuncs/TreeClickEvent'],function(TreeClickEvent){
            if(node.true){
                $.messager.alert(cj.defaultTitle, node.title+'('+node.functionid + ') 是目录', 'info');
            }
            if(node.type=='1'){ //组件
                TreeClickEvent.ShowContent({
                    htmfile:htmlfile,
                    jsfile:jsfile,
                    title:title,
                    location:nodelocaltion,
                    functionid:node.functionid,
                    readonly:false,
                    viewfolder:'views',
                    currentfolder:'views/'+nodelocaltion.substr(0,nodelocaltion.lastIndexOf('.')).replace('.','/')
                });
            }else if(node.type=='0'){//url
                //console.log(node)
                TreeClickEvent.ShowIframe(value
                    //+'&functionid='+node.functionid
                    ,jsfile,title);
            }
        });
    }


    return {
        open:f
    }
})