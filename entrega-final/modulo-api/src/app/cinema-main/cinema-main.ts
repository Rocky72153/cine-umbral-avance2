import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface IntegranteElenco {
  rol: string;
  nombre: string;
}

interface ResenaPelicula {
  usuario: string;
  calificacion: number;
  comentario: string;
  respuestaEmpresa: string;
}

interface FuncionDisponible {
  fecha: string;
  horas: string[];
  tipoSala: string;
  requisitosSala: string;
  precioBoleta: number;
  cargoServicio: number;
}

interface PeliculaDetalle {
  id: number;
  titulo: string;
  tituloOriginal: string;
  poster: string;
  clasificacion: string;
  duracion: string;
  idiomaOriginal: string;
  audios: string[];
  subtitulos: string[];
  sinopsis: string;
  elenco: IntegranteElenco[];
  funciones: FuncionDisponible[];
  resenas: ResenaPelicula[];
}

export interface EspectadorRegistro {
  id_espectador: number;
  id_tipo_documento: number;
  tipo_documento?: string;
  primer_nombre: string;
  segundo_nombre: string | null;
  primer_apellido: string;
  segundo_apellido: string | null;
  numero_documento: string;
  correo: string;
  usuario: string;
  contrasenia?: string;
}

export interface MiembroStaff {
  id_staff: number;
  id_cargo_staff: number;
  cargo_nombre: string;
  id_estado_staff: number;
  estado_nombre: string;
  id_tipo_documento: number;
  primer_nombre: string;
  segundo_nombre: string | null;
  primer_apellido: string;
  segundo_apellido: string | null;
  numero_documento: string;
  correo: string;
  usuario: string;
  contrasenia: string;
  id_tipo_contrato: number;
  tipo_contrato_nombre: string;
  fecha_inicio: string;
  salario: number;
}

interface SesionActiva {
  tipo: 'espectador' | 'staff';
  id_usuario: number;
  usuario: string;
  nombre_completo: string;
  id_cargo_staff?: number;
  cargo_nombre?: string;
  datos_espectador?: EspectadorRegistro;
  datos_staff?: MiembroStaff;
}

interface TipoDocumentoOpcion {
  id: number;
  nombre: string;
}

interface CatalogoOpcion {
  id: number;
  nombre: string;
}

interface ApiResponse<T> {
  status: string;
  data?: T;
  errors?: Record<string, string>;
  message?: string;
}

@Component({
  selector: 'app-cinema-main',
  standalone: true,
  templateUrl: './cinema-main.html',
  styleUrls: ['./cinema-main.css']
})
export class CinemaMain implements OnInit {
  private readonly apiBaseUrl = 'http://127.0.0.1:8000/api';
  private readonly storageKeyEspectadores = 'cineplus_espectadores';
  private readonly storageKeyStaff = 'cineplus_staff_v2';
  private readonly storageKeySesion = 'cineplus_sesion_activa';

  tiposDocumento: TipoDocumentoOpcion[] = [
    { id: 1, nombre: 'Cédula de ciudadanía' },
    { id: 2, nombre: 'Tarjeta de identidad' },
    { id: 3, nombre: 'Cédula de extranjería' },
    { id: 4, nombre: 'Pasaporte' }
  ];

  cargosStaff: CatalogoOpcion[] = [
    { id: 1, nombre: 'Taquillero' },
    { id: 2, nombre: 'Supervisor' },
    { id: 3, nombre: 'Administrador' }
  ];

  estadosStaff: CatalogoOpcion[] = [
    { id: 1, nombre: 'Activo' },
    { id: 2, nombre: 'Inactivo' }
  ];

  tiposContrato: CatalogoOpcion[] = [
    { id: 1, nombre: 'Indefinido' },
    { id: 2, nombre: 'Término fijo' },
    { id: 3, nombre: 'Temporal' }
  ];

