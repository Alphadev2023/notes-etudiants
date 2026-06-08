package com.gestion.notes_backend.releves.application;

import com.gestion.notes_backend.matieres.domain.Matiere;
import com.gestion.notes_backend.matieres.domain.MatiereRepository;
import com.gestion.notes_backend.notes.domain.Note;
import com.gestion.notes_backend.notes.domain.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExcelExportService {

    private final MatiereRepository matiereRepository;
    private final NoteRepository noteRepository;

    public byte[] exportNotesClasse(Long classeId) throws IOException {
        List<Matiere> matieres = matiereRepository.findByClasseId(classeId);

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Notes");

            // ── Style en-tête ──
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderBottom(BorderStyle.THIN);

            // ── En-tête ──
            Row headerRow = sheet.createRow(0);
            String[] headers = {"Matière", "Code", "Coefficient", "Semestre", "Moyenne"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
                sheet.autoSizeColumn(i);
            }

            // ── Données ──
            int rowNum = 1;
            for (Matiere matiere : matieres) {
                List<Note> notes = noteRepository.findByMatiereId(matiere.getId());
                double moyenne = notes.stream()
                        .mapToDouble(n -> n.getValeur().doubleValue())
                        .average()
                        .orElse(0);

                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(matiere.getNom());
                row.createCell(1).setCellValue(matiere.getCode());
                row.createCell(2).setCellValue(matiere.getCoefficient().getDoubleValue());
                row.createCell(3).setCellValue(matiere.getSemestre());
                row.createCell(4).setCellValue(Math.round(moyenne * 100.0) / 100.0);
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        }
    }
}