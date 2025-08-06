import { apiFetch } from "@/lib/api";

export async function submitContactForm(formData: {
    name: string
    email: string
    subject: string
    message: string
  }): Promise<{ success: boolean; message?: string }> {
    try {
      await apiFetch<{ success: boolean }>('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      return { success: true, message: 'Message sent successfully!' }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to send message',
      }
    }
  }