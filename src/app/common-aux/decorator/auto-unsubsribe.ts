import { OnDestroy } from '@angular/core';

export function autoUnsubscribe(target: any, key: string) {
    const cmp = target as OnDestroy;
    const ngOnDestroyOrig = cmp.ngOnDestroy;

    cmp.ngOnDestroy = function () {
        const subscription = this[key];
        if (subscription && (typeof subscription.unsubscribe === 'function')) {
            subscription.unsubscribe();
        }
        if (ngOnDestroyOrig && typeof ngOnDestroyOrig === 'function') {
            ngOnDestroyOrig.apply(this, arguments);
        }
    };
}
