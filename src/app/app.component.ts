import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SnackbarComponent } from './shared/components/ui/snackbar/snackbar.component';
import { LoaderComponent } from './shared/components/ui/loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    SnackbarComponent,
    LoaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Angular Ecommerce Dashboard | TailAdmin';
}
