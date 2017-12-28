import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

import * as katex from 'katex';

@Directive({
  selector: '[appRenderTex]'
})
export class RenderTexDirective implements OnChanges {

  @Input('appRenderTex')
  appRenderTex: string;

  constructor(private element: ElementRef) { }

  ngOnChanges() {
    this.render();
  }

  private render() {

    // Render all TeX, remove all braces, and replace inner HTML.
    this.element.nativeElement.innerHTML = this.appRenderTex
      .replace(new RegExp('\\$(.*)\\$', 'g'),
        function(match: any, mathExpr: string): string {
          return katex.renderToString(mathExpr);
        }
      )
      .replace(new RegExp('{|}', 'g'), '');
  }
}
