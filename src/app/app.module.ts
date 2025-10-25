// app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LeaderboardCardsComponent } from './leaderboard-cards.component';

@NgModule({
  declarations: [AppComponent, LeaderboardCardsComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule, // Import HttpClientModule here
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
