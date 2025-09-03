import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription, interval } from 'rxjs';

import { ParticipantService, ParticipantData } from '../services/participant.service';

@Component({
  selector: 'app-participant-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './participant-list.component.html',
  styleUrl: './participant-list.component.scss'
})
export class ParticipantListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  
  participants: ParticipantData[] = [];
  dataSource = new MatTableDataSource<ParticipantData>([]);
  displayedColumns: string[] = ['name', 'email', 'phoneNumber', 'linkedInProfile', 'githubId', 'technicalSkills', 'actions'];
  isLoading = false;
  pageSize = 10;
  currentPage = 0;
  totalParticipants = 0;
  pageSizeOptions = [5, 10, 20, 50];
  paginatedParticipants: ParticipantData[] = [];
  searchText = '';
  filteredParticipants: ParticipantData[] = [];
  
  // Enhanced refresh functionality
  lastRefreshTime: Date | null = null;
  autoRefreshEnabled = false;
  refreshInterval = 30000; // 30 seconds
  private subscriptions = new Subscription();
  private autoRefreshSubscription: Subscription | null = null;
  
  // Expose Math to template
  Math = Math;

  constructor(
    private router: Router,
    private participantService: ParticipantService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadParticipants();
    this.subscribeToParticipantChanges();
    this.subscribeToLastRefresh();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.stopAutoRefresh();
  }

  private subscribeToParticipantChanges() {
    const participantsSubscription = this.participantService.participants$.subscribe(
      (participants) => {
        this.participants = participants;
        this.applyFilter();
      }
    );
    this.subscriptions.add(participantsSubscription);
  }

  private subscribeToLastRefresh() {
    const refreshSubscription = this.participantService.lastRefresh$.subscribe(
      (lastRefresh) => {
        this.lastRefreshTime = lastRefresh;
      }
    );
    this.subscriptions.add(refreshSubscription);
  }

  loadParticipants() {
    this.participants = this.participantService.getAllParticipants();
    this.applyFilter();
  }

  applyFilter() {
    this.filteredParticipants = this.participants.filter(participant => {
      if (!this.searchText.trim()) {
        return true;
      }
      
      const searchLower = this.searchText.toLowerCase();
      return (
        participant.name.toLowerCase().includes(searchLower) ||
        participant.email.toLowerCase().includes(searchLower) ||
        participant.phoneNumber?.toLowerCase().includes(searchLower) ||
        participant.githubId?.toLowerCase().includes(searchLower) ||
        participant.linkedInProfile?.toLowerCase().includes(searchLower) ||
        this.getSkillsText(participant).toLowerCase().includes(searchLower)
      );
    });
    
    this.totalParticipants = this.filteredParticipants.length;
    this.currentPage = 0; // Reset to first page when filtering
    this.updatePaginatedData();
    this.updateDataSource();
  }

  updateDataSource() {
    this.dataSource.data = this.paginatedParticipants;
  }

  updatePaginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedParticipants = this.filteredParticipants.slice(startIndex, endIndex);
  }

  getSkillsText(participant: ParticipantData): string {
    if (!participant.technicalSkills) return '';
    return [
      participant.technicalSkills.angular,
      participant.technicalSkills.python,
      participant.technicalSkills.css,
      participant.technicalSkills.html,
      participant.technicalSkills.mysql
    ].filter(skill => skill).join(' ');
  }

  onSearchChange() {
    this.applyFilter();
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  onPageSizeChange() {
    this.currentPage = 0;
    this.updatePaginatedData();
    this.updateDataSource();
  }

  addParticipant() {
    this.router.navigate(['/add-participant']);
  }

  refreshData() {
    this.isLoading = true;
    
    // Show refresh feedback
    this.snackBar.open('Refreshing participants...', '', {
      duration: 1000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
    
    // Simulate loading time for better UX and refresh data
    setTimeout(() => {
      this.participantService.refreshParticipants().subscribe(() => {
        this.isLoading = false;
        this.snackBar.open(
          `Refreshed successfully! Found ${this.totalParticipants} participants`, 
          'Close', 
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          }
        );
      });
    }, 500);
  }

  // Enhanced refresh methods
  forceRefresh() {
    this.isLoading = true;
    this.participantService.refreshParticipants().subscribe(() => {
      this.isLoading = false;
      this.snackBar.open('Data refreshed successfully!', 'Close', {
        duration: 2000
      });
    });
  }

  toggleAutoRefresh() {
    this.autoRefreshEnabled = !this.autoRefreshEnabled;
    
    if (this.autoRefreshEnabled) {
      this.startAutoRefresh();
      this.snackBar.open('Auto-refresh enabled (every 30 seconds)', 'Close', {
        duration: 3000
      });
    } else {
      this.stopAutoRefresh();
      this.snackBar.open('Auto-refresh disabled', 'Close', {
        duration: 2000
      });
    }
  }

  private startAutoRefresh() {
    this.stopAutoRefresh(); // Clear any existing interval
    this.autoRefreshSubscription = interval(this.refreshInterval).subscribe(() => {
      if (!this.isLoading) {
        this.loadParticipants();
      }
    });
  }

  private stopAutoRefresh() {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
      this.autoRefreshSubscription = null;
    }
  }

  getTimeSinceLastRefresh(): string {
    if (!this.lastRefreshTime) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - this.lastRefreshTime.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s ago`;
    return `${seconds}s ago`;
  }

  editParticipant(participant: ParticipantData) {
    // Set participant data in service for editing
    this.participantService.setEditingParticipant(participant);
    this.router.navigate(['/add-participant']);
  }

  viewParticipant(participant: ParticipantData) {
    // Navigate to view mode or open modal
    this.router.navigate(['/participant-details'], {
      state: { participantData: participant }
    });
  }

  deleteParticipant(participant: ParticipantData) {
    if (confirm(`Are you sure you want to delete ${participant.name}?`)) {
      const success = this.participantService.deleteParticipant(participant.id);
      if (success) {
        this.loadParticipants();
        console.log('Participant deleted successfully');
      } else {
        alert('Error deleting participant. Please try again.');
      }
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalParticipants / this.pageSize);
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.getTotalPages()) {
      this.currentPage = page;
      this.updatePaginatedData();
      this.updateDataSource();
    }
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getSkillLevel(skill: string): string {
    const level = parseInt(skill);
    if (level >= 9) return 'Expert';
    if (level >= 7) return 'Advanced';
    if (level >= 4) return 'Intermediate';
    return 'Beginner';
  }

  getSkillColor(skill: string): string {
    const level = parseInt(skill);
    if (level >= 9) return 'expert';
    if (level >= 7) return 'advanced';
    if (level >= 4) return 'intermediate';
    return 'beginner';
  }
}
