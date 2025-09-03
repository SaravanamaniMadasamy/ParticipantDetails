import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';

// Services
import { ParticipantService, ParticipantData } from '../services/participant.service';

// Dialog components
import { SuccessDialogComponent } from '../dialogs/success-dialog.component';

@Component({
  selector: 'app-participant-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule
  ],
  templateUrl: './participant-form.html',
  styleUrl: './participant-form.scss'
})
export class ParticipantForm implements OnInit, OnDestroy {
  participantForm!: FormGroup;
  isEditMode = false;
  editingParticipant: ParticipantData | null = null;
  private subscription = new Subscription();
  skillLevels = [
    { value: '', viewValue: 'Rate yourself' },
    { value: 1, viewValue: '1 - Beginner' },
    { value: 2, viewValue: '2' },
    { value: 3, viewValue: '3' },
    { value: 4, viewValue: '4' },
    { value: 5, viewValue: '5 - Intermediate' },
    { value: 6, viewValue: '6' },
    { value: 7, viewValue: '7' },
    { value: 8, viewValue: '8' },
    { value: 9, viewValue: '9' },
    { value: 10, viewValue: '10 - Expert' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private participantService: ParticipantService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.createForm();
    this.checkForEditMode();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  checkForEditMode() {
    // Subscribe to editing participant from service
    this.subscription.add(
      this.participantService.editingParticipant$.subscribe(participant => {
        if (participant) {
          this.isEditMode = true;
          this.editingParticipant = participant;
          this.populateFormForEdit();
        } else {
          this.isEditMode = false;
          this.editingParticipant = null;
        }
      })
    );
  }

  populateFormForEdit() {
    if (this.editingParticipant) {
      this.participantForm.patchValue({
        name: this.editingParticipant.name,
        phoneNumber: this.editingParticipant.phoneNumber,
        email: this.editingParticipant.email,
        linkedInProfile: this.editingParticipant.linkedInProfile,
        githubId: this.editingParticipant.githubId,
        angular: this.editingParticipant.technicalSkills?.angular || '',
        python: this.editingParticipant.technicalSkills?.python || '',
        css: this.editingParticipant.technicalSkills?.css || '',
        html: this.editingParticipant.technicalSkills?.html || '',
        mysql: this.editingParticipant.technicalSkills?.mysql || '',
        trainingOutcome: this.editingParticipant.trainingOutcome || ''
      });
    }
  }

  createForm() {
    this.participantForm = this.fb.group({
      // Personal Information
      name: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.pattern(/^\+?[\d\s-()]{10,}$/)]],
      email: ['', [Validators.required, Validators.email]],
      linkedInProfile: ['', [Validators.pattern(/^https:\/\/([a-z]{2,3}\.)?linkedin\.com\/.*$/)]],
      githubId: [''],

      // Technical Skills (all mandatory)
      angular: ['', Validators.required],
      python: ['', Validators.required],
      css: ['', Validators.required],
      html: ['', Validators.required],
      mysql: ['', Validators.required],

      // Training Outcome
      trainingOutcome: ['', [Validators.required, Validators.minLength(250), Validators.maxLength(1000)]]
    });
  }

  onSubmit() {
    if (this.participantForm.valid) {
      const formData = this.participantForm.value;
      
      if (this.isEditMode && this.editingParticipant) {
        // Update existing participant
        const updatedParticipantData: ParticipantData = {
          ...this.editingParticipant, // Keep existing id, createdAt
          name: formData.name || '',
          email: formData.email || '',
          phoneNumber: formData.phoneNumber || '',
          linkedInProfile: formData.linkedInProfile || '',
          githubId: formData.githubId || '',
          technicalSkills: {
            angular: formData.angular || '',
            python: formData.python || '',
            css: formData.css || '',
            html: formData.html || '',
            mysql: formData.mysql || ''
          },
          trainingOutcome: formData.trainingOutcome || '',
          updatedAt: new Date().toISOString()
        };
        
        // Get existing participants and update the specific one
        const existingParticipants: ParticipantData[] = JSON.parse(localStorage.getItem('participants') || '[]');
        const updatedParticipants = existingParticipants.map(p => 
          p.id === this.editingParticipant!.id ? updatedParticipantData : p
        );
        
        localStorage.setItem('participants', JSON.stringify(updatedParticipants));
        console.log('Participant updated successfully:', updatedParticipantData);
        
        // Show success dialog
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          width: '400px',
          data: {
            title: 'Update Successful',
            message: 'Participant details have been updated successfully!',
            icon: 'check_circle'
          }
        });

        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/participants']);
        });
      } else {
        // Create new participant
        const participantData: ParticipantData = {
          id: Date.now().toString(),
          name: formData.name || '',
          email: formData.email || '',
          phoneNumber: formData.phoneNumber || '',
          linkedInProfile: formData.linkedInProfile || '',
          githubId: formData.githubId || '',
          technicalSkills: {
            angular: formData.angular || '',
            python: formData.python || '',
            css: formData.css || '',
            html: formData.html || '',
            mysql: formData.mysql || ''
          },
          trainingOutcome: formData.trainingOutcome || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Get existing participants and add new one
        const existingParticipants: ParticipantData[] = JSON.parse(localStorage.getItem('participants') || '[]');
        existingParticipants.push(participantData);
        
        localStorage.setItem('participants', JSON.stringify(existingParticipants));
        console.log('Participant created successfully:', participantData);
        
        // Show success dialog
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          width: '400px',
          data: {
            title: 'Save Successful',
            message: 'New participant has been saved successfully!',
            icon: 'person_add'
          }
        });

        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/participants']);
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.participantService.clearEditingParticipant();
    this.router.navigate(['/participants']);
  }

  onReset() {
    this.participantForm.reset();
    // Reset form control values to empty strings and clear validation states
    Object.keys(this.participantForm.controls).forEach(key => {
      this.participantForm.get(key)?.setErrors(null);
    });
  }

  // Utility method to view saved participants (for testing)
  viewSavedParticipants() {
    const participants = JSON.parse(localStorage.getItem('participants') || '[]');
    console.log('All saved participants:', participants);
    return participants;
  }

  // Method to clear all participants from localStorage (for testing)
  clearAllParticipants() {
    localStorage.removeItem('participants');
    console.log('All participants cleared from localStorage');
  }

  markFormGroupTouched() {
    Object.keys(this.participantForm.controls).forEach(key => {
      const control = this.participantForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(field: string): string {
    const control = this.participantForm.get(field);
    if (control?.hasError('required')) {
      return `${this.getFieldDisplayName(field)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `Minimum ${requiredLength} characters required`;
    }
    if (control?.hasError('maxlength')) {
      const requiredLength = control.errors?.['maxlength']?.requiredLength;
      return `Maximum ${requiredLength} characters allowed`;
    }
    if (control?.hasError('pattern')) {
      if (field === 'phoneNumber') {
        return 'Please enter a valid phone number';
      }
      if (field === 'linkedInProfile') {
        return 'Please enter a valid LinkedIn profile URL';
      }
    }
    return '';
  }

  getFieldDisplayName(field: string): string {
    const fieldNames: { [key: string]: string } = {
      name: 'Name',
      phoneNumber: 'Phone Number',
      email: 'Email',
      linkedInProfile: 'LinkedIn Profile',
      githubId: 'GitHub ID',
      angular: 'Angular',
      python: 'Python',
      css: 'CSS',
      html: 'HTML',
      mysql: 'MySQL',
      trainingOutcome: 'Training Outcome'
    };
    return fieldNames[field] || field;
  }
}
