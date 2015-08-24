/**
 * Created by weipan on 14-10-24.
 */
requirejs.config({

    urlArgs: "dc_=" +  (new Date()).getTime()

});
var widgetcmp=pagename.replace(/\./g,'/');
require(['text!views/'+widgetcmp+'.htm','views/'+widgetcmp,'../../js/commonfuncs/validate/Init'],function(htm,js,validateInit){
    new validateInit();
    var localtab = $('body').append(htm);
    $.parser.parse(localtab.parent());
    js.render(localtab, {});
})
