import * as Joi from 'joi';


export const validate = (body: any, schemaMap: Joi.SchemaMap, allowUnknown: boolean = false): any => {
  const schema = Joi.object().keys(schemaMap);

  const {value, error} = schema.validate(body,{allowUnknown, stripUnknown: true});
  if (error) {
    throw error;
  }
  return value;
  
};



// const schema = Joi.object({ name: Joi.string() .min(6) .required(),
//   email: Joi.string() .min(6) .required() .email(),
//   password: Joi.string() .min(6) .required() });
  
//   const validation = schema.validate(req.body);
//   res.send(validation);

