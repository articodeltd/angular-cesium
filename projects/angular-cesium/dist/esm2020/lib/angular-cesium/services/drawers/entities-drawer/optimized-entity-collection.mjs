export class OptimizedEntityCollection {
    constructor(entityCollection, collectionSize = -1, updateRate = -1) {
        this.entityCollection = entityCollection;
        this._isSuspended = false;
        this._isHardSuspend = false;
        this._updateRate = updateRate;
        this._collectionSize = collectionSize;
    }
    setShow(show) {
        this.entityCollection.show = show;
    }
    get isSuspended() {
        return this._isSuspended;
    }
    get updateRate() {
        return this._updateRate;
    }
    set updateRate(value) {
        this._updateRate = value;
    }
    get collectionSize() {
        return this._collectionSize;
    }
    set collectionSize(value) {
        this._collectionSize = value;
    }
    collection() {
        return this.entityCollection;
    }
    isFree() {
        return this._collectionSize < 1 || this.entityCollection.values.length < this._collectionSize;
    }
    add(entity) {
        this.suspend();
        return this.entityCollection.add(entity);
    }
    remove(entity) {
        this.suspend();
        return this.entityCollection.remove(entity);
    }
    removeNoSuspend(entity) {
        this.entityCollection.remove(entity);
    }
    removeAll() {
        this.suspend();
        this.entityCollection.removeAll();
    }
    onEventSuspension(callback, once = false) {
        this._onEventSuspensionCallback = { callback, once };
        return () => {
            this._onEventSuspensionCallback = undefined;
        };
    }
    onEventResume(callback, once = false) {
        this._onEventResumeCallback = { callback, once };
        if (!this._isSuspended) {
            this.triggerEventResume();
        }
        return () => {
            this._onEventResumeCallback = undefined;
        };
    }
    triggerEventSuspension() {
        if (this._onEventSuspensionCallback !== undefined) {
            const callback = this._onEventSuspensionCallback.callback;
            if (this._onEventSuspensionCallback.once) {
                this._onEventSuspensionCallback = undefined;
            }
            callback();
        }
    }
    triggerEventResume() {
        if (this._onEventResumeCallback !== undefined) {
            const callback = this._onEventResumeCallback.callback;
            if (this._onEventResumeCallback.once) {
                this._onEventResumeCallback = undefined;
            }
            callback();
        }
    }
    suspend() {
        if (this._updateRate < 0) {
            return;
        }
        if (this._isHardSuspend) {
            return;
        }
        if (!this._isSuspended) {
            this._isSuspended = true;
            this.entityCollection.suspendEvents();
            this.triggerEventSuspension();
            this._suspensionTimeout = setTimeout(() => {
                this.entityCollection.resumeEvents();
                this.triggerEventResume();
                this._isSuspended = false;
                this._suspensionTimeout = undefined;
            }, this._updateRate);
        }
    }
    hardSuspend() {
        this.entityCollection.suspendEvents();
        this._isHardSuspend = true;
    }
    hardResume() {
        this.entityCollection.resumeEvents();
        this._isHardSuspend = false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW1pemVkLWVudGl0eS1jb2xsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL2VudGl0aWVzLWRyYXdlci9vcHRpbWl6ZWQtZW50aXR5LWNvbGxlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxPQUFPLHlCQUF5QjtJQVNwQyxZQUFvQixnQkFBcUIsRUFBRSxjQUFjLEdBQUcsQ0FBQyxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUEzRCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQUs7UUFOakMsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFDckIsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFNN0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7UUFDOUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7SUFFeEMsQ0FBQztJQUVELE9BQU8sQ0FBQyxJQUFhO1FBQ25CLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3BDLENBQUM7SUFFRCxJQUFJLFdBQVc7UUFDYixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFBSSxVQUFVLENBQUMsS0FBYTtRQUMxQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBRUQsSUFBSSxjQUFjO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBSSxjQUFjLENBQUMsS0FBYTtRQUM5QixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztJQUMvQixDQUFDO0lBRUQsVUFBVTtRQUNSLE9BQU8sSUFBSSxDQUFDLGdCQUFn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RUFBRSxDQUFDO2dCQUNyQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxTQUFTLENBQUM7WUFDdEMsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUN0QjtJQUNILENBQUM7SUFFTSxXQUFXO1FBQ2hCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztJQUM3QixDQUFDO0lBRU0sVUFBVTtRQUNmLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztJQUM5QixDQUFDO0NBRUYiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgT3B0aW1pemVkRW50aXR5Q29sbGVjdGlvbiB7XHJcbiAgcHJpdmF0ZSBfdXBkYXRlUmF0ZTogbnVtYmVyO1xyXG4gIHByaXZhdGUgX2NvbGxlY3Rpb25TaXplOiBudW1iZXI7XHJcbiAgcHJpdmF0ZSBfaXNTdXNwZW5kZWQgPSBmYWxzZTtcclxuICBwcml2YXRlIF9pc0hhcmRTdXNwZW5kID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSBfc3VzcGVuc2lvblRpbWVvdXQ6IGFueTtcclxuICBwcml2YXRlIF9vbkV2ZW50U3VzcGVuc2lvbkNhbGxiYWNrOiB7IG9uY2U6IGJvb2xlYW4sIGNhbGxiYWNrOiBGdW5jdGlvbiB9O1xyXG4gIHByaXZhdGUgX29uRXZlbnRSZXN1bWVDYWxsYmFjazogeyBvbmNlOiBib29sZWFuLCBjYWxsYmFjazogRnVuY3Rpb24gfTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbnRpdHlDb2xsZWN0aW9uOiBhbnksIGNvbGxlY3Rpb25TaXplID0gLTEsIHVwZGF0ZVJhdGUgPSAtMSkge1xyXG4gICAgdGhpcy5fdXBkYXRlUmF0ZSA9IHVwZGF0ZVJhdGU7XHJcbiAgICB0aGlzLl9jb2xsZWN0aW9uU2l6ZSA9IGNvbGxlY3Rpb25TaXplO1xyXG5cclxuICB9XHJcblxyXG4gIHNldFNob3coc2hvdzogYm9vbGVhbikge1xyXG4gICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uLnNob3cgPSBzaG93O1xyXG4gIH1cclxuXHJcbiAgZ2V0IGlzU3VzcGVuZGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2lzU3VzcGVuZGVkO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHVwZGF0ZVJhdGUoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl91cGRhdGVSYXRlO1xyXG4gIH1cclxuXHJcbiAgc2V0IHVwZGF0ZVJhdGUodmFsdWU6IG51bWJlcikge1xyXG4gICAgdGhpcy5fdXBkYXRlUmF0ZSA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGNvbGxlY3Rpb25TaXplKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fY29sbGVjdGlvblNpemU7XHJcbiAgfVxyXG5cclxuICBzZXQgY29sbGVjdGlvblNpemUodmFsdWU6IG51bWJlcikge1xyXG4gICAgdGhpcy5fY29sbGVjdGlvblNpemUgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGNvbGxlY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlDb2xsZWN0aW9uO1xyXG4gIH1cclxuXHJcbiAgaXNGcmVlKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2NvbGxlY3Rpb25TaXplIDwgMSB8fCB0aGlzLmVudGl0eUNvbGxlY3Rpb24udmFsdWVzLmxlbmd0aCA8IHRoaXMuX2NvbGxlY3Rpb25TaXplO1xyXG4gIH1cclxuXHJcbiAgYWRkKGVudGl0eTogYW55KSB7XHJcbiAgICB0aGlzLnN1c3BlbmQoKTtcclxuICAgIHJldHVybiB0aGlzLmVudGl0eUNvbGxlY3Rpb24uYWRkKGVudGl0eSk7XHJcbiAgfVxyXG5cclxuICByZW1vdmUoZW50aXR5OiBhbnkpIHtcclxuICAgIHRoaXMuc3VzcGVuZCgpO1xyXG4gICAgcmV0dXJuIHRoaXMuZW50aXR5Q29sbGVjdGlvbi5yZW1vdmUoZW50aXR5KTtcclxuICB9XHJcblxyXG4gIHJlbW92ZU5vU3VzcGVuZChlbnRpdHk6IGFueSkge1xyXG4gICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uLnJlbW92ZShlbnRpdHkpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlQWxsKCkge1xyXG4gICAgdGhpcy5zdXNwZW5kKCk7XHJcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb24ucmVtb3ZlQWxsKCk7XHJcbiAgfVxyXG5cclxuICBvbkV2ZW50U3VzcGVuc2lvbihjYWxsYmFjazogRnVuY3Rpb24sIG9uY2UgPSBmYWxzZSk6IEZ1bmN0aW9uIHtcclxuICAgIHRoaXMuX29uRXZlbnRTdXNwZW5zaW9uQ2FsbGJhY2sgPSB7Y2FsbGJhY2ssIG9uY2V9O1xyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgdGhpcy5fb25FdmVudFN1c3BlbnNpb25DYWxsYmFjayA9IHVuZGVmaW5lZDtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBvbkV2ZW50UmVzdW1lKGNhbGxiYWNrOiBGdW5jdGlvbiwgb25jZSA9IGZhbHNlKTogRnVuY3Rpb24ge1xyXG4gICAgdGhpcy5fb25FdmVudFJlc3VtZUNhbGxiYWNrID0ge2NhbGxiYWNrLCBvbmNlfTtcclxuICAgIGlmICghdGhpcy5faXNTdXNwZW5kZWQpIHtcclxuICAgICAgdGhpcy50cmlnZ2VyRXZlbnRSZXN1bWUoKTtcclxuICAgIH1cclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIHRoaXMuX29uRXZlbnRSZXN1bWVDYWxsYmFjayA9IHVuZGVmaW5lZDtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICB0cmlnZ2VyRXZlbnRTdXNwZW5zaW9uKCkge1xyXG4gICAgaWYgKHRoaXMuX29uRXZlbnRTdXNwZW5zaW9uQ2FsbGJhY2sgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuX29uRXZlbnRTdXNwZW5zaW9uQ2FsbGJhY2suY2FsbGJhY2s7XHJcbiAgICAgIGlmICh0aGlzLl9vbkV2ZW50U3VzcGVuc2lvbkNhbGxiYWNrLm9uY2UpIHtcclxuICAgICAgICB0aGlzLl9vbkV2ZW50U3VzcGVuc2lvbkNhbGxiYWNrID0gdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcbiAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0cmlnZ2VyRXZlbnRSZXN1bWUoKSB7XHJcbiAgICBpZiAodGhpcy5fb25FdmVudFJlc3VtZUNhbGxiYWNrICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLl9vbkV2ZW50UmVzdW1lQ2FsbGJhY2suY2FsbGJhY2s7XHJcbiAgICAgIGlmICh0aGlzLl9vbkV2ZW50UmVzdW1lQ2FsbGJhY2sub25jZSkge1xyXG4gICAgICAgIHRoaXMuX29uRXZlbnRSZXN1bWVDYWxsYmFjayA9IHVuZGVmaW5lZDtcclxuICAgICAgfVxyXG4gICAgICBjYWxsYmFjaygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHN1c3BlbmQoKSB7XHJcbiAgICBpZiAodGhpcy5fdXBkYXRlUmF0ZSA8IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuX2lzSGFyZFN1c3BlbmQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLl9pc1N1c3BlbmRlZCkge1xyXG4gICAgICB0aGlzLl9pc1N1c3BlbmRlZCA9IHRydWU7XHJcbiAgICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbi5zdXNwZW5kRXZlbnRzKCk7XHJcbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50U3VzcGVuc2lvbigpO1xyXG4gICAgICB0aGlzLl9zdXNwZW5zaW9uVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbi5yZXN1bWVFdmVudHMoKTtcclxuICAgICAgICB0aGlzLnRyaWdnZXJFdmVudFJlc3VtZSgpO1xyXG4gICAgICAgIHRoaXMuX2lzU3VzcGVuZGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fc3VzcGVuc2lvblRpbWVvdXQgPSB1bmRlZmluZWQ7XHJcbiAgICAgIH0sIHRoaXMuX3VwZGF0ZVJhdGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGhhcmRTdXNwZW5kKCkge1xyXG4gICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uLnN1c3BlbmRFdmVudHMoKTtcclxuICAgIHRoaXMuX2lzSGFyZFN1c3BlbmQgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGhhcmRSZXN1bWUoKSB7XHJcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb24ucmVzdW1lRXZlbnRzKCk7XHJcbiAgICB0aGlzLl9pc0hhcmRTdXNwZW5kID0gZmFsc2U7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=