import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizedHtml'
})
export class SanitizedHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    const normalized = value.replace(/&nbsp;/g, ' ');
    return this.sanitizer.bypassSecurityTrustHtml(normalized);
  }
}
