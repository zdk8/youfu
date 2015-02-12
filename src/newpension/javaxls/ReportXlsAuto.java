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
    public void setHeadXls(HSSFSheet sheet,HSSFWorkbook wb,String[] bodyTxtArr,String title){
        Calendar date=Calendar.getInstance();
        HSSFRow row = sheet.createRow((int) 0);  //创建第0行
        HSSFCell cell = row.createCell((short) 0);//创建单元格0
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, bodyTxtArr.length-1));//合并列
        cell.setCellValue("海盐县居家养老【"+title+"】人员列表");//标题

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

        HSSFRow row1 = sheet.createRow((int) 1);  //创建第1行
        if (bodyTxtArr.length > 0){
            for (int i=0;i<bodyTxtArr.length;i++){
                String txtval = bodyTxtArr[i].toString();
                if (txtval.equals("身份证号")){
                    sheet.setColumnWidth(i,6*1000);//设置宽度
                }else if (txtval.equals("住址")){
                    sheet.setColumnWidth(i,8*1000);//设置宽度
                }else{
                    sheet.setColumnWidth(i,4*1000);//设置宽度
                }
                HSSFCell cell = row1.createCell((short) i);
                cell.setCellValue(txtval);
                cell.setCellStyle(style_bold);
            }
        }
    }
    //表体值
    public void setValueXls(HSSFSheet sheet,HSSFWorkbook wb,String[] bodyfield,Map[] datas){
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.BORDER_MEDIUM);
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);

        int rowindex = 2;     //表体值从第2行开始
        Map datasval = getDatas(datas);  //数据
        for (int i=0;i<datasval.size();i++){        //行
            HSSFRow rownum = sheet.createRow((int) rowindex++);
            Map dataval = (Map)datasval.get(i);
            for (int j=0;j<bodyfield.length;j++){   //列
                HSSFCell cellnum = rownum.createCell((short) j);
                String name = ":"+bodyfield[j];
                String val = dataval.get(name).toString();
                if (val.length() > 0){
                    cellnum.setCellValue(val);
                }
                cellnum.setCellStyle(style);
            }
        }
    }
    /*xls导出报表*/
    public static Workbook getReport(String bodytxt,String bodyfield,String title,Map[] datas) throws Exception{
        // 创建webbook的Excel工作薄
        HSSFWorkbook wb = new HSSFWorkbook();
        // 创建一个sheet
        HSSFSheet sheet = wb.createSheet("人员列表");
        ReportXlsAuto mainclass = new ReportXlsAuto();
        String[] bodytxtarr = {};
        String[] bodyfieldarr = {};
        if (bodytxt.length() > 0){
            bodytxtarr = mainclass.setBodyTxtArr(bodytxt);
        }
        if (bodyfield.length() > 0){
            bodyfieldarr = mainclass.setBodyFieldArr(bodyfield);
        }
        mainclass.setHeadXls(sheet,wb,bodytxtarr,title);   //表头
        mainclass.setBodyXls(sheet, wb,bodytxtarr);   //表体
        mainclass.setValueXls(sheet,wb,bodyfieldarr,datas);   //值
        return wb;
    }
    /*xls导出空报表*/
    public static Workbook getReportNull(String bodytxt,String title) throws Exception{
        // 创建webbook的Excel工作薄
        HSSFWorkbook wb = new HSSFWorkbook();
        // 创建一个sheet
        HSSFSheet sheet = wb.createSheet("人员列表");
        ReportXlsAuto mainclass = new ReportXlsAuto();
        String[] bodytxtarr = {};
        if (bodytxt.length() > 0){
            bodytxtarr = mainclass.setBodyTxtArr(bodytxt);
        }
        mainclass.setHeadXls(sheet,wb,bodytxtarr,title);   //表头
        mainclass.setBodyXls(sheet,wb,bodytxtarr);   //表体
        return wb;
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
//        System.out.println(cetd.getMonths());
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