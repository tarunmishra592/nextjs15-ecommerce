import { ContactFormInput } from '../schemas/contactSchema';
import { Contact } from '../models/Contact';

export const handleContactForm = async (data: ContactFormInput) => {
  try {
    const newContact = new Contact(data);
    await newContact.save();

    return { success: true, message: 'Message saved successfully' };
  } catch (error) {
    console.error('Error saving contact form:', error);
    throw new Error('Failed to save contact message');
  }
};
