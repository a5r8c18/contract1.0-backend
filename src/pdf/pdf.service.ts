/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
  async generatePDF(formData: any): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      doc.fontSize(16).text('Contrato de Arrendamiento', { align: 'center' });
      doc.fontSize(12).text(`Arrendador: ${formData.arrendadorNombre}`);
      doc.text(`Arrendatario: ${formData.arrendatarioNombre}`);
      // Agrega más contenido según el contrato
      doc.end();
    });
  }
}