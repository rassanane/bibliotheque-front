import { Component, OnInit, ViewChild } from '@angular/core';
import { Livre } from '../livre';
import { Auteur } from '../auteur';
import { LivresService } from '../livres.service';
import { AuteursService } from '../auteurs.service';
import { NgForm } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';

@Component({
  selector: 'app-livres',
  templateUrl: './livres.component.html',
  styleUrls: ['./livres.component.css']
})
export class LivresComponent implements OnInit {

  constructor(private restService : LivresService, private restAuteursService : AuteursService) { }

  @ViewChild('ajoutForm') ajoutForm!: NgForm;
  @ViewChild('modifForm') modifForm!: NgForm;
  
  ajoutFormData = {
    id: 0,
    titre: '',
    prix: '',
    datePublication: '',
    auteur: ''
  };

  modifFormData = {
    id: 0,
    titre: '',
    prix: '',
    datePublication: '',
    auteur: ''
  };

  listLivres!: Livre[];
  livreMaj!: Livre;
  affichAjout!:boolean;
  affichModif!:boolean;
  listAuteurs!: Auteur[];

  ngOnInit(): void {
    
    console.log("init");
   
   
    let livres;
   
    this.affichAjout = false;
    this.affichModif = false;

  this.restService.getLivres().subscribe( data => {

    data.forEach((livre) => {

      //this.restAuteursService.getAuteur(livre.auteur).subscribe( data => console.log(data)  );

      this.restAuteursService.getAuteur(livre.auteur).subscribe({
        next: (result: Auteur) => {
          livre.nomAuteur = result.nom;
          //livre.nomAuteur != result?.nom;
          console.log(livre.nomAuteur);
        }
        });

    });
    
    this.listLivres = data;

  } );

  this.restAuteursService.getAuteurs().subscribe( data => this.listAuteurs = data );


  
    /*this.restService.getLivres().subscribe({
      next: (result: any) => {
        this.listLivres = result;
        console.log(result);
      },
      error: (err: any) => {
        console.log("erreur : " + err);
      },
      complete: () => {
        livres = this.listLivres;
        console.log('complete');
      }
      });

      console.log("toto " + livres);*/


    //this.restAuteursService.getAuteurs().subscribe( data => this.listAuteurs = data );
    /*this.restAuteursService.getAuteurs().subscribe({
      next: data => this.listAuteurs = data,
      error: err => console.error(err),
      complete: () => console.log(this.listAuteurs)
  });*/


  
    /*setTimeout(() => {
      this.restAuteursService.getAuteurs().subscribe( data => this.listAuteurs = data );
  }, 10000);*/


  /*this.listLivres?.forEach(item => {
    let auteurDuLivre = this.listAuteurs.find(auteur => auteur.id == item.id);
    console.log("aut : " + auteurDuLivre?.nom);
    item.nomAuteur != auteurDuLivre?.nom;
  })*/



    //const clothing = ['shoes', 'shirts', 'socks', 'sweaters'];
    //console.log(clothing.length);
    console.log("test1 : " + this.listAuteurs);
    console.log("test2 : " + this.listLivres);
    //console.log(this.listAuteurs.length);
    
    /*for (const data of this.listLivres) {
      console.log(data.nomAuteur);
      
    }*/



    //for (const data of this.listLivres) {
      //console.log(char.auteur); // prints chars: H e l l o  W o r l d
    //}


  }

  affichFrmAjout(){
    this.affichAjout = true;
    this.cachFrmModif();
  }

  cachFrmAjout(){
    this.affichAjout = false;
    this.ajoutForm?.reset();
  }
  
  affichFrmModif(id:Number){

    this.affichModif = true;
    this.cachFrmAjout();

    var datePipe = new DatePipe('en-US');

    this.restService.getLivre(Number(id)).subscribe({
      next: (result: any) => {
        this.livreMaj = result;
        console.log(result);
      },
      error: (err: any) => {
        console.log("erreur : " + err);
      },
      complete: () => {
        this.modifFormData.id = this.livreMaj.id;
        this.modifFormData.titre = this.livreMaj.titre;
        this.modifFormData.prix = this.livreMaj.prix.toString();
        this.modifFormData.datePublication = this.livreMaj.datePublication.toLocaleString();
        this.modifFormData.datePublication = (datePipe.transform(this.livreMaj.datePublication,"dd/MM/yyyy") as string);
        this.modifFormData.auteur = this.livreMaj.auteur.toString();
        console.log('complete');
      }
      });
    
  }

  cachFrmModif(){
    this.affichModif = false;
    this.modifForm?.reset();
  }

  supprimer(id:Number){

    if(confirm("Voulez vous supprimer ce livre ?")) {

        this.restService.supprimeLivre(Number(id)).subscribe({
          next: (result: any) => {
          console.log(result);
        },
          error: (err: any) => {
          console.log("erreur : " + err);
        },
        complete: () => {
          console.log('complete');
          this.restService.getLivres().subscribe( data => this.listLivres = data );
        }
        });

    }
   
  }

  ajouter() {
    
    console.log("ajout");

    if (this.ajoutForm.form.get('titre')?.value==""){
      alert("Le titre est obligatoire");
      (<HTMLInputElement>document.getElementById("titre")).focus();
    }else if (this.ajoutForm.form.get('prix')?.value==""){
      alert("Le prix est obligatoire");
      (<HTMLInputElement>document.getElementById("prix")).focus();
    }else{

      let livre = {} as Livre;
      livre.titre = this.ajoutFormData.titre;
      livre.prix = Number(this.ajoutFormData.prix);
      //2024-02-27
      livre.datePublication = new Date(this.ajoutFormData.datePublication.split('/')[2] + "-" + this.ajoutFormData.datePublication.split('/')[1] + "-" + this.ajoutFormData.datePublication.split('/')[0]);
      livre.auteur = Number(this.ajoutFormData.auteur);

      this.restService.ajoutLivre(livre)
      .subscribe({
        next: (result: any) => {
        console.log(result);
      },
        error: (err: any) => {
        console.log("erreur : " + err);
        },
        complete: () => {
        console.log('complete');
        this.restService.getLivres().subscribe( data => this.listLivres = data );
      }
      });

      this.cachFrmAjout();

    }
    
  }

  modifier() {
    console.log("modif");
    let livre = {} as Livre;
    livre.id = this.modifFormData.id;
    livre.titre = this.modifFormData.titre;
    livre.prix = Number(this.modifFormData.prix);
    //2024-02-27
    livre.datePublication = new Date(this.modifFormData.datePublication.split('/')[2] + "-" + this.modifFormData.datePublication.split('/')[1] + "-" + this.modifFormData.datePublication.split('/')[0]);
    livre.auteur = Number(this.modifFormData.auteur);

    if (this.modifForm.form.get('titre')?.value==""){
      alert("Le titre est obligatoire");
      (<HTMLInputElement>document.getElementById("titre")).focus();
    }else if (this.modifForm.form.get('prix')?.value==""){
      alert("Le prix est obligatoire");
      (<HTMLInputElement>document.getElementById("prix")).focus();
    }else{

      this.restService.majLivre(livre)
      .subscribe({
        next: (result: any) => {
        console.log(result);
      },
        error: (err: any) => {
        console.log("erreur : " + err);
        },
        complete: () => {
        console.log('complete');
        this.restService.getLivres().subscribe( data => this.listLivres = data );
      }
      });

      this.cachFrmModif();

      }
    
  }

}
