/* eslint-disable prettier/prettier */
import { FormData } from '../interfaces/from-data.interface';


export function generateComodatoContractHtml(formData: FormData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 15mm;
            color: #000;
            font-size: 14px;
            line-height: 1.5;
          }
          .pdf-section {
            width: 190mm;
            padding: 10mm;
            background: #fff;
            box-sizing: border-box;
          }
          h1 {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
          }
          h2 {
            font-size: 16px;
            margin-top: 20px;
            font-weight: bold;
          }
          h3 {
            font-size: 14px;
            margin-top: 15px;
            font-weight: bold;
          }
          p {
            margin: 10px 0;
            text-align: justify;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 10px 0;
          }
          th, td {
            border: 1px solid #000;
            padding: 4px;
            text-align: left;
            font-size: 14px;
          }
          th {
            background-color: #f0f0f0;
          }
          .signature {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
          }
          ol {
            margin-left: 20px;
            margin-top: 10px;
          }
          @page {
            margin: 15mm;
          }
          @media print {
            .pdf-section {
              break-inside: avoid;
              page-break-inside: avoid;
            }
            h2, h3 {
              break-after: avoid;
              page-break-after: avoid;
            }
            p, table, ol {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <!-- Sección 1: Cláusulas 1-2 -->
        <div class="pdf-section">
          <h1>Contrato de Comodato</h1>
  
          <section>
            <h2>DE UNA PARTE</h2>
            <p>
              <strong>${formData.comodanteNombre || 'Nombre del comodante'}</strong>,
              de nacionalidad ${formData.comodanteNacionalidad || 'Nacionalidad'},
              con domicilio social en ${formData.comodanteDomicilio || 'Domicilio'},
              municipio ${formData.comodanteMunicipio || 'Municipio'},
              provincia La Habana,
              con carnet de identidad permanente ${formData.comodanteIdentidad || 'Identidad'},
              teléfono ${formData.comodanteTelefono || 'Teléfono'},
              que en lo sucesivo y a los efectos del presente Contrato se denominará
              <strong>EL COMODANTE</strong>.
            </p>
          </section>
  
          <section>
            <h2>DE OTRA PARTE</h2>
            <p>
              ${formData.comodatarioNombre || 'Nombre del comodatario'},
              constituida mediante ${formData.comodatarioConstitucion || 'Constitución'}
              No. ${formData.comodatarioDecisionNumero || 'Número'}
              de fecha ${formData.comodatarioDecisionFecha || 'Fecha'},
              con domicilio legal en ${formData.comodatarioDomicilio || 'Domicilio'},
              municipio ${formData.comodatarioMunicipio || 'Municipio'},
              provincia ${formData.comodatarioProvincia || 'Provincia'},
              de nacionalidad ${formData.comodatarioNacionalidad || 'Nacionalidad'},
              código REEUP y NIT: ${formData.comodatarioREEUPNIT || 'REEUP y NIT'},
              Inscripción Registro Mercantil Libro ${formData.comodatarioLibro || 'Libro'},
              Tomo ${formData.comodatarioTomo || 'Tomo'},
              Folio ${formData.comodatarioFolio || 'Folio'},
              Hoja ${formData.comodatarioHoja || 'Hoja'},
              Cuenta bancaria No. ${formData.comodatarioCuentaBancaria || 'Cuenta bancaria'},
              teléfonos ${formData.comodatarioTelefonos || 'Teléfonos'},
              dirección electrónica: ${formData.comodatarioEmail || 'Email'},
              representada en este acto por ${formData.comodatarioRepresentante || 'Representante'}
              en su condición de ${formData.comodatarioCondicion || 'Condición'},
              lo que acredita mediante ${formData.comodatarioDecision || 'Decisión'}
              No. ${formData.comodatarioDecisionNumero || 'Número'}
              de fecha ${formData.comodatarioDecisionFecha || 'Fecha'},
              emitida por ${formData.comodatarioEmitidaPor || 'Notario'},
              notario con competencia provincial en ${formData.comodatarioNotarioProvincia || 'Provincia'}
              y sede en la ${formData.comodatarioNotarioSede || 'Sede'},
              provincia ${formData.comodatarioNotarioProvinciaSede || 'Provincia'},
              que en lo sucesivo y a los efectos de este contrato se denominará
              <strong>EL COMODATARIO</strong>.
            </p>
          </section>
  
          <section>
            <h2>AMBAS PARTES</h2>
            <p>
              Reconociéndose respectivamente la capacidad y representación con que comparecen
              convienen suscribir el presente Contrato bajo los términos y condiciones siguientes:
            </p>
          </section>
  
          <section>
            <h2>1. OBJETO DEL CONTRATO</h2>
            <p>
              1.1 Por el presente contrato EL COMODANTE se obliga a ceder gratuitamente al
              COMODATARIO el uso del ${formData.bienDescripción || 'Descripción del bien'}
              cuyas descripciones aparecen detalladas en el ANEXO 1 al presente y EL
              COMODATARIO los devolverá una vez finalizado el tiempo pactado.<br>
              1.2 EL COMODANTE declara que es propietario de los bienes que cede en comodato
              los cuales se destinarán al cumplimiento del Objeto Social aprobado a la empresa,
              estándole prohibido a EL COMODATARIO modificar el destino antes mencionado.
            </p>
          </section>
  
          <section>
            <h2>2. OBLIGACIONES DE LAS PARTES</h2>
            <p>
              2.1 Obligaciones de EL COMODANTE:<br>
              2.1.1 Entregar el bien en comodato referido en el ANEXO 1 del presente contrato
              a EL COMODATARIO.<br>
              2.1.2 Garantizar a EL COMODATARIO la posesión pacífica del bien durante la
              vigencia del presente.<br>
              2.1.3 Pagar los gastos extraordinarios en que haya incurrido EL COMODATARIO
              como consecuencia de la conservación del bien siempre que este le haya informado
              de tales pagos debidamente justificados.<br>
              2.1.4 Reembolsar a EL COMODATARIO los gastos en que haya incurrido por daños
              originados por vicios ocultos del bien, siempre que los conociere y no los
              hubiese advertido oportunamente.<br>
              2.2 Obligaciones de EL COMODATARIO:<br>
              2.2.1 Usar el bien de acuerdo al destino señalado en la sub cláusula 1.2.<br>
              2.2.2 Responder por los daños ocasionados al bien cuando lo use de modo
              contrario a lo pactado o a su naturaleza o destino.<br>
              2.2.3 Pagar los gastos ordinarios que se derivan del uso y conservación del
              bien.<br>
              2.2.4 Devolver el bien en el plazo previsto en el presente contrato.
            </p>
          </section>
        </div>
  
        <!-- Sección 2: Cláusulas 3-6 -->
        <div class="pdf-section">
          <section>
            <h2>3. CESIÓN</h2>
            <p>
              3.1 EL COMODATARIO no podrá ceder el bien objeto del presente a un tercero
              a menos que lo autorice EL COMODANTE.
            </p>
          </section>
  
          <section>
            <h2>4. VIGENCIA, MODIFICACIÓN Y EXTINCIÓN DEL CONTRATO</h2>
            <p>
              4.1 La duración del presente Contrato será de ${formData.vigenciaAnios || 'Años'} años.<br>
              4.1.1 LAS PARTES durante el cumplimiento del presente Contrato pueden acordar
              modificaciones a las obligaciones, condiciones y términos que se pactaron en el
              Contrato. Toda adición, modificación, especificación o enmienda que se pretenda
              realizar al presente Contrato, solamente podrá formalizarse mediante Suplementos
              que adquirirán plena validez y efecto legal a partir de la fecha de su firma por
              AMBAS PARTES contratantes.<br>
              4.1.2 El presente Contrato se extinguirá por las siguientes causas:<br>
              4.1.3 Muerte de EL COMODANTE o de EL COMODATARIO.<br>
              4.1.4 Destinar EL COMODATARIO el bien a un uso incompatible con su naturaleza
              o distinto del pactado.<br>
              4.1.5 Ceder EL COMODATARIO, sin permiso, a un tercero, el uso del bien.<br>
              4.1.6 Reclamar EL COMODANTE el bien antes de haber vencido el término del
              contrato o de haber concluido el uso convenido, por tener necesidad urgente de
              él siempre con al menos 15 días de antelación a la fecha en que pretenda que
              surta efectos.<br>
              4.1.7 El resto de las causas generales de extinción de los contratos.
            </p>
          </section>
  
          <section>
            <h2>5. RECLAMACIONES</h2>
            <p>
              5.1 LAS PARTES podrán reclamarse mutuamente por el incumplimiento o
              cumplimiento inadecuado de sus obligaciones contractuales, por escrito, dentro
              de los quince (15) días naturales contados a partir de la fecha de ocurrencia
              del incumplimiento.<br>
              5.2 Todas las reclamaciones se efectuarán por escrito en el domicilio legal de
              la otra Parte, debiendo la Parte reclamada dar respuesta dentro de los treinta
              (30) días naturales posteriores a la fecha de su notificación.<br>
              5.3 Toda comunicación efectuada por medio del correo electrónico requerirá de
              su acuse de recibo como constancia de su recepción. De no recibirse el acuse en
              el término de cuarenta y ocho (48) horas, el emisor deberá utilizar otra vía de
              comunicación que permita poner en conocimiento del destinatario del correo
              electrónico que le ha sido enviada la información por la vía del correo
              electrónico.
            </p>
          </section>
  
          <section>
            <h2>6. SOLUCIÓN DE CONFLICTOS</h2>
            <p>
              6.1 LAS PARTES se comprometen a cumplir el presente Contrato de buena fe, y a
              solucionar mediante negociaciones amigables las posibles discrepancias que
              surgieren en la ejecución del presente Contrato y/o en relación con el mismo,
              debiendo dejar evidencia escrita de las conciliaciones realizadas.<br>
              6.2 De no llegarse a acuerdo someterán sus discrepancias a la decisión de la
              Sala de lo Económico del Tribunal Provincial Popular de La Habana, portando en
              todos los casos las evidencias escritas de las conciliaciones realizadas.
            </p>
          </section>
        </div>
  
        <!-- Sección 3: Cláusulas 7-8 y Firma -->
        <div class="pdf-section">
          <section>
            <h2>7. AVISO ENTRE LAS PARTES</h2>
            <p>
              7.1 Todos los avisos entre las partes se realizarán por correo electrónico u
              otros medios telemáticos y carta certificada a las siguientes direcciones:
            </p>
  
            <h3>A EL COMODANTE</h3>
            <table>
              <thead>
                <tr>
                  <th>Campo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Att.</td>
                  <td>${formData.avisoComodanteAtt || 'Atención'}</td>
                </tr>
                <tr>
                  <td>Dirección:</td>
                  <td>${formData.avisoComodanteDireccion || 'Dirección'}</td>
                </tr>
                <tr>
                  <td>Teléfono:</td>
                  <td>${formData.avisoComodanteTelefono || 'Teléfono'}</td>
                </tr>
                <tr>
                  <td>E-mail:</td>
                  <td>${formData.avisoComodanteEmail || 'Email'}</td>
                </tr>
              </tbody>
            </table>
  
            <h3>A EL COMODATARIO</h3>
            <table>
              <thead>
                <tr>
                  <th>Campo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Att.</td>
                  <td>${formData.avisoComodatarioAtt || 'Atención'}</td>
                </tr>
                <tr>
                  <td>Dirección:</td>
                  <td>${formData.avisoComodatarioDireccion || 'Dirección'}</td>
                </tr>
                <tr>
                  <td>Teléfono:</td>
                  <td>${formData.avisoComodatarioTelefono || 'Teléfono'}</td>
                </tr>
                <tr>
                  <td>E-mail:</td>
                  <td>${formData.avisoComodatarioEmail || 'Email'}</td>
                </tr>
              </tbody>
            </table>
          </section>
  
          <section>
            <h2>8. OTRAS CONDICIONES</h2>
            <p>
              8.1 EL COMODATARIO no puede retener el bien bajo pretexto de que EL COMODANTE
              es deudor de él, aun cuando se trate de gastos extraordinarios o costas.<br>
              8.2 El presente Contrato se rige e interpreta de conformidad con lo establecido
              en la Ley No. 141/21 “Código de Procesos”, Resolución 183/2020 “Normas
              Bancarias para los Cobros y Pagos”, Decreto Ley No.304/2012 “De la Contratación
              Económica” y el Decreto No.310/2012 “De los Tipos de Contratos”, la Ley
              No.59/87 “Código Civil”, y demás disposiciones legales que le sean de aplicación.
            </p>
          </section>
  
          <section>
            <p>
              Y PARA QUE ASÍ CONSTE, se extienden y firman dos ejemplares en idioma español,
              a un mismo tenor e idénticos efectos legales, en La Habana, a los
              ${formData.firmaDia || 'Día'} días del mes de ${formData.firmaMes || 'Mes'}
              de ${formData.firmaAnio || 'Año'}.
            </p>
            <div class="signature">
              <div>
                ___________________<br>
                EL COMODANTE
              </div>
              <div>
                ___________________<br>
                EL COMODATARIO
              </div>
            </div>
          </section>
        </div>
  
        <!-- Sección 4: Anexo 1 -->
        <div class="pdf-section">
          <section>
            <h2>ANEXO 1: DESCRIPCIÓN DE LOS BIENES</h2>
            <table>
              <thead>
                <tr>
                  <th>Nombre del Bien</th>
                  <th>Características</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Chapa</th>
                </tr>
              </thead>
              <tbody>
                ${formData.anexoBienes
                  .map(
                    (bien) => `
                      <tr>
                        <td>${bien.nombre || 'Nombre'}</td>
                        <td>${bien.caracteristicas || 'Características'}</td>
                        <td>${bien.marca || 'Marca'}</td>
                        <td>${bien.modelo || 'Modelo'}</td>
                        <td>${bien.chapa || 'Chapa'}</td>
                      </tr>
                    `
                  )
                  .join('')}
              </tbody>
            </table>
            <div class="signature">
              <div>
                ___________________<br>
                EL COMODANTE
              </div>
              <div>
                ___________________<br>
                EL COMODATARIO
              </div>
            </div>
          </section>
        </div>
      </body>
      </html>
    `;
  }