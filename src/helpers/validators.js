export const required = value => (value ? undefined : 'Required');

const CAR_NUMBER_REG_EXP = /^[A-ZА-Я]{2}[0-9]{4}[A-ZА-Я]{2}$/;

export const carNumber = value => (CAR_NUMBER_REG_EXP.test(value) ? undefined : 'Not a car number');

export const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);
