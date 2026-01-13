import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function BePasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';

    if (!value) return null;

    const errors: ValidationErrors = {};

    if (value.length < 8) errors['minLength'] = true;
    if (!/[A-Z]/.test(value)) errors['uppercase'] = true;
    if (!/[a-z]/.test(value)) errors['lowercase'] = true;
    if (!/[0-9]/.test(value)) errors['number'] = true;
    if (!/[^A-Za-z0-9]/.test(value)) errors['special'] = true;

    return Object.keys(errors).length ? errors : null;
  };
}
