const Joi = require('joi');

const eventValidation = {
    // Create event validation
    createEvent: {
        body:{
            title: Joi.string().required().max(200).messages({
                'string.empty': 'Event title is required',
                'string.max': 'Title cannot exceed 200 characters',
            }),
            description: Joi.string().required().max(2000).messages({
                'string.empty': 'Event description is required',
                'string.max': 'Description cannot exceed 2000 characters',
            }),
            beachId: Joi.string().required().messages({
                'string.empty': 'Beach Id is required',
            }),
            startDate: Joi.date().iso().greater('now').required().messages({
                'date.base': 'Start date must be a valid date',
                'date.greater': 'Start date must be in the future',
            }),
            endDate: Joi.date().iso().greater(Joi.ref('startDate')).required().messages({
                'date.greater': 'End date must be after start date',
            }),
            maxVolunteers: Joi.number().min(1).optional().allow(null),
            tags: Joi.array().items(Joi.string().max(50)).optional(),
            imageUrls: Joi.array().items(Joi.string().uri()).optional(),
        }
    },

    // Update event validation
    updateEvent: {
        params: {
            eventId: Joi.string().optional(),
        },
        body: {
            title: Joi.string().max(200).optional(),
            description: Joi.string().max(2000).optional(),
            location: Joi.string().optional(),
            coordinates: Joi.object({
                latitude: Joi.number().min(-90).max(90).required(),
                longitude: Joi.number().min(-180).max(180).required(),
            }).optional(),
            startDate: Joi.date().iso().optional(),
            endDate: Joi.date().iso().optional(),
            maxVolunteers: Joi.number().min(1).optional().allow(null),
            status: Joi.string()
                .valid('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED')
                .optional(),
            tags: Joi.array().items(Joi.string().max(50)).optional(),
            imageUrls: Joi.array().items(Joi.string().uri()).optional(),
        }
    },

    // Delete event validation
    deleteEvent: {
        query:{
            eventId: Joi.string().optional(),
        }
    }

    //
}


const updateEventSchema = Joi.object({

}).min(1);

module.exports = {
  createEventSchema,
  updateEventSchema,
};
