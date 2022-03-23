import { Cartesian3, Cartesian2, Color, HeightReference, HorizontalOrigin, LabelStyle as cLabelStyle, VerticalOrigin } from 'cesium';
export const defaultLabelProps = {
    backgroundColor: new Color(0.165, 0.165, 0.165, 0.7),
    backgroundPadding: new Cartesian2(25, 20),
    distanceDisplayCondition: undefined,
    fillColor: Color.WHITE,
    font: '30px sans-serif',
    heightReference: HeightReference.NONE,
    horizontalOrigin: HorizontalOrigin.LEFT,
    outlineColor: Color.BLACK,
    outlineWidth: 1.0,
    pixelOffset: Cartesian2.ZERO,
    pixelOffsetScaleByDistance: undefined,
    scale: 1.0,
    scaleByDistance: undefined,
    show: true,
    showBackground: false,
    style: cLabelStyle.FILL,
    text: '',
    translucencyByDistance: undefined,
    verticalOrigin: VerticalOrigin.BASELINE,
    eyeOffset: Cartesian3.ZERO,
    disableDepthTestDistance: 0,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFiZWwtcHJvcHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvbW9kZWxzL2xhYmVsLXByb3BzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxJQUFJLFdBQVcsRUFBRSxjQUFjLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFtRHJJLE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFlO0lBQzNDLGVBQWUsRUFBRSxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUM7SUFDcEQsaUJBQWlCLEVBQUUsSUFBSSxVQUFVLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUN6Qyx3QkFBd0IsRUFBRSxTQUFTO0lBQ25DLFNBQVMsRUFBRSxLQUFLLENBQUMsS0FBSztJQUN0QixJQUFJLEVBQUUsaUJBQWlCO0lBQ3ZCLGVBQWUsRUFBRSxlQUFlLENBQUMsSUFBSTtJQUNyQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJO0lBQ3ZDLFlBQVksRUFBRSxLQUFLLENBQUMsS0FBSztJQUN6QixZQUFZLEVBQUUsR0FBRztJQUNqQixXQUFXLEVBQUUsVUFBVSxDQUFDLElBQUk7SUFDNUIsMEJBQTBCLEVBQUUsU0FBUztJQUNyQyxLQUFLLEVBQUUsR0FBRztJQUNWLGVBQWUsRUFBRSxTQUFTO0lBQzFCLElBQUksRUFBRSxJQUFJO0lBQ1YsY0FBYyxFQUFFLEtBQUs7SUFDckIsS0FBSyxFQUFFLFdBQVcsQ0FBQyxJQUFJO0lBQ3ZCLElBQUksRUFBRSxFQUFFO0lBQ1Isc0JBQXNCLEVBQUUsU0FBUztJQUNqQyxjQUFjLEVBQUUsY0FBYyxDQUFDLFFBQVE7SUFDdkMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxJQUFJO0lBQzFCLHdCQUF3QixFQUFFLENBQUM7Q0FDNUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhcnRlc2lhbjMsIENhcnRlc2lhbjIsIENvbG9yLCBIZWlnaHRSZWZlcmVuY2UsIEhvcml6b250YWxPcmlnaW4sIExhYmVsU3R5bGUgYXMgY0xhYmVsU3R5bGUsIFZlcnRpY2FsT3JpZ2luIH0gZnJvbSAnY2VzaXVtJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTGFiZWxTdHlsZSB7XHJcbiAgc2hvdz86IGJvb2xlYW47XHJcbiAgZm9udD86IHN0cmluZztcclxuICBzdHlsZT86IGFueTtcclxuICBmaWxsQ29sb3I/OiBhbnk7XHJcbiAgb3V0bGluZUNvbG9yPzogYW55O1xyXG4gIGJhY2tncm91bmRDb2xvcj86IGFueTtcclxuICBiYWNrZ3JvdW5kUGFkZGluZz86IGFueTtcclxuICBzaG93QmFja2dyb3VuZD86IGJvb2xlYW47XHJcbiAgc2NhbGU/OiBudW1iZXI7XHJcbiAgZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uPzogYW55O1xyXG4gIGhlaWdodFJlZmVyZW5jZT86IGFueTtcclxuICBob3Jpem9udGFsT3JpZ2luPzogYW55O1xyXG4gIGV5ZU9mZnNldD86IENhcnRlc2lhbjM7XHJcbiAgcG9zaXRpb24/OiBDYXJ0ZXNpYW4zO1xyXG4gIHBpeGVsT2Zmc2V0PzogQ2FydGVzaWFuMjtcclxuICBwaXhlbE9mZnNldFNjYWxlQnlEaXN0YW5jZT86IGFueTtcclxuICBvdXRsaW5lV2lkdGg/OiBhbnk7XHJcbiAgc2NhbGVCeURpc3RhbmNlPzogYW55O1xyXG4gIHRyYW5zbHVjZW5jeUJ5RGlzdGFuY2U/OiBhbnk7XHJcbiAgdmVydGljYWxPcmlnaW4/OiBhbnk7XHJcbiAgZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlPzogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIExhYmVsUHJvcHMge1xyXG4gIHRleHQ6IHN0cmluZztcclxuICBzaG93PzogYm9vbGVhbjtcclxuICBmb250Pzogc3RyaW5nO1xyXG4gIHN0eWxlPzogYW55O1xyXG4gIGZpbGxDb2xvcj86IGFueTtcclxuICBvdXRsaW5lQ29sb3I/OiBhbnk7XHJcbiAgYmFja2dyb3VuZENvbG9yPzogYW55O1xyXG4gIGJhY2tncm91bmRQYWRkaW5nPzogYW55O1xyXG4gIHNob3dCYWNrZ3JvdW5kPzogYm9vbGVhbjtcclxuICBzY2FsZT86IG51bWJlcjtcclxuICBkaXN0YW5jZURpc3BsYXlDb25kaXRpb24/OiBhbnk7XHJcbiAgaGVpZ2h0UmVmZXJlbmNlPzogYW55O1xyXG4gIGhvcml6b250YWxPcmlnaW4/OiBhbnk7XHJcbiAgZXllT2Zmc2V0PzogQ2FydGVzaWFuMztcclxuICBwb3NpdGlvbj86IENhcnRlc2lhbjM7XHJcbiAgcGl4ZWxPZmZzZXQ/OiBDYXJ0ZXNpYW4yO1xyXG4gIHBpeGVsT2Zmc2V0U2NhbGVCeURpc3RhbmNlPzogYW55O1xyXG4gIG91dGxpbmVXaWR0aD86IGFueTtcclxuICBzY2FsZUJ5RGlzdGFuY2U/OiBhbnk7XHJcbiAgdHJhbnNsdWNlbmN5QnlEaXN0YW5jZT86IGFueTtcclxuICB2ZXJ0aWNhbE9yaWdpbj86IGFueTtcclxuICBkaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2U/OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkZWZhdWx0TGFiZWxQcm9wczogTGFiZWxQcm9wcyA9IHtcclxuICBiYWNrZ3JvdW5kQ29sb3I6IG5ldyBDb2xvcigwLjE2NSwgMC4xNjUsIDAuMTY1LCAwLjcpLFxyXG4gIGJhY2tncm91bmRQYWRkaW5nOiBuZXcgQ2FydGVzaWFuMigyNSwgMjApLFxyXG4gIGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbjogdW5kZWZpbmVkLFxyXG4gIGZpbGxDb2xvcjogQ29sb3IuV0hJVEUsXHJcbiAgZm9udDogJzMwcHggc2Fucy1zZXJpZicsXHJcbiAgaGVpZ2h0UmVmZXJlbmNlOiBIZWlnaHRSZWZlcmVuY2UuTk9ORSxcclxuICBob3Jpem9udGFsT3JpZ2luOiBIb3Jpem9udGFsT3JpZ2luLkxFRlQsXHJcbiAgb3V0bGluZUNvbG9yOiBDb2xvci5CTEFDSyxcclxuICBvdXRsaW5lV2lkdGg6IDEuMCxcclxuICBwaXhlbE9mZnNldDogQ2FydGVzaWFuMi5aRVJPLFxyXG4gIHBpeGVsT2Zmc2V0U2NhbGVCeURpc3RhbmNlOiB1bmRlZmluZWQsXHJcbiAgc2NhbGU6IDEuMCxcclxuICBzY2FsZUJ5RGlzdGFuY2U6IHVuZGVmaW5lZCxcclxuICBzaG93OiB0cnVlLFxyXG4gIHNob3dCYWNrZ3JvdW5kOiBmYWxzZSxcclxuICBzdHlsZTogY0xhYmVsU3R5bGUuRklMTCxcclxuICB0ZXh0OiAnJyxcclxuICB0cmFuc2x1Y2VuY3lCeURpc3RhbmNlOiB1bmRlZmluZWQsXHJcbiAgdmVydGljYWxPcmlnaW46IFZlcnRpY2FsT3JpZ2luLkJBU0VMSU5FLFxyXG4gIGV5ZU9mZnNldDogQ2FydGVzaWFuMy5aRVJPLFxyXG4gIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogMCxcclxufTtcclxuIl19