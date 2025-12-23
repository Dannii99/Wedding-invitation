import { Injectable } from '@angular/core';
import { CUPOS_POR_UUID } from '../../config/cupos.config';

@Injectable({
  providedIn: 'root'
})
export class CuposService {

  getCuposByUUID(uuid: string): number | null {
    return CUPOS_POR_UUID[uuid] ?? null;
  }

}
