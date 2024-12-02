import { Component ,OnInit} from '@angular/core';
import { Router } from '@angular/router';  // For navigation (if needed)

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  // Navigate to the booking page
  onBookAppointmentClick(): void {
    // For now, just log to the console (can be replaced with routing)
    console.log("Navigating to appointment booking page...");
    this.router.navigate(['/appointment']);  // Example route to the appointment page
  }
}
