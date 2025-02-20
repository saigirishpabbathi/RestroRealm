import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../core/services/reservation/reservation.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent {
  private reservationService = inject(ReservationService);

  date: string = '';
  time: string = '';
  numGuests: number = 1;
  duration: number | null = null;

  availableTables: any[] = [];
  selectedTableId: number | null = null;

  availableSlots: string[] = [];
  selectedTime: string = '';

  isLoggedIn: boolean = false;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';

  /** Step 1: Fetch available tables */
  fetchAvailableTables() {
    if (!this.date || !this.time) return;

    this.reservationService.getAvailableTables(this.date, this.time, this.numGuests).subscribe({
      next: (tables) => {
        this.availableTables = tables;
        this.selectedTableId = null;
        this.availableSlots = [];
      },
      error: (err) => {
        console.error('Error fetching tables:', err);
      }
    });
  }

  /** Step 2: Fetch available time slots */
  fetchAvailableTimeSlots() {
    if (!this.date || !this.selectedTableId) return;

    this.reservationService.getAvailableTimeSlots(this.date, this.selectedTableId, this.numGuests).subscribe({
      next: (response) => {
        this.availableSlots = response.availableSlots;
        this.selectedTime = '';
      },
      error: (err) => {
        console.error('Error fetching time slots:', err);
      }
    });
  }

  /** Step 3: Make a reservation */
  makeReservation() {
    if (!this.selectedTableId || !this.selectedTime || !this.duration) {
      alert('Please select a table, an available time slot, and enter the duration.');
      return;
    }

    const reservationData = {
      tableId: this.selectedTableId,
      numGuests: this.numGuests,
      reservationDate: this.date,
      reservationTime: this.selectedTime,
      duration: this.duration, // Taking duration from the user input
      customerName: `${this.firstName} ${this.lastName}`,
      customerContact: this.phone
    };

    this.reservationService.createReservation(reservationData).subscribe({
      next: () => {
        alert('Reservation successful!');
      },
      error: (err) => {
        console.error('Error making reservation:', err);
      }
    });
  }
}
