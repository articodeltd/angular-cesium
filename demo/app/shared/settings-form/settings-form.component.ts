import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';
import { Http, Response } from '@angular/http';
import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'settings-form',
  templateUrl: 'settings-form.component.html',
  styleUrls: ['settings-form.component.css']
})
export class SettingsFormComponent implements OnInit {
  @Output() cleanMap = new EventEmitter();
  @Output() showEvent = new EventEmitter();

  public numOfEntities = 0;
  public rate = 0;
  public sendOption = 'chunk';
  private isShow = true;
  private currentLongitude = 0;
  private currentLatitude = 0;

  constructor(private http: Http,
              public ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.getServerSettings().subscribe((data) => {
      this.numOfEntities = data.numOfEntities;
      this.rate = data.interval;
      this.sendOption = data.sendOption;
    });
  }

  private getServerSettings() {
    return this.http.get('http://localhost:3000/data').catch(this.handleError).map((res: Response) => {
        const body = res.json();
        return body || {};
      }
    );
  }

  applySettings() {
    this.http.post('http://localhost:3000/change',
      {
        rate: this.rate,
        numOfEntities: this.numOfEntities,
        sendOption: 'chunk'
      }).catch(this.handleError)
      .subscribe(() => {
        this.cleanMap.emit();
        alert('changed');
      });
  }

  show() {
    this.isShow = !this.isShow;
    this.showEvent.emit(this.isShow);
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.log(`error connecting to the server: ${errMsg}`);
    return Observable.throw(errMsg);
  }

  setLongLat(value) {
    this.currentLongitude = value.latitude.toFixed(4);
    this.currentLatitude = value.longitude.toFixed(4);
    this.ref.detectChanges();
  }
}
