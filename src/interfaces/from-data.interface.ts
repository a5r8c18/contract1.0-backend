/* eslint-disable prettier/prettier */
export interface Person {
  nombre: string;
  cargo?: string; // Optional for comodato bienes, where cargo may not apply
  firma?: string; // Optional for comodato bienes
  identidad?: string; // Optional for comodato bienes
  caracteristicas?: string; // Added for comodato bienes
  marca?: string; // Added for comodato bienes
  modelo?: string; // Added for comodato bienes
  chapa?: string; // Added for comodato bienes
}

export interface FormData {
  // Arrendamiento fields
  arrendadorNombre: string;
  arrendadorCarne: string;
  arrendadorDireccion: string;
  arrendadorMunicipio: string;
  arrendadorProvincia: string;
  arrendadorNIT: string;
  arrendadorCuenta: string;
  arrendadorAgencia: string;
  arrendadorAgenciaDireccion: string;
  arrendadorLicencia: string;
  arrendadorTelefono: string;
  arrendatarioNombre: string;
  arrendatarioConstitucion: string;
  arrendatarioNumero: string;
  arrendatarioFecha: string;
  arrendatarioDireccion: string;
  arrendatarioMunicipio: string;
  arrendatarioProvincia: string;
  arrendatarioNacionalidad: string;
  arrendatarioNIT: string;
  arrendatarioLibro: string;
  arrendatarioTomo: string;
  arrendatarioFolio: string;
  arrendatarioHoja: string;
  arrendatarioCuenta: string;
  arrendatarioTelefonos: string;
  arrendatarioEmail: string;
  arrendatarioRepresentante: string;
  arrendatarioCondicion: string;
  arrendatarioAcreditacion: string;
  arrendatarioAcreditacionNumero: string;
  arrendatarioAcreditacionFecha: string;
  arrendatarioNotario: string;
  arrendatarioNotarioProvincia: string;
  arrendatarioNotarioSede: string;
  arrendatarioNotarioProvinciaSede: string;
  objetoTipo: string;
  objetoUbicacion: string;
  objetoMunicipio: string;
  objetoProvincia: string;
  notificacionDiasArrendador: string;
  notificacionDiasArrendatario: string;
  reciboTipo: string;
  pagoMonto: string;
  pagoInstrumento: string;
  pagoFrecuencia: string;
  pagoComprobante: string;
  vigenciaTermino: string;
  vigenciaConservacion: string;
  firmaDia: string;
  firmaMes: string;
  firmaAnio: string;
  anexoEntidadNombre: string;
  anexoEntidadDireccion: string;
  anexoEntidadTelefono: string;
  anexoEntidadEmail: string;
  anexoEntidadCodigo: string;
  anexoEntidadOrganismo: string;
  anexoEntidadNIT: string;
  anexoEntidadCuentaCUP: string;
  anexoEntidadSucursalCUP: string;
  anexoEntidadSucursalDireccionCUP: string;
  anexoPersonasServicios: Person[];
  anexoPersonasConciliaciones: Person[];
  anexoRepresentanteContrato: string;
  anexoRepresentanteCargo: string;
  anexoDirectorNombre: string;
  anexoDirectorCarne: string;
  anexoNotificadoNombre: string;
  anexoNotificadoCondicion: string;

  // Comodato fields
  comodanteNombre: string;
  comodanteNacionalidad: string;
  comodanteDomicilio: string;
  comodanteMunicipio: string;
  comodanteIdentidad: string;
  comodanteTelefono: string;
  comodatarioNombre: string;
  comodatarioConstitucion: string;
  comodatarioDecisionNumero: string;
  comodatarioDecisionFecha: string;
  comodatarioDomicilio: string;
  comodatarioMunicipio: string;
  comodatarioProvincia: string;
  comodatarioNacionalidad: string;
  comodatarioREEUPNIT: string;
  comodatarioLibro: string;
  comodatarioTomo: string;
  comodatarioFolio: string;
  comodatarioHoja: string;
  comodatarioCuentaBancaria: string;
  comodatarioTelefonos: string;
  comodatarioEmail: string;
  comodatarioRepresentante: string;
  comodatarioCondicion: string;
  comodatarioDecision: string;
  comodatarioEmitidaPor: string;
  comodatarioNotarioProvincia: string;
  comodatarioNotarioSede: string;
  comodatarioNotarioProvinciaSede: string;
  bienDescripción: string;
  vigenciaAnios: string;
  avisoComodanteAtt: string;
  avisoComodanteDireccion: string;
  avisoComodanteTelefono: string;
  avisoComodanteEmail: string;
  avisoComodatarioAtt: string;
  avisoComodatarioDireccion: string;
  avisoComodatarioTelefono: string;
  avisoComodatarioEmail: string;
  anexoBienes: Person[];
}