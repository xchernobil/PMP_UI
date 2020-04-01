import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
    selector: '[appDropdown]',
    exportAs: 'appDropdown'
})
export class DropdownDirective {
    @HostBinding('class.show') isShown = false;
    @HostListener('click') toggleOpen() {
        this.isShown = !this.isShown;
    }
}
