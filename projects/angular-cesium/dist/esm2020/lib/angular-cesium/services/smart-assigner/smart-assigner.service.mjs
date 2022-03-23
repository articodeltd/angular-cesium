/**
 * Service for effective assignment.
 */
export class SmartAssigner {
    static create(props = [], allowUndefined = true) {
        let fnBody = ``;
        props.forEach(prop => {
            if (!allowUndefined) {
                // tslint:disable-next-line:max-line-length
                fnBody += `if (!(obj1['${prop}'] instanceof Cesium.CallbackProperty) && obj2['${prop}'] !== undefined) { obj1['${prop}'] = obj2['${prop}']; } `;
            }
            else {
                fnBody += `if(!(obj1['${prop}'] instanceof Cesium.CallbackProperty))obj1['${prop}'] = obj2['${prop}']; `;
            }
        });
        fnBody += `return obj1`;
        const assignFn = new Function('obj1', 'obj2', fnBody);
        return function smartAssigner(obj1, obj2) {
            return assignFn(obj1, obj2);
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnQtYXNzaWduZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvc21hcnQtYXNzaWduZXIvc21hcnQtYXNzaWduZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUNILE1BQU0sT0FBTyxhQUFhO0lBRXhCLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBa0IsRUFBRSxFQUFFLGlCQUEwQixJQUFJO1FBQ2hFLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUVoQixLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25CLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ25CLDJDQUEyQztnQkFDM0MsTUFBTSxJQUFJLGVBQWUsSUFBSSxtREFBbUQsSUFBSSw2QkFBNkIsSUFBSSxjQUFjLElBQUksUUFBUSxDQUFDO2FBQ2pKO2lCQUFNO2dCQUNMLE1BQU0sSUFBSSxjQUFjLElBQUksZ0RBQWdELElBQUksY0FBYyxJQUFJLE1BQU0sQ0FBQzthQUMxRztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxJQUFJLGFBQWEsQ0FBQztRQUN4QixNQUFNLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXRELE9BQU8sU0FBUyxhQUFhLENBQUMsSUFBWSxFQUFFLElBQVk7WUFDdEQsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBTZXJ2aWNlIGZvciBlZmZlY3RpdmUgYXNzaWdubWVudC5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBTbWFydEFzc2lnbmVyIHtcclxuXHJcbiAgc3RhdGljIGNyZWF0ZShwcm9wczogc3RyaW5nW10gPSBbXSwgYWxsb3dVbmRlZmluZWQ6IGJvb2xlYW4gPSB0cnVlKTogKG9iajE6IE9iamVjdCwgb2JqMjogT2JqZWN0KSA9PiBPYmplY3Qge1xyXG4gICAgbGV0IGZuQm9keSA9IGBgO1xyXG5cclxuICAgIHByb3BzLmZvckVhY2gocHJvcCA9PiB7XHJcbiAgICAgIGlmICghYWxsb3dVbmRlZmluZWQpIHtcclxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXHJcbiAgICAgICAgZm5Cb2R5ICs9IGBpZiAoIShvYmoxWycke3Byb3B9J10gaW5zdGFuY2VvZiBDZXNpdW0uQ2FsbGJhY2tQcm9wZXJ0eSkgJiYgb2JqMlsnJHtwcm9wfSddICE9PSB1bmRlZmluZWQpIHsgb2JqMVsnJHtwcm9wfSddID0gb2JqMlsnJHtwcm9wfSddOyB9IGA7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZm5Cb2R5ICs9IGBpZighKG9iajFbJyR7cHJvcH0nXSBpbnN0YW5jZW9mIENlc2l1bS5DYWxsYmFja1Byb3BlcnR5KSlvYmoxWycke3Byb3B9J10gPSBvYmoyWycke3Byb3B9J107IGA7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGZuQm9keSArPSBgcmV0dXJuIG9iajFgO1xyXG4gICAgY29uc3QgYXNzaWduRm4gPSBuZXcgRnVuY3Rpb24oJ29iajEnLCAnb2JqMicsIGZuQm9keSk7XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIHNtYXJ0QXNzaWduZXIob2JqMTogT2JqZWN0LCBvYmoyOiBPYmplY3QpIHtcclxuICAgICAgcmV0dXJuIGFzc2lnbkZuKG9iajEsIG9iajIpO1xyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIl19