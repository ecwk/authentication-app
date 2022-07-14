import * as yup from 'yup';
import { isValidNumberForRegion } from 'libphonenumber-js';

export const createUserSchema = yup.object({
  email: yup.string().email().required(),
  password: yup
    .string()
    .min(8)
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*/, {
      message:
        'password must contain at least 1 uppercase, lowercase, number and special character (!@#$%^&*)'
    })
    .required()
});

export const updateUserSchema = yup.object({
  email: yup.string().email(),
  password: yup
    .string()
    .test(
      'minimumLength',
      'password must containt at least 8 characters',
      (value) => {
        if (value) {
          return value.length >= 8;
        } else {
          return true;
        }
      }
    )
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*/, {
      message:
        'password must contain at least 1 uppercase, lowercase, number and special character (!@#$%^&*)'
    }),
  phone: yup
    .string()
    .test(
      'isValidNumberForRegion',
      'Phone number must be a valid Singaporean phone number',
      (value) => {
        if (value) {
          return isValidNumberForRegion(value, 'SG');
        } else {
          return true;
        }
      }
    )
    .transform((value) => {
      return value.replace(/\s/g, '');
    }),
  name: yup.string(),
  bio: yup.string().max(500)
});
