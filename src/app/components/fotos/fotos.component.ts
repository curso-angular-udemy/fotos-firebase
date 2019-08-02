import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styles: []
})
export class FotosComponent implements OnInit {

  imagenes: Observable<any[]>;

  constructor( private db: AngularFirestore ) {
    this.imagenes = db.collection('img').valueChanges();
  }

  ngOnInit() {
  }

}
