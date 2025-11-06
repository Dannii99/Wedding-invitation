import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GaleryService {
  constructor(private http: HttpClient) {}

  public getGalery() {
    /*   this.http.get('https://www.icloud.com/sharedalbum/es-es/#B1nGWZuqD19HXYr').subscribe({
      next: (value) => {
        console.log('value => ', value);
      }
    }) */
    this.http
      .post('https://p111-sharedstreams.icloud.com/B1nGWZuqD19HXYr/sharedstreams/webasseturls', {
        photoGuids: [
          'A7BB7D1A-6A40-4F38-9CD9-66837B836DEF',
          'B92AC720-56AE-4DC0-AF1C-10A51EC81163',
          '5336CBBC-749C-4DE2-AB0C-AC02AA70A392',
          '605A8226-2EDD-4A20-B5F2-4F24E9CF613E',
          '944CB077-EB3F-4B59-A3E0-BD7BE5483077',
          'EC9C4C39-4385-4F66-A828-B167E2FB4A40',
          'DEDEAE17-C72D-4021-9921-F5912FE94701',
          '8AC4862C-D981-4154-9E8A-DEE8F355D52A',
          'AAE60653-5845-4257-8271-19D24E9C5BC3',
          '8FB47EEB-7F76-4A7E-BB77-ABF4174C818E',
          '02333DEB-2247-4C14-A841-E9FA47A00607',
          'F1C49E71-009A-4B6B-AF5A-11C0E821D2E0',
          'F420F6C5-0BA9-4256-A343-3B29E72046A0',
        ],
      })
      .subscribe({
        next: (value) => {
          console.log('value => ', value);
        },
      });
  }
}
