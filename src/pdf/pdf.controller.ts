/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { FormData } from '../interfaces/from-data.interface';
import { Response } from 'express';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate')
  async generatePdf(@Body('formData') formData: FormData, @Res() res: Response) {
    try {
      const pdfBuffer = await this.pdfService.generatePDF(formData);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=contrato_arrendamiento.pdf',
        'Content-Length': pdfBuffer.length,
      });

      res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: `Error generando el PDF: ${error.message}`,
      });
    }
  }
}