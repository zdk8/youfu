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
    public void setHeadXls(HSSFSheet sheet,HSSFWorkbook wb,String[] monthsarr,String year,String title){
        Calendar date=Calendar.getInstance();
        HSSFRow row = sheet.createRow((int) 0);  //������0��
        HSSFCell cell = row.createCell((short) 0);//������Ԫ��0
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 12+monthsarr.length));//�ϲ���
        cell.setCellValue("������"+year+"��"+title+"�Ӽ�����������������ʽ��°��嵥");//����

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
    public void setBodyXls(HSSFSheet sheet,HSSFWorkbook wb,String[] monthsarr){
        /*����ͷ(��)��ʽ*/
        HSSFCellStyle stylebodyleft = wb.createCellStyle();
        stylebodyleft.setAlignment(HSSFCellStyle.ALIGN_LEFT);
        stylebodyleft.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        /*����ͷ(��)��ʽ*/
        HSSFCellStyle stylebodyright = wb.createCellStyle();
        stylebodyright.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
        stylebodyright.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

        HSSFRow row1 = sheet.createRow((int) 1);             //������1��
        sheet.addMergedRegion(new CellRangeAddress(1,1,0,4));//�ϲ���
        HSSFCell cellbzdw = row1.createCell((short) 0);
        cellbzdw.setCellValue("���Ƶ�λ��������������");
        cellbzdw.setCellStyle(stylebodyleft);
        sheet.addMergedRegion(new CellRangeAddress(1,1,10,12+monthsarr.length));//�ϲ���
        HSSFCell celljedw = row1.createCell((short) 10);
        celljedw.setCellValue("��λ��Ԫ");
        celljedw.setCellStyle(stylebodyright);

        /*������ʽ*/
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.BORDER_MEDIUM);
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);

        HSSFRow row2 = sheet.createRow((int) 2);  //������2��

        sheet.addMergedRegion(new CellRangeAddress(2,3,0,0));//�ϲ���
        sheet.setColumnWidth(0,1500);//���ÿ��
        HSSFCell cellxh = row2.createCell((short) 0);
        cellxh.setCellValue("��\n��");
        cellxh.setCellStyle(style);

        sheet.addMergedRegion(new CellRangeAddress(2,3,1,1));
        HSSFCell cellxzjd = row2.createCell((short) 1);
        cellxzjd.setCellValue("����ֵ�");
        cellxzjd.setCellStyle(style);

        sheet.addMergedRegion(new CellRangeAddress(2,2,2,4));
        HSSFCell cellbfwdx = row2.createCell((short) 2);
        cellbfwdx.setCellValue("�� �� �� �� ��");
        cellbfwdx.setCellStyle(style);
        row2.createCell((short) 3).setCellStyle(style);
        row2.createCell((short) 4).setCellStyle(style);
        row2.createCell((short) 6).setCellStyle(style);
        row2.createCell((short) 7).setCellStyle(style);

        HSSFRow row3 = sheet.createRow((int) 3);  //������3��
        HSSFCell cellbfwdx_xm = row3.createCell((short) 2);
        cellbfwdx_xm.setCellValue("�� ��");
        cellbfwdx_xm.setCellStyle(style);
        row3.createCell((short) 0).setCellStyle(style);
        row3.createCell((short) 1).setCellStyle(style);
        row3.createCell((short) 8).setCellStyle(style);
        row3.createCell((short) 9).setCellStyle(style);
        row3.createCell((short) 10).setCellStyle(style);

        HSSFCell cellbfwdx_sfzh = row3.createCell((short) 3);
        sheet.setColumnWidth(3,5*1000);
        cellbfwdx_sfzh.setCellValue("���֤��");
        cellbfwdx_sfzh.setCellStyle(style);
        HSSFCell cellbfwdx_jtzz = row3.createCell((short) 4);
        sheet.setColumnWidth(4,6*1000);
        cellbfwdx_jtzz.setCellValue("��ͥ��ַ");
        cellbfwdx_jtzz.setCellStyle(style);

        sheet.addMergedRegion(new CellRangeAddress(2,2,5,7));
        HSSFCell cellfwry = row2.createCell((short) 5);
        cellfwry.setCellValue("��  ��  ��  Ա");
        cellfwry.setCellStyle(style);
        HSSFCell cellfwry_xm = row3.createCell((short) 5);
        cellfwry_xm.setCellValue("�� ��");
        cellfwry_xm.setCellStyle(style);
        HSSFCell cellfwry_sfzh = row3.createCell((short) 6);
        sheet.setColumnWidth(6,5*1000);
        cellfwry_sfzh.setCellValue("���֤��");
        cellfwry_sfzh.setCellStyle(style);
        HSSFCell cellfwry_jtdz = row3.createCell((short) 7);
        sheet.setColumnWidth(7,6*1000);
        cellfwry_jtdz.setCellValue("��ͥ��ַ");
        cellfwry_jtdz.setCellStyle(style);

        sheet.addMergedRegion(new CellRangeAddress(2,3,8,8));
        HSSFCell cellfwdj = row2.createCell((short) 8);
        cellfwdj.setCellValue("����ȼ�");
        cellfwdj.setCellStyle(style);
        sheet.addMergedRegion(new CellRangeAddress(2, 3, 9, 9));
        HSSFCell cellrylx = row2.createCell((short) 9);
        cellrylx.setCellValue("��Ա����");
        cellrylx.setCellStyle(style);
        sheet.addMergedRegion(new CellRangeAddress(2, 3, 10, 10));
        HSSFCell cellzfgmfubz = row2.createCell((short) 10);
        cellzfgmfubz.setCellValue("������������׼(Сʱ)");
        style.setWrapText(true);
        cellzfgmfubz.setCellStyle(style);
        /*�·�*/
        if (monthsarr.length>0){
            for (int i=0;i<monthsarr.length;i++){
                sheet.addMergedRegion(new CellRangeAddress(2, 3, 11+i, 11+i));
                HSSFCell cellzybz = row2.createCell((short) 11+i);
                cellzybz.setCellValue(monthsarr[i]+"��");
                cellzybz.setCellStyle(style);
                /*�߿���*/
                row3.createCell((short) 11+i).setCellStyle(style);
            }
        }
        sheet.addMergedRegion(new CellRangeAddress(2, 3, 11+monthsarr.length, 11+monthsarr.length));
        HSSFCell cellzybz = row2.createCell((short) 11+monthsarr.length);
        cellzybz.setCellValue("סԺ����");
        style.setWrapText(true);
        cellzybz.setCellStyle(style);
        sheet.addMergedRegion(new CellRangeAddress(2, 3, 12+monthsarr.length, 12+monthsarr.length));
        HSSFCell cellbzje = row2.createCell((short) 12+monthsarr.length);
        cellbzje.setCellValue("�������");
        style.setWrapText(true);
        cellbzje.setCellStyle(style);
        /*�߿���*/
        row3.createCell((short) 11+monthsarr.length).setCellStyle(style);
        row3.createCell((short) 12+monthsarr.length).setCellStyle(style);
    }
    //����ֵ
    public void setValueXls(HSSFSheet sheet,HSSFWorkbook wb,String[] monthsarr,Map[] datas){
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
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.BORDER_MEDIUM);
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);

        Map datasval = getDatas(datas);  //����

        HSSFRow row4 = sheet.createRow((int) 4);
        sheet.addMergedRegion(new CellRangeAddress(4,4,0,3));
        HSSFCell cell_heji = row4.createCell((short) 0);   //�ϼ�
        cell_heji.setCellValue("��   ��");
        cell_heji.setCellStyle(style_bold);
        row4.createCell((short) 1).setCellStyle(style_bold);
        row4.createCell((short) 2).setCellStyle(style_bold);
        row4.createCell((short) 3).setCellStyle(style_bold);
        HSSFCell cell_renshu = row4.createCell((short) 4);   //����
        cell_renshu.setCellValue("��  ��");
        cell_renshu.setCellStyle(style_bold);
        HSSFCell cell_renshu_val = row4.createCell((short) 5);   //����val
        cell_renshu_val.setCellValue(datasval.size());
        cell_renshu_val.setCellStyle(style_bold);
        sheet.addMergedRegion(new CellRangeAddress(4,4,6,10));
        HSSFCell cell_jine = row4.createCell((short) 6);   //���
        cell_jine.setCellValue("��   ��");
        cell_jine.setCellStyle(style_bold);
        row4.createCell((short) 7).setCellStyle(style_bold);
        row4.createCell((short) 8).setCellStyle(style_bold);
        row4.createCell((short) 9).setCellStyle(style_bold);
        row4.createCell((short) 10).setCellStyle(style_bold);
        for (int i=0;i<datasval.size();i++){
            Map dataval = (Map)datasval.get(i);
            /*�·�ֵ*/
            if (monthsarr.length>0){
                String month;
                for (int m=0;m<monthsarr.length;m++){
                    month = ":"+monthsarr[m];
//                    System.out.println("�·�ֵ:һ��:"+dataval.get(":һ"));
                    /*HSSFCell cell_yuefen = row4.createCell((short) 11+m);
                    String month = ":"+monthsarr[m];
                    cell_yuefen.setCellValue(dataval.get(month).toString());
                    cell_yuefen.setCellStyle(style);*/
                }
                System.out.println("��:"+monthsarr);
//                System.out.println("�·�ֵ:һ��:"+dataval.get(":һ"));
            }
        }


        int rowindex = 5;     //����ֵ�ӵ�4�п�ʼ
        for (int i=0;i<datasval.size();i++){
            HSSFRow rownum = sheet.createRow((int) rowindex++);
            Map dataval = (Map)datasval.get(i);

            HSSFCell cellnum = rownum.createCell((short) 0);
            int rowval = i+1;
            cellnum.setCellValue(rowval);
            cellnum.setCellStyle(style);
            /*���������*/
            HSSFCell cell_address1 = rownum.createCell((short) 1);
            cell_address1.setCellValue("��ԭ��");
            cell_address1.setCellStyle(style);

            HSSFCell cell_name = rownum.createCell((short) 2);              //����
            cell_name.setCellValue(dataval.get(":name").toString());
            cell_name.setCellStyle(style);

            HSSFCell cell_identityid = rownum.createCell((short) 3);        //���֤��
            cell_identityid.setCellValue(dataval.get(":identityid").toString());
            cell_identityid.setCellStyle(style);

            HSSFCell cell_address = rownum.createCell((short) 4);           //��ͥ��ַ
            cell_address.setCellValue(dataval.get(":address").toString());
            cell_address.setCellStyle(style);
            /*������Ա*/
            HSSFCell cell_servicername = rownum.createCell((short) 5);        //����
            cell_servicername.setCellValue(dataval.get(":servicername").toString()==null?"1":dataval.get(":servicername").toString());
            cell_servicername.setCellStyle(style);

            HSSFCell cell_servicephone = rownum.createCell((short) 6);        //���֤��
            cell_servicephone.setCellValue(dataval.get(":servicephone").toString());
            cell_servicephone.setCellStyle(style);

            HSSFCell cell_serviceaddress = rownum.createCell((short) 7);     //��ͥ��ַ
            cell_serviceaddress.setCellValue(dataval.get(":serviceaddress").toString());
            cell_serviceaddress.setCellStyle(style);

            HSSFCell cell_servicephone1 = rownum.createCell((short) 8);       //����ȼ�
            cell_servicephone1.setCellValue("�ж�");
            cell_servicephone1.setCellStyle(style);

            HSSFCell cell_assesstype = rownum.createCell((short) 9);         //��Ա����
            cell_assesstype.setCellValue(dataval.get(":assesstype").toString());
            cell_assesstype.setCellStyle(style);

            HSSFCell cell_servicetime = rownum.createCell((short) 10);       //������������׼(Сʱ)
            cell_servicetime.setCellValue(dataval.get(":servicetime").toString());
            cell_servicetime.setCellStyle(style);

            /*�·�ֵ*/
            if (monthsarr.length>0){
                for (int m=0;m<monthsarr.length;m++){
                    HSSFCell cell_yuefen = rownum.createCell((short) 11+m);
                    String month = ":"+monthsarr[m];
                    cell_yuefen.setCellValue(dataval.get(month).toString());
                    cell_yuefen.setCellStyle(style);
                }
            }

            HSSFCell cell_zybz = rownum.createCell((short) 11+monthsarr.length); //סԺ����
            cell_zybz.setCellValue("200");
            cell_zybz.setCellStyle(style);
            HSSFCell cell_bzje = rownum.createCell((short) 12+monthsarr.length); //�������
            cell_bzje.setCellValue("300");
            cell_bzje.setCellStyle(style);
        }
    }
    /*xls��������*/
    public static Workbook getReport(String year,String months,Map[] datas) throws Exception{
        String[] monthsarr = {};//����·�����
        System.out.println("����:"+monthsarr);
        String title = "xx��";
        ReportXlsByMoths mainclass = new ReportXlsByMoths();
        Map<String,Integer> map = mainclass.getMonths();
        if (months.length()>0){
            monthsarr = months.split(",");
            title = map.get(monthsarr[0])+"-"+map.get(monthsarr[monthsarr.length-1])+"��";
        }
        // ����webbook��Excel������
        HSSFWorkbook wb = new HSSFWorkbook();
        // ����һ��sheet
        HSSFSheet sheet = wb.createSheet(title);
        mainclass.setHeadXls(sheet,wb,monthsarr,year,title);   //��ͷ
        mainclass.setBodyXls(sheet,wb,monthsarr);   //����
        mainclass.setValueXls(sheet,wb,monthsarr,datas);   //ֵ
        return wb;
    }
    /*xls�����ձ���*/
    public static Workbook getReportNull(String year,String months) throws Exception{
        String[] monthsarr = {};//����·�����
        System.out.println("����:"+monthsarr);
        String title = "xx��";
        ReportXlsByMoths mainclass = new ReportXlsByMoths();
        Map<String,Integer> map = mainclass.getMonths();
        if (months.length()>0){
            monthsarr = months.split(",");
            title = map.get(monthsarr[0])+"-"+map.get(monthsarr[monthsarr.length-1])+"��";
        }
        // ����webbook��Excel������
        HSSFWorkbook wb = new HSSFWorkbook();
        // ����һ��sheet
        HSSFSheet sheet = wb.createSheet(title);
        mainclass.setHeadXls(sheet,wb,monthsarr,year,title);   //��ͷ
        mainclass.setBodyXls(sheet,wb,monthsarr);   //����
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
        ReportXlsByMoths cetd = new ReportXlsByMoths();
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
            getReport("2015",arr,maptest).write(fout);
//            getReport(arr);  //��??
            fout.close();
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}  