serverUrl="http://10.40.190.20:8089/"
serverUrl="http://192.168.2.4/"
/*var mysessionid="nosessionid";
if(sessionid){
    mysessionid=sessionid;
}
preFixUrl="proxy.jsp?sessionid="+mysessionid+"&";*/

preFixUrl="auth/proxy?";
var urldest="urldest=http://192.168.2.2:8080/"
//urldest="urldest=http://112.124.50.195:8080/pensionwebbg/";

if(document.URL.indexOf('10.40.190')>0){
    serverUrl="http://10.40.190.20:8089/";
    urldest="urldest=http://112.124.50.195:8080/pensionwebbg/";
}
if(document.URL.indexOf('localhost')>0){
    urldest="urldest=http://192.168.2.4:3000/";
}
preFixUrl+=urldest;

extEasyui=serverUrl+"easyui/";
extJqueryui=serverUrl+"jqueryui/"
hstock=serverUrl+"hstock/"
hchart=serverUrl+"hchart/"
uploadBase=serverUrl+"jasper/"
imgnoperson="img/noperson.gif";

var svalidatesys_micard=preFixUrl+'pension/checkmicard';

var defaultPage = "dmxt.PlaceAdd";
// defaultPage = "manager.Role";
//defaultPage = "pension.RuZhuRYManagement";
//defaultPage = "pension.YangLaoJGManagement";
//defaultPage = "pension.PensionPeopleAudit";
defaultPage=undefined;
var onlyPage=!true;
//select t.*, t.rowid from T_ENUMS t WHERE t.ENUM_GROUP_GUID='759AB90C-E2BC-E210-BDCC-B8EB0793557E' --and enum_name like '交%'


