import { z } from 'zod';

const IMAGE_MB_LIMIT = 5000000;
const ACCEPTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const SingleImageFileSchema = z
  .custom<File>()
  .superRefine((f, ctx) => {
    if (!f) {
      return;
    }
    // First, add an issue if the mime type is wrong.
    if (!ACCEPTED_IMAGE_MIME_TYPES.includes(f.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `File must be one of [${ACCEPTED_IMAGE_MIME_TYPES.join(', ')}] but was ${f.type}`,
      });
    }
    // Next add an issue if the file size is too large.
    if (f.size > IMAGE_MB_LIMIT) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        type: 'array',
        message: `The file must not be larger than ${IMAGE_MB_LIMIT} bytes: ${f?.size}`,
        maximum: IMAGE_MB_LIMIT,
        inclusive: true,
      });
    }
  })
  .optional();

export const ImageChangeFormSchema = z.object({
  coverImageUrl: SingleImageFileSchema,
  avatarImageUrl: SingleImageFileSchema,
});

export type ImageChangeFormSchemaType = z.infer<typeof ImageChangeFormSchema>;
