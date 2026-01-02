import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'be-stepper',
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {
    @Input() steps: string[] = [];
    @Input() currentStep: number = 0;
    @Output() stepChange = new EventEmitter<number>();

    onStepClick(index: number): void {
        if (index <= this.currentStep) {
            this.currentStep = index;
            this.stepChange.emit(index);
        }
    }

    isStepCompleted(index: number): boolean {
        return index < this.currentStep;
    }

    isStepActive(index: number): boolean {
        return index === this.currentStep;
    }
}