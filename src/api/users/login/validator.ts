import * as Joi from 'Joi';

export default {
    userLogin: {
        headers: Joi.object({
        }).options({ allowUnknown: true }),
    },
};
