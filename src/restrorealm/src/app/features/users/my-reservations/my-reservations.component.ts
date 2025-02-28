import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from '../../../core/services/reservation/reservation.service';
import { TableService } from '../../../core/services/table/table.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-reservations',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.css'
})
export class MyReservationsComponent {
  viewMode = 'grid';
  allReservations: any[] = [];
  reservations: any[] = [];
  selectedDate: string = new Date().toISOString().split('T')[0];
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalReservations: number = 0;
  selectedReservations: Set<number> = new Set();
  showModal: boolean = false;
  selectedReservation: any = null;
  nameQuery: string = '';
  phoneQuery: string = '';
  emailQuery: string = '';
  timeRangeStart: string = '';
  timeRangeEnd: string = '';
  selectedTables: string[] = [];
  selectedStatuses: string[] = ['ACTIVE'];
  availableTables: any[] = [];
  statusOptions = ['ACTIVE', 'OCCUPIED', 'CANCELLED', 'COMPLETED'];
  undoStates: Map<number, { originalStatus: string, timeout: any }> = new Map();
  viewModes = ['grid', 'list'];

  constructor(
    private reservationService: ReservationService,
    private tableService: TableService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchReservations();
    this.fetchAvailableTables();
  }

  fetchReservations(): void {
    this.reservationService.getMyReservations().subscribe(
      (data) => {
        this.allReservations = data;
        this.applyFilters();
      },
      (error) => {
        console.error('Error fetching reservations:', error);
      }
    );
  }

  fetchAvailableTables(): void {
    this.tableService.getTables().subscribe(tables => {
      this.availableTables = tables.filter(table => table.reservable);
    });
  }

  applyFilters(): void {
    let filtered = this.allReservations;

    if (this.selectedDate) {
      filtered = filtered.filter(reservation => 
        reservation.reservationDate === this.selectedDate
      );
    }

    if (this.timeRangeStart && this.timeRangeEnd) {
      filtered = filtered.filter(reservation => {
        const resTime = this.timeToMinutes(reservation.reservationTime);
        return resTime >= this.timeToMinutes(this.timeRangeStart) && 
               resTime <= this.timeToMinutes(this.timeRangeEnd);
      });
    }

    // Text filters
    filtered = filtered.filter(reservation => 
      (!this.nameQuery || reservation.customerName.toLowerCase().includes(this.nameQuery.toLowerCase())) &&
      (!this.phoneQuery || reservation.phone.includes(this.phoneQuery)) &&
      (!this.emailQuery || reservation.email.toLowerCase().includes(this.emailQuery.toLowerCase()))
    );

    // Table filter
    if (this.selectedTables.length > 0) {
      filtered = filtered.filter(reservation => 
        this.selectedTables.includes(reservation.tableId)
      );
    }

    // Status filter
    if (this.selectedStatuses.length > 0) {
      filtered = filtered.filter(reservation => 
        this.selectedStatuses.includes(reservation.status)
      );
    }

    // Pagination
    this.totalReservations = filtered.length;
    this.reservations = filtered.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  clearFilters(): void {
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.nameQuery = '';
    this.phoneQuery = '';
    this.emailQuery = '';
    this.timeRangeStart = '';
    this.timeRangeEnd = '';
    this.selectedTables = [];
    this.selectedStatuses = ['ACTIVE'];
    this.applyFilters();
  }

  get isFiltersActive(): boolean {
    return !!this.nameQuery ||
      !!this.phoneQuery ||
      !!this.emailQuery ||
      !!this.timeRangeStart ||
      !!this.timeRangeEnd ||
      this.selectedTables.length > 0 ||
      this.selectedStatuses.length !== 1 ||
      this.selectedStatuses[0] !== 'ACTIVE';
  }

  setStatus(reservationId: number, status: string): void {
    const reservation = this.allReservations.find(r => r.id === reservationId);
    if (!reservation) return;

    const originalStatus = reservation.status;
    reservation.status = status;

    const existing = this.undoStates.get(reservationId);
    if (existing) clearTimeout(existing.timeout);

    const timeout = setTimeout(() => {
      this.undoStates.delete(reservationId);
    }, 5000);

    this.undoStates.set(reservationId, { originalStatus, timeout });
  }

  undoStatusChange(reservationId: number): void {
    const state = this.undoStates.get(reservationId);
    if (state) {
      clearTimeout(state.timeout);
      const reservation = this.allReservations.find(r => r.id === reservationId);
      if (reservation) reservation.status = state.originalStatus;
      this.undoStates.delete(reservationId);
    }
  }

  occupySelected(): void {
    this.selectedReservations.forEach(id => {
      this.setStatus(id, 'OCCUPIED');
    });
    this.selectedReservations.clear();
  }

  onDateChange(event: any): void {
    this.selectedDate = event.target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  addReservation(): void {
    this.router.navigate(['/reservation']);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  toggleSelection(reservationId: number): void {
    if (this.selectedReservations.has(reservationId)) {
      this.selectedReservations.delete(reservationId);
    } else {
      this.selectedReservations.add(reservationId);
    }
  }

  cancelSelectedReservations(): void {
    this.allReservations.forEach(reservation => {
      if (this.selectedReservations.has(reservation.id)) {
        reservation.status = 'cancelled';
      }
    });
    this.selectedReservations.clear();
    this.applyFilters();
  }

  openModal(reservation: any): void {
    this.selectedReservation = reservation;
    this.showModal = true;
  }

  closeModal(event: any): void {
    if (event.target.classList.contains('modal-backdrop')) {
      this.showModal = false;
      this.selectedReservation = null;
    }
  }
}

