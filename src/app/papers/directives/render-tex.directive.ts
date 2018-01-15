import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

import * as katex from 'katex';

@Directive({
  selector: '[appRenderTex]'
})
export class RenderTexDirective implements OnChanges {

  @Input() text: string;

  constructor(private element: ElementRef) { }

  ngOnChanges() {
    this.render();
  }

  private render() {

    // No text, do nothing.
    if (!this.text) {
      return;
    }

    // Render all TeX, remove all braces, and replace inner HTML.
    this.element.nativeElement.innerHTML = this.text
      .replace(new RegExp('\\$(.*)\\$', 'g'),
        function(match: any, mathExpr: string): string {
          return katex.renderToString(mathExpr);
        }
      )
      .replace(new RegExp('{|}', 'g'), '');
  }
}
