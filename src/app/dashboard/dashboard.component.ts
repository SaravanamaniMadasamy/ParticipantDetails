import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ParticipantService, ParticipantData } from '../services/participant.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatProgressBarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  participantCount = 0;
  totalSkillsRated = 0;
  averageAngularSkill = 0;
  averagePythonSkill = 0;
  skillDistribution: any = {};
  participants: ParticipantData[] = [];
  
  skillsAnalysis = {
    angular: { average: 0, distribution: [] as number[] },
    python: { average: 0, distribution: [] as number[] },
    css: { average: 0, distribution: [] as number[] },
    html: { average: 0, distribution: [] as number[] },
    mysql: { average: 0, distribution: [] as number[] }
  };

  constructor(private participantService: ParticipantService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.participants = this.participantService.getAllParticipants();
    this.participantCount = this.participants.length;
    
    if (this.participants.length > 0) {
      this.calculateStats();
    }
  }

  calculateStats() {
    // Calculate participants with completed skills
    this.totalSkillsRated = this.participants.filter(p => 
      p.technicalSkills?.angular && 
      p.technicalSkills?.python && 
      p.technicalSkills?.css && 
      p.technicalSkills?.html && 
      p.technicalSkills?.mysql
    ).length;
    
    // Calculate skill averages and distributions
    const skills = ['angular', 'python', 'css', 'html', 'mysql'] as const;
    
    skills.forEach(skill => {
      const skillValues = this.participants
        .filter(p => p.technicalSkills && p.technicalSkills[skill])
        .map(p => parseInt(p.technicalSkills![skill]!));
      
      if (skillValues.length > 0) {
        this.skillsAnalysis[skill].average = Math.round(
          skillValues.reduce((sum, val) => sum + val, 0) / skillValues.length
        );
        
        // Create distribution array for progress bars
        const distribution = new Array(10).fill(0);
        skillValues.forEach(val => {
          if (val >= 1 && val <= 10) {
            distribution[val - 1]++;
          }
        });
        this.skillsAnalysis[skill].distribution = distribution;
      }
    });
    
    this.averageAngularSkill = this.skillsAnalysis.angular.average;
    this.averagePythonSkill = this.skillsAnalysis.python.average;
  }

  getSkillAnalysis(skill: string) {
    return this.skillsAnalysis[skill as keyof typeof this.skillsAnalysis];
  }

  getSkillColor(skillName: string): string {
    const colors: { [key: string]: string } = {
      angular: '#dd0031',
      python: '#3776ab',
      css: '#1572b6',
      html: '#e34f26',
      mysql: '#4479a1'
    };
    return colors[skillName] || '#666';
  }

  getProgressPercentage(skill: string): number {
    return (this.skillsAnalysis[skill as keyof typeof this.skillsAnalysis].average / 10) * 100;
  }

  refreshData() {
    this.loadStats();
  }
}
