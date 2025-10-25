import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';

interface UserProfile {
  username: string;
  email: string;
  skillsBoostUrl: string;
  profileStatus: string;
  accessCode: string;
  allCompleted: string;
  badges: number;
  badgeNames: string;
  arcade_status: number;
  arcadeNames: string;
  rank: number;
  swag: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  ProfilesList: UserProfile[] = [];
  filteredProfiles: UserProfile[] = [];
  searchText: string = '';
  lastUpdatedDate: string = '';
  prevDate: string = '';

  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  interval: any;
  eventTime = new Date('November 1, 2024 17:00:00 GMT+0530').getTime();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.startCountdown();
    this.readCSV();
    this.extractLastUpdatedDate();
  }
  clearSearch() {
    this.searchText = '';
    this.filterProfiles();
  }

  readCSV() {
    this.http.get('assets/GenAI.csv', { responseType: 'text' }).subscribe(
      (data) => {
        this.parseCSV(data);
      },
      (error) => {
        console.error('Error reading CSV file:', error);
      }
    );
  }

  parseCSV(csvData: string) {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const profiles: UserProfile[] = result.data.map((row: any) => ({
          username: row['User Name'],
          email: row['User Email'],
          skillsBoostUrl: row['Google Cloud Skills Boost Profile URL'],
          profileStatus: row['Profile URL Status'],
          accessCode: row['Access Code Redemption Status'],
          allCompleted: row['All Skill Badges & Games Completed'],
          badges: parseInt(row['# of Skill Badges Completed'], 10) || 0,
          badgeNames: row['Names of Completed Skill Badges'],
          arcade_status: parseInt(row['# of Arcade Games Completed'], 10) || 0,
          arcadeNames: row['Names of Completed Arcade Games'],
          rank: 0,
          swag:
            parseInt(row['# of Arcade Games Completed'], 10) === 1 &&
            parseInt(row['# of Skill Badges Completed'], 10) >= 15,
        }));

        profiles.sort((a, b) => {
          if (b.badges !== a.badges) return b.badges - a.badges;
          return b.arcade_status - a.arcade_status;
        });

        profiles.forEach((p, i) => (p.rank = i + 1));

        this.ProfilesList = profiles;
        this.filteredProfiles = [...profiles];
        this.filterProfiles();
      },
    });
  }

  extractLastUpdatedDate() {
    this.http
      .get<{ buildDate: string }>('assets/build-metadata.json')
      .subscribe(
        (data) => {
          const date = new Date(data.buildDate);
          const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });

          const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          this.lastUpdatedDate = `${formattedDate}, ${formattedTime}`;
          const previous = new Date(date);
          previous.setDate(date.getDate() - 1);
          this.prevDate = previous.toLocaleDateString('en-GB');
        },
        (error) => {
          console.error('Error loading build date:', error);
        }
      );
  }

  filterProfiles() {
    if (!this.searchText) {
      this.filteredProfiles = this.ProfilesList;
    } else {
      const lowerCaseSearchText = this.searchText.toLowerCase();
      this.filteredProfiles = this.ProfilesList.filter(
        (profile) =>
          profile.username.toLowerCase().includes(lowerCaseSearchText) ||
          profile.email.toLowerCase().includes(lowerCaseSearchText) ||
          profile.badges.toString().includes(lowerCaseSearchText)
      );
    }
    this.pg = 1;
  }

  pg: number = 1;
  fetchPages: number = 5;

  get paginatedProfiles() {
    const startIndex = (this.pg - 1) * this.fetchPages;
    return this.filteredProfiles.slice(
      startIndex,
      startIndex + this.fetchPages
    );
  }

  onPageChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.fetchPages = +selectElement.value;
    this.pg = 1;
  }

  nextPage(): void {
    if (this.pg < this.totalPages) {
      this.pg++;
    }
  }

  previousPage(): void {
    if (this.pg > 1) {
      this.pg--;
    }
  }

  get totalPages() {
    return Math.ceil(this.filteredProfiles.length / this.fetchPages);
  }

  get pageNumbers() {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number) {
    this.pg = page;
  }

  startCountdown() {
    this.interval = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = this.eventTime - now;

      this.days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      this.hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      this.minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      if (timeLeft < 0) {
        clearInterval(this.interval);
        this.days = this.hours = this.minutes = this.seconds = 0;
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
