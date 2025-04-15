import { FormCarNumber } from "@/components/form/car-number"
import { FormCombobox } from "@/components/form/combobox"
import { FormDatePicker } from "@/components/form/date-picker"
import { FormFormatNumberInput } from "@/components/form/format-number-input"
import FormInput from "@/components/form/input"
import { FormMultiCombobox } from "@/components/form/multi-combobox"
import { FormNumberInput } from "@/components/form/number-input"
import { ReactNode } from "@tanstack/react-router"
import { UseFormReturn } from "react-hook-form"

export const useMakeForm = ({
    f,
    form,
}: {
    f: FormField
    form: UseFormReturn<any>
}): ReactNode => {
    switch (f.type) {
        case "combobox":
            return (
                <FormCombobox
                    returnVal={f.returnVal}
                    key={f.name}
                    control={form.control}
                    name={f.name}
                    label={f.label}
                    placeholder={f.placeholder}
                    options={f.options}
                    disabled={f.disabled}
                />
            )
        case "multi-combobox":
            return (
                <FormMultiCombobox
                    returnVal={f.returnVal}
                    key={f.name}
                    control={form.control}
                    name={f.name}
                    label={f.label}
                    placeholder={f.placeholder}
                    options={f.options}
                    disabled={f.disabled}
                />
            )
        case "money":
            return (
                <FormNumberInput
                    key={f.name}
                    control={form.control}
                    name={f.name}
                    label={f.label}
                    placeholder={f.placeholder}
                    thousandSeparator=" "
                    disabled={f.disabled}
                />
            )
        case "number":
            return (
                <FormNumberInput
                    key={f.name}
                    control={form.control}
                    name={f.name}
                    label={f.label}
                    placeholder={f.placeholder}
                    disabled={f.disabled}
                />
            )
        case "phone_number":
            return (
                <FormFormatNumberInput
                    format="+998 ## ### ## ##"
                    key={f.name}
                    control={form.control}
                    name={f.name}
                    label={f.label}
                    placeholder={f.placeholder}
                    disabled={f.disabled}
                />
            )
        case "car_number":
            return (
                <FormCarNumber
                    key={f.name}
                    control={form.control}
                    name={f.name}
                    label={f.label}
                    placeholder={f.placeholder}
                    disabled={f.disabled}
                />
            )

        case "date":
            return (
                <FormDatePicker
                    key={f.name}
                    control={form.control}
                    name={f.name}
                    label={f.label}
                    disabled={f.disabled}
                />
            )
        default:
            return (
                <FormInput
                    key={f.name}
                    methods={form}
                    name={f.name}
                    label={f.label}
                    placeholder={f.placeholder}
                    disabled={f.disabled}
                />
            )
    }
}
