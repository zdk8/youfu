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
    /*����ͷ��װ*/
    public String[] setBodyTxtArr(String bodytxt){
        String[] bodyTxtArr = {};
        if (bodytxt.length()>0){
            bodyTxtArr = bodytxt.split(",");
        }
        return bodyTxtArr;
    }
    /*�����ֶη�װ*/
    public String[] setBodyFieldArr(String bodyfield){
        String[] bodyFieldArr = {};
        if (bodyfield.length()>0){
            bodyFieldArr = bodyfield.split(",");
        }
        return bodyFieldArr;
    }

    /*���ñ�ͷ*/
    public void setHeadXls(HSSFSheet sheet,HSSFWorkbook wb,String[] bodyTxtArr){
        Calendar date=Calendar.getInstance();
        HSSFRow row = sheet.createRow((int) 0);  //������0��
        HSSFCell cell = row.createCell((short) 0);//������Ԫ��0
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, bodyTxtArr.length-1));//�ϲ���
        cell.setCellValue("������");//����

        HSSFFont font = wb.createFont();  //����
        font.setFontHeightInPoints((short) 16);
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
        HSSFCellStyle style = wb.createCellStyle();  //��ʽ
        style.setAlignment(HSSFCellStyle.BORDER_MEDIUM); // ���Ҷ���
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER); //���¶���
        style.setFont(font);

        cell.setCellStyle(style);//������ʽ
        row.setHeight((short) 500);

    }
    /*���ñ���*/
    public void setBodyXls(HSSFSheet sheet,HSSFWorkbook wb,String[] bodyTxtArr){
        /*����ͷ(��)��ʽ*/
        HSSFCellStyle stylebodyleft = wb.createCellStyle();
        stylebodyleft.setAlignment(HSSFCellStyle.ALIGN_LEFT);
        stylebodyleft.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        /*����ͷ(��)��ʽ*/
        HSSFCellStyle stylebodyright = wb.createCellStyle();
        stylebodyright.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
        stylebodyright.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);


        /*������ʽ*/
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.BORDER_MEDIUM);
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);
//        String bodytxt = getBodytxt();
        HSSFRow row1 = sheet.createRow((int) 1);  //������1��
        if (bodyTxtArr.length > 0){
            for (int i=0;i<bodyTxtArr.length;i++){
                HSSFCell cell = row1.createCell((short) i);
                cell.setCellValue(bodyTxtArr[i].toString());
                cell.setCellStyle(style);
            }
        }

        /*HSSFRow row2 = sheet.createRow((int) 2);  //������2��

        sheet.addMergedRegion(new CellRangeAddress(2,3,0,0));//�ϲ���
        sheet.setColumnWidth(0,1500);//���ÿ��
        HSSFCell cellxh = row2.createCell((short) 0);
        cellxh.setCellValue("��\n��");
        cellxh.setCellStyle(style);


        *//*�߿���*//*
        row3.createCell((short) 11+monthsarr.length).setCellStyle(style);
        row3.createCell((short) 12+monthsarr.length).setCellStyle(style);*/
    }
    //����ֵ
    public void setValueXls(HSSFSheet sheet,HSSFWorkbook wb,String[] bodyfield){
        /*��ʽһ*/
        HSSFFont font = wb.createFont();  //����
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
        /*��ʽ��*/
        HSSFFont font2 = wb.createFont();  //����
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
        /*��ʽ��*/
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.BORDER_MEDIUM);
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);

        int rowindex = 2;     //����ֵ�ӵ�4�п�ʼ
        if (bodyfield.length > 0){
            for (int i=0;i<bodyfield.length;i++){
                /*HSSFCell cell = row1.createCell((short) i);
                cell.setCellValue(bodyfield[i].toString());
                cell.setCellStyle(style);*/
            }
        }

        /*Map datasval = getDatas(datas);  //����

        int rowindex = 4;     //����ֵ�ӵ�4�п�ʼ

        for (int i=0;i<datasval.size();i++){
            HSSFRow rownum = sheet.createRow((int) rowindex++);
            Map dataval = (Map)datasval.get(i);

            HSSFCell cellnum = rownum.createCell((short) 0);
            int rowval = i+1;
            cellnum.setCellValue(rowval);
            cellnum.setCellStyle(style);
            *//*���������*//*
            HSSFCell cell_address1 = rownum.createCell((short) 1);
            String dvname1 = dataval.get(":dvname").toString();
            if (dvname1.length() > 0){
                cell_address1.setCellValue(dvname1);
            }
        }*/
    }
    /*xls��������*/
    public static Workbook getReport(String bodytxt,String bodyfield) throws Exception{

        // ����webbook��Excel������
        HSSFWorkbook wb = new HSSFWorkbook();
        // ����һ��sheet
        HSSFSheet sheet = wb.createSheet("11");
        ReportXlsAuto mainclass = new ReportXlsAuto();
        String[] bodytxtarr = mainclass.setBodyTxtArr(bodytxt);
        String[] bodyfieldarr = mainclass.setBodyFieldArr(bodyfield);
        mainclass.setHeadXls(sheet,wb,bodytxtarr);   //��ͷ
        mainclass.setBodyXls(sheet, wb,bodytxtarr);   //����
//        mainclass.setValueXls(sheet,wb,bodyfield,datas);   //ֵ
        mainclass.setValueXls(sheet,wb,bodyfieldarr);   //ֵ
        return wb;
    }
    /*xls�����ձ���*/
    public static Workbook getReportNull(String year,String months) throws Exception{
        String[] monthsarr = {};//����·�����
        System.out.println("����:"+monthsarr);
        String title = "xx��";
        ReportXlsAuto mainclass = new ReportXlsAuto();
        Map<String,Integer> map = mainclass.getMonths();
        if (months.length()>0){
            monthsarr = months.split(",");
            title = map.get(monthsarr[0])+"-"+map.get(monthsarr[monthsarr.length-1])+"��";
        }
        // ����webbook��Excel������
        HSSFWorkbook wb = new HSSFWorkbook();
        // ����һ��sheet
        HSSFSheet sheet = wb.createSheet(title);
//        mainclass.setHeadXls(sheet,wb,monthsarr,year,title);   //��ͷ
//        mainclass.setBodyXls(sheet,wb,monthsarr);   //����
        return wb;
    }

    /*�·�map*/
    public Map<String,Integer> getMonths(){
        Map<String,Integer> map = new HashMap<String,Integer>();
        map.put("һ",1);
        map.put("��",2);
        map.put("��",3);
        map.put("��",4);
        map.put("��",5);
        map.put("��",6);
        map.put("��",7);
        map.put("��",8);
        map.put("��",9);
        map.put("ʮ",10);
        map.put("ʮһ",11);
        map.put("ʮ��",12);
        return map;
    }

    public static void main(String args[]) throws Exception{
        ReportXlsAuto cetd = new ReportXlsAuto();
//        String[] arr = {"?","??","??","??","??","??"};
        String arr = "һ,��,��,��";
//        String arr = "";
//        cetd.getMonths(arr);

        SimpleDateFormat df = new SimpleDateFormat("yyyy-mm-dd");
        System.out.println(new Date().getTime());
        Map[] maptest = new HashMap[]{};
        System.out.println(cetd.getMonths());
        try {
            FileOutputStream fout = new FileOutputStream("C:\\Users\\Administrator\\Downloads\\"+new Date().getTime()+".xls");
//            getReport("2015",arr,maptest).write(fout);
//            getReport(arr);  //��??
            fout.close();
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}  