import { z } from 'zod';
import { isSwedishIdentityNumber } from './isSwedishIdentityNumber.js';

const createSwedishIdentitySchema = (length, messageKey, validationT) =>
  z
    .string()
    .superRefine((val, ctx) => {
      const numericVal = val.replace(/\D/g, '');
      if (!new RegExp(`^\\d{${length}}$`).test(numericVal)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: validationT(messageKey),
        });
      }
    })
    .transform((val) => {
      return val.replace(/\D/g, '');
    });

export const getCheckoutSchema = (validationT, locale) => {
  const baseSchema = z.object({
    firstName: z
      .string()
      .trim()
      .min(1, { message: validationT('firstNameRequired') }),
    lastName: z
      .string()
      .trim()
      .min(1, { message: validationT('lastNameRequired') }),
    email: z.string().email({ message: validationT('emailInvalid') }),
    phoneNumber: z
      .string()
      .transform((val) => val.replace(/\D/g, ''))
      .pipe(
        z
          .string()
          .min(8, { message: validationT('phoneMin') })
          .max(19, { message: validationT('phoneMax') }),
      ),
    desiredActivationDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: validationT('invalidDateFormat') }),
    address: z
      .string()
      .trim()
      .min(1, { message: validationT('addressRequired') }),
    postalCode: z.string().transform((val) => val.replace(/\s/g, '')),
    city: z
      .string()
      .trim()
      .min(1, { message: validationT('cityRequired') }),
    terms: z.literal(true, {
      errorMap: () => ({ message: validationT('termsRequired') }),
    }),
  });

  const internationalIdentitySchema = z
    .string()
    .trim()
    .min(5, {
      message: validationT('idNumberInvalid'),
    });

  return z
    .discriminatedUnion('type', [
      baseSchema.extend({
        type: z.literal('private'),
        orgPersonNr: z.string(),
        companyName: z.string().optional(),
        personalNumberForAuth: z.string().optional(),
      }),
      baseSchema.extend({
        type: z.literal('company'),
        orgPersonNr: z.string(),
        companyName: z
          .string()
          .trim()
          .min(1, { message: validationT('companyNameRequired') }),
        personalNumberForAuth: z.string().optional(),
      }),
    ])
    .superRefine((data, ctx) => {
      const isSwedish = isSwedishIdentityNumber(data.orgPersonNr);

      if (isSwedish) {
        // Swedish Customer Validation.
        const idSchema =
          data.type === 'private'
            ? createSwedishIdentitySchema(12, 'personalNumberInvalid', validationT)
            : createSwedishIdentitySchema(10, 'orgNumberInvalid', validationT);

        const idResult = idSchema.safeParse(data.orgPersonNr);
        if (!idResult.success) {
          idResult.error.issues.forEach((issue) => {
            ctx.addIssue({ ...issue, path: ['orgPersonNr'] });
          });
        }

        // If it's a Swedish company, require and validate the signatory's personal number.
        if (data.type === 'company') {
          const signatorySchema = createSwedishIdentitySchema(
            12,
            'personalNumberInvalid',
            validationT,
          );
          const signatoryResult = signatorySchema.safeParse(data.personalNumberForAuth);
          if (!signatoryResult.success) {
            signatoryResult.error.issues.forEach((issue) => {
              ctx.addIssue({ ...issue, path: ['personalNumberForAuth'] });
            });
          }
        }

        if (!/^\d{5}$/.test(data.postalCode)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: validationT('postalCodeInvalid'),
            path: ['postalCode'],
          });
        }
      } else {
        // International Customer Validation.
        const idResult = internationalIdentitySchema.safeParse(data.orgPersonNr);
        if (!idResult.success) {
          idResult.error.issues.forEach((issue) => {
            ctx.addIssue({ ...issue, path: ['orgPersonNr'] });
          });
        }

        if (data.postalCode.length < 3) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: validationT('postalCodeInvalidInternational'),
            path: ['postalCode'],
          });
        }
      }
    });
};
