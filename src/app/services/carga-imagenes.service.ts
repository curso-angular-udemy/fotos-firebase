import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Image } from '../models/image';
import { FileItem } from '../models/file-item';

@Injectable({
  providedIn: 'root'
})

export class CargaImagenesService {

  private CARPETA_IMAGENES = 'img';

  constructor( private db: AngularFirestore) { }

  cargarImagenesFirebase(imagenes: FileItem[]) {
    const storageRef = firebase.storage().ref();
    for (const imagen of imagenes) {
      imagen.estaSubiendo = true;
      if (imagen.progreso === 100) {
        continue;
      }
      const uploadTask: firebase.storage.UploadTask = storageRef.child(`${this.CARPETA_IMAGENES}/${imagen.nombreArchivo}`).put(imagen.archivo);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) => {
          imagen.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          snapshot.ref.getDownloadURL().then( (url) => imagen.url = url);
        },
        (error) => console.error("Error al subir", error),
        () => {
          console.log('Imagen cargada correctamente');
          imagen.estaSubiendo = false;
          console.log(imagen.url)
          this.guardarImagen({nombre: imagen.nombreArchivo, url: imagen.url});
        }
      );
    }
  }

  private guardarImagen( imagen: Image) {
    this.db.collection(`${this.CARPETA_IMAGENES}`).add(imagen);
  }
}
