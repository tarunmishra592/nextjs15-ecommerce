import { Request, Response } from 'express';
import { contactFormSchema } from '../schemas/contactSchema';
import { handleContactForm } from '../services/contactService';

export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const validatedData = contactFormSchema.parse(req.body);
    const result = await handleContactForm(validatedData);

    return res.status(201).json({ message: result.message });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.errors,
      });
    }

    console.error('Contact form submission error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
