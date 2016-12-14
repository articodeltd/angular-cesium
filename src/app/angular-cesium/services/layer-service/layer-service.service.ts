import { Injectable } from '@angular/core';

@Injectable()
export class LayerService {
  private notification:any;
  public change;

  getCurrentNotification(){
    return this.notification;
  }

  setCurrentNotification(notification:any){
    this.notification = notification;
  }

}
