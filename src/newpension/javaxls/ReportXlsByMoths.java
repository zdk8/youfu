package newpension.javaxls;

import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;

import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class ReportXlsByMoths {
    /*获取表体数据*/
    public static Map getDatas(Map[] value){
        Map mapall = new HashMap();
        for (int d=0;d<value.length;d++){
            Map mapval = new HashMap();
            for (int i=0;i<value[d].size();i++){
                mapval.put(value[d].keySet().toArray()[i].toString(),value[d].values().toArray()[i]==null?"":value[d].values().toArray()[i]);
            }

            mapall.put(d,mapval);
        }
        return mapall;
    }
    /*设置表头*/
    public void setHeadXls(HSSFSheet sheet,HSSFWorkbook wb,String[] monthsarr,String year,String title){
        Calendar date=Calendar.getInstance();
        HSSFRow row = sheet.createRow((int) 0);  //创建第0行
        HSSFCell cell = row.createCell((short) 0);//创建单元格0
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 12+monthsarr.length));//合并列
        cell.setCellValue("海盐县"+year+"年"+title+"居家养老政府购买服务资金下拔清单");//标题

        HSSFFont font = wb.createFont();  //字体
        font.setFontHeightInPoints((short) 16);
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
        HSSFCellStyle style = wb.createCellStyle();  //样式
        style.setAlignment(HSSFCellStyle.BORDER_MEDIUM); // 左右对齐
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER); //上下对齐
        style.setFont(font);

        cell.setCellStyle(style);//设置样式
        row.setHeight((short) 500);

    }
    /*设置表体*/
    public void setBodyXls(HSSFSheet sheet,HSSFWorkbook wb,String[] monthsarr){
        /*表体头(左)样式*/
        HSSFCellStyle stylebodyleft = wb.createCellStyle();
        stylebodyleft.setAlignment(HSSFCellStyle.ALIGN_LEFT);
        stylebodyleft.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        /*表体头(右)样式*/
        HSSFCellStyle stylebodyright = wb.createCellStyle();
        stylebodyright.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
        stylebodyright.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

        HSSFRow row1 = sheet.createRow((int) 1);             //创建第1行
        sheet.addMergedRegion(new CellRangeAddress(1,1,0,4));//合并列
        HSSFCell cellbzdw = row1.createCell((short) 0);
        cellbzdw.setCellValue("编制单位：海盐县民政局");
        cellbzdw.setCellStyle(stylebodyleft);
        sheet.addMergedRegion(new CellRangeAddress(1,1,10,12+monthsarr.length));//合并列
        HSSFCell celljedw = row1.createCell((short) 10);
        celljedw.setCellValue("金额单位：元");
        celljedw.setCellStyle(stylebodyright);

        /*公共样式*/
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.BORDER_MEDIUM);
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);

        HSSFRow row2 = sheet.createRow((int) 2);  //创建第2行

        sheet.addMergedRegion(new CellRangeAddress(2,3,0,0));//合并行
        sheet.setColumnWidth(0,1500);//设置宽度
        HSSFCell cellxh = row2.createCell((short) 0);
        cellxh.setCellValue("序\n号");
        cellxh.setCellStyle(style);

        sheet.addMergedRegion(new CellRangeAddress(2,3,1,1));
        HSSFCell cellxzjd = row2.createCell((short) 1);
        cellxzjd.setCellValue("乡镇街道");
        cellxzjd.setCellStyle(style);

        sheet.addMergedRegion(new CellRangeAddress(2,2,2,4));
        HSSFCell cellbfwdx = row2.createCell((short) 2);
        cellbfwdx.setCellValue("被 服 务 对 象");
        cellbfwdx.setCellStyle(style);
        row2.createCell((short) 3).setCellStyle(style);
        row2.createCell((short) 4).setCellStyle(style);
        row2.createCell((short) 6).setCellStyle(style);
        row2.createCell((short) 7).setCellStyle(style);

        HSSFRow row3 = sheet.createRow((int) 3);  //创建第3行
        HSSFCell cellbfwdx_xm = row3.createCell((short) 2);
        cellbfwdx_xm.setCellValue("姓 名");
        cellbfwdx_xm.setCellStyle(style);
        row3.createCell((short) 0).setCellStyle(style);
        row3.createCell((short) 1).setCellStyle(style);
        row3.createCell((short) 8).setCellStyle(style);
        row3.createCell((short) 9).setCellStyle(style);
        row3.createCell((short) 10).setCellStyle(style);

        HSSFCell cellbfwdx_sfzh = row3.createCell((short) 3);
        sheet.setColumnWidth(3,5*1000);
        cellbfwdx_sfzh.setCellValue("身份证号");
        cellbfwdx_sfzh.setCellStyle(style);
        HSSFCell cellbfwdx_jtzz = row3.createCell((short) 4);
        sheet.setColumnWidth(4,6*1000);
        cellbfwdx_jtzz.setCellValue("家庭地址");
        cellbfwdx_jtzz.setCellStyle(style);

        sheet.addMergedRegion(new CellRangeAddress(2,2,5,7));
        HSSFCell cellfwry = row2.createCell((short) 5);
        cellfwry.setCellValue("服  务  人  员");
        cellfwry.setCellStyle(style);
        HSSFCell cellfwry_xm = row3.createCell((short) 5);
        cellfwry_xm.setCellValue("姓 名");
        cellfwry_xm.setCellStyle(style);
        HSSFCell cellfwry_sfzh = row3.createCell((short) 6);
        sheet.setColumnWidth(6,5*1000);
        cellfwry_sfzh.setCellValue("身份证号");
        cellfwry_sfzh.setCellStyle(style);
        HSSFCell cellfwry_jtdz = row3.createCell((short) 7);
        sheet.setColumnWidth(7,6*1000);
        cellfwry_jtdz.setCellValue("家庭地址");
        cellfwry_jtdz.setCellStyle(style);

        sheet.addMergedRegion(new CellRangeAddress(2,3,8,8));
        HSSFCell cellfwdj = row2.createCell((short) 8);
        cellfwdj.setCellValue("服务等级");
        cellfwdj.setCellStyle(style);
        sheet.addMergedRegion(new CellRangeAddress(2, 3, 9, 9));
        HSSFCell cellrylx = row2.createCell((short) 9);
        cellrylx.setCellValue("人员类型");
        cellrylx.setCellStyle(style);
        sheet.addMergedRegion(new CellRangeAddress(2, 3, 10, 10));
        HSSFCell cellzfgmfubz = row2.createCell((short) 10);
        cellzfgmfubz.setCellValue("政府购买服务标准(小时)");
        style.setWrapText(true);
        cellzfgmfubz.setCellStyle(style);
        /*月份*/
        if (monthsarr.length>0){
            for (int i=0;i<monthsarr.length;i++){
                sheet.addMergedRegion(new CellRangeAddress(2, 3, 11+i, 11+i));
                HSSFCell cellzybz = row2.createCell((short) 11+i);
                cellzybz.setCellValue(monthsarr[i]+"月");
                cellzybz.setCellStyle(style);
                /*边框标黑*/
                row3.createCell((short) 11+i).setCellStyle(style);
            }
        }
        sheet.addMergedRegion(new CellRangeAddress(2, 3, 11+monthsarr.length, 11+monthsarr.length));
        HSSFCell cellzybz = row2.createCell((short) 11+monthsarr.length);
        cellzybz.setCellValue("住院补助");
        style.setWrapText(true);
        cellzybz.setCellStyle(style);
        sheet.addMergedRegion(new CellRangeAddress(2, 3, 12+monthsarr.length, 12+monthsarr.length));
        HSSFCell cellbzje = row2.createCell((short) 12+monthsarr.length);
        cellbzje.setCellValue("补助金额");
        style.setWrapText(true);
        cellbzje.setCellStyle(style);
        /*边框标黑*/
        row3.createCell((short) 11+monthsarr.length).setCellStyle(style);
        row3.createCell((short) 12+monthsarr.length).setCellStyle(style);
    }
    //表体值
    public void setValueXls(HSSFSheet sheet,HSSFWorkbook wb,String[] monthsarr,Map[] datas){
        /*样式一*/
        HSSFFont font = wb.createFont();  //字体
        font.setFontHeightInPoints((short) 11);
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
        HSSFCellStyle style_bold = wb.createCellStyle();
        style_bold.setAlignment(HSSFCellStyle.BORDER_MEDIUM);
        style_bold.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        style_bold.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style_bold.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style_bold.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style_bold.setBorderRight(HSSFCellStyle.BORDER_THIN);
        style_bold.setFont(font);
        /*样式二*/
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.BORDER_MEDIUM);
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);

        Map datasval = getDatas(datas);  //数据

        HSSFRow row4 = sheet.createRow((int) 4);
        sheet.addMergedRegion(new CellRangeAddress(4,4,0,3));
        HSSFCell cell_heji = row4.createCell((short) 0);   //合计
        cell_heji.setCellValue("合   计");
        cell_heji.setCellStyle(style_bold);
        row4.createCell((short) 1).setCellStyle(style_bold);
        row4.createCell((short) 2).setCellStyle(style_bold);
        row4.createCell((short) 3).setCellStyle(style_bold);
        HSSFCell cell_renshu = row4.createCell((short) 4);   //人数
        cell_renshu.setCellValue("人  数");
        cell_renshu.setCellStyle(style_bold);
        HSSFCell cell_renshu_val = row4.createCell((short) 5);   //人数val
        cell_renshu_val.setCellValue(datasval.size());
        cell_renshu_val.setCellStyle(style_bold);
        sheet.addMergedRegion(new CellRangeAddress(4,4,6,10));
        HSSFCell cell_jine = row4.createCell((short) 6);   //金额
        cell_jine.setCellValue("金   额");
        cell_jine.setCellStyle(style_bold);
        row4.createCell((short) 7).setCellStyle(style_bold);
        row4.createCell((short) 8).setCellStyle(style_bold);
        row4.createCell((short) 9).setCellStyle(style_bold);
        row4.createCell((short) 10).setCellStyle(style_bold);
        for (int i=0;i<datasval.size();i++){
            Map dataval = (Map)datasval.get(i);
            /*月份值*/
            if (monthsarr.length>0){
                String month;
                for (int m=0;m<monthsarr.length;m++){
                    month = ":"+monthsarr[m];
//                    System.out.println("月份值:一月:"+dataval.get(":一"));
                    /*HSSFCell cell_yuefen = row4.createCell((short) 11+m);
                    String month = ":"+monthsarr[m];
                    cell_yuefen.setCellValue(dataval.get(month).toString());
                    cell_yuefen.setCellStyle(style);*/
                }
                System.out.println("月:"+monthsarr);
//                System.out.println("月份值:一月:"+dataval.get(":一"));
            }
        }


        int rowindex = 5;     //表体值从第4行开始
        for (int i=0;i<datasval.size();i++){
            HSSFRow rownum = sheet.createRow((int) rowindex++);
            Map dataval = (Map)datasval.get(i);

            HSSFCell cellnum = rownum.createCell((short) 0);
            int rowval = i+1;
            cellnum.setCellValue(rowval);
            cellnum.setCellStyle(style);
            /*被服务对象*/
            HSSFCell cell_address1 = rownum.createCell((short) 1);
            cell_address1.setCellValue("五原镇");
            cell_address1.setCellStyle(style);

            HSSFCell cell_name = rownum.createCell((short) 2);              //姓名
            cell_name.setCellValue(dataval.get(":name").toString());
            cell_name.setCellStyle(style);

            HSSFCell cell_identityid = rownum.createCell((short) 3);        //身份证号
            cell_identityid.setCellValue(dataval.get(":identityid").toString());
            cell_identityid.setCellStyle(style);

            HSSFCell cell_address = rownum.createCell((short) 4);           //家庭地址
            cell_address.setCellValue(dataval.get(":address").toString());
            cell_address.setCellStyle(style);
            /*服务人员*/
            HSSFCell cell_servicername = rownum.createCell((short) 5);        //姓名
            cell_servicername.setCellValue(dataval.get(":servicername").toString()==null?"1":dataval.get(":servicername").toString());
            cell_servicername.setCellStyle(style);

            HSSFCell cell_servicephone = rownum.createCell((short) 6);        //身份证号
            cell_servicephone.setCellValue(dataval.get(":servicephone").toString());
            cell_servicephone.setCellStyle(style);

            HSSFCell cell_serviceaddress = rownum.createCell((short) 7);     //家庭地址
            cell_serviceaddress.setCellValue(dataval.get(":serviceaddress").toString());
            cell_serviceaddress.setCellStyle(style);

            HSSFCell cell_servicephone1 = rownum.createCell((short) 8);       //服务等级
            cell_servicephone1.setCellValue("中度");
            cell_servicephone1.setCellStyle(style);

            HSSFCell cell_assesstype = rownum.createCell((short) 9);         //人员类型
            cell_assesstype.setCellValue(dataval.get(":assesstype").toString());
            cell_assesstype.setCellStyle(style);

            HSSFCell cell_servicetime = rownum.createCell((short) 10);       //政府购买服务标准(小时)
            cell_servicetime.setCellValue(dataval.get(":servicetime").toString());
            cell_servicetime.setCellStyle(style);

            /*月份值*/
            if (monthsarr.length>0){
                for (int m=0;m<monthsarr.length;m++){
                    HSSFCell cell_yuefen = rownum.createCell((short) 11+m);
                    String month = ":"+monthsarr[m];
                    cell_yuefen.setCellValue(dataval.get(month).toString());
                    cell_yuefen.setCellStyle(style);
                }
            }

            HSSFCell cell_zybz = rownum.createCell((short) 11+monthsarr.length); //住院补助
            cell_zybz.setCellValue("200");
            cell_zybz.setCellStyle(style);
            HSSFCell cell_bzje = rownum.createCell((short) 12+monthsarr.length); //补助金额
            cell_bzje.setCellValue("300");
            cell_bzje.setCellStyle(style);
        }
    }
    /*xls导出报表*/
    public static Workbook getReport(String year,String months,Map[] datas) throws Exception{
        String[] monthsarr = {};//存放月份数组
        System.out.println("数组:"+monthsarr);
        String title = "xx月";
        ReportXlsByMoths mainclass = new ReportXlsByMoths();
        Map<String,Integer> map = mainclass.getMonths();
        if (months.length()>0){
            monthsarr = months.split(",");
            title = map.get(monthsarr[0])+"-"+map.get(monthsarr[monthsarr.length-1])+"月";
        }
        // 创建webbook的Excel工作薄
        HSSFWorkbook wb = new HSSFWorkbook();
        // 创建一个sheet
        HSSFSheet sheet = wb.createSheet(title);
        mainclass.setHeadXls(sheet,wb,monthsarr,year,title);   //表头
        mainclass.setBodyXls(sheet,wb,monthsarr);   //表体
        mainclass.setValueXls(sheet,wb,monthsarr,datas);   //值
        return wb;
    }
    /*xls导出空报表*/
    public static Workbook getReportNull(String year,String months) throws Exception{
        String[] monthsarr = {};//存放月份数组
        System.out.println("数组:"+monthsarr);
        String title = "xx月";
        ReportXlsByMoths mainclass = new ReportXlsByMoths();
        Map<String,Integer> map = mainclass.getMonths();
        if (months.length()>0){
            monthsarr = months.split(",");
            title = map.get(monthsarr[0])+"-"+map.get(monthsarr[monthsarr.length-1])+"月";
        }
        // 创建webbook的Excel工作薄
        HSSFWorkbook wb = new HSSFWorkbook();
        // 创建一个sheet
        HSSFSheet sheet = wb.createSheet(title);
        mainclass.setHeadXls(sheet,wb,monthsarr,year,title);   //表头
        mainclass.setBodyXls(sheet,wb,monthsarr);   //表体
        return wb;
    }

    /*月份map*/
    public Map<String,Integer> getMonths(){
        Map<String,Integer> map = new HashMap<String,Integer>();
        map.put("一",1);
        map.put("二",2);
        map.put("三",3);
        map.put("四",4);
        map.put("五",5);
        map.put("六",6);
        map.put("七",7);
        map.put("八",8);
        map.put("九",9);
        map.put("十",10);
        map.put("十一",11);
        map.put("十二",12);
        return map;
    }

    public static void main(String args[]) throws Exception{
        ReportXlsByMoths cetd = new ReportXlsByMoths();
//        String[] arr = {"?","??","??","??","??","??"};
        String arr = "一,二,三,四";
//        String arr = "";
//        cetd.getMonths(arr);

        SimpleDateFormat df = new SimpleDateFormat("yyyy-mm-dd");
        System.out.println(new Date().getTime());
        Map[] maptest = new HashMap[]{};
        System.out.println(cetd.getMonths());
        try {
            FileOutputStream fout = new FileOutputStream("C:\\Users\\Administrator\\Downloads\\"+new Date().getTime()+".xls");
            getReport("2015",arr,maptest).write(fout);
//            getReport(arr);  //д??
            fout.close();
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}  