import { takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { Track } from '../../../utils/services/dataProvider/track.model';

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
  public trackEntityFn: any;
  private stopper$ = new Subject();
  private singleTrackQuery$: QueryRef<Track>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private cd: ChangeDetectorRef, private apollo: Apollo) {
  }

  ngOnInit(): void {
    this.trackEntityFn = this.data.trackEntityFn;
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

      this.singleTrackQuery$.valueChanges.pipe(
        takeUntil(this.stopper$))
        .subscribe((result: any) => {
          const track = result.data.track;
          Object.assign(this.track, {
            from: track.from,
            to: track.to,
            type: track.type,
          });
          this.cd.markForCheck();
        });
    } else {
      this.cd.detectChanges();
      this.track$ = this.data.trackObservable.pipe(takeUntil(this.stopper$));
      this.track$.subscribe((track) => {
        this.track = Object.assign({}, track);
        this.changeTrackPosToDeg(track);
        this.cd.detectChanges();
      });
    }

    this.cd.markForCheck();
  }

  private changeTrackPosToDeg(track: any) {
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

  toDegrees(value: number) {
    const result = Math.round((360 - (180 * value / Math.PI) % 360.0) * 100) / 100;
    return result < 0 ? result + 360 : result;
  }

  fixTextSize(text: string) {
    if (text && text.length > 25) {
      return text.slice(0, 25).concat('...');
    }
    return text;
  }
}
