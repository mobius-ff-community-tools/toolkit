import { AfterContentInit, Component, ContentChild, Directive, ElementRef, HostBinding, Renderer2 } from '@angular/core';
import { inspect } from 'util';

@Directive({
    selector: '[app-checkbox-button-content], [appCheckboxButtonContent]'
})
export class CheckboxButtonContentDirective {
    @HostBinding('class') classes = 'btn btn-secondary';

    constructor(public element: ElementRef) {}
}

@Component({
    selector: 'app-checkbox-button',
    templateUrl: './checkbox-button.component.html',
    styleUrls: ['./checkbox-button.component.css'],
})
export class CheckboxButtonComponent implements AfterContentInit {
    @HostBinding('attr.data-toggle') toggle = 'buttons';

    @ContentChild(CheckboxButtonContentDirective)
    label: CheckboxButtonContentDirective;

    constructor(private renderer: Renderer2) {}

    ngAfterContentInit() {
        console.log('CheckboxButtonComponent#ngAfterContentInit');
        console.log(`\tlabel: ${inspect(this.label)}`)
        this.renderer.addClass(this.label.element.nativeElement, 'btn');
        this.renderer.addClass(this.label.element.nativeElement, 'btn-secondary');
        const icon = this.createIcon();
        this.renderer.insertBefore(this.label.element.nativeElement, icon, this.label.element.nativeElement.firstChild);
    }

    private createIcon(kind = 'fa-check-circle'): any {
        const icon = this.renderer.createElement('span');
        this.renderer.addClass(icon, 'fa');
        this.renderer.addClass(icon, kind);
        return icon;
    }
}
