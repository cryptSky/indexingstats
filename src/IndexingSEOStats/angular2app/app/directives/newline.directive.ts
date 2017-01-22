import { Directive, HostListener, ElementRef, OnInit } from "@angular/core";

@Directive({ selector: "[newLine]" })
export class NewLineDirective implements OnInit {

  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef
  ) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    
  }

  @HostListener("change", ["$event.target.value"])
  onChange(value) {
    this.el.value = this.splitByNewLine(value);
    
    //let event = new CustomEvent('change', { bubbles: true });
    //this.renderer.invokeElementMethod(this.el, 'dispatchEvent', [event]);
  }

  private splitByNewLine(value: string): string {
    let splitted = value.split(/[ ,;]/);
    splitted = splitted.filter(v=> v.trim() != '');
    let result = splitted.join('\r\n');
    
    return result;
  }

}