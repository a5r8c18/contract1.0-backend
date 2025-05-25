/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PdfService {
  // Método original para el contrato de arrendamiento
  async generatePDF(formData: any): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 28.35, bottom: 28.35, left: 28.35, right: 28.35 },
      });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Register Arial Narrow fonts
      const fontPathRegular = path.join(process.cwd(), 'fonts/arialn.ttf');
      const fontPathBold = path.join(process.cwd(), 'fonts/arialnb.ttf');
      if (!fs.existsSync(fontPathRegular) || !fs.existsSync(fontPathBold)) {
        throw new Error(`Font files not found at ${fontPathRegular} or ${fontPathBold}`);
      }
      doc.registerFont('ArialNarrow', fontPathRegular);
      doc.registerFont('ArialNarrow-Bold', fontPathBold);

      doc.font('ArialNarrow').fontSize(14);

      // Funciones auxiliares (igual que en el original)
      interface TextOptions {
        align?: 'left' | 'right' | 'center' | 'justify';
        indent?: number;
        width?: number;
      }

      const addText = (text: string, x: number, y: number, options: TextOptions = {}) => {
        const pageWidth = 595.35;
        const margin = 28.35;
        const textWidth = pageWidth - 2 * margin;
        doc.text(text, x, y, {
          ...options,
          width: textWidth,
          align: options.align || 'justify',
        });
      };

      const addSectionTitle = (title: string) => {
        doc.font('ArialNarrow-Bold').fontSize(16);
        addText(title, 28.35, doc.y, { align: 'center' });
        doc.font('ArialNarrow').fontSize(14);
        doc.moveDown(1);
      };

      const addTable = (headers: string[], rows: any[], startX: number, startY: number) => {
        const pageWidth = 595.35;
        const margin = 28.35;
        const tableWidth = pageWidth - 2 * margin;
        const colWidths = headers.map(() => tableWidth / headers.length);
        const rowHeight = 20;
        let y = startY;

        doc.font('ArialNarrow-Bold');
        headers.forEach((header, i) => {
          doc.rect(startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, colWidths[i], rowHeight)
            .fillAndStroke('#f0f0f0', '#000000');
          addText(header, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 4, y + 4, { align: 'center', width: colWidths[i] - 8 });
        });
        y += rowHeight;

        doc.font('ArialNarrow');
        rows.forEach((row) => {
          row.forEach((cell: string, i: number) => {
            doc.rect(startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, colWidths[i], rowHeight)
              .stroke();
            addText(cell, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 4, y + 4, { align: 'justify', width: colWidths[i] - 8 });
          });
          y += rowHeight;
        });

        return y;
      };

      // Page 1: Title and Sections I-V
      addSectionTitle('Contrato de Arrendamiento');

      // DE UNA PARTE
      addSectionTitle('DE UNA PARTE');
      addText(
        `El(La) Trabajador(a) por Cuenta Propia ${formData.arrendadorNombre}, ciudadano(a) cubano(a) mayor de edad con carne de Identidad No. ${formData.arrendadorCarne} con domicilio Legal en calle ${formData.arrendadorDireccion} Municipio ${formData.arrendadorMunicipio}, Provincia ${formData.arrendadorProvincia}, con NIT ${formData.arrendadorNIT}, y cuenta bancaria No. ${formData.arrendadorCuenta} en el banco Metropolitano, Agencia ${formData.arrendadorAgencia}, cito en ${formData.arrendadorAgenciaDireccion}, con No. De licencia comercial ${formData.arrendadorLicencia}, Teléfono ${formData.arrendadorTelefono} y a los efectos de este contrato se denominará EL ARRENDADOR.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      // DE LA OTRA PARTE
      addSectionTitle('DE LA OTRA PARTE');
      addText(
        `${formData.arrendatarioNombre}, constituida mediante ${formData.arrendatarioConstitucion} No. ${formData.arrendatarioNumero} de fecha ${formData.arrendatarioFecha} con domicilio legal en ${formData.arrendatarioDireccion}, municipio ${formData.arrendatarioMunicipio}, provincia ${formData.arrendatarioProvincia}, de nacionalidad ${formData.arrendatarioNacionalidad}, código REEUP y NIT: ${formData.arrendatarioNIT}, Inscripción Registro Mercantil Libro ${formData.arrendatarioLibro}, Tomo ${formData.arrendatarioTomo}, Folio ${formData.arrendatarioFolio}, Hoja ${formData.arrendatarioHoja}, Cuenta bancaria No. ${formData.arrendatarioCuenta}, teléfonos ${formData.arrendatarioTelefonos}, dirección electrónica: ${formData.arrendatarioEmail}, representada en este acto por ${formData.arrendatarioRepresentante} en su condición de ${formData.arrendatarioCondicion}. Lo que acredita mediante ${formData.arrendatarioAcreditacion} No. ${formData.arrendatarioAcreditacionNumero} de fecha ${formData.arrendatarioAcreditacionFecha}, emitida por ${formData.arrendatarioNotario}, notario con competencia provincial en ${formData.arrendatarioNotarioProvincia} y sede en la ${formData.arrendatarioNotarioSede}, provincia ${formData.arrendatarioNotarioProvinciaSede}, que en lo sucesivo y a los efectos de este contrato se denominará EL ARRENDATARIO.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      // AMBAS PARTES
      addSectionTitle('AMBAS PARTES');
      addText(
        'Convienen en suscribir el presente contrato en los términos y condiciones siguientes:',
        28.35,
        doc.y
      );
      doc.moveDown(1);

      // CLÁUSULA I: OBJETO DEL CONTRATO
      addSectionTitle('CLÁUSULA No. I.- OBJETO DEL CONTRATO');
      addText(
        `1.1. Por el presente contrato EL ARRENDADOR conviene en arrendar un ${formData.objetoTipo} para su uso, ubicado en ${formData.objetoUbicacion}, Municipio ${formData.objetoMunicipio}, Provincia ${formData.objetoProvincia}, cuya titularidad pertenece a EL ARRENDADOR, y EL ARRENDATARIO pagará por su uso, de conformidad con los términos, condiciones que sean acordados por ambas partes.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      // CLÁUSULA II: OBLIGACIONES DE EL ARRENDADOR
      addSectionTitle('CLÁUSULA No. II.- OBLIGACIONES DE EL ARRENDADOR');
      addText(
        `2.1. EL ARRENDADOR se Obliga a:
2.1.2 Entregar el ${formData.objetoTipo} objeto del Contrato en los términos convenidos.
2.1.3 Permitir el uso pacífico del ${formData.objetoTipo} alquilado, durante el término de vigencia del presente contrato.
2.1.4 Comunicar a El Arrendatario llegado el momento de terminación de la vigencia del presente contrato la decisión de terminar el presente con no menos de ${formData.notificacionDiasArrendador} días de antelación devolviendo el valor del arrendamiento si así fuera necesario.
2.1.5 Emitir ${formData.reciboTipo} recibo de efectivo por el espacio arrendado, de conformidad al precio acordado por ambas partes.
2.1.6 Pagar los gastos extraordinarios en que haya incurrido EL ARRENDATARIO como consecuencia de la conservación del inmueble siempre que este le haya informado de tales pagos debidamente justificados, dichos pagos se llevarán a cabo mediante descuentos del valor del arrendamiento previamente conciliados y aceptados entre las partes.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      // CLÁUSULA III: OBLIGACIONES DEL ARRENDATARIO
      addSectionTitle('CLÁUSULA No. III.- OBLIGACIONES DEL ARRENDATARIO');
      addText(
        `3.1 EL ARRENDATARIO se Obliga a:
3.1.1 Recibir el local objeto del Contrato en los términos convenidos.
3.1.2 Comunicar a EL ARRENDADOR llegado el momento de terminación de la vigencia del presente contrato la decisión de terminar el presente con no menos de ${formData.notificacionDiasArrendatario} días de antelación devolviendo el valor del arrendamiento si así fuera necesario.
3.1.3 Pagar, el importe por el ${formData.objetoTipo} alquilado en la forma y la cuantía establecida en el presente.
3.1.4 Utilizar el ${formData.objetoTipo} objeto del presente contrato con la diligencia debida y para la realización de la actividad para la cual está autorizado, según lo aprobado por el organismo competente.
3.1.5 No modificar ni alterar la estructura de la instalación, objeto del presente contrato sin que antes hubiese acuerdo entre las partes.
3.1.6 No ceder el arriendo, ni subarrendar a terceras personas.
3.1.7 Devolver a El Arrendador el espacio en condiciones adecuadas, una vez concluido el término de vigencia del presente contrato y de no resultar así, asumirá la indemnización por los trabajos que se requieran realizar para restituir su estado inicial.
3.1.8 Mantener la limpieza e higiene adecuada, así como dar seguridad y protección a sus bienes y de no observar ésta y ocasionarse daños a los mismos El Arrendador, estará exento de responsabilidad.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      // CLÁUSULA IV: OTRAS CONDICIONES
      addSectionTitle('CLÁUSULA No. IV.- OTRAS CONDICIONES');
      addText(
        `4.1 Realizar la entrega-recepción del ${formData.objetoTipo}, tanto al iniciar como al terminar la relación contractual, dejando evidencia escrita, firmada de mutuo acuerdo entre las partes.
4.2 Revisar en cualquier momento el presente contrato, ajustando aquellas cláusulas que así correspondan, mediante suplemento firmado de mutuo acuerdo entre las partes o atendiendo a indicaciones o disposiciones emitidas por autoridad competente.
4.3 Permitir el acceso del El Arrendador e inspectores con competencia para ello al interior de la instalación, cuando así se considere pertinente y previo aviso con tres (3) días de antelación.
4.4 Las partes no permitirán que se lleve a cabo por personal a su cargo acciones o actos que puedan causar daños, interrupciones o mal funcionamiento de los sistemas instalados, local, y otras facilidades de la otra parte que no hayan sido colegiadas y aprobadas por ambas, asumiendo los gastos de restitución, reparación o indemnización según proceda en el caso que se provoquen éstos.
4.5 Ante la ocurrencia de desastres naturales que puedan afectar la integridad del ${formData.objetoTipo}, El Arrendatario, cumplirá las indicaciones emitidas por la Defensa Civil y hasta tanto se mantenga la misma, retirará del lugar sus bienes si es necesario. De no observar lo anterior, El Arrendador no será responsable por los daños y perjuicios que puedan sufrir los mismos.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      // CLÁUSULA V: VALOR Y FORMA DE PAGO
      addSectionTitle('CLÁUSULA No. V.- VALOR Y FORMA DE PAGO');
      addText(
        `5.1 EL pago del arrendamiento será de ${formData.pagoMonto} CUP.
El instrumento de pago será ${formData.pagoInstrumento} y se efectuará con una frecuencia ${formData.pagoFrecuencia}, previa entrega de la correspondiente ${formData.pagoComprobante}.`,
        28.35,
        doc.y
      );

      // Page 2: Cláusulas VI-XIII
      doc.addPage();
      addSectionTitle('CLÁUSULA No. VI.- PENALIDADES');
      addText(
        `6.1 Cuando EL ARRENDATARIO incumpliese con la obligación de pago expresado en el presente Contrato, EL ARRENDADOR podrá ejercitar las acciones siguientes:
a) Se cobrarán intereses moratorios consistentes en
- Durante los primeros 30 días: 4% del valor total facturado.
- Durante los siguientes 30 días: 6% del valor total facturado.
- Más de 60 días: 8% del valor total facturado.
b) Suspender los servicios pactados hasta tanto se salde la deuda.
6.2 En igual cuantía será penalizado EL ARRENDADOR cuando incumpliese con cualquier obligación distinta a las obligaciones de pago y con cualquier término expresado en el presente.
6.3 Ambas partes son responsables civilmente, por los daños y perjuicios causados por el incumplimiento total o parcial de sus respectivas obligaciones, cuando estas no sean cubiertas por la penalización prevista en el párrafo anterior.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      addSectionTitle('CLÁUSULA VII.- CONFIDENCIALIDAD');
      addText(
        `7.1 Las partes acuerdan mantener la confidencialidad necesaria sobre la información general que se generen en virtud del servicio prestado, comprometiéndose a guardar la documentación por un término de 5 años a partir de la firma del presente.
Ningún acto de intercambio será interpretado como cesión de los derechos de la Propiedad Intelectual que sobre dichas modalidades EL ARRENDADOR posea.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      addSectionTitle('CLÁUSULA VIII.- MODIFICACIÓN Y TERMINACIÓN');
      addText(
        `8.1 Toda adición o modificación al Contrato se realizará mediante Suplemento fechado y firmado por ambas partes, debiendo la otra parte dar respuesta en un término de quince (15) días. En caso de no dar respuesta se entenderá como aceptado, toda modificación se realizará suscribiéndose el correspondiente suplemento.
8.2 La modificación o rescisión del Contrato no exime a las partes contrayentes de las obligaciones en ejecución, del pago pendiente, de la responsabilidad material derivada de ellos, ni del derecho de reclamarlas directamente o jurídicamente.
8.3 Será causal de terminación del presente contrato además de las establecidas en la legislación vigente en la materia las siguientes:
- El cierre del proyecto de trabajo aprobado tanto para el Arrendador como para el Arrendatario.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      addSectionTitle('CLÁUSULA No. IX.- EXIMENTES DE RESPONSABILIDAD');
      addText(
        `9.1 Se considerarán EXIMENTES DE RESPONSABILIDAD aquellas que surjan después de firmado el contrato e impidan su cumplimiento, siempre que sean extraordinarias, imprevisibles e inevitables o siendo previsibles igualmente inevitables y ajenas a la voluntad de las partes.
9.2 El período de tiempo señalado para el cumplimiento de las obligaciones contractuales, se entenderá en dichos casos prorrogados por un período igual al de la vigencia de dichas contingencias. Si estas contingencias duraran más de tres meses, cada una de las partes contratantes podrá dar por terminado el contrato, notificando por escrito a la otra parte, no teniendo ningún derecho a ser indemnizada de cualquier pérdida. La alegación de una causal de eximente de responsabilidad no exime del cumplimiento de las obligaciones no afectadas por esta, quedando a decisión, por mutuo acuerdo de las partes, que la misma constituya una causal de extinción del contrato.
9.3 La parte imposibilitada de cumplir por las razones antes expuestas, notificará inmediatamente por escrito a la otra, la existencia y duración de la causal que corresponda, la cual deberá acreditar mediante certificación expedida por institución competente, la Cámara de Comercio de la República de Cuba, sin perjuicio de su obligación en efectuar cuantos actos y desembolsos fueran necesarios para minimizar o eliminar las consecuencias negativas para la otra parte y para la relación objeto del contrato.
9.4 No serán consideradas causas eximentes de responsabilidad, ni circunstancias modificativas de las obligaciones emergentes del presente contrato, cualesquiera regulaciones, disposiciones, órdenes u acciones, incluida la de negación de licencias de gobiernos extranjeros a las partes, o de entidades que de cualquier forma posean, dirijan o controlen al ARRENDATARIO, que impidan o intenten impedir, total o parcialmente, el oportuno y cabal cumplimiento de este contrato.
9.5 Cuando concurran circunstancias de EXIMENTES DE RESPONSABILIDAD y después de realizar todas las gestiones para asegurar la protección de las mercancías, EL ARRENDADOR quedará liberado de toda responsabilidad respecto a la óptima conservación de las mercancías almacenadas. EL ARRENDATARIO, si así lo desea, deberá asegurar el valor de las mercancías almacenadas con una empresa especializada.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      addSectionTitle('CLÁUSULA No. X.- CALIDAD Y GARANTÍA');
      addText(
        `10.1 EL ARRENDADOR garantiza el goce pacífico del bien arrendado a EL ARRENDATARIO por el período de vigencia pactado en el presente contrato.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      addSectionTitle('CLÁUSULA No. XI.- RECLAMACIONES Y SOLUCIÓN DE CONFLICTOS');
      addText(
        `11.1 Ambas partes reconocen el derecho recíproco de formularse reclamación ante el incumplimiento total o parcial de las obligaciones contraídas en el presente contrato.
11.2 Las partes convienen en cumplir el presente contrato de buena fe y agotar la vía conciliatoria, con el ánimo de solucionar cualquier discrepancia mediante negociaciones amigables.
11.3 Las reclamaciones deberán hacerse por escrito en el término de 15 días a partir de la fecha en que la obligación debió ser cumplida.
11.4 La parte contra la que se presente la reclamación deberá examinarla y dar respuesta de su contenido dentro del término de diez días hábiles siguientes a la fecha en que hubiere recibido la misma, decursado este, se entenderá rechazada y el asunto podrá someterse a la consideración del órgano juzgador del domicilio del demandado y la decisión del mismo será de obligatorio cumplimiento para ambas partes.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      addSectionTitle('CLÁUSULA No. XII.- LEY APLICABLE');
      addText(
        `12.1 El presente contrato se rige según lo dispuesto en el Decreto Ley 304/12, De la Contratación Económica, Decreto 310/12, De los Tipos de Contratos y en lo dispuesto en el Decreto Ley 88/24 Sobre las micro, pequeñas y medianas empresas, Decreto Ley 90/24 Sobre el Ejercicio del Trabajo por cuenta propia, Decreto Ley 91/24 De las contravenciones en el Ejercicio del Trabajo Por Cuenta Propia, las Micro, Pequeñas y Medianas empresas privadas y los Titulares de los Proyectos de Desarrollo Local y demás que sean de adecuación emitidos por los organismos competentes.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      addSectionTitle('CLÁUSULA No. XIII.- VIGENCIA');
      addText(
        `13.1 El presente contrato tendrá vigencia por el término de ${formData.vigenciaTermino} años a partir de la fecha de su firma, al término del cual podrá ser prorrogado por acuerdo expreso de las partes lo que se hará constar mediante suplemento al mismo.
13.2 Ambas partes conservarán el presente contrato, por un término de ${formData.vigenciaConservacion} años.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      addText(
        `Y como constancia de su conformidad, se extiende el mismo en dos ejemplares a un solo tenor y efecto legal en La Habana, a los ${formData.firmaDia} días del mes de ${formData.firmaMes} de ${formData.firmaAnio}.`,
        28.35,
        doc.y
      );
      doc.moveDown(2);
      addText('___________________', 28.35, doc.y, { align: 'left' });
      addText('EL ARRENDADOR', 28.35, doc.y, { align: 'left' });
      addText('___________________', 28.35 + 300, doc.y - 20, { align: 'left' });
      addText('EL ARRENDATARIO', 28.35 + 300, doc.y, { align: 'left' });

      // Page 3: Anexo II
      doc.addPage();
      addSectionTitle('ANEXO II: FICHA DEL CLIENTE');

      // Entidad Details
      addText(`Nombre de la entidad: ${formData.anexoEntidadNombre}`, 28.35, doc.y);
      addText(`Dirección: ${formData.anexoEntidadDireccion}`, 28.35, doc.y);
      addText(`Teléfono: ${formData.anexoEntidadTelefono}    E-mail: ${formData.anexoEntidadEmail}`, 28.35, doc.y);
      addText(`Código Entidad: ${formData.anexoEntidadCodigo}    Organismo o Ministerio: ${formData.anexoEntidadOrganismo}    NIT: ${formData.anexoEntidadNIT}`, 28.35, doc.y);
      addText(`Cuenta Bancaria CUP: ${formData.anexoEntidadCuentaCUP}    Sucursal CUP: ${formData.anexoEntidadSucursalCUP}`, 28.35, doc.y);
      addText(`Dirección Sucursal CUP: ${formData.anexoEntidadSucursalDireccionCUP}`, 28.35, doc.y);
      doc.moveDown(1);

      // Personas Autorizadas a solicitar servicios
      addSectionTitle('Personas Autorizadas a solicitar servicios, firma de los entregables y facturas');
      const servicioRows = formData.anexoPersonasServicios.map((p: any) => [
        p.nombre || 'Nombre',
        p.cargo || 'Cargo',
        p.firma || 'Firma',
        p.identidad || 'Identidad',
      ]);
      doc.y = addTable(['Nombre y Apellidos', 'Cargo', 'Firma', 'No. C. Identidad'], servicioRows, 28.35, doc.y);
      doc.moveDown(1);

      // Personas Autorizadas para firmar conciliaciones
      addSectionTitle('Personas Autorizadas para firmar conciliaciones');
      const conciliacionRows = formData.anexoPersonasConciliaciones.map((p: any) => [
        p.nombre || 'Nombre',
        p.cargo || 'Cargo',
        p.firma || 'Firma',
        p.identidad || 'Identidad',
      ]);
      doc.y = addTable(['Nombre y Apellidos', 'Cargo', 'Firma', 'No. C. Identidad'], conciliacionRows, 28.35, doc.y);
      doc.moveDown(1);

      // Representante y Director
      addText(
        `Representante de la Entidad designado para firmar Contrato: ${formData.anexoRepresentanteContrato}    Cargo que ocupa: ${formData.anexoRepresentanteCargo}`,
        28.35,
        doc.y
      );
      doc.moveDown(1);
      addText(
        `El Director de la entidad o su equivalente declara, apercibido de la responsabilidad en que incurre, que todos los datos aquí plasmados son ciertos y que cualquier variación en alguno de ellos deberá comunicarse de inmediato a ${formData.anexoNotificadoNombre} en su condición de ${formData.anexoNotificadoCondicion}, para evitar cualquier consecuencia que de ello pueda derivarse.`,
        28.35,
        doc.y
      );
      addText(
        `Nombres y apellidos del Director de la Entidad o su equivalente: ${formData.anexoDirectorNombre}    Cuño: ____________`,
        28.35,
        doc.y
      );
      addText(`No. Carné de identidad: ${formData.anexoDirectorCarne}`, 28.35, doc.y);
      addText(`Firma: ____________`, 28.35, doc.y);
      doc.moveDown(1);

      // Documentos Requeridos
      addSectionTitle('Documentos que deben acompañar a este modelo para conformar el expediente del cliente:');
      addText('1. Resolución de Nombramiento del Director de la entidad.', 28.35, doc.y, { indent: 20 });
      addText('2. Resolución o documento que faculta a la persona designada para firmar el Contrato.', 28.35, doc.y, { indent: 20 });

      doc.end();
    });
  }
  // Método para el contrato de comodato
  async generateComodatoPDF(formData: any): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 28.35, bottom: 28.35, left: 28.35, right: 28.35 }, // Mismos márgenes que arrendamiento (10mm)
      });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Register Arial Narrow fonts
      const fontPathRegular = path.join(process.cwd(), 'fonts/arialn.ttf');
      const fontPathBold = path.join(process.cwd(), 'fonts/arialnb.ttf');
      if (!fs.existsSync(fontPathRegular) || !fs.existsSync(fontPathBold)) {
        throw new Error(`Font files not found at ${fontPathRegular} or ${fontPathBold}`);
      }
      doc.registerFont('ArialNarrow', fontPathRegular);
      doc.registerFont('ArialNarrow-Bold', fontPathBold);

      doc.font('ArialNarrow').fontSize(14);

      // Helper functions (idénticas al arrendamiento)
      interface TextOptions {
        align?: 'left' | 'right' | 'center' | 'justify';
        indent?: number;
        width?: number;
      }

      const addText = (text: string, x: number, y: number, options: TextOptions = {}) => {
        const pageWidth = 595.35;
        const margin = 28.35;
        const textWidth = pageWidth - 2 * margin;
        doc.text(text, x, y, {
          ...options,
          width: textWidth,
          align: options.align || 'justify',
        });
      };

      const addSectionTitle = (title: string) => {
        doc.font('ArialNarrow-Bold').fontSize(16);
        addText(title, 28.35, doc.y, { align: 'center' });
        doc.font('ArialNarrow').fontSize(14);
        doc.moveDown(1);
      };

      const addTable = (headers: string[], rows: any[], startX: number, startY: number) => {
        const pageWidth = 595.35;
        const margin = 28.35;
        const tableWidth = pageWidth - 2 * margin;
        const colWidths = headers.map(() => tableWidth / headers.length);
        const rowHeight = 20;
        let y = startY;

        doc.font('ArialNarrow-Bold');
        headers.forEach((header, i) => {
          doc.rect(startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, colWidths[i], rowHeight)
            .fillAndStroke('#f0f0f0', '#000000');
          addText(header, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 4, y + 4, { align: 'center', width: colWidths[i] - 8 });
        });
        y += rowHeight;

        doc.font('ArialNarrow');
        rows.forEach((row) => {
          row.forEach((cell: string, i: number) => {
            doc.rect(startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, colWidths[i], rowHeight)
              .stroke();
            addText(cell, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 4, y + 4, { align: 'justify', width: colWidths[i] - 8 });
          });
          y += rowHeight;
        });

        return y;
      };

      // Page 1: Título y Cláusulas 1-2
      addSectionTitle('Contrato de Comodato');

      addSectionTitle('DE UNA PARTE');
      addText(
        `${formData.comodanteNombre}, de nacionalidad ${formData.comodanteNacionalidad}, con domicilio social en ${formData.comodanteDomicilio}, municipio ${formData.comodanteMunicipio}, provincia La Habana, con carnet de identidad permanente ${formData.comodanteIdentidad}, teléfono ${formData.comodanteTelefono}, que en lo sucesivo y a los efectos del presente Contrato se denominará EL COMODANTE.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      addSectionTitle('DE OTRA PARTE');
      addText(
        `${formData.comodatarioNombre}, constituida mediante ${formData.comodatarioConstitucion} No. ${formData.comodatarioDecisionNumero} de fecha ${formData.comodatarioDecisionFecha}, con domicilio legal en ${formData.comodatarioDomicilio}, municipio ${formData.comodatarioMunicipio}, provincia ${formData.comodatarioProvincia}, de nacionalidad ${formData.comodatarioNacionalidad}, código REEUP y NIT: ${formData.comodatarioREEUPNIT}, Inscripción Registro Mercantil Libro ${formData.comodatarioLibro}, Tomo ${formData.comodatarioTomo}, Folio ${formData.comodatarioFolio}, Hoja ${formData.comodatarioHoja}, Cuenta bancaria No. ${formData.comodatarioCuentaBancaria}, teléfonos ${formData.comodatarioTelefonos}, dirección electrónica: ${formData.comodatarioEmail}, representada en este acto por ${formData.comodatarioRepresentante} en su condición de ${formData.comodatarioCondicion}, lo que acredita mediante ${formData.comodatarioDecision} No. ${formData.comodatarioDecisionNumero} de fecha ${formData.comodatarioDecisionFecha}, emitida por ${formData.comodatarioEmitidaPor}, notario con competencia provincial en ${formData.comodatarioNotarioProvincia} y sede en la ${formData.comodatarioNotarioSede}, provincia ${formData.comodatarioNotarioProvinciaSede}, que en lo sucesivo y a los efectos de este contrato se denominará EL COMODATARIO.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      addSectionTitle('AMBAS PARTES');
      addText(
        'Reconociéndose respectivamente la capacidad y representación con que comparecen convienen suscribir el presente Contrato bajo los términos y condiciones siguientes:',
        28.35,
        doc.y
      );
      doc.moveDown(1);

      addSectionTitle('1. OBJETO DEL CONTRATO');
      addText(
        `1.1 Por el presente contrato EL COMODANTE se obliga a ceder gratuitamente al COMODATARIO el uso del ${formData.bienDescripción} cuyas descripciones aparecen detalladas en el ANEXO 1 al presente y EL COMODATARIO los devolverá una vez finalizado el tiempo pactado.\n1.2 EL COMODANTE declara que es propietario de los bienes que cede en comodato los cuales se destinarán al cumplimiento del Objeto Social aprobado a la empresa, estándole prohibido a EL COMODATARIO modificar el destino antes mencionado.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      addSectionTitle('2. OBLIGACIONES DE LAS PARTES');
      addText(
        `2.1 Obligaciones de EL COMODANTE:\n2.1.1 Entregar el bien en comodato referido en el ANEXO 1 del presente contrato a EL COMODATARIO.\n2.1.2 Garantizar a EL COMODATARIO la posesión pacífica del bien durante la vigencia del presente.\n2.1.3 Pagar los gastos extraordinarios en que haya incurrido EL COMODATARIO como consecuencia de la conservación del bien siempre que este le haya informado de tales pagos debidamente justificados.\n2.1.4 Reembolsar a EL COMODATARIO los gastos en que haya incurrido por daños originados por vicios ocultos del bien, siempre que los conociere y no los hubiese advertido oportunamente.\n2.2 Obligaciones de EL COMODATARIO:\n2.2.1 Usar el bien de acuerdo al destino señalado en la sub cláusula 1.2.\n2.2.2 Responder por los daños ocasionados al bien cuando lo use de modo contrario a lo pactado o a su naturaleza o destino.\n2.2.3 Pagar los gastos ordinarios que se derivan del uso y conservación del bien.\n2.2.4 Devolver el bien en el plazo previsto en el presente contrato.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      // Page 2: Cláusulas 3-6
      doc.addPage();

      addSectionTitle('3. CESIÓN');
      addText(
        `3.1 EL COMODATARIO no podrá ceder el bien objeto del presente a un tercero a menos que lo autorice EL COMODANTE.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      addSectionTitle('4. VIGENCIA, MODIFICACIÓN Y EXTINCIÓN DEL CONTRATO');
      addText(
        `4.1 La duración del presente Contrato será de ${formData.vigenciaAnios} años.\n4.1.1 LAS PARTES durante el cumplimiento del presente Contrato pueden acordar modificaciones a las obligaciones, condiciones y términos que se pactaron en el Contrato. Toda adición, modificación, especificación o enmienda que se pretenda realizar al presente Contrato, solamente podrá formalizarse mediante Suplementos que adquirirán plena validez y efecto legal a partir de la fecha de su firma por AMBAS PARTES contratantes.\n4.1.2 El presente Contrato se extinguirá por las siguientes causas:\n4.1.3 Muerte de EL COMODANTE o de EL COMODATARIO.\n4.1.4 Destinar EL COMODATARIO el bien a un uso incompatible con su naturaleza o distinto del pactado.\n4.1.5 Ceder EL COMODATARIO, sin permiso, a un tercero, el uso del bien.\n4.1.6 Reclamar EL COMODANTE el bien antes de haber vencido el término del contrato o de haber concluido el uso convenido, por tener necesidad urgente de él siempre con al menos 15 días de antelación a la fecha en que pretenda que surta efectos.\n4.1.7 El resto de las causas generales de extinción de los contratos.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      addSectionTitle('5. RECLAMACIONES');
      addText(
        `5.1 LAS PARTES podrán reclamarse mutuamente por el incumplimiento o cumplimiento inadecuado de sus obligaciones contractuales, por escrito, dentro de los quince (15) días naturales contados a partir de la fecha de ocurrencia del incumplimiento.\n5.2 Todas las reclamaciones se efectuarán por escrito en el domicilio legal de la otra Parte, debiendo la Parte reclamada dar respuesta dentro de los treinta (30) días naturales posteriores a la fecha de su notificación.\n5.3 Toda comunicación efectuada por medio del correo electrónico requerirá de su acuse de recibo como constancia de su recepción. De no recibirse el acuse en el término de cuarenta y ocho (48) horas, el emisor deberá utilizar otra vía de comunicación que permita poner en conocimiento del destinatario del correo electrónico que le ha sido enviada la información por la vía del correo electrónico.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      addSectionTitle('6. SOLUCIÓN DE CONFLICTOS');
      addText(
        `6.1 LAS PARTES se comprometen a cumplir el presente Contrato de buena fe, y a solucionar mediante negociaciones amigables las posibles discrepancias que surgieren en la ejecución del presente Contrato y/o en relación con el mismo, debiendo dejar evidencia escrita de las conciliaciones realizadas.\n6.2 De no llegarse a acuerdo someterán sus discrepancias a la decisión de la Sala de lo Económico del Tribunal Provincial Popular de La Habana, portando en todos los casos las evidencias escritas de las conciliaciones realizadas.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      // Page 3: Cláusulas 7-8 y Anexo 1
      doc.addPage();

      addSectionTitle('7. AVISO ENTRE LAS PARTES');
      addText(
        `7.1 Todos los avisos entre las partes se realizarán por correo electrónico u otros medios telemáticos y carta certificada a las siguientes direcciones:`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      addSectionTitle('A EL COMODANTE');
      const comodanteRows = [
        ['Att.', formData.avisoComodanteAtt || 'Atención'],
        ['Dirección:', formData.avisoComodanteDireccion || 'Dirección'],
        ['Teléfono:', formData.avisoComodanteTelefono || 'Teléfono'],
        ['E-mail:', formData.avisoComodanteEmail || 'Email'],
      ];
      doc.y = addTable(['Campo', 'Valor'], comodanteRows, 28.35, doc.y);
      doc.moveDown(1);

      addSectionTitle('A EL COMODATARIO');
      const comodatarioRows = [
        ['Att.', formData.avisoComodatarioAtt || 'Atención'],
        ['Dirección:', formData.avisoComodatarioDireccion || 'Dirección'],
        ['Teléfono:', formData.avisoComodatarioTelefono || 'Teléfono'],
        ['E-mail:', formData.avisoComodatarioEmail || 'Email'],
      ];
      doc.y = addTable(['Campo', 'Valor'], comodatarioRows, 28.35, doc.y);
      doc.moveDown(1);

      addSectionTitle('8. OTRAS CONDICIONES');
      addText(
        `8.1 EL COMODATARIO no puede retener el bien bajo pretexto de que EL COMODANTE es deudor de él, aun cuando se trate de gastos extraordinarios o costas.\n8.2 El presente Contrato se rige e interpreta de conformidad con lo establecido en la Ley No. 141/21 “Código de Procesos”, Resolución 183/2020 “Normas Bancarias para los Cobros y Pagos”, Decreto Ley No.304/2012 “De la Contratación Económica” y el Decreto No.310/2012 “De los Tipos de Contratos”, la Ley No.59/87 “Código Civil”, y demás disposiciones legales que le sean de aplicación.`,
        28.35,
        doc.y
      );
      doc.moveDown(1);

      addText(
        `Y PARA QUE ASÍ CONSTE, se extienden y firman dos ejemplares en idioma español, a un mismo tenor e idénticos efectos legales, en La Habana, a los ${formData.firmaDia} días del mes de ${formData.firmaMes} de ${formData.firmaAnio}.`,
        28.35,
        doc.y
      );
      doc.moveDown(2);
      addText('___________________', 28.35, doc.y, { align: 'left' });
      addText('EL COMODANTE', 28.35, doc.y, { align: 'left' });
      addText('___________________', 28.35 + 300, doc.y - 20, { align: 'left' });
      addText('EL COMODATARIO', 28.35 + 300, doc.y, { align: 'left' });

      doc.addPage();
      addSectionTitle('ANEXO 1: DESCRIPCIÓN DE LOS BIENES');
      const anexoRows = formData.anexoBienes.map((bien: any) => [
        bien.nombre || 'Nombre del Bien',
        bien.caracteristicas || 'Características',
        bien.marca || 'Marca',
        bien.modelo || 'Modelo',
        bien.chapa || 'Chapa',
      ]);
      doc.y = addTable(
        ['Nombre del Bien', 'Características', 'Marca', 'Modelo', 'Chapa'],
        anexoRows,
        28.35,
        doc.y
      );
      doc.moveDown(2);
      addText('___________________', 28.35, doc.y, { align: 'left' });
      addText('EL COMODANTE', 28.35, doc.y, { align: 'left' });
      addText('___________________', 28.35 + 300, doc.y - 20, { align: 'left' });
      addText('EL COMODATARIO', 28.35 + 300, doc.y, { align: 'left' });

      doc.end();
    });
  }
}