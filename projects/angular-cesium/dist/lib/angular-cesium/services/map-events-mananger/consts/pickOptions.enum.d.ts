/**
 *  NO_PICK,    - will not pick entities
 *  PICK_FIRST  - first entity will be picked . use Cesium.scene.pick()
 *  PICK_ONE    - in case a few entities are picked plonter is resolved . use Cesium.scene.drillPick()
 *  PICK_ALL    - all entities are picked. use Cesium.scene.drillPick()
 */
export declare enum PickOptions {
    NO_PICK = 0,
    PICK_FIRST = 1,
    PICK_ONE = 2,
    PICK_ALL = 3
}
