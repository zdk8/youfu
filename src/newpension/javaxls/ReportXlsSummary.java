package newpension.javaxls;

import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;

import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: Administrator
 * Date: 15-1-31
 * Time: ????2:24
 * To change this template use File | Settings | File Templates.
 */
public class ReportXlsSummary {
    /*???*/
    public void setHeadXls(HSSFSheet sheet,HSSFWorkbook wb){
        Calendar date=Calendar.getInstance();
        HSSFRow row = sheet.createRow((int) 0);  //??????
        HSSFCell cell = row.createCell((short) 0);//????????????
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 16));//?????
        cell.setCellValue(date.get(Calendar.YEAR)+"??1-12????????????????????????");//???????

        HSSFFont font = wb.createFont();  //????
        font.setFontHeightInPoints((short) 16);
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
        HSSFCellStyle style = wb.createCellStyle();  //????????????
        style.setAlignment(HSSFCellStyle.BORDER_MEDIUM); // ??????????§Ú??
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        style.setFont(font);

        cell.setCellStyle(style);//???
        row.setHeight((short) 500);

    }
    /*????*/
    public void setBodyXls(HSSFSheet sheet,HSSFWorkbook wb){
        /*????*/
        HSSFCellStyle stylebodyleft = wb.createCellStyle();  //????????????
        stylebodyleft.setAlignment(HSSFCellStyle.ALIGN_LEFT); // ??????????§Ú??
        stylebodyleft.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        /*?????*/
        HSSFCellStyle stylebodyright = wb.createCellStyle();  //????????????
        stylebodyright.setAlignment(HSSFCellStyle.ALIGN_RIGHT); // ??????????§Ú??
        stylebodyright.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

        HSSFRow row1 = sheet.createRow((int) 1);             //??????1??
        sheet.addMergedRegion(new CellRangeAddress(1,1,0,4));//?????
        HSSFCell cellbzdw = row1.createCell((short) 0);
        cellbzdw.setCellValue("?????¦Ë??????????????»_??");
        cellbzdw.setCellStyle(stylebodyleft);
        sheet.addMergedRegion(new CellRangeAddress(1,1,15,16));//?????
        HSSFCell celljedw = row1.createCell((short) 15);
        celljedw.setCellValue("???¦Ë???");
        celljedw.setCellStyle(stylebodyright);

        /*???????*/
        HSSFFont font = wb.createFont();  //????
        font.setFontHeightInPoints((short) 12);
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
        HSSFCellStyle style = wb.createCellStyle();  //????????????
        style.setAlignment(HSSFCellStyle.BORDER_MEDIUM); // ??????????§Ú??
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);
        style.setFont(font);

        HSSFRow row2 = sheet.createRow((int) 2);  //??????2??

        sheet.addMergedRegion(new CellRangeAddress(2,3,0,0));//?????
        sheet.setColumnWidth(0,1500);//?????§á?
        HSSFCell cellxh = row2.createCell((short) 0);
        cellxh.setCellValue("??\n??");
        cellxh.setCellStyle(style);


        sheet.addMergedRegion(new CellRangeAddress(2,3,1,1));//?????
        sheet.setColumnWidth(1,5*1000);//?????§á?
        HSSFCell cellxzjd = row2.createCell((short) 1);
        cellxzjd.setCellValue("??(???)????");
        cellxzjd.setCellStyle(style);

        sheet.addMergedRegion(new CellRangeAddress(2,3,2,2));//?????
        HSSFCell cellrsh = row2.createCell((short) 2);
        cellrsh.setCellValue("????");
        cellrsh.setCellStyle(style);

        sheet.addMergedRegion(new CellRangeAddress(2,2,3,14));//?????
        HSSFCell cellbfwdx = row2.createCell((short) 3);//?¡¤?
        cellbfwdx.setCellValue("??        ??");
        cellbfwdx.setCellStyle(style);
        row2.createCell((short) 4).setCellStyle(style);
        row2.createCell((short) 5).setCellStyle(style);
        row2.createCell((short) 6).setCellStyle(style);
        row2.createCell((short) 7).setCellStyle(style);
        row2.createCell((short) 8).setCellStyle(style);
        row2.createCell((short) 9).setCellStyle(style);
        row2.createCell((short) 10).setCellStyle(style);
        row2.createCell((short) 11).setCellStyle(style);
        row2.createCell((short) 12).setCellStyle(style);
        row2.createCell((short) 13).setCellStyle(style);
        row2.createCell((short) 14).setCellStyle(style);

        HSSFRow row3 = sheet.createRow((int) 3);  //??????3??
        HSSFCell cellbfyue1 = row3.createCell((short) 3);
        cellbfyue1.setCellValue("???");
        cellbfyue1.setCellStyle(style);
        HSSFCell cellbfyue2 = row3.createCell((short) 4);
        cellbfyue2.setCellValue("????");
        cellbfyue2.setCellStyle(style);
        HSSFCell cellbfyue3 = row3.createCell((short) 5);
        cellbfyue3.setCellValue("????");
        cellbfyue3.setCellStyle(style);
        HSSFCell cellbfyue4 = row3.createCell((short) 6);
        cellbfyue4.setCellValue("????");
        cellbfyue4.setCellStyle(style);
        HSSFCell cellbfyue5 = row3.createCell((short) 7);
        cellbfyue5.setCellValue("????");
        cellbfyue5.setCellStyle(style);
        HSSFCell cellbfyue6 = row3.createCell((short) 8);
        cellbfyue6.setCellValue("????");
        cellbfyue6.setCellStyle(style);
        HSSFCell cellbfyue7 = row3.createCell((short) 9);
        cellbfyue7.setCellValue("????");
        cellbfyue7.setCellStyle(style);
        HSSFCell cellbfyue8 = row3.createCell((short) 10);
        cellbfyue8.setCellValue("????");
        cellbfyue8.setCellStyle(style);
        HSSFCell cellbfyue9 = row3.createCell((short) 11);
        cellbfyue9.setCellValue("????");
        cellbfyue9.setCellStyle(style);
        HSSFCell cellbfyue10 = row3.createCell((short) 12);
        cellbfyue10.setCellValue("???");
        cellbfyue10.setCellStyle(style);
        HSSFCell cellbfyue11 = row3.createCell((short) 13);
        cellbfyue11.setCellValue("????");
        cellbfyue11.setCellStyle(style);
        HSSFCell cellbfyue12 = row3.createCell((short) 14);
        cellbfyue12.setCellValue("?????");
        cellbfyue12.setCellStyle(style);

        sheet.addMergedRegion(new CellRangeAddress(2, 3, 15, 15)); //?????
        sheet.setColumnWidth(15,4*1000);//?????§á?
        HSSFCell cellzybz = row2.createCell((short) 15);
        cellzybz.setCellValue("??????");
        style.setWrapText(true);
        cellzybz.setCellStyle(style);
        sheet.addMergedRegion(new CellRangeAddress(2, 3, 16, 16));//?????
        sheet.setColumnWidth(16,4*1000);//?????§á?
        HSSFCell cellhjje = row2.createCell((short) 16);
        cellhjje.setCellValue("?????");
        style.setWrapText(true);
        cellhjje.setCellStyle(style);
        //*???*//*
        row3.createCell((short) 0).setCellStyle(style);
        row3.createCell((short) 1).setCellStyle(style);
        row3.createCell((short) 2).setCellStyle(style);
        row3.createCell((short) 15).setCellStyle(style);
        row3.createCell((short) 16).setCellStyle(style);
    }
    //?
    public void setValueXls(HSSFSheet sheet,HSSFWorkbook wb){
        HSSFCellStyle style = wb.createCellStyle();  //????????????
        style.setAlignment(HSSFCellStyle.BORDER_MEDIUM); // ??????????§Ú??
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);

        String[][] strval = {
                {"0","??????","?????","330424194108120811","?????","?????","330424196607160817","?????","?§Ø?","???","30"},
                {"1","??????","????","330424194703120816","?????","????","330424196401290835","?????","?§Ø?","???","30"}
        };

        int rowindex = 4;     //??????4?§á??
        for(int i=0;i<strval.length;i++){
            HSSFRow rownum = sheet.createRow((int) rowindex++);
            for (int j=0;j<strval[i].length;j++){
                HSSFCell cellvar = rownum.createCell((short) j);
                cellvar.setCellValue(strval[i][j]);
                cellvar.setCellStyle(style);
            }
        }
    }
    /*xls??????*/
    public static Workbook getReport(String months) throws Exception{
        String title = "?????";
        ReportXlsSummary summary = new ReportXlsSummary();
        // ??????????????webbook????????Excel???
        HSSFWorkbook wb = new HSSFWorkbook();    //??????????
        // ?????????webbook????????sheet,???Excel????§Ö?sheet
        HSSFSheet sheet = wb.createSheet(title);    //???????
        summary.setHeadXls(sheet,wb);   //???????
        summary.setBodyXls(sheet,wb);   //????????
        summary.setValueXls(sheet,wb);   //?????
        return wb;
    }

    public static void main(String args[]) throws Exception{
        ReportXlsSummary summary = new ReportXlsSummary();
//        String[] arr = {"?","??","??","??","??","??"};
        String arr = "?,??,??,??,??,??,??,??,??,?,??,???";
//        String arr = "";
//        cetd.getMonths(arr);

        SimpleDateFormat df = new SimpleDateFormat("yyyy-mm-dd");
        System.out.println(new Date().getTime());

        try {
            FileOutputStream fout = new FileOutputStream("C:\\Users\\Administrator\\Downloads\\"+new Date().getTime()+".xls");
            getReport(arr).write(fout);  //§Õ??
            fout.close();
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
