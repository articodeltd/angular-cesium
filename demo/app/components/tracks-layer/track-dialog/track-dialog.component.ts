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
            from
            to
            type
        }
    }
`;


@Component({
  selector: 'track-dialog',
  templateUrl: './track-dialog.component.html',
  styleUrls: ['./track-dialog.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class TracksDialogComponent implements OnInit, OnDestroy {
  private readonly POLL_INTERVAL = 2000;
  public track$: Observable<any>;
  public track: Track;
  private stopper$ = new Subject();
  private singleTrackQuery$: ApolloQueryObservable<Track>;

  constructor(@Inject(MD_DIALOG_DATA) private data: any,
              private cd: ChangeDetectorRef, private apollo: Apollo) {
  }

  ngOnInit(): void {
    this.track = this.data.track;
    this.track$ = this.data.trackObservable;

    if (this.data.realData) {
      this.track$.subscribe((track) => {
          this.track = Object.assign(this.track, track);
          this.changeTrackPosToDeg(track);
          this.cd.markForCheck();
        },
        err => console.log('track dialog err: ' + err));

      this.singleTrackQuery$ = this.apollo.watchQuery<Track>({
        query: TrackDataQuery,
        variables: {
          id: this.data.track.id,
        },
        pollInterval: this.POLL_INTERVAL,
        fetchPolicy: 'network-only',
      });

      this.singleTrackQuery$
        .takeUntil(this.stopper$)
        .subscribe((result: any) => {
        const track = result.data.track;
        Object.assign(this.track, {
          from: track.from,
          to: track.to,
          type: track.type,
        });
        this.cd.markForCheck();
      });
    }
    else {
      this.cd.detectChanges();
      this.track$ = this.data.trackObservable.takeUntil(this.stopper$);
      this.track$.subscribe((track) => {
        this.track = Object.assign({}, track);
        this.changeTrackPosToDeg(track);
        this.cd.detectChanges();
      });
    }

    this.cd.markForCheck();
  }

  private changeTrackPosToDeg(track) {
    const pos = Cesium.Cartographic.fromCartesian(track.position);
    this.track.position = {
      lat: this.toDegrees(pos.latitude),
      long: this.toDegrees(pos.longitude),
      alt: track.alt
    };
  }

  ngOnDestroy() {
    if (this.singleTrackQuery$) {
      this.singleTrackQuery$.stopPolling();
    }
    this.stopper$.next(true);
  }

  toDegrees(value) {
    const result = Math.round((360 - (180 * value / Math.PI) % 360.0) * 100) / 100;
    return result < 0 ? result + 360 : result;
  }

  fixTextSize(text) {
    if (text && text.length > 25) {
      return text.slice(0, 25).concat('...');
    }
  }
}
