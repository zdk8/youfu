package newpension.javaxls;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;

import java.util.Date;

/**
 * Created by Administrator on 2014/12/8.
 */
public class XlsReport {
    public static Workbook getReport() {
        Workbook wb = new HSSFWorkbook();  // or new XSSFWorkbook();

        Sheet sheet1 = wb.createSheet("new sheet");
        Row row = sheet1.createRow((short)0);
        // Create a cell and put a value in it.
        Cell cell = row.createCell(0);
        String code1 = "??????";
//        String code1_1 = new String(code1.getBytes("ISO-8859-1"),"GBK");
        cell.setCellValue(code1);

        // Or do it on one line.
        CreationHelper createHelper = wb.getCreationHelper();
        row.createCell(1).setCellValue(1.2);
        row.createCell(2).setCellValue(
                createHelper.createRichTextString("This is a string"));
        row.createCell(3).setCellValue(true);
        Cell celldate = row.createCell(4);
        celldate.setCellValue(new Date());
        row.createCell(5).setCellValue("HZ.XH.MY");


        return wb;

    }
}
