import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { BePasswordValidator } from "@app/shared/validators/password-validator";

export function createRegisterForm(fb: FormBuilder): FormGroup {
    return fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, BePasswordValidator()]],
        confirmPassword: ['', Validators.required]
    }, { validators: passwordsMatchValidator() });
}

export function passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const formGroup = control as FormGroup;
        const password = formGroup.get('password')?.value;
        const confirmPassword = formGroup.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { mismatch: true };
    };
}