import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ParticipantData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  linkedInProfile: string;
  githubId: string;
  technicalSkills?: {
    angular: string;
    python: string;
    css: string;
    html: string;
    mysql: string;
  };
  trainingOutcome?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  private editingParticipantSubject = new BehaviorSubject<ParticipantData | null>(null);
  private participantsSubject = new BehaviorSubject<ParticipantData[]>([]);
  private lastRefreshSubject = new BehaviorSubject<Date | null>(null);
  
  public editingParticipant$ = this.editingParticipantSubject.asObservable();
  public participants$ = this.participantsSubject.asObservable();
  public lastRefresh$ = this.lastRefreshSubject.asObservable();

  setEditingParticipant(participant: ParticipantData | null) {
    this.editingParticipantSubject.next(participant);
  }

  getEditingParticipant(): ParticipantData | null {
    return this.editingParticipantSubject.value;
  }

  clearEditingParticipant() {
    this.editingParticipantSubject.next(null);
  }

  // Refresh participants data and notify subscribers
  refreshParticipants(): Observable<ParticipantData[]> {
    const participants = this.loadParticipantsFromStorage();
    this.participantsSubject.next(participants);
    this.lastRefreshSubject.next(new Date());
    return this.participants$;
  }

  // Get participants synchronously
  getAllParticipants(): ParticipantData[] {
    const participants = this.loadParticipantsFromStorage();
    this.participantsSubject.next(participants);
    return participants;
  }

  // Private method to load from localStorage
  private loadParticipantsFromStorage(): ParticipantData[] {
    try {
      const data = localStorage.getItem('participants');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading participants:', error);
      return [];
    }
  }

  // Get last refresh time
  getLastRefreshTime(): Date | null {
    return this.lastRefreshSubject.value;
  }

  saveParticipant(participant: ParticipantData): boolean {
    try {
      const participants = this.loadParticipantsFromStorage();
      const existingIndex = participants.findIndex(p => p.id === participant.id);
      
      if (existingIndex >= 0) {
        // Update existing participant
        participants[existingIndex] = { ...participant, updatedAt: new Date().toISOString() };
      } else {
        // Add new participant
        participants.push(participant);
      }
      
      localStorage.setItem('participants', JSON.stringify(participants));
      this.participantsSubject.next(participants); // Notify subscribers
      return true;
    } catch (error) {
      console.error('Error saving participant:', error);
      return false;
    }
  }

  deleteParticipant(id: string): boolean {
    try {
      const participants = this.loadParticipantsFromStorage();
      const filteredParticipants = participants.filter(p => p.id !== id);
      localStorage.setItem('participants', JSON.stringify(filteredParticipants));
      this.participantsSubject.next(filteredParticipants); // Notify subscribers
      return true;
    } catch (error) {
      console.error('Error deleting participant:', error);
      return false;
    }
  }
}
