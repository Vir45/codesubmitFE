import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

import { SidenavComponent } from './components/sidenav/sidenav.component';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { AuthService } from './services/authService/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  isLoggedIn: boolean = false;

  constructor(private dialog: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.isLoggedIn = true;
    } else {
      this.openLoginDialog();
    }
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '270px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.isLoggedIn = true;
    });
  }
}