  private readonly staffIniciales: MiembroStaff[] = [
    {
      id_staff: 1,
      id_cargo_staff: 3,
      cargo_nombre: 'Administrador',
      id_estado_staff: 1,
      estado_nombre: 'Activo',
      id_tipo_documento: 1,
      primer_nombre: 'Carlos',
      segundo_nombre: 'Eduardo',
      primer_apellido: 'Ramírez',
      segundo_apellido: 'Soto',
      numero_documento: '80111222',
      correo: 'jefe@cineplus.com',
      usuario: 'jefe_cine',
      contrasenia: 'Jefe1234',
      id_tipo_contrato: 1,
      tipo_contrato_nombre: 'Indefinido',
      fecha_inicio: '2026-01-15',
      salario: 4500000
    },
    {
      id_staff: 2,
      id_cargo_staff: 1,
      cargo_nombre: 'Taquillero',
      id_estado_staff: 1,
      estado_nombre: 'Activo',
      id_tipo_documento: 1,
      primer_nombre: 'Valentina',
      segundo_nombre: null,
      primer_apellido: 'Torres',
      segundo_apellido: 'Mejía',
      numero_documento: '1022334455',
      correo: 'taquilla1@cineplus.com',
      usuario: 'vendedor_boleta',
      contrasenia: 'Vendedor1234',
      id_tipo_contrato: 2,
      tipo_contrato_nombre: 'Término fijo',
      fecha_inicio: '2026-02-01',
      salario: 1800000
    }
  ];

  espectadoresGuardados: EspectadorRegistro[] = [];
  miembrosStaff: MiembroStaff[] = [];
  sesionActiva: SesionActiva | null = null;
  pestanaActiva: 'cartelera' | 'staff' = 'cartelera';

  modalAbierto = false;
  mostrarContrasena = false;
  correo = '';
  contrasena = '';
  correoInvalido = false;
  errorLogin = '';

  modalRegistroAbierto = false;
  mostrarContrasenaRegistro = false;
  guardandoRegistro = false;
  errorRegistro = '';
  mensajeRegistro = '';
  horaPendienteCompra: string | null = null;

  modalContratarStaffAbierto = false;
  errorContratacion = '';
  mensajeContratacion = '';

  idStaffSeleccionadoCompra = 2;

  nuevoEspectador = {
    id_tipo_documento: 1,
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    numero_documento: '',
    correo: '',
    usuario: '',
    contrasenia: ''
  };

  nuevoStaff = {
    id_cargo_staff: 1,
    id_estado_staff: 1,
    id_tipo_documento: 1,
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    numero_documento: '',
    correo: '',
    usuario: '',
    contrasenia: '',
    id_tipo_contrato: 1,
    fecha_inicio: '2026-11-21',
    salario: 1800000
  };

  peliculaSeleccionada: PeliculaDetalle | null = null;
  modalFuncionesAbierto = false;
  fechaSeleccionada = '';
  horasDisponibles: string[] = [];

  cargandoPeliculas = true;
  peliculas: PeliculaDetalle[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.cargarDatosGuardados();
  }

  ngOnInit(): void {
    this.cargarTiposDocumentoDesdeBackend();
    this.cargarPeliculasDesdeBackend();
    this.cargarStaffDesdeBackend();
  }

  private cargarStaffDesdeBackend(): void {
    this.http.get<ApiResponse<any[]>>(`${this.apiBaseUrl}/staff/`).subscribe({
      next: resp => {
        if (resp.status === 'success' && Array.isArray(resp.data)) {
          this.miembrosStaff = resp.data.map(s => ({ ...s, contrasenia: '' }));
          this.persistirStaff();
          this.sincronizarStaffSeleccionadoCompra();
          this.cdr.detectChanges();
        }
      }
    });
  }

  get esAdministrador(): boolean {
    return this.sesionActiva?.tipo === 'staff' && this.sesionActiva.id_cargo_staff === 3;
  }

  get taquillerosActivos(): MiembroStaff[] {
    const activos = this.miembrosStaff.filter(
      m => m.id_cargo_staff === 1 && m.id_estado_staff === 1
    );
    return activos.length > 0 ? activos : [this.staffIniciales[1]];
  }

