import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [CommonModule,MatToolbarModule, MatButtonModule, FooterComponent, HeaderComponent,RouterModule],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.css'
})
export class LandingpageComponent {
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  // Navigate to the booking page
  onBookAppointmentClick(): void {
    // For now, just log to the console (can be replaced with routing)
    console.log("Navigating to appointment booking page...");
    this.router.navigate(['/appointment']);  // Example route to the appointment page
  }

  specialties = [
    { name: 'General Physician', link: '/doctors/General-physician', image: 'https://via.placeholder.com/150?text=GP' },
    { name: 'Gynecologist', link: '/doctors/Gynecologist', image: 'https://via.placeholder.com/150?text=Gyne' },
    { name: 'Dermatologist', link: '/doctors/Dermatologist', image: 'https://via.placeholder.com/150?text=Derm' },
    { name: 'Pediatricians', link: '/doctors/Pediatricians', image: 'https://via.placeholder.com/150?text=Pediatrics' },
    { name: 'Neurologist', link: '/doctors/Neurologist', image: 'https://via.placeholder.com/150?text=Neuro' },
    { name: 'Gastroenterologist', link: '/doctors/Gastroenterologist', image: 'https://via.placeholder.com/150?text=Gastro' },
  ];


}
