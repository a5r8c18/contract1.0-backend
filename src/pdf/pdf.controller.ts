/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Response } from 'express';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate')
  async generatePDF(@Body() body: { formData: any }, @Res() res: Response) {
    const pdfBuffer = await this.pdfService.generatePDF(body.formData);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=contrato_arrendamiento.pdf',
      'Content-Length': pdfBuffer.length.toString(),
    });
    res.send(pdfBuffer);
  }
}