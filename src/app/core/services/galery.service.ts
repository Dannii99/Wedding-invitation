import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GaleryResponse } from '../modules/galery.interface';
import { environment as env } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GaleryService {
  constructor(private http: HttpClient) {}

  public getGalery(): Observable<GaleryResponse> {
    return this.http.get<GaleryResponse>(`${env.url}items?page=1&size=60`);
  }
}
