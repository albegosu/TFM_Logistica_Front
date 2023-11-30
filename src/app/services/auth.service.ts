import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { User } from '../models/user.interface';
import { Auth } from '../models/Respuestas_API/auth.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.tokenAvailable());
  httpClient = inject(HttpClient);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  async login(user: User) {
    try {
      if (user.email !== '' && user.pwd !== '') {
        const token = await firstValueFrom(
          this.httpClient.post<Auth>('http://localhost:3000/api/login', user)
        );
        if (token != undefined) {
          console.log('entra');
          localStorage.setItem('token', JSON.stringify({ token: token.token }));
          let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token.token,
          });
          console.log('Tiene el token');
          let options = { headers: headers };
          const usuario = await firstValueFrom(
            this.httpClient.post<Auth>(
              'http://localhost:3000/api/login/getUser',
              null,
              options
            )
          );
          localStorage.setItem('usuario', JSON.stringify(usuario));
          console.log(localStorage.getItem('usuario'))
          this.loggedIn.next(true);
          this.router.navigate(['/pedidos']);
        }
      }
    } catch (error) {}
  }

  private tokenAvailable(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    this.loggedIn.next(false);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  constructor(private router: Router) {}
}
