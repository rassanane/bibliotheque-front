import { Component, OnInit, ViewChild } from '@angular/core';
import { Auteur } from '../auteur';
import { AuteursService } from '../auteurs.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auteurs',
  templateUrl: './auteurs.component.html',
  styleUrls: ['./auteurs.component.css']
})
export class AuteursComponent implements OnInit {

  constructor(private restService : AuteursService) { }

  @ViewChild('ajoutForm') ajoutForm!: NgForm;
  @ViewChild('modifForm') modifForm!: NgForm;
  
  ajoutFormData = {
    id: 0,
    nom: '',
    prenom: ''
  };

  modifFormData = {
    id: 0,
    nom: '',
    prenom: ''
  };

  listAuteurs!: Auteur[];
  auteurMaj!: Auteur;
  affichAjout!:boolean;
  affichModif!:boolean;
  
  ngOnInit(): void {
    
    this.affichAjout = false;
    this.affichModif = false;
    this.restService.getAuteurs().subscribe( data => this.listAuteurs = data );

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

    this.restService.getAuteur(Number(id)).subscribe({
      next: (result: any) => {
        this.auteurMaj = result;
        console.log(result);
      },
      error: (err: any) => {
        console.log("erreur : " + err);
      },
      complete: () => {
        this.modifFormData.id = this.auteurMaj.id;
        this.modifFormData.nom = this.auteurMaj.nom;
        this.modifFormData.prenom = this.auteurMaj.prenom;
        console.log('complete');
      }
      });
    
  }

  cachFrmModif(){
    this.affichModif = false;
    this.modifForm?.reset();
  }

  supprimer(id:Number){

    if(confirm("Voulez vous supprimer cet auteur ?")) {

        this.restService.supprimeAuteur(Number(id)).subscribe({
          next: (result: any) => {
          console.log(result);
        },
          error: (err: any) => {
          console.log("erreur : " + err);
        },
        complete: () => {
          console.log('complete');
          this.restService.getAuteurs().subscribe( data => this.listAuteurs = data );
        }
        });

        //this.router.navigate(['/auteurs']);
        //window.location.reload();
    }
   
  }

  ajouter() {
    
    console.log("ajout");

    if (this.ajoutForm.form.get('nom')?.value==""){
      alert("Le nom est obligatoire");
      (<HTMLInputElement>document.getElementById("nom")).focus();
    }else if (this.ajoutForm.form.get('prenom')?.value==""){
      alert("Le prénom est obligatoire");
      (<HTMLInputElement>document.getElementById("prenom")).focus();
    }else{

      let auteur = {} as Auteur;
      auteur.nom = this.ajoutFormData.nom;
      auteur.prenom = this.ajoutFormData.prenom;

      this.restService.ajoutAuteur(auteur)
      .subscribe({
        next: (result: any) => {
        console.log(result);
      },
        error: (err: any) => {
        console.log("erreur : " + err);
        },
        complete: () => {
        console.log('complete');
        this.restService.getAuteurs().subscribe( data => this.listAuteurs = data );
      }
      });

      this.cachFrmAjout();

    }
    
  }

  modifier() {

    console.log("modif");

    let auteur = {} as Auteur;
    auteur.id = this.modifFormData.id;
    auteur.nom = this.modifFormData.nom;
    auteur.prenom = this.modifFormData.prenom;
  
    if (this.modifForm.form.get('nom')?.value==""){
      alert("Le nom est obligatoire");
      (<HTMLInputElement>document.getElementById("nom")).focus();
    }else if (this.modifForm.form.get('prenom')?.value==""){
      alert("Le prénom est obligatoire");
      (<HTMLInputElement>document.getElementById("prenom")).focus();
    }else{

      this.restService.majAuteur(auteur)
      .subscribe({
        next: (result: any) => {
        console.log(result);
      },
        error: (err: any) => {
        console.log("erreur : " + err);
        },
        complete: () => {
        console.log('complete');
        this.restService.getAuteurs().subscribe( data => this.listAuteurs = data );
      }
      });

      this.cachFrmModif();

      }
    
  }

}
