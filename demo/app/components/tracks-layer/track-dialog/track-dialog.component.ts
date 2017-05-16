import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import gql from 'graphql-tag';
import { Track } from '../../../../utils/services/dataProvider/track.model';
import { Subject } from 'rxjs/Subject';


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
  private stopper$ = new Subject();

  constructor(@Inject(MD_DIALOG_DATA) private data: any,
              private cd: ChangeDetectorRef, private apollo: Apollo) {
  }

  ngOnInit(): void {
    this.track = this.data.track;

    if (this.data.realData) {
      this.track$ = this.apollo.watchQuery<Track>({
        query : TrackDataQuery,
        variables : {
          id : this.data.track.id,
        },
        pollInterval : this.POLL_INTERVAL,
        fetchPolicy : 'network-only',
      }).takeUntil(this.stopper$);
      this.track$.subscribe((result) => {
          this.track = result.data.track;
          this.cd.markForCheck();
        },
        err => console.log('track dialog err: ' + err));

    } else {
      this.cd.detectChanges();
      this.track$ = this.data.trackObservable.takeUntil(this.stopper$);
      this.track$.subscribe((track) => {
        this.track = Object.assign({}, track);
        this.changeTrackPosToDeg(track);
        this.cd.detectChanges();
      });
    }
  }

  private changeTrackPosToDeg(track) {
    const pos = Cesium.Cartographic.fromCartesian(track.position);
    this.track.position = {
      lat: this.toDegrees(pos.latitude),
      long: this.toDegrees(pos.longitude),
      alt: pos.height
    };
  }

  ngOnDestroy() {
    if (this.track$ instanceof ApolloQueryObservable) {
      this.track$.stopPolling();
    }
    this.stopper$.next(true);
  }

  toDegrees(value) {
    const result = (360 - Math.round(180 * value / Math.PI)) % 360;
    return result < 0 ? result + 360 : result;
  }

  fixTextSize(text) {
    if (text && text.length > 25) {
      return text.slice(0, 25).concat('...');
    }
  }
}
