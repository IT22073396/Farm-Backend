const mongoose = require('mongoose');
const Joi = require('joi');

// Define cow schema
const CowSchema = new mongoose.Schema({
    cow_id: {
        type: String,
        unique: true,
        required: [true, "Cow ID is required."]
    },
    tag_number: {
        type: String,
        required: [true, "Tag number is required."]
    },
    breed: {
        type: String,
        required: [true, "Breed is required."]
    },
    date_of_birth: {
        type: Date,
        required: [true, "Date of birth is required."]
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: [true, "Gender is required."]
    },
    health_records: [{
        medical_condition: String,
        symptoms: String,
        diagnosis_date: Date,
        diagnosed_by: String
    }],
    treatment_details: [{
        treatment_description: String,
        medications_administered: {
            name: String,
            dose: String,
            frequency: String
        },
        start_date: Date,
        end_date: Date,
        administered_by: String
    }],
    vaccination_records: [{
        vaccine_name: String,
        vaccination_date: Date,
        next_due_date: Date,
        administered_by: String
    }],
    lab_tests: [{
        test_type: String,
        test_date: Date,
        result_summary: String,
        uploaded_documents: String // URL or file path for reports
    }],
    veterinarian_info: {
        vet_name: String,
        vet_license_number: String,
        contact_number: String,
        clinic_name: String
    },
    general_notes: {
        remarks: String,
        follow_up_required: Boolean,
        next_checkup_date: Date
    },
    createdAt: { type: Date, default: Date.now }
});

// Create Cow model
const Cow = mongoose.model("Cow", CowSchema);

// Validate cow data
const validateCow = data => {
    const schema = Joi.object({
        cow_id: Joi.string().required(),
        tag_number: Joi.string().required(),
        breed: Joi.string().required(),
        date_of_birth: Joi.date().required(),
        gender: Joi.string().valid('Male', 'Female').required(),
        health_records: Joi.array().items(Joi.object({
            medical_condition: Joi.string(),
            symptoms: Joi.string(),
            diagnosis_date: Joi.date(),
            diagnosed_by: Joi.string()
        })),
        treatment_details: Joi.array().items(Joi.object({
            treatment_description: Joi.string(),
            medications_administered: Joi.object({
                name: Joi.string(),
                dose: Joi.string(),
                frequency: Joi.string()
            }),
            start_date: Joi.date(),
            end_date: Joi.date(),
            administered_by: Joi.string()
        })),
        vaccination_records: Joi.array().items(Joi.object({
            vaccine_name: Joi.string(),
            vaccination_date: Joi.date(),
            next_due_date: Joi.date(),
            administered_by: Joi.string()
        })),
        lab_tests: Joi.array().items(Joi.object({
            test_type: Joi.string(),
            test_date: Joi.date(),
            result_summary: Joi.string(),
            uploaded_documents: Joi.string()
        })),
        veterinarian_info: Joi.object({
            vet_name: Joi.string(),
            vet_license_number: Joi.string(),
            contact_number: Joi.string(),
            clinic_name: Joi.string()
        }),
        general_notes: Joi.object({
            remarks: Joi.string(),
            follow_up_required: Joi.boolean(),
            next_checkup_date: Joi.date()
        })
    });

    return schema.validate(data);
};

module.exports = {
    validateCow,
    Cow
};