  private cargarPeliculasDesdeBackend(): void {
    this.cargandoPeliculas = true;
    this.cdr.detectChanges();

    this.http
      .get<ApiResponse<PeliculaDetalle[]>>(`${this.apiBaseUrl}/peliculas/`)
      .subscribe({
        next: resp => {
          this.cargandoPeliculas = false;
          if (resp.status === 'success' && Array.isArray(resp.data)) {
            this.peliculas = [...resp.data];
          } else {
            this.peliculas = [];
          }
          this.cdr.detectChanges();
        },
        error: () => {
          this.cargandoPeliculas = false;
          this.peliculas = [];
          this.cdr.detectChanges();
        }
      });
  }

  private cargarTiposDocumentoDesdeBackend(): void {
    this.http
      .get<ApiResponse<{ id_tipo_documento: number; nombre: string }[]>>(`${this.apiBaseUrl}/tipos-documento/`)
      .subscribe({
        next: resp => {
          if (resp.status === 'success' && Array.isArray(resp.data) && resp.data.length > 0) {
            this.tiposDocumento = resp.data.map(item => ({
              id: item.id_tipo_documento,
              nombre: item.nombre
            }));
            const existeActual = this.tiposDocumento.some(t => t.id === this.nuevoEspectador.id_tipo_documento);
            if (!existeActual) {
              this.nuevoEspectador.id_tipo_documento = this.tiposDocumento[0].id;
              this.nuevoStaff.id_tipo_documento = this.tiposDocumento[0].id;
            }
            this.cdr.detectChanges();
          }
        },
        error: () => {}
      });
  }

  private cargarDatosGuardados(): void {
    try {
      const rawLista = localStorage.getItem(this.storageKeyEspectadores);
      if (rawLista) {
        this.espectadoresGuardados = JSON.parse(rawLista);
      }

      const rawStaff = localStorage.getItem(this.storageKeyStaff);
      if (rawStaff) {
        const parseados: MiembroStaff[] = JSON.parse(rawStaff);
        this.miembrosStaff = parseados.length > 0 ? parseados : [...this.staffIniciales];
      } else {
        this.miembrosStaff = [...this.staffIniciales];
        this.persistirStaff();
      }

      const rawSesion = localStorage.getItem(this.storageKeySesion);
      if (rawSesion) {
        this.sesionActiva = JSON.parse(rawSesion);
        this.pestanaActiva = this.esAdministrador ? 'staff' : 'cartelera';
      }
    } catch {
      this.espectadoresGuardados = [];
      this.miembrosStaff = [...this.staffIniciales];
      this.sesionActiva = null;
      this.pestanaActiva = 'cartelera';
    }
    this.sincronizarStaffSeleccionadoCompra();
  }

  private sincronizarStaffSeleccionadoCompra(): void {
    if (this.sesionActiva?.tipo === 'staff' && this.sesionActiva.id_cargo_staff === 1) {
      this.idStaffSeleccionadoCompra = this.sesionActiva.id_usuario;
      return;
    }
    const taquilleros = this.taquillerosActivos;
    const existe = taquilleros.some(v => v.id_staff === this.idStaffSeleccionadoCompra);
    if (!existe && taquilleros.length > 0) {
      this.idStaffSeleccionadoCompra = taquilleros[0].id_staff;
    }
  }

  private persistirEspectadores(): void {
    localStorage.setItem(this.storageKeyEspectadores, JSON.stringify(this.espectadoresGuardados));
  }

  private persistirStaff(): void {
    localStorage.setItem(this.storageKeyStaff, JSON.stringify(this.miembrosStaff));
  }

  private persistirSesion(): void {
    if (this.sesionActiva) {
      localStorage.setItem(this.storageKeySesion, JSON.stringify(this.sesionActiva));
    } else {
      localStorage.removeItem(this.storageKeySesion);
    }
  }

  seleccionarPestana(pestana: 'cartelera' | 'staff'): void {
    if (pestana === 'staff' && !this.esAdministrador) {
      return;
    }
    this.pestanaActiva = pestana;
  }

