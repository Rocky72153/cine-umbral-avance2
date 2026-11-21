import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface DatosCompraFuncion {
  idPelicula: number;
  tituloPelicula: string;
  tituloOriginal: string;
  poster: string;
  clasificacion: string;
  duracion: string;
  idiomaOriginal: string;
  fecha: string;
  hora: string;
  tipoSala: string;
  requisitosSala: string;
  precioBoleta: number;
  cargoServicio: number;
}

interface AsientoSala {
  codigo: string;
  fila: string;
  numero: number;
  ocupado: boolean;
}

@Component({
  selector: 'app-cinema-pruchase',
  standalone: true,
  templateUrl: './cinema-pruchase.html',
  styleUrls: ['./cinema-pruchase.css']
})
export class CinemaPruchase implements OnInit {
  funcionCompra!: DatosCompraFuncion;

  filas: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  numerosAsiento: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  asientosOcupados: string[] = ['A3', 'A4', 'C6', 'C7', 'E5', 'G8', 'I2', 'J9'];

  asientosSeleccionados: string[] = [];
  asientoSelector = '';
  modoAgregarBoleta = false;
  etapaActual: 'sillas' | 'pago' | 'confirmada' = 'sillas';
  metodoPago = 'Tarjeta de crédito';
  correoComprador = '';
  mensajeConfirmacion = '';

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const datos = nav?.extras?.state?.['funcionCompra'] || history.state?.['funcionCompra'];
    if (datos) {
      this.funcionCompra = datos;
    }
  }

  ngOnInit(): void {
    if (!this.funcionCompra) {
      this.router.navigate(['/']);
      return;
    }
    const primerLibre = this.obtenerTodosLosAsientos().find(a => !a.ocupado);
    if (primerLibre) {
      this.asientosSeleccionados = [primerLibre.codigo];
      this.asientoSelector = primerLibre.codigo;
    }
  }

  obtenerTodosLosAsientos(): AsientoSala[] {
    const lista: AsientoSala[] = [];
    for (const fila of this.filas) {
      for (const numero of this.numerosAsiento) {
        const codigo = `${fila}${numero}`;
        lista.push({
          codigo,
          fila,
          numero,
          ocupado: this.asientosOcupados.includes(codigo)
        });
      }
    }
    return lista;
  }

  obtenerAsientosFila(fila: string): AsientoSala[] {
    return this.numerosAsiento.map(numero => {
      const codigo = `${fila}${numero}`;
      return {
        codigo,
        fila,
        numero,
        ocupado: this.asientosOcupados.includes(codigo)
      };
    });
  }

  estaSeleccionado(codigo: string): boolean {
    return this.asientosSeleccionados.includes(codigo);
  }

  seleccionarAsiento(codigo: string, ocupado: boolean): void {
    if (ocupado) {
      return;
    }

    if (this.estaSeleccionado(codigo)) {
      if (this.asientosSeleccionados.length > 1) {
        this.asientosSeleccionados = this.asientosSeleccionados.filter(a => a !== codigo);
        this.asientoSelector = this.asientosSeleccionados[this.asientosSeleccionados.length - 1];
      }
      return;
    }

    if (this.modoAgregarBoleta) {
      this.asientosSeleccionados = [...this.asientosSeleccionados, codigo];
    } else {
      this.asientosSeleccionados = [codigo];
    }
    this.asientoSelector = codigo;
  }

  actualizarSelectorAsiento(codigo: string): void {
    if (!codigo || this.asientosOcupados.includes(codigo)) {
      return;
    }
    if (this.modoAgregarBoleta) {
      if (!this.estaSeleccionado(codigo)) {
        this.asientosSeleccionados = [...this.asientosSeleccionados, codigo];
      }
    } else {
      this.asientosSeleccionados = [codigo];
    }
    this.asientoSelector = codigo;
  }

  quitarAsiento(codigo: string): void {
    if (this.asientosSeleccionados.length <= 1) {
      return;
    }
    this.asientosSeleccionados = this.asientosSeleccionados.filter(a => a !== codigo);
    this.asientoSelector = this.asientosSeleccionados[this.asientosSeleccionados.length - 1];
  }

  continuarConCompra(): void {
    if (this.asientosSeleccionados.length === 0) {
      return;
    }
    this.modoAgregarBoleta = false;
    this.etapaActual = 'pago';
  }

  volverASillas(): void {
    this.modoAgregarBoleta = false;
    this.etapaActual = 'sillas';
    this.mensajeConfirmacion = '';
  }

  agregarOtraBoleta(): void {
    this.modoAgregarBoleta = true;
    const siguienteLibre = this.obtenerTodosLosAsientos().find(
      a => !a.ocupado && !this.estaSeleccionado(a.codigo)
    );
    if (siguienteLibre) {
      this.asientosSeleccionados = [...this.asientosSeleccionados, siguienteLibre.codigo];
      this.asientoSelector = siguienteLibre.codigo;
    }
    this.etapaActual = 'sillas';
    this.mensajeConfirmacion = '';
  }

  obtenerCantidadBoletas(): number {
    return this.asientosSeleccionados.length;
  }

  obtenerSubtotalBoletas(): number {
    return this.funcionCompra.precioBoleta * this.obtenerCantidadBoletas();
  }

  obtenerTotalServicio(): number {
    return this.funcionCompra.cargoServicio * this.obtenerCantidadBoletas();
  }

  obtenerTotal(): number {
    return this.obtenerSubtotalBoletas() + this.obtenerTotalServicio();
  }

  realizarCompra(event: Event): void {
    event.preventDefault();
    if (this.asientosSeleccionados.length === 0) {
      return;
    }
    const cantidad = this.obtenerCantidadBoletas();
    const etiquetaBoletas = cantidad === 1 ? '1 boleta' : `${cantidad} boletas`;
    this.etapaActual = 'confirmada';
    this.mensajeConfirmacion = `Compra realizada (${etiquetaBoletas}) para "${this.funcionCompra.tituloPelicula}" (${this.funcionCompra.fecha} · ${this.funcionCompra.hora}), asientos ${this.asientosSeleccionados.join(', ')} mediante ${this.metodoPago}.`;
  }

  volverACartelera(): void {
    this.router.navigate(['/']);
  }
}
