/**
 *  NO_PICK,    - will not pick entities
 *  PICK_FIRST  - first entity will be picked . use Cesium.scene.pick()
 *  PICK_ALL    - all entities are picked. use Cesium.scene.drillPick()
 */
export const enum PickOptions {
	NO_PICK,
	PICK_FIRST,
	PICK_ALL
}
