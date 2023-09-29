import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appAutoScale]'
})
export class AutoScaleDirective {
  @Input() scalePercentage: number = 10; // Porcentaje de escala (ajusta según tus necesidades)

  constructor(private el: ElementRef) { }

  private applyScale(scale: number): void {
    const element = this.el.nativeElement;
    element.style.width = `${scale}%`;
    element.style.height = `${scale}%`;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const parentWidth = this.el.nativeElement.parentNode.offsetWidth;
    const parentHeight = this.el.nativeElement.parentNode.offsetHeight;
    const scale = Math.min(parentWidth, parentHeight) * (this.scalePercentage / 100);
    this.applyScale(scale);
  }
}
