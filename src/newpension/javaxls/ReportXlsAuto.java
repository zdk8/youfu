package newpension.javaxls;

import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;

import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class ReportXlsAuto {
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
    /*表体头封装*/
    public String[] setBodyTxtArr(String bodytxt){
        String[] bodyTxtArr = {};
        if (bodytxt.length()>0){
            bodyTxtArr = bodytxt.split(",");
        }
        return bodyTxtArr;
    }
    /*表体字段封装*/
    public String[] setBodyFieldArr(String bodyfield){
        String[] bodyFieldArr = {};
        if (bodyfield.length()>0){
            bodyFieldArr = bodyfield.split(",");
        }
        return bodyFieldArr;
    }

    /*设置表头*/
    public void setHeadXls(HSSFSheet sheet,HSSFWorkbook wb,String[] bodyTxtArr){
        Calendar date=Calendar.getInstance();
        HSSFRow row = sheet.createRow((int) 0);  //创建第0行
        HSSFCell cell = row.createCell((short) 0);//创建单元格0
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, bodyTxtArr.length-1));//合并列
        cell.setCellValue("海盐县");//标题

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
    public void setBodyXls(HSSFSheet sheet,HSSFWorkbook wb,String[] bodyTxtArr){
        /*表体头(左)样式*/
        HSSFCellStyle stylebodyleft = wb.createCellStyle();
        stylebodyleft.setAlignment(HSSFCellStyle.ALIGN_LEFT);
        stylebodyleft.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        /*表体头(右)样式*/
        HSSFCellStyle stylebodyright = wb.createCellStyle();
        stylebodyright.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
        stylebodyright.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);


        /*公共样式*/
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.BORDER_MEDIUM);
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);
//        String bodytxt = getBodytxt();
        HSSFRow row1 = sheet.createRow((int) 1);  //创建第1行
        if (bodyTxtArr.length > 0){
            for (int i=0;i<bodyTxtArr.length;i++){
                HSSFCell cell = row1.createCell((short) i);
                cell.setCellValue(bodyTxtArr[i].toString());
                cell.setCellStyle(style);
            }
        }

        /*HSSFRow row2 = sheet.createRow((int) 2);  //创建第2行

        sheet.addMergedRegion(new CellRangeAddress(2,3,0,0));//合并行
        sheet.setColumnWidth(0,1500);//设置宽度
        HSSFCell cellxh = row2.createCell((short) 0);
        cellxh.setCellValue("序\n号");
        cellxh.setCellStyle(style);


        *//*边框标黑*//*
        row3.createCell((short) 11+monthsarr.length).setCellStyle(style);
        row3.createCell((short) 12+monthsarr.length).setCellStyle(style);*/
    }
    //表体值
    public void setValueXls(HSSFSheet sheet,HSSFWorkbook wb,String[] bodyfield){
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
        HSSFFont font2 = wb.createFont();  //字体
        font2.setFontHeightInPoints((short) 10);
        font2.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
        font2.setColor(HSSFColor.BLUE_GREY.index);
        HSSFCellStyle style_bold2 = wb.createCellStyle();
        style_bold2.setAlignment(HSSFCellStyle.BORDER_MEDIUM);
        style_bold2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        style_bold2.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style_bold2.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style_bold2.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style_bold2.setBorderRight(HSSFCellStyle.BORDER_THIN);
        style_bold2.setFont(font2);
        /*样式三*/
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.BORDER_MEDIUM);
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);

        int rowindex = 2;     //表体值从第4行开始
        if (bodyfield.length > 0){
            for (int i=0;i<bodyfield.length;i++){
                /*HSSFCell cell = row1.createCell((short) i);
                cell.setCellValue(bodyfield[i].toString());
                cell.setCellStyle(style);*/
            }
        }

        /*Map datasval = getDatas(datas);  //数据

        int rowindex = 4;     //表体值从第4行开始

        for (int i=0;i<datasval.size();i++){
            HSSFRow rownum = sheet.createRow((int) rowindex++);
            Map dataval = (Map)datasval.get(i);

            HSSFCell cellnum = rownum.createCell((short) 0);
            int rowval = i+1;
            cellnum.setCellValue(rowval);
            cellnum.setCellStyle(style);
            *//*被服务对象*//*
            HSSFCell cell_address1 = rownum.createCell((short) 1);
            String dvname1 = dataval.get(":dvname").toString();
            if (dvname1.length() > 0){
                cell_address1.setCellValue(dvname1);
            }
        }*/
    }
    /*xls导出报表*/
    public static Workbook getReport(String bodytxt,String bodyfield) throws Exception{

        // 创建webbook的Excel工作薄
        HSSFWorkbook wb = new HSSFWorkbook();
        // 创建一个sheet
        HSSFSheet sheet = wb.createSheet("11");
        ReportXlsAuto mainclass = new ReportXlsAuto();
        String[] bodytxtarr = mainclass.setBodyTxtArr(bodytxt);
        String[] bodyfieldarr = mainclass.setBodyFieldArr(bodyfield);
        mainclass.setHeadXls(sheet,wb,bodytxtarr);   //表头
        mainclass.setBodyXls(sheet, wb,bodytxtarr);   //表体
//        mainclass.setValueXls(sheet,wb,bodyfield,datas);   //值
        mainclass.setValueXls(sheet,wb,bodyfieldarr);   //值
        return wb;
    }
    /*xls导出空报表*/
    public static Workbook getReportNull(String year,String months) throws Exception{
        String[] monthsarr = {};//存放月份数组
        System.out.println("数组:"+monthsarr);
        String title = "xx月";
        ReportXlsAuto mainclass = new ReportXlsAuto();
        Map<String,Integer> map = mainclass.getMonths();
        if (months.length()>0){
            monthsarr = months.split(",");
            title = map.get(monthsarr[0])+"-"+map.get(monthsarr[monthsarr.length-1])+"月";
        }
        // 创建webbook的Excel工作薄
        HSSFWorkbook wb = new HSSFWorkbook();
        // 创建一个sheet
        HSSFSheet sheet = wb.createSheet(title);
//        mainclass.setHeadXls(sheet,wb,monthsarr,year,title);   //表头
//        mainclass.setBodyXls(sheet,wb,monthsarr);   //表体
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
        ReportXlsAuto cetd = new ReportXlsAuto();
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
//            getReport("2015",arr,maptest).write(fout);
//            getReport(arr);  //д??
            fout.close();
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}  