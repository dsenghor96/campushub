import { Component, inject, OnInit, signal } from '@angular/core';
import { Etudiant } from '../../model/etudiant.interface';
import { EtudiantCardComponent } from '../etudiant-card-component/etudiant-card-component';
import { EtudiantService } from '../../services/etudiant-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-etudiant-list-component',
  standalone: true,
  imports: [EtudiantCardComponent],

  templateUrl: './etudiant-list-component.html',
  styleUrl: './etudiant-list-component.scss',
})

export class EtudiantListComponent implements OnInit {

  etudiants = signal<Etudiant[]>([]);

  private etudiantService = inject(EtudiantService);
  authService = inject(AuthService);

  loading = signal(true);
  erreur = signal<string | null>(null);

  pageActuelle = signal(0);
  taillePage = 4;
  totalPages = signal(0);
  ngOnInit() {
    this.chargerEtudiants();
  }

  chargerEtudiants() {
    this.etudiantService.getAll(this.pageActuelle(), this.taillePage).subscribe({
      next: (data) => {
        this.etudiants.set(data.content);
        this.loading.set(false);
        this.totalPages.set(data.totalPages)
      },
      error: (err) => {
        this.erreur.set('Impossible de charger les étudiants');
        this.loading.set(false);
      }
    });
  }

  // onSupprimer(id: number) {
  //   if (confirm('Confirmer la suppression ?')) {
  //     this.etudiantService.delete(id).subscribe(() => this.chargerEtudiants());
  //   }
  // }
onSupprimer(id: number) {
  if (confirm('Confirmer la suppression ?')) {
    this.etudiantService.delete(id).subscribe({
      next: () => this.chargerEtudiants(),
      error: () => this.erreur.set('Impossible de supprimer l\'étudiant') // ← ajouté
    });
  }
}

  pagePrecedente() {
    if (this.pageActuelle() > 0) {
      this.pageActuelle.update(p => p - 1);
      this.chargerEtudiants();
    }
  }

  pageSuivante() {
    this.pageActuelle.update(p => {
      if(p < this.totalPages() - 1) {
        return p + 1;
      }
      return p;
    });
    this.chargerEtudiants();
  }
}
