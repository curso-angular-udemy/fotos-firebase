import { FileItem } from '../models/file-item';
import { 
  Directive,
  EventEmitter,
  ElementRef,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { database } from 'firebase';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any) {
    this.prevenirDetener(event);
    this.mouseSobre.emit(true);
  }


  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) {
    this.mouseSobre.emit(false);
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any) {
    
    const transferencia = this.getTransferencia(event);
    if(!transferencia) {
      return;
    }
    this.extraerArchivos(transferencia.files);
    this.prevenirDetener(event);
    this.mouseSobre.emit(false);

  }

  getTransferencia(event: any) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private extraerArchivos(archivosLista: FileList) {
    Object.values(archivosLista).forEach(archivo => {
      if (this.archivoPuedeSerCargado(archivo)) {
        const nuevoArchivo = new FileItem(archivo);
        this.archivos.push(nuevoArchivo)
      }
    });
    console.log(this.archivos)
  }

  // Validaciones

  private archivoPuedeSerCargado(archivo: File): boolean {
    return !this.yaFueCargado(archivo.name) && this.esImagen(archivo.type);
  }

  private prevenirDetener(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  private yaFueCargado(nombreArchivo: string): boolean {
    for (const archivo of this.archivos) {
      if (archivo.nombreArchivo === nombreArchivo) {
        console.log(`El archivo ${nombreArchivo} ya ha sido arrastrado`);
        return true;
      }
    }
    return false;
  }

  private esImagen(tipoArchivo: string): boolean {
    return (tipoArchivo === '' || tipoArchivo === undefined) ? false : tipoArchivo.startsWith('image');
  }
}
