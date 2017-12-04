import { AfterContentInit, Component, ContentChild, Directive, ElementRef, HostBinding, Renderer2 } from '@angular/core';
import { inspect } from 'util';
import { NGXLogger } from 'ngx-logger';

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

    constructor(private renderer: Renderer2, private logger: NGXLogger) {}

    ngAfterContentInit() {
        this.logger.debug('CheckboxButtonComponent#ngAfterContentInit');
        this.logger.debug(`\tlabel:${this.label}`);
        this.logger.debug(`\t\t${inspect(this.label)}`);
        this.logger.debug(`\tfirst child:${this.label.element.nativeElement.firstChild}`);
        this.logger.debug(`\t\t${inspect(this.label.element.nativeElement.firstChild)}`);

        const icon = this.createIcon();

        this.logger.debug(`\ticon: ${icon}`);
        this.logger.debug(`\t\t${inspect(icon)}`);

        this.renderer.insertBefore(this.label.element.nativeElement, icon, this.label.element.nativeElement.firstChild);
    }

    private createIcon(kind = 'fa-check-circle'): HTMLSpanElement {
        const icon = this.renderer.createElement('span');
        this.renderer.addClass(icon, 'fa');
        this.renderer.addClass(icon, kind);
        return icon;
    }
}
