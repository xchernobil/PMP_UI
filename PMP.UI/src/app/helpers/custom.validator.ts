import { FormGroup } from '@angular/forms';

export function DateCompare(date1: string, date2: string) {
    return (formGroup: FormGroup) => {
        const dateStartControl = formGroup.controls[date1];
        const dateEndControl = formGroup.controls[date2];

        if (dateEndControl.errors && !dateEndControl.errors.dateCompare) {
            // return if another validator has already found an error on the dateEndControl
            return;
        }
        
        // set error on dateEndControl if validation fails
        if (Date.parse(dateStartControl.value) >= Date.parse(dateEndControl.value)) {
            dateEndControl.setErrors({ dateCompare: true });
        } else {
            dateEndControl.setErrors(null);
        }
    }
}

export function DependentRequired(checkbox: string, parentTask: string) {
    return (formGroup: FormGroup) => {
        const checkBoxControl = formGroup.controls[checkbox];
        const parentTaskControl = formGroup.controls[parentTask];
        
        // set error on dateEndControl if validation fails
        if (checkBoxControl.value!=true && parentTaskControl.value=="") {
            parentTaskControl.setErrors({ dependentRequired: true });
        } else {
            parentTaskControl.setErrors(null);
        }
    }
}