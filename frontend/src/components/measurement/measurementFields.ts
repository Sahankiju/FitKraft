export interface MeasurementField {
    key: string;   // the name sent to the backend
    label: string; // the title shown above the input
    hint: string;  // the small text shown below the input
}

export const MEASUREMENT_FIELDS: MeasurementField[] = [
    { key: "neck", label: "Neck", hint: "Around base of neck" },
    { key: "chest", label: "Chest", hint: "Fullest part of chest" },
    { key: "waist", label: "Waist", hint: "Natural waistline" },
    { key: "hip", label: "Hip", hint: "Fullest part of hips" },
    { key: "shoulder", label: "Shoulder", hint: "Tip to tip across back" },
    { key: "sleeve", label: "Sleeve length", hint: "Shoulder to wrist" },
    { key: "bicep", label: "Bicep", hint: "Around upper arm" },
    { key: "wrist", label: "Wrist", hint: "Around wrist bone" },
    { key: "shirt_length", label: "Shirt length", hint: "Collar to hem" },
    { key: "inseam", label: "Inseam", hint: "Crotch to ankle" },
    { key: "height", label: "Height", hint: "Total body height" },
];