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

/**
 * Created with IntelliJ IDEA.
 * User: Administrator
 * Date: 15-1-31
 * Time: ????2:24
 * To change this template use File | Settings | File Templates.
 */
public class ReportXlsSummary {
    /*��ȡ��������*/
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
    /*���ñ�ͷ*/
    public void setHeadXls(HSSFSheet sheet,HSSFWorkbook wb,String title){
        HSSFRow row = sheet.createRow((int) 0);  //������0��
        HSSFCell cell = row.createCell((short) 0);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 16));//�ϲ���
        cell.setCellValue(title+"��1-12�¾Ӽ���������������񾭷ѻ��ܱ�");

        HSSFFont font = wb.createFont();  //����
        font.setFontHeightInPoints((short) 16);
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.BORDER_MEDIUM);
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        style.setFont(font);

        cell.setCellStyle(style);
        row.setHeight((short) 500);

    }
    /*���ñ���*/
    public void setBodyXls(HSSFSheet sheet,HSSFWorkbook wb){
        /*��ʽ(left)*/
        HSSFCellStyle stylebodyleft = wb.createCellStyle();
        stylebodyleft.setAlignment(HSSFCellStyle.ALIGN_LEFT);
        stylebodyleft.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        /*��ʽ(right)*/
        HSSFCellStyle stylebodyright = wb.createCellStyle();
        stylebodyright.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
        stylebodyright.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

        HSSFRow row1 = sheet.createRow((int) 1);             //������1��
        sheet.addMergedRegion(new CellRangeAddress(1,1,0,4));
        HSSFCell cellbzdw = row1.createCell((short) 0);
        cellbzdw.setCellValue("���Ƶ�λ�������ز������籣��");
        cellbzdw.setCellStyle(stylebodyleft);
        sheet.addMergedRegion(new CellRangeAddress(1,1,15,16));
        HSSFCell celljedw = row1.createCell((short) 15);
        celljedw.setCellValue("��λ��Ԫ");
        celljedw.setCellStyle(stylebodyright);

        /*������ʽ*/
        HSSFFont font = wb.createFont();
        font.setFontHeightInPoints((short) 12);
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.BORDER_MEDIUM);
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);
        style.setFont(font);

        HSSFRow row2 = sheet.createRow((int) 2);  //������2��

        sheet.addMergedRegion(new CellRangeAddress(2,3,0,0));
        sheet.setColumnWidth(0,1500);
        HSSFCell cellxh = row2.createCell((short) 0);
        cellxh.setCellValue("��\n��");
        cellxh.setCellStyle(style);


        sheet.addMergedRegion(new CellRangeAddress(2,3,1,1));
        sheet.setColumnWidth(1,5*1000);//?????��?
        HSSFCell cellxzjd = row2.createCell((short) 1);
        cellxzjd.setCellValue("�򣨽ֵ�������");
        cellxzjd.setCellStyle(style);

        sheet.addMergedRegion(new CellRangeAddress(2,3,2,2));
        HSSFCell cellrsh = row2.createCell((short) 2);
        cellrsh.setCellValue("�� ��");
        cellrsh.setCellStyle(style);

        sheet.addMergedRegion(new CellRangeAddress(2,2,3,14));
        HSSFCell cellbfwdx = row2.createCell((short) 3);
        cellbfwdx.setCellValue("��       ��");
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

        HSSFRow row3 = sheet.createRow((int) 3);  //������3��
        HSSFCell cellbfyue1 = row3.createCell((short) 3);
        cellbfyue1.setCellValue("һ��");
        cellbfyue1.setCellStyle(style);
        HSSFCell cellbfyue2 = row3.createCell((short) 4);
        cellbfyue2.setCellValue("����");
        cellbfyue2.setCellStyle(style);
        HSSFCell cellbfyue3 = row3.createCell((short) 5);
        cellbfyue3.setCellValue("����");
        cellbfyue3.setCellStyle(style);
        HSSFCell cellbfyue4 = row3.createCell((short) 6);
        cellbfyue4.setCellValue("����");
        cellbfyue4.setCellStyle(style);
        HSSFCell cellbfyue5 = row3.createCell((short) 7);
        cellbfyue5.setCellValue("����");
        cellbfyue5.setCellStyle(style);
        HSSFCell cellbfyue6 = row3.createCell((short) 8);
        cellbfyue6.setCellValue("����");
        cellbfyue6.setCellStyle(style);
        HSSFCell cellbfyue7 = row3.createCell((short) 9);
        cellbfyue7.setCellValue("����");
        cellbfyue7.setCellStyle(style);
        HSSFCell cellbfyue8 = row3.createCell((short) 10);
        cellbfyue8.setCellValue("����");
        cellbfyue8.setCellStyle(style);
        HSSFCell cellbfyue9 = row3.createCell((short) 11);
        cellbfyue9.setCellValue("����");
        cellbfyue9.setCellStyle(style);
        HSSFCell cellbfyue10 = row3.createCell((short) 12);
        cellbfyue10.setCellValue("ʮ��");
        cellbfyue10.setCellStyle(style);
        HSSFCell cellbfyue11 = row3.createCell((short) 13);
        cellbfyue11.setCellValue("ʮһ��");
        cellbfyue11.setCellStyle(style);
        HSSFCell cellbfyue12 = row3.createCell((short) 14);
        cellbfyue12.setCellValue("ʮ����");
        cellbfyue12.setCellStyle(style);

        sheet.addMergedRegion(new CellRangeAddress(2, 3, 15, 15));
        sheet.setColumnWidth(15,4*1000);
        HSSFCell cellzybz = row2.createCell((short) 15);
        cellzybz.setCellValue("סԺ����");
        style.setWrapText(true);
        cellzybz.setCellStyle(style);
        sheet.addMergedRegion(new CellRangeAddress(2, 3, 16, 16));
        sheet.setColumnWidth(16, 4 * 1000);
        HSSFCell cellhjje = row2.createCell((short) 16);
        cellhjje.setCellValue("�ϼƽ��");
        style.setWrapText(true);
        cellhjje.setCellStyle(style);

        row3.createCell((short) 0).setCellStyle(style);
        row3.createCell((short) 1).setCellStyle(style);
        row3.createCell((short) 2).setCellStyle(style);
        row3.createCell((short) 15).setCellStyle(style);
        row3.createCell((short) 16).setCellStyle(style);
    }
    //����ֵ
    public void setValueXls(HSSFSheet sheet,HSSFWorkbook wb,Map[] datas){
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.BORDER_MEDIUM);
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);

        /*String[][] strval = {
                {"0","??????","?????","330424194108120811","?????","?????","330424196607160817","?????","?��?","???","30"},
                {"1","??????","????","330424194703120816","?????","????","330424196401290835","?????","?��?","???","30"}
        };

        int rowindex = 4;
        for(int i=0;i<strval.length;i++){
            HSSFRow rownum = sheet.createRow((int) rowindex++);
            for (int j=0;j<strval[i].length;j++){
                HSSFCell cellvar = rownum.createCell((short) j);
                cellvar.setCellValue(strval[i][j]);
                cellvar.setCellStyle(style);
            }
        }*/
        Map datasval = getDatas(datas);
        int rowindex = 4;     //����ֵ�ӵ�4�п�ʼ
        for (int i=0;i<datasval.size();i++) {
            HSSFRow rownum = sheet.createRow((int) rowindex++);
            Map dataval = (Map) datasval.get(i);
            /*���*/
            HSSFCell cellnum = rownum.createCell((short) 0);
            int rowval = i + 1;
            cellnum.setCellValue(rowval);
            cellnum.setCellStyle(style);

            HSSFCell cell_address1 = rownum.createCell((short) 1);      //�ֵ�����
            cell_address1.setCellValue("��ԭ��");
            cell_address1.setCellStyle(style);

            HSSFCell cell_name = rownum.createCell((short) 2);           //����
            cell_name.setCellValue(dataval.get(":name").toString());
            cell_name.setCellStyle(style);

            HSSFCell cell_month1 = rownum.createCell((short) 3);           //�·�
            cell_month1.setCellValue(dataval.get(":һ").toString());
            cell_month1.setCellStyle(style);
            HSSFCell cell_month2 = rownum.createCell((short) 4);
            cell_month2.setCellValue(dataval.get(":��").toString());
            cell_month2.setCellStyle(style);
            HSSFCell cell_month3 = rownum.createCell((short) 5);
            cell_month3.setCellValue(dataval.get(":��").toString());
            cell_month3.setCellStyle(style);
            HSSFCell cell_month4 = rownum.createCell((short) 6);
            cell_month4.setCellValue(dataval.get(":��").toString());
            cell_month4.setCellStyle(style);
            HSSFCell cell_month5 = rownum.createCell((short) 7);
            cell_month5.setCellValue(dataval.get(":��").toString());
            cell_month5.setCellStyle(style);
            HSSFCell cell_month6 = rownum.createCell((short) 8);
            cell_month6.setCellValue(dataval.get(":��").toString());
            cell_month6.setCellStyle(style);
            HSSFCell cell_month7 = rownum.createCell((short) 9);
            cell_month7.setCellValue(dataval.get(":��").toString());
            cell_month7.setCellStyle(style);
            HSSFCell cell_month8 = rownum.createCell((short) 10);
            cell_month8.setCellValue(dataval.get(":��").toString());
            cell_month8.setCellStyle(style);
            HSSFCell cell_month9 = rownum.createCell((short) 11);
            cell_month9.setCellValue(dataval.get(":��").toString());
            cell_month9.setCellStyle(style);
            HSSFCell cell_month10 = rownum.createCell((short) 12);
            cell_month10.setCellValue(dataval.get(":ʮ").toString());
            cell_month10.setCellStyle(style);
            HSSFCell cell_month11 = rownum.createCell((short) 13);
            cell_month11.setCellValue(dataval.get(":ʮһ").toString());
            cell_month11.setCellStyle(style);
            HSSFCell cell_month12 = rownum.createCell((short) 14);
            cell_month12.setCellValue(dataval.get(":ʮ��").toString());
            cell_month12.setCellStyle(style);

            HSSFCell cell_zybt = rownum.createCell((short) 15);
            cell_zybt.setCellValue(dataval.get(":һ").toString());
            cell_zybt.setCellStyle(style);
            HSSFCell cell_hjje = rownum.createCell((short) 16);
            cell_hjje.setCellValue(dataval.get(":һ").toString());
            cell_hjje.setCellStyle(style);
        }
    }
    /*xls����*/
    public static Workbook getReport(String year,Map[] datas) throws Exception{
        String title = "���ܱ�";
        HSSFWorkbook wb = new HSSFWorkbook();    //����workbook
        HSSFSheet sheet = wb.createSheet(title);    //����sheet
        ReportXlsSummary summary = new ReportXlsSummary();
        summary.setHeadXls(sheet,wb,year);
        summary.setBodyXls(sheet,wb);
        summary.setValueXls(sheet,wb,datas);
        return wb;
    }
    /*�ձ���*/
    public static Workbook getReportNull(String year) throws Exception{
        String title = "���ܱ�";
        HSSFWorkbook wb = new HSSFWorkbook();    //����workbook
        HSSFSheet sheet = wb.createSheet(title);    //����sheet
        ReportXlsSummary summary = new ReportXlsSummary();
        summary.setHeadXls(sheet,wb,year);
        summary.setBodyXls(sheet,wb);
        return wb;
    }

    public static void main(String args[]) throws Exception{
        ReportXlsSummary summary = new ReportXlsSummary();
//        String[] arr = {"?","??","??","??","??","??"};
//        String arr = "?,??,??,??,??,??,??,??,??,?,??,???";
//        String arr = "";
//        cetd.getMonths(arr);

        SimpleDateFormat df = new SimpleDateFormat("yyyy-mm-dd");
        System.out.println(new Date().getTime());
        Map[] maptest = new HashMap[]{};
        try {
            FileOutputStream fout = new FileOutputStream("C:\\Users\\Administrator\\Downloads\\"+new Date().getTime()+".xls");
            getReport("2015",maptest).write(fout);
            fout.close();
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
