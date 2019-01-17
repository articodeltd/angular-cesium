/**
 *  NO_PICK,    - will not pick entities
 *  PICK_FIRST  - first entity will be picked . use Cesium.scene.pick()
 *  PICK_ONE    - in case a few entities are picked plonter is resolved . use Cesium.scene.drillPick()
 *  PICK_ALL    - all entities are picked. use Cesium.scene.drillPick()
 */
export enum PickOptions {
  NO_PICK,
  PICK_FIRST,
  PICK_ONE,
  PICK_ALL
}
