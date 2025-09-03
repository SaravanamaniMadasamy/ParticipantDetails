import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface SuccessDialogData {
  title: string;
  message: string;
  icon?: string;
}

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="success-dialog">
      <div class="dialog-header">
        <mat-icon class="success-icon">{{ data.icon || 'check_circle' }}</mat-icon>
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </div>
      
      <div mat-dialog-content class="dialog-content">
        <p>{{ data.message }}</p>
      </div>
      
      <div mat-dialog-actions class="dialog-actions">
        <button mat-raised-button color="primary" (click)="onClose()" cdkFocusInitial>
          <mat-icon>done</mat-icon>
          OK
        </button>
      </div>
    </div>
  `,
  styles: [`
    .success-dialog {
      min-width: 350px;
      max-width: 500px;
      text-align: center;
    }
    
    .dialog-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .success-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #4caf50;
      margin-bottom: 16px;
    }
    
    h2 {
      margin: 0;
      color: #333;
      font-weight: 500;
    }
    
    .dialog-content {
      margin: 20px 0;
    }
    
    .dialog-content p {
      color: #666;
      font-size: 16px;
      line-height: 1.5;
      margin: 0;
    }
    
    .dialog-actions {
      display: flex;
      justify-content: center;
      padding: 20px 0 10px 0;
    }
    
    .dialog-actions button {
      min-width: 120px;
    }
  `]
})
export class SuccessDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SuccessDialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
