/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { FormData } from '../interfaces/from-data.interface';

export function generateContractHtml(formData: FormData): string {
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
      <!-- Sección 1: Cláusulas I-V -->
      <div class="pdf-section">
        <h1>Contrato de Arrendamiento</h1>

        <section>
          <h2>DE UNA PARTE</h2>
          <p>
            El(La) Trabajador(a) por Cuenta Propia <strong>${formData.arrendadorNombre || 'Nombre'}</strong>,
            ciudadano(a) cubano(a) mayor de edad con carne de Identidad No. ${formData.arrendadorCarne || 'Carné'},
            con domicilio Legal en calle ${formData.arrendadorDireccion || 'Dirección'} Municipio
            ${formData.arrendadorMunicipio || 'Municipio'}, Provincia ${formData.arrendadorProvincia || 'Provincia'},
            con NIT ${formData.arrendadorNIT || 'NIT'}, y cuenta bancaria No. ${formData.arrendadorCuenta || 'Cuenta'},
            en el banco Metropolitano, Agencia ${formData.arrendadorAgencia || 'Agencia'},
            cito en ${formData.arrendadorAgenciaDireccion || 'Dirección de la agencia'},
            con No. De licencia comercial ${formData.arrendadorLicencia || 'Licencia'},
            Teléfono ${formData.arrendadorTelefono || 'Teléfono'} y a los efectos de este
            contrato se denominará <strong>EL ARRENDADOR</strong>.
          </p>
        </section>

        <section>
          <h2>DE LA OTRA PARTE</h2>
          <p>
            ${formData.arrendatarioNombre || 'Nombre de la entidad'},
            constituida mediante ${formData.arrendatarioConstitucion || 'Constitución'} No.
            ${formData.arrendatarioNumero || 'Número'} de fecha ${formData.arrendatarioFecha || 'Fecha'},
            con domicilio legal en ${formData.arrendatarioDireccion || 'Dirección legal'},
            municipio ${formData.arrendatarioMunicipio || 'Municipio'},
            provincia ${formData.arrendatarioProvincia || 'Provincia'},
            de nacionalidad ${formData.arrendatarioNacionalidad || 'Nacionalidad'},
            código REEUP y NIT: ${formData.arrendatarioNIT || 'NIT'},
            Inscripción Registro Mercantil Libro ${formData.arrendatarioLibro || 'Libro'},
            Tomo ${formData.arrendatarioTomo || 'Tomo'}, Folio ${formData.arrendatarioFolio || 'Folio'},
            Hoja ${formData.arrendatarioHoja || 'Hoja'}, Cuenta bancaria No.
            ${formData.arrendatarioCuenta || 'Cuenta bancaria'},
            teléfonos ${formData.arrendatarioTelefonos || 'Teléfonos'},
            dirección electrónica: ${formData.arrendatarioEmail || 'Email'},
            representada en este acto por ${formData.arrendatarioRepresentante || 'Representante'}
            en su condición de ${formData.arrendatarioCondicion || 'Condición'}.
            Lo que acredita mediante ${formData.arrendatarioAcreditacion || 'Acreditación'} No.
            ${formData.arrendatarioAcreditacionNumero || 'Número'} de fecha
            ${formData.arrendatarioAcreditacionFecha || 'Fecha'},
            emitida por ${formData.arrendatarioNotario || 'Notario'},
            notario con competencia provincial en ${formData.arrendatarioNotarioProvincia || 'Provincia'}
            y sede en la ${formData.arrendatarioNotarioSede || 'Sede'},
            provincia ${formData.arrendatarioNotarioProvinciaSede || 'Provincia'},
            que en lo sucesivo y a los efectos de este contrato se denominará
            <strong>EL ARRENDATARIO</strong>.
          </p>
        </section>

        <section>
          <h2>AMBAS PARTES</h2>
          <p>
            Convienen en suscribir el presente contrato en los términos y condiciones siguientes:
          </p>
        </section>

        <section>
          <h2>CLÁUSULA No. I.- OBJETO DEL CONTRATO</h2>
          <p>
            1.1. Por el presente contrato EL ARRENDADOR conviene en arrendar un
            ${formData.objetoTipo || 'Tipo'} para su uso, ubicado en
            ${formData.objetoUbicacion || 'Ubicación'}, Municipio
            ${formData.objetoMunicipio || 'Municipio'}, Provincia
            ${formData.objetoProvincia || 'Provincia'}, cuya titularidad pertenece a
            EL ARRENDADOR, y EL ARRENDATARIO pagará por su uso, de conformidad con los
            términos, condiciones que sean acordados por ambas partes.
          </p>
        </section>

        <section>
          <h2>CLÁUSULA No. II.- OBLIGACIONES DE EL ARRENDADOR</h2>
          <p>
            2.1. EL ARRENDADOR se Obliga a:<br>
            2.1.2 Entregar el ${formData.objetoTipo || 'Tipo'} objeto del Contrato en los términos convenidos.<br>
            2.1.3 Permitir el uso pacífico del ${formData.objetoTipo || 'Tipo'} alquilado,
            durante el término de vigencia del presente contrato.<br>
            2.1.4 Comunicar a El Arrendatario llegado el momento de terminación de la
            vigencia del presente contrato la decisión de terminar el presente con no
            menos de ${formData.notificacionDiasArrendador || 'Días'} días de antelación
            devolviendo el valor del arrendamiento si así fuera necesario.<br>
            2.1.5 Emitir ${formData.reciboTipo || 'Recibo'} recibo de efectivo por el espacio
            arrendado, de conformidad al precio acordado por ambas partes.<br>
            2.1.6 Pagar los gastos extraordinarios en que haya incurrido EL ARRENDATARIO
            como consecuencia de la conservación del inmueble siempre que este le haya
            informado de tales pagos debidamente justificados, dichos pagos se llevarán a
            cabo mediante descuentos del valor del arrendamiento previamente conciliados y
            aceptados entre las partes.
          </p>
        </section>

        <section>
          <h2>CLÁUSULA No. III.- OBLIGACIONES DEL ARRENDATARIO</h2>
          <p>
            3.1 EL ARRENDATARIO se Obliga a:<br>
            3.1.1 Recibir el local objeto del Contrato en los términos convenidos.<br>
            3.1.2 Comunicar a EL ARRENDADOR llegado el momento de terminación de la
            vigencia del presente contrato la decisión de terminar el presente con no
            menos de ${formData.notificacionDiasArrendatario || 'Días'} días de antelación
            devolviendo el valor del arrendamiento si así fuera necesario.<br>
            3.1.3 Pagar, el importe por el ${formData.objetoTipo || 'Tipo'} alquilado en
            la forma y la cuantía establecida en el presente.<br>
            3.1.4 Utilizar el ${formData.objetoTipo || 'Tipo'} objeto del presente contrato
            con la diligencia debida y para la realización de la actividad para la cual
            está autorizado, según lo aprobado por el organismo competente.<br>
            3.1.5 No modificar ni alterar la estructura de la instalación, objeto del
            presente contrato sin que antes hubiese acuerdo entre las partes.<br>
            3.1.6 No ceder el arriendo, ni subarrendar a terceras personas.<br>
            3.1.7 Devolver a El Arrendador el espacio en condiciones adecuadas, una vez
            concluido el término de vigencia del presente contrato y de no resultar así,
            asumirá la indemnización por los trabajos que se requieran realizar para
            restituir su estado inicial.<br>
            3.1.8 Mantener la limpieza e higiene adecuada, así como dar seguridad y
            protección a sus bienes y de no observar ésta y ocasionarse daños a los mismos
            El Arrendador, estará exento de responsabilidad.
          </p>
        </section>

        <section>
          <h2>CLÁUSULA No. IV.- OTRAS CONDICIONES</h2>
          <p>
            4.1 Realizar la entrega-recepción del ${formData.objetoTipo || 'Tipo'}, tanto
            al iniciar como al terminar la relación contractual, dejando evidencia escrita,
            firmada de mutuo acuerdo entre las partes.<br>
            4.2 Revisar en cualquier momento el presente contrato, ajustando aquellas
            cláusulas que así correspondan, mediante suplemento firmado de mutuo acuerdo
            entre las partes o atendiendo a indicaciones o disposiciones emitidas por
            autoridad competente.<br>
            4.3 Permitir el acceso del El Arrendador e inspectores con competencia para
            ello al interior de la instalación, cuando así se considere pertinente y
            previo aviso con tres (3) días de antelación.<br>
            4.4 Las partes no permitirán que se lleve a cabo por personal a su cargo
            acciones o actos que puedan causar daños, interrupciones o mal funcionamiento
            de los sistemas instalados, local, y otras facilidades de la otra parte que
            no hayan sido colegiadas y aprobadas por ambas, asumiendo los gastos de
            restitución, reparación o indemnización según proceda en el caso que se
            provoquen éstos.<br>
            4.5 Ante la ocurrencia de desastres naturales que puedan afectar la integridad
            del ${formData.objetoTipo || 'Tipo'}, El Arrendatario, cumplirá las
            indicaciones emitidas por la Defensa Civil y hasta tanto se mantenga la
            misma, retirará del lugar sus bienes si es necesario. De no observar lo
            anterior, El Arrendador no será responsable por los daños y perjuicios que
            puedan sufrir los mismos.
          </p>
        </section>

        <section>
          <h2>CLÁUSULA No. V.- VALOR Y FORMA DE PAGO</h2>
          <p>
            5.1 EL pago del arrendamiento será de ${formData.pagoMonto || 'Monto'} CUP.<br>
            El instrumento de pago será ${formData.pagoInstrumento || 'Instrumento'} y se
            efectuará con una frecuencia ${formData.pagoFrecuencia || 'Frecuencia'},
            previa entrega de la correspondiente ${formData.pagoComprobante || 'Comprobante'}.
          </p>
        </section>
      </div>

      <!-- Sección 2: Cláusulas VI-XIII -->
      <div class="pdf-section">
        <section>
          <h2>CLÁUSULA No. VI.- PENALIDADES</h2>
          <p>
            6.1 Cuando EL ARRENDATARIO incumpliese con la obligación de pago expresado
            en el presente Contrato, EL ARRENDADOR podrá ejercitar las acciones
            siguientes:<br>
            a) Se cobrarán intereses moratorios consistentes en<br>
            - Durante los primeros 30 días: 4% del valor total facturado.<br>
            - Durante los siguientes 30 días: 6% del valor total facturado.<br>
            - Más de 60 días: 8% del valor total facturado.<br>
            b) Suspender los servicios pactados hasta tanto se salde la deuda.<br>
            6.2 En igual cuantía será penalizado EL ARRENDADOR cuando incumpliese con
            cualquier obligación distinta a las obligaciones de pago y con cualquier
            término expresado en el presente.<br>
            6.3 Ambas partes son responsables civilmente, por los daños y perjuicios
            causados por el incumplimiento total o parcial de sus respectivas
            obligaciones, cuando estas no sean cubiertas por la penalización prevista en
            el párrafo anterior.
          </p>
        </section>

        <section>
          <h2>CLÁUSULA VII.- CONFIDENCIALIDAD</h2>
          <p>
            7.1 Las partes acuerdan mantener la confidencialidad necesaria sobre la
            información general que se generen en virtud del servicio prestado,
            comprometiéndose a guardar la documentación por un término de 5 años a
            partir de la firma del presente.<br>
            Ningún acto de intercambio será interpretado como cesión de los derechos de
            la Propiedad Intelectual que sobre dichas modalidades EL ARRENDADOR posea.
          </p>
        </section>

        <section>
          <h2>CLÁUSULA VIII.- MODIFICACIÓN Y TERMINACIÓN</h2>
          <p>
            8.1 Toda adición o modificación al Contrato se realizará mediante Suplemento
            fechado y firmado por ambas partes, debiendo la otra parte dar respuesta en
            un término de quince (15) días. En caso de no dar respuesta se entenderá
            como aceptado, toda modificación se realizará suscribiéndose el
            correspondiente suplemento.<br>
            8.2 La modificación o rescisión del Contrato no exime a las partes
            contrayentes de las obligaciones en ejecución, del pago pendiente, de la
            responsabilidad material derivada de ellos, ni del derecho de reclamarlas
            directamente o jurídicamente.<br>
            8.3 Será causal de terminación del presente contrato además de las
            establecidas en la legislación vigente en la materia las siguientes:<br>
            - El cierre del proyecto de trabajo aprobado tanto para el Arrendador como
            para el Arrendatario.
          </p>
        </section>

        <section>
          <h2>CLÁUSULA No. IX.- EXIMENTES DE RESPONSABILIDAD</h2>
          <p>
            9.1 Se considerarán EXIMENTES DE RESPONSABILIDAD aquellas que surjan
            después de firmado el contrato e impidan su cumplimiento, siempre que sean
            extraordinarias, imprevisibles e inevitables o siendo previsibles igualmente
            inevitables y ajenas a la voluntad de las partes.<br>
            9.2 El período de tiempo señalado para el cumplimiento de las obligaciones
            contractuales, se entenderá en dichos casos prorrogados por un período igual
            al de la vigencia de dichas contingencias. Si estas contingencias duraran
            más de tres meses, cada una de las partes contratantes podrá dar por
            terminado el contrato, notificando por escrito a la otra parte, no teniendo
            ningún derecho a ser indemnizada de cualquier pérdida. La alegación de una
            causal de eximente de responsabilidad no exime del cumplimiento de las
            obligaciones no afectadas por esta, quedando a decisión, por mutuo acuerdo
            de las partes, que la misma constituya una causal de extinción del
            contrato.<br>
            9.3 La parte imposibilitada de cumplir por las razones antes expuestas,
            notificará inmediatamente por escrito a la otra, la existencia y duración
            de la causal que corresponda, la cual deberá acreditar mediante
            certificación expedida por institución competente, la Cámara de Comercio de
            la República de Cuba, sin perjuicio de su obligación en efectuar cuantos
            actos y desembolsos fueran necesarios para minimizar o eliminar las
            consecuencias negativas para la otra parte y para la relación objeto del
            contrato.<br>
            9.4 No serán consideradas causas eximentes de responsabilidad, ni
            circunstancias modificativas de las obligaciones emergentes del presente
            contrato, cualesquiera regulaciones, disposiciones, órdenes u acciones,
            incluida la de negación de licencias de gobiernos extranjeros a las partes,
            o de entidades que de cualquier forma posean, dirijan o controlen al
            ARRENDATARIO, que impidan o intenten impedir, total o parcialmente, el
            oportuno y cabal cumplimiento de este contrato.<br>
            9.5 Cuando concurran circunstancias de EXIMENTES DE RESPONSABILIDAD y
            después de realizar todas las gestiones para asegurar la protección de las
            mercancías, EL ARRENDADOR quedará liberado de toda responsabilidad respecto
            a la óptima conservación de las mercancías almacenadas. EL ARRENDATARIO, si
            así lo desea, deberá asegurar el valor de las mercancías almacenadas con
            una empresa especializada.
          </p>
        </section>

        <section>
          <h2>CLÁUSULA No. X.- CALIDAD Y GARANTÍA</h2>
          <p>
            10.1 EL ARRENDADOR garantiza el goce pacífico del bien arrendado a EL
            ARRENDATARIO por el período de vigencia pactado en el presente contrato.
          </p>
        </section>

        <section>
          <h2>CLÁUSULA No. XI.- RECLAMACIONES Y SOLUCIÓN DE CONFLICTOS</h2>
          <p>
            11.1 Ambas partes reconocen el derecho recíproco de formularse reclamación
            ante el incumplimiento total o parcial de las obligaciones contraídas en el
            presente contrato.<br>
            11.2 Las partes convienen en cumplir el presente contrato de buena fe y
            agotar la vía conciliatoria, con el ánimo de solucionar cualquier
            discrepancia mediante negociaciones amigables.<br>
            11.3 Las reclamaciones deberán hacerse por escrito en el término de 15 días
            a partir de la fecha en que la obligación debió ser cumplida.<br>
            11.4 La parte contra la que se presente la reclamación deberá examinarla y
            dar respuesta de su contenido dentro del término de diez días hábiles
            siguientes a la fecha en que hubiere recibido la misma, decursado este, se
            entenderá rechazada y el asunto podrá someterse a la consideración del
            órgano juzgador del domicilio del demandado y la decisión del mismo será de
            obligatorio cumplimiento para ambas partes.
          </p>
        </section>

        <section>
          <h2>CLÁUSULA No. XII.- LEY APLICABLE</h2>
          <p>
            12.1 El presente contrato se rige según lo dispuesto en el Decreto Ley
            304/12, De la Contratación Económica, Decreto 310/12, De los Tipos de
            Contratos y en lo dispuesto en el Decreto Ley 88/24 Sobre las micro,
            pequeñas y medianas empresas, Decreto Ley 90/24 Sobre el Ejercicio del
            Trabajo por cuenta propia, Decreto Ley 91/24 De las contravenciones en el
            Ejercicio del Trabajo Por Cuenta Propia, las Micro, Pequeñas y Medianas
            empresas privadas y los Titulares de los Proyectos de Desarrollo Local y
            demás que sean de adecuación emitidos por los organismos competentes.
          </p>
        </section>

        <section>
          <h2>CLÁUSULA No. XIII.- VIGENCIA</h2>
          <p>
            13.1 El presente contrato tendrá vigencia por el término de
            ${formData.vigenciaTermino || 'Años'} años a partir de la fecha de su
            firma, al término del cual podrá ser prorrogado por acuerdo expreso de las
            partes lo que se hará constar mediante suplemento al mismo.<br>
            13.2 Ambas partes conservarán el presente contrato, por un término de
            ${formData.vigenciaConservacion || 'Años'} años.
          </p>
        </section>

        <section>
          <p>
            Y como constancia de su conformidad, se extiende el mismo en dos ejemplares
            a un solo tenor y efecto legal en La Habana, a los ${formData.firmaDia || 'Día'}
            días del mes de ${formData.firmaMes || 'Mes'} de ${formData.firmaAnio || 'Año'}.
          </p>
          <div class="signature">
            <div>
              ___________________<br>
              EL ARRENDADOR
            </div>
            <div>
              ___________________<br>
              EL ARRENDATARIO
            </div>
          </div>
        </section>
      </div>

      <!-- Sección 3: Anexo II -->
      <div class="pdf-section">
        <section>
          <h2>ANEXO II: FICHA DEL CLIENTE</h2>
          <div>
            <p><strong>Nombre de la entidad:</strong> ${formData.anexoEntidadNombre || 'Nombre'}</p>
            <p><strong>Dirección:</strong> ${formData.anexoEntidadDireccion || 'Dirección'}</p>
            <p>
              <strong>Teléfono:</strong> ${formData.anexoEntidadTelefono || 'Teléfono'}
              <span style="margin-left: 20px;">
                <strong>E-mail:</strong> ${formData.anexoEntidadEmail || 'E-mail'}
              </span>
            </p>
            <p>
              <strong>Código Entidad:</strong> ${formData.anexoEntidadCodigo || 'Código'}
              <span style="margin-left: 20px;">
                <strong>Organismo o Ministerio:</strong> ${formData.anexoEntidadOrganismo || 'Organismo'}
              </span>
              <span style="margin-left: 20px;">
                <strong>NIT:</strong> ${formData.anexoEntidadNIT || 'NIT'}
              </span>
            </p>
            <p>
              <strong>Cuenta Bancaria CUP:</strong> ${formData.anexoEntidadCuentaCUP || 'Cuenta'}
              <span style="margin-left: 20px;">
                <strong>Sucursal CUP:</strong> ${formData.anexoEntidadSucursalCUP || 'Sucursal'}
              </span>
            </p>
            <p>
              <strong>Dirección Sucursal CUP:</strong> ${formData.anexoEntidadSucursalDireccionCUP || 'Dirección'}
            </p>
          </div>

          <div>
            <h3>Personas Autorizadas a solicitar servicios, firma de los entregables y facturas</h3>
            <table>
              <thead>
                <tr>
                  <th>Nombre y Apellidos</th>
                  <th>Cargo</th>
                  <th>Firma</th>
                  <th>No. C. Identidad</th>
                </tr>
              </thead>
              <tbody>
                ${formData.anexoPersonasServicios
                  .map(
                    (persona) => `
                      <tr>
                        <td>${persona.nombre || 'Nombre'}</td>
                        <td>${persona.cargo || 'Cargo'}</td>
                        <td>${persona.firma || 'Firma'}</td>
                        <td>${persona.identidad || 'Identidad'}</td>
                      </tr>
                    `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>

          <div>
            <h3>Personas Autorizadas para firmar conciliaciones</h3>
            <table>
              <thead>
                <tr>
                  <th>Nombre y Apellidos</th>
                  <th>Cargo</th>
                  <th>Firma</th>
                  <th>No. C. Identidad</th>
                </tr>
              </thead>
              <tbody>
                ${formData.anexoPersonasConciliaciones
                  .map(
                    (persona) => `
                      <tr>
                        <td>${persona.nombre || 'Nombre'}</td>
                        <td>${persona.cargo || 'Cargo'}</td>
                        <td>${persona.firma || 'Firma'}</td>
                        <td>${persona.identidad || 'Identidad'}</td>
                      </tr>
                    `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>

          <div>
            <p>
              <strong>Representante de la Entidad designado para firmar Contrato:</strong>
              ${formData.anexoRepresentanteContrato || 'Representante'}
              <span style="margin-left: 20px;">
                <strong>Cargo que ocupa:</strong> ${formData.anexoRepresentanteCargo || 'Cargo'}
              </span>
            </p>
          </div>

          <div>
            <p>
              El Director de la entidad o su equivalente declara, apercibido de la
              responsabilidad en que incurre, que todos los datos aquí plasmados son
              ciertos y que cualquier variación en alguno de ellos deberá comunicarse
              de inmediato a ${formData.anexoNotificadoNombre || 'Notificado'} en su
              condición de ${formData.anexoNotificadoCondicion || 'Condición'},
              para evitar cualquier consecuencia que de ello pueda derivarse.
            </p>
            <p>
              <strong>Nombres y apellidos del Director de la Entidad o su equivalente:</strong>
              ${formData.anexoDirectorNombre || 'Nombre'}
              <span style="margin-left: 20px;">
                <strong>Cuño:</strong> ____________
              </span>
            </p>
            <p>
              <strong>No. Carné de identidad:</strong> ${formData.anexoDirectorCarne || 'Carné'}
            </p>
            <p>
              <strong>Firma:</strong> ____________
            </p>
          </div>

          <div>
            <h3>Documentos que deben acompañar a este modelo para conformar el expediente del cliente:</h3>
            <ol>
              <li>Resolución de Nombramiento del Director de la entidad.</li>
              <li>Resolución o documento que faculta a la persona designada para firmar el Contrato.</li>
            </ol>
          </div>
        </section>
      </div>
    </body>
    </html>
  `;
}