  abrirModal(): void {
    this.errorLogin = '';
    this.correoInvalido = false;
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.mostrarContrasena = false;
    this.correoInvalido = false;
    this.errorLogin = '';
  }

  cerrarSesion(): void {
    this.sesionActiva = null;
    this.pestanaActiva = 'cartelera';
    this.persistirSesion();
    this.sincronizarStaffSeleccionadoCompra();
  }

  alternarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  validarCorreo(): void {
    const valor = this.correo.trim();
    if (!valor || !valor.includes('@')) {
      this.correoInvalido = false;
      return;
    }
    this.correoInvalido = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }

  enviarFormulario(event: Event): void {
    event.preventDefault();
    this.errorLogin = '';
    this.validarCorreo();

    const identificador = this.correo.trim().toLowerCase();
    const clave = this.contrasena;

    if (!identificador || !clave.trim() || this.correoInvalido) {
      this.errorLogin = 'Completa tu correo o usuario y tu contraseña.';
      return;
    }

    this.http
      .post<ApiResponse<any>>(`${this.apiBaseUrl}/staff/login/`, {
        usuario: identificador,
        contrasenia: clave
      })
      .subscribe({
        next: resp => {
          const s = resp.data;
          const datosStaff =
            this.miembrosStaff.find(m => m.id_staff === s.id_staff) ?? this.staffIniciales[0];
          this.sesionActiva = {
            tipo: 'staff',
            id_usuario: s.id_staff,
            usuario: s.usuario,
            nombre_completo: `${s.primer_nombre} ${s.primer_apellido}`,
            id_cargo_staff: s.id_cargo_staff,
            cargo_nombre: s.cargo_nombre,
            datos_staff: datosStaff
          };
          this.pestanaActiva = s.id_cargo_staff === 3 ? 'staff' : 'cartelera';
          this.sincronizarStaffSeleccionadoCompra();
          this.persistirSesion();
          this.cerrarModal();
          if (s.id_cargo_staff !== 3) {
            this.continuarCompraPendienteSiExiste();
          } else {
            this.horaPendienteCompra = null;
          }
          this.cdr.detectChanges();
        },
        // Si no es staff, se intenta como espectador (lógica que ya existía)
        error: () => {
          this.iniciarSesionEspectador(identificador, clave);
          this.cdr.detectChanges();
        }
      });
  }

  private iniciarSesionEspectador(identificador: string, clave: string): void {
    const espectadorEncontrado = this.espectadoresGuardados.find(
      esp =>
        ((esp.correo || '').trim().toLowerCase() === identificador ||
          esp.usuario.trim().toLowerCase() === identificador) &&
        esp.contrasenia === clave
    );

    if (espectadorEncontrado) {
      const nombreCompleto = [
        espectadorEncontrado.primer_nombre,
        espectadorEncontrado.segundo_nombre,
        espectadorEncontrado.primer_apellido,
        espectadorEncontrado.segundo_apellido
      ]
        .filter(Boolean)
        .join(' ');

      this.sesionActiva = {
        tipo: 'espectador',
        id_usuario: espectadorEncontrado.id_espectador,
        usuario: espectadorEncontrado.usuario,
        nombre_completo: nombreCompleto,
        datos_espectador: espectadorEncontrado
      };
      this.pestanaActiva = 'cartelera';
      this.sincronizarStaffSeleccionadoCompra();
      this.persistirSesion();
      this.cerrarModal();
      this.continuarCompraPendienteSiExiste();
      return;
    }

    if (this.espectadoresGuardados.length === 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identificador)) {
      const usuarioBase = identificador.split('@')[0];
      const sesionDemo: EspectadorRegistro = {
        id_espectador: 1,
        id_tipo_documento: 1,
        primer_nombre: usuarioBase,
        segundo_nombre: '',
        primer_apellido: 'Espectador',
        segundo_apellido: '',
        numero_documento: '0000000000',
        correo: identificador,
        usuario: usuarioBase,
        contrasenia: clave
      };
      this.sesionActiva = {
        tipo: 'espectador',
        id_usuario: sesionDemo.id_espectador,
        usuario: sesionDemo.usuario,
        nombre_completo: `${sesionDemo.primer_nombre} ${sesionDemo.primer_apellido}`,
        datos_espectador: sesionDemo
      };
      this.pestanaActiva = 'cartelera';
      this.sincronizarStaffSeleccionadoCompra();
      this.persistirSesion();
      this.cerrarModal();
      this.continuarCompraPendienteSiExiste();
      return;
    }

