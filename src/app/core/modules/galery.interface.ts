export interface Galery {
  height: number,
  id: string,
  mediaUrl: string,
  thumbUrl: string,
  type: string,
  width: number
}


export interface GaleryResponse {
  page: number;
  size: number;
  total: number;
  items: Galery[];
}
