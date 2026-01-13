import { AbstractControl, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from "@angular/forms";
import { BePasswordsMatchValidator, BePasswordValidator } from "@app/shared/validators/password-validator";

export function createRegisterFreelancerForm(fb: NonNullableFormBuilder): FormGroup {
    return fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, BePasswordValidator()]],
        confirmPassword: ['', Validators.required]
    }, { validators: BePasswordsMatchValidator() });
}

export function createRegisterRepresentativeForm(fb: NonNullableFormBuilder): FormGroup {
    return fb.group({
        name: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        address: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        position: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, BePasswordValidator()]],
        confirmPassword: ['', Validators.required]
    }, { validators: BePasswordsMatchValidator() });
}