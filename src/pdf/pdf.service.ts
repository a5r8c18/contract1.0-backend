/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { FormData } from '../interfaces/from-data.interface';
import { generateContractHtml } from '../templates/contract.template';

@Injectable()
export class PdfService {
  async generatePdf(formData: FormData): Promise<Buffer> {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();

      const htmlContent = generateContractHtml(formData);
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '15mm', bottom: '15mm', left: '10mm', right: '10mm' },
        preferCSSPageSize: true,
      });

      return pdfBuffer;
    } catch (error) {
      throw new Error(`Error generando el PDF: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}