    this.errorLogin = 'Credenciales incorrectas o el usuario no existe. Si no tienes cuenta, créala aquí.';
  }

  abrirModalRegistro(event: Event): void {
    event.preventDefault();
    this.errorRegistro = '';
    this.mensajeRegistro = '';
    this.modalAbierto = false;
    this.modalRegistroAbierto = true;
    this.cargarTiposDocumentoDesdeBackend();
  }

  cerrarModalRegistro(): void {
    this.modalRegistroAbierto = false;
    this.mostrarContrasenaRegistro = false;
    this.guardandoRegistro = false;
    this.errorRegistro = '';
    this.mensajeRegistro = '';
    this.horaPendienteCompra = null;
  }

  volverAIniciarSesion(): void {
    this.modalRegistroAbierto = false;
    this.errorLogin = '';
    this.modalAbierto = true;
  }

  guardarUsuario(event: Event): void {
    event.preventDefault();
    if (this.guardandoRegistro) {
      return;
    }

    this.errorRegistro = '';
    this.mensajeRegistro = '';

    const primerNombre = this.nuevoEspectador.primer_nombre.trim();
    const segundoNombre = this.nuevoEspectador.segundo_nombre.trim() || null;
    const primerApellido = this.nuevoEspectador.primer_apellido.trim();
    const segundoApellido = this.nuevoEspectador.segundo_apellido.trim() || null;
    const numeroDocumento = this.nuevoEspectador.numero_documento.trim();
    const correo = this.nuevoEspectador.correo.trim();
    const usuario = this.nuevoEspectador.usuario.trim();
    const contrasenia = this.nuevoEspectador.contrasenia;

    if (!primerNombre || !primerApellido || !numeroDocumento || !correo || !usuario || !contrasenia.trim()) {
      this.errorRegistro = 'Completa todos los campos obligatorios del espectador.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      this.errorRegistro = 'Ingresa un correo electrónico válido.';
      return;
    }

    const payload = {
      id_tipo_documento: Number(this.nuevoEspectador.id_tipo_documento),
      primer_nombre: primerNombre,
      segundo_nombre: segundoNombre,
      primer_apellido: primerApellido,
      segundo_apellido: segundoApellido,
      numero_documento: numeroDocumento,
      correo,
      usuario,
      contrasenia
    };

    this.guardandoRegistro = true;
    this.cdr.detectChanges();

    this.http
      .post<ApiResponse<EspectadorRegistro>>(`${this.apiBaseUrl}/espectadores/registro/`, payload)
      .subscribe({
        next: resp => {
          this.guardandoRegistro = false;
          if (resp.status !== 'success' || !resp.data) {
            this.errorRegistro = resp.message || 'No se pudo registrar el espectador.';
            this.cdr.detectChanges();
            return;
          }

          const registrado: EspectadorRegistro = {
            ...resp.data,
            contrasenia
          };

          this.espectadoresGuardados = [
            ...this.espectadoresGuardados.filter(
              e => e.id_espectador !== registrado.id_espectador && e.usuario !== registrado.usuario
            ),
            registrado
          ];
          this.persistirEspectadores();

          const nombreCompleto = [
            registrado.primer_nombre,
            registrado.segundo_nombre,
            registrado.primer_apellido,
            registrado.segundo_apellido
          ]
            .filter(Boolean)
            .join(' ');

          this.sesionActiva = {
            tipo: 'espectador',
            id_usuario: registrado.id_espectador,
            usuario: registrado.usuario,
            nombre_completo: nombreCompleto,
            datos_espectador: registrado
          };
          this.pestanaActiva = 'cartelera';
          this.sincronizarStaffSeleccionadoCompra();
          this.persistirSesion();

          this.nuevoEspectador = {
            id_tipo_documento: this.tiposDocumento[0]?.id ?? 1,
            primer_nombre: '',
            segundo_nombre: '',
            primer_apellido: '',
            segundo_apellido: '',
            numero_documento: '',
            correo: '',
            usuario: '',
            contrasenia: ''
          };

          this.modalRegistroAbierto = false;
          this.cdr.detectChanges();
          this.continuarCompraPendienteSiExiste();
        },
        error: (err: HttpErrorResponse) => {
          this.guardandoRegistro = false;
          const cuerpoError = err.error as ApiResponse<unknown> | null;
          if (cuerpoError?.errors) {
            this.errorRegistro = Object.values(cuerpoError.errors).join(' ');
          } else if (cuerpoError?.message) {
            this.errorRegistro = cuerpoError.message;
          } else {
            this.errorRegistro = 'No fue posible conectar con el servidor de Cineplus.';
          }
          this.cdr.detectChanges();
        }
      });
  }

  abrirModalContratarStaff(): void {
    this.errorContratacion = '';
    this.mensajeContratacion = '';
    this.modalContratarStaffAbierto = true;
  }

  cerrarModalContratarStaff(): void {
    this.modalContratarStaffAbierto = false;
    this.errorContratacion = '';
  }

  contratarMiembroStaff(event: Event): void {
    event.preventDefault();
    this.errorContratacion = '';
    this.mensajeContratacion = '';

    const primerNombre = this.nuevoStaff.primer_nombre.trim();
    const segundoNombre = this.nuevoStaff.segundo_nombre.trim() || null;
    const primerApellido = this.nuevoStaff.primer_apellido.trim();
    const segundoApellido = this.nuevoStaff.segundo_apellido.trim() || null;
    const numeroDocumento = this.nuevoStaff.numero_documento.trim();
    const correo = this.nuevoStaff.correo.trim();
    const usuario = this.nuevoStaff.usuario.trim();
    const contrasenia = this.nuevoStaff.contrasenia;
    const fechaInicio = this.nuevoStaff.fecha_inicio.trim();
    const salario = Number(this.nuevoStaff.salario);
    const idCargo = Number(this.nuevoStaff.id_cargo_staff);
    const idEstado = Number(this.nuevoStaff.id_estado_staff);
    const idTipoDoc = Number(this.nuevoStaff.id_tipo_documento);
    const idTipoContrato = Number(this.nuevoStaff.id_tipo_contrato);

    if (
      !primerNombre ||
      !primerApellido ||
      !numeroDocumento ||
      !correo ||
      !usuario ||
      !contrasenia.trim() ||
      !fechaInicio ||
      Number.isNaN(salario) ||
      salario <= 0
    ) {
      this.errorContratacion = 'Completa todos los campos obligatorios del miembro de staff y su contrato.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      this.errorContratacion = 'Ingresa un correo electrónico válido.';
      return;
    }

    const payload = {
      id_cargo_staff: idCargo,
      id_estado_staff: idEstado,
      id_tipo_documento: idTipoDoc,
      primer_nombre: primerNombre,
      segundo_nombre: segundoNombre,
      primer_apellido: primerApellido,
      segundo_apellido: segundoApellido,
      numero_documento: numeroDocumento,
      correo,
      usuario,
      contrasenia,
      id_tipo_contrato: idTipoContrato,
      fecha_inicio: fechaInicio,
      salario
    };

    this.http.post<ApiResponse<any>>(`${this.apiBaseUrl}/staff/contratar/`, payload).subscribe({
      next: () => {
        const cargoObj = this.cargosStaff.find(c => c.id === idCargo);
        this.mensajeContratacion = `Se contrató a ${primerNombre} ${primerApellido} como ${cargoObj?.nombre ?? 'staff'}.`;
        this.modalContratarStaffAbierto = false;
        this.nuevoStaff = {
          ...this.nuevoStaff,
          primer_nombre: '',
          segundo_nombre: '',
          primer_apellido: '',
          segundo_apellido: '',
          numero_documento: '',
          correo: '',
          usuario: '',
          contrasenia: ''
        };
        this.cargarStaffDesdeBackend();
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.errorContratacion = err.error?.message || 'No se pudo contratar al miembro de staff.';
        this.cdr.detectChanges();
      }
    });
  }

  private resolverStaffParaVenta(): MiembroStaff {
    const taquilleros = this.taquillerosActivos;
    const seleccionado = taquilleros.find(
      v => v.id_staff === Number(this.idStaffSeleccionadoCompra)
    );
    return seleccionado ?? taquilleros[0];
  }

  private continuarCompraPendienteSiExiste(): void {
    const hora = this.horaPendienteCompra;
    this.horaPendienteCompra = null;
    if (hora) {
      this.navegarACompra(hora);
    }
  }

  abrirDetallePelicula(pelicula: PeliculaDetalle): void {
    this.peliculaSeleccionada = pelicula;
    this.modalFuncionesAbierto = false;
    this.fechaSeleccionada = '';
    this.horasDisponibles = [];
  }

  cerrarDetallePelicula(): void {
    this.peliculaSeleccionada = null;
    this.modalFuncionesAbierto = false;
    this.fechaSeleccionada = '';
    this.horasDisponibles = [];
  }

  abrirModalFunciones(): void {
    if (!this.peliculaSeleccionada) {
      return;
    }
    this.sincronizarStaffSeleccionadoCompra();
    this.modalFuncionesAbierto = true;
    const primeraFuncion = this.peliculaSeleccionada.funciones[0];
    if (primeraFuncion) {
      this.seleccionarFecha(primeraFuncion.fecha);
    } else {
      this.fechaSeleccionada = '';
      this.horasDisponibles = [];
    }
  }

  cerrarModalFunciones(): void {
    this.modalFuncionesAbierto = false;
  }

  seleccionarFecha(fecha: string): void {
    this.fechaSeleccionada = fecha;
    const encontrada = this.peliculaSeleccionada?.funciones.find(f => f.fecha === fecha);
    this.horasDisponibles = encontrada ? encontrada.horas : [];
  }

  comprarBoleta(hora: string): void {
    if (!this.sesionActiva) {
      this.horaPendienteCompra = hora;
      this.errorLogin = 'Debes iniciar sesión para comprar boletas.';
      this.modalAbierto = true;
      return;
    }
    this.navegarACompra(hora);
  }

  private navegarACompra(hora: string): void {
    if (!this.peliculaSeleccionada || !this.fechaSeleccionada || !this.sesionActiva) {
      return;
    }
    const funcionElegida = this.peliculaSeleccionada.funciones.find(
      f => f.fecha === this.fechaSeleccionada
    );
    if (!funcionElegida) {
      return;
    }

    const staffAsignado = this.resolverStaffParaVenta();
    const espectadorCompra =
      this.sesionActiva.tipo === 'espectador'
        ? this.sesionActiva.datos_espectador ?? null
        : this.espectadoresGuardados[0] ?? null;

    const datosCompra = {
      idPelicula: this.peliculaSeleccionada.id,
      tituloPelicula: this.peliculaSeleccionada.titulo,
      tituloOriginal: this.peliculaSeleccionada.tituloOriginal,
      poster: this.peliculaSeleccionada.poster,
      clasificacion: this.peliculaSeleccionada.clasificacion,
      duracion: this.peliculaSeleccionada.duracion,
      idiomaOriginal: this.peliculaSeleccionada.idiomaOriginal,
      fecha: this.fechaSeleccionada,
      hora,
      tipoSala: funcionElegida.tipoSala,
      requisitosSala: funcionElegida.requisitosSala,
      precioBoleta: funcionElegida.precioBoleta,
      cargoServicio: funcionElegida.cargoServicio,
      idStaffAsignado: staffAsignado.id_staff,
      staffAsignado,
      espectador: espectadorCompra
    };
    this.modalFuncionesAbierto = false;
    this.peliculaSeleccionada = null;
    this.router.navigate(['/cinema-pruchase'], { state: { funcionCompra: datosCompra } });
  }
}