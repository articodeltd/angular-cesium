import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject, OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import gql from 'graphql-tag';
import { Track } from '../../../../utils/services/dataProvider/track.model'; import { SettingsFormComponent } from '../../../shared/settings-form/settings-form.component'; import { AppSettingsService } from '../../../services/app-settings-service/app-settings-service';


const TrackDataQuery = gql`
    query TrackData($id: String!) {
        track(id: $id){
            callsign
            from
            to
            type
            heading
            id
            groundSpeed
            position {
                lat
                long
                alt
            }
        }
    }
`;


@Component({
  selector : 'track-dialog',
  templateUrl : './track-dialog.component.html',
  styleUrls : ['./track-dialog.component.css'],
  encapsulation : ViewEncapsulation.None,
  changeDetection : ChangeDetectionStrategy.OnPush

})
export class TracksDialogComponent implements OnInit, OnDestroy {
  private readonly POLL_INTERVAL = 2000;
  public track$: Observable<any>;
  public track: Track;

  constructor(@Inject(MD_DIALOG_DATA) private data: any,
              private cd: ChangeDetectorRef, private apollo: Apollo) {
  }

  ngOnInit(): void {
    if (this.data.realData) {
      this.track$ = this.apollo.watchQuery<Track>({
        query : TrackDataQuery,
        variables : {
          id : this.data.realTrack.id,
        },
        pollInterval : this.POLL_INTERVAL,
        fetchPolicy: 'network-only',
      });
      this.track$.subscribe((result) => {
          console.log(result);
          this.track = result.data.track;
          this.cd.markForCheck();
        },
        err => console.log('track dialog err: ' + err));

    } else {
      this.track$ = this.data.trackObservable;
      this.track$.subscribe(() => {
        this.cd.detectChanges();
      });
    }
  }

  ngOnDestroy(){
    const track$ = this.track$ as ApolloQueryObservable<Track>;
    track$.stopPolling();
  }

  toDegrees(value) {
    const result = (360 - Math.round(180 * value / Math.PI)) % 360;
    return result < 0 ? result + 360 : result;
  }
}
