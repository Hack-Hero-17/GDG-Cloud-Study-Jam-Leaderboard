import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Profile } from './models/profile.interface';

@Component({
  selector: 'app-leaderboard-cards',
  template: `
    <!-- Leaderboard Cards Section -->
    <div class="container mx-auto px-4">
      <!-- Top 3 Winners Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Second Place -->
        <div
          class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-200 order-2 md:order-1"
          *ngIf="paginatedProfiles[1]"
        >
          <div class="card-body items-center text-center">
            <div class="badge badge-lg badge-secondary mb-2">2nd Place</div>
            <div class="avatar placeholder mb-4">
              <div class="bg-neutral text-neutral-content rounded-full w-16">
                <span class="text-2xl">2</span>
              </div>
            </div>
            <h2 class="card-title">{{ paginatedProfiles[1].username }}</h2>
            <p class="text-sm opacity-70">{{ paginatedProfiles[1].email }}</p>
            <div class="flex gap-2 mt-2">
              <div class="badge badge-primary">
                {{ paginatedProfiles[1].badges }} Badges
              </div>
              <div
                class="badge"
                [class.badge-success]="paginatedProfiles[1].arcade_status === 1"
                [class.badge-error]="paginatedProfiles[1].arcade_status === 0"
              >
                {{
                  paginatedProfiles[1].arcade_status === 1
                    ? 'Arcade Complete'
                    : 'Arcade Incomplete'
                }}
              </div>
            </div>
            <a
              [href]="paginatedProfiles[1].skillsBoostUrl"
              target="_blank"
              class="btn btn-outline btn-sm mt-3"
              >View Profile</a
            >
          </div>
        </div>

        <!-- First Place -->
        <div
          class="card bg-primary text-primary-content shadow-xl hover:shadow-2xl transition-shadow duration-200 order-1 md:order-2"
          *ngIf="paginatedProfiles[0]"
        >
          <div class="card-body items-center text-center">
            <div class="badge badge-lg badge-secondary mb-2">Champion 🏆</div>
            <div class="avatar placeholder mb-4">
              <div class="bg-base-100 text-base-content rounded-full w-20">
                <span class="text-3xl">1</span>
              </div>
            </div>
            <h2 class="card-title text-2xl">
              {{ paginatedProfiles[0].username }}
            </h2>
            <p class="text-sm opacity-80">{{ paginatedProfiles[0].email }}</p>
            <div class="flex gap-2 mt-2">
              <div class="badge badge-secondary">
                {{ paginatedProfiles[0].badges }} Badges
              </div>
              <div
                class="badge"
                [class.badge-success]="paginatedProfiles[0].arcade_status === 1"
                [class.badge-error]="paginatedProfiles[0].arcade_status === 0"
              >
                {{
                  paginatedProfiles[0].arcade_status === 1
                    ? 'Arcade Complete'
                    : 'Arcade Incomplete'
                }}
              </div>
            </div>
            <a
              [href]="paginatedProfiles[0].skillsBoostUrl"
              target="_blank"
              class="btn btn-outline btn-sm mt-3"
              >View Profile</a
            >
          </div>
        </div>

        <!-- Third Place -->
        <div
          class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-200 order-3"
          *ngIf="paginatedProfiles[2]"
        >
          <div class="card-body items-center text-center">
            <div class="badge badge-lg badge-secondary mb-2">3rd Place</div>
            <div class="avatar placeholder mb-4">
              <div class="bg-neutral text-neutral-content rounded-full w-16">
                <span class="text-2xl">3</span>
              </div>
            </div>
            <h2 class="card-title">{{ paginatedProfiles[2].username }}</h2>
            <p class="text-sm opacity-70">{{ paginatedProfiles[2].email }}</p>
            <div class="flex gap-2 mt-2">
              <div class="badge badge-primary">
                {{ paginatedProfiles[2].badges }} Badges
              </div>
              <div
                class="badge"
                [class.badge-success]="paginatedProfiles[2].arcade_status === 1"
                [class.badge-error]="paginatedProfiles[2].arcade_status === 0"
              >
                {{
                  paginatedProfiles[2].arcade_status === 1
                    ? 'Arcade Complete'
                    : 'Arcade Incomplete'
                }}
              </div>
            </div>
            <a
              [href]="paginatedProfiles[2].skillsBoostUrl"
              target="_blank"
              class="btn btn-outline btn-sm mt-3"
              >View Profile</a
            >
          </div>
        </div>
      </div>

      <!-- Rest of Leaderboard -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          *ngFor="let profile of paginatedProfiles.slice(3)"
          class="card bg-base-100 shadow hover:shadow-md transition-shadow duration-200 card-animate"
        >
          <div class="card-body">
            <div class="flex justify-between items-center">
              <h3 class="card-title text-lg">{{ profile.username }}</h3>
              <div class="badge badge-neutral">Rank {{ profile.rank }}</div>
            </div>
            <p class="text-sm opacity-70">{{ profile.email }}</p>
            <div class="flex flex-wrap gap-2 mt-2">
              <div class="badge badge-primary">{{ profile.badges }} Badges</div>
              <div
                class="badge"
                [class.badge-success]="profile.arcade_status === 1"
                [class.badge-error]="profile.arcade_status === 0"
              >
                {{
                  profile.arcade_status === 1
                    ? 'Arcade Complete'
                    : 'Arcade Incomplete'
                }}
              </div>
              <div
                class="badge"
                [class.badge-success]="profile.swag"
                [class.badge-error]="!profile.swag"
              >
                {{ profile.swag ? 'Swag Eligible' : 'Swag Ineligible' }}
              </div>
            </div>
            <a
              [href]="profile.skillsBoostUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-outline btn-sm mt-2"
            >
              View Profile
            </a>
          </div>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div
        class="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8"
      >
        <!-- Items per page -->
        <div class="flex items-center gap-2">
          <span class="text-sm">Per page:</span>
          <select
            class="select select-bordered select-sm w-20"
            (change)="onPageChange($event)"
          >
            <option value="5">5</option>
            <option value="15">15</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>

        <!-- Page navigation -->
        <div class="btn-group">
          <button
            class="btn btn-sm"
            (click)="previousPage()"
            [disabled]="pg === 1"
          >
            «
          </button>
          <ng-container *ngFor="let page of pageNumbers">
            <ng-container
              *ngIf="
                (page > pg - 2 && page < pg + 2) ||
                page === 1 ||
                page === totalPages
              "
            >
              <button
                class="btn btn-sm"
                (click)="goToPage(page)"
                [class.btn-active]="pg === page"
              >
                {{ page }}
              </button>
            </ng-container>
            <button
              *ngIf="page === pg - 2 && pg > 3"
              class="btn btn-sm btn-disabled"
            >
              ...
            </button>
            <button
              *ngIf="page === pg + 2 && pg < totalPages - 2"
              class="btn btn-sm btn-disabled"
            >
              ...
            </button>
          </ng-container>
          <button
            class="btn btn-sm"
            (click)="nextPage()"
            [disabled]="pg === totalPages"
          >
            »
          </button>
        </div>
      </div>
    </div>
  `,
})
export class LeaderboardCardsComponent {
  @Input() paginatedProfiles: Profile[] = [];
  @Input() pg: number = 1;
  @Input() totalPages: number = 1;
  @Input() pageNumbers: number[] = [];

  @Output() pageChange = new EventEmitter<any>();
  @Output() goToPageEvent = new EventEmitter<number>();
  @Output() previousPageEvent = new EventEmitter<void>();
  @Output() nextPageEvent = new EventEmitter<void>();

  onPageChange(event: any) {
    this.pageChange.emit(event);
  }

  goToPage(page: number) {
    this.goToPageEvent.emit(page);
  }

  previousPage() {
    this.previousPageEvent.emit();
  }

  nextPage() {
    this.nextPageEvent.emit();
  }
}
