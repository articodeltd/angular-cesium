import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionType } from '../../../../src/models/action-type.enum';
import { AcNotification } from '../../../../src/models/ac-notification';
import { AcLayerComponent } from '../../../../src/components/ac-layer/ac-layer.component';

@Component({
	selector: 'arc-layer',
	templateUrl: 'arc-layer.component.html'
})

export class ArcLayerComponent implements OnInit, AfterViewInit {
	arcs$: Observable<AcNotification>;
	show = true;
	@ViewChild(AcLayerComponent) layer: AcLayerComponent;

	constructor() {
		let yellowMatirial = new Cesium.Material({
			fabric: {
				type: 'Color',
				uniforms: {
					color: new Cesium.Color(1.0, 1.0, 0.0, 1.0)
				}
			}
		});

		const colorMaterial = Cesium.Material.fromType('Color');
		colorMaterial.uniforms.color = Cesium.Color.YELLOW;

		const arcArray = [];
		for (let i = 0; i < 1000; i++) {
			let randCenter = Cesium.Cartesian3.fromDegrees(Math.random() * 90 - 40, Math.random() * 90 - 40);
			let randomDelta = Math.PI;
			let randomRadius = Math.random() * 1000000;
			let randomAngle = Math.random() * 3 - 1;
			arcArray.push({
				id: i,
				actionType: ActionType.ADD_UPDATE,
				entity: {
					angle: randomAngle,
					delta: randomDelta,
					radius: randomRadius,
					name: 'base haifa',
					center: randCenter,
					appearance: new Cesium.PolylineMaterialAppearance({
						material: colorMaterial
					}),
					attributes: {
						color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom())
					},
				}
			})
		}

		this.arcs$ = Observable.create(function (observable) {
			arcArray.forEach(function (arc) {
				observable.next(arc);
			});

			setTimeout(function () {
				colorMaterial.uniforms.color = Cesium.Color.RED;
				arcArray.forEach(function (arc) {
					arc.entity.appearance = new Cesium.PolylineMaterialAppearance({
						material: colorMaterial
					});

					observable.next(arc);
				});
			}, 8000);
		});
	}

	ngOnInit(): void {
	}

	ngAfterViewInit(): void {
	}

	removeAll() {
		//do nothing
	}

	setShow($event) {
		this.show = $event
	}
}