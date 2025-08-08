'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { FiMail, FiPhone, FiMapPin, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { useState } from 'react'
import { submitContactForm } from '@/services/contactService'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

export default function ContactPage() {
    const [submissionState, setSubmissionState] = useState<{success: boolean, message: string} | null>(null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmissionState(null)
    const result = await submitContactForm(values)
    
    if (result.success) {
      form.reset()
      setSubmissionState({
        success: true,
        message: result.message || 'Message sent successfully!'
      })
    } else {
      setSubmissionState({
        success: false,
        message: result.message || 'Failed to send message'
      })
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Contact Form */}
      <div>
        <h1 className="text-3xl font-bold mb-6">Get in Touch</h1>

        {submissionState && (
          <Alert variant={submissionState.success ? 'default' : 'destructive'} className={`mb-6 ${submissionState.success ? 'text-green-500' : 'text-red-500'}`}>
            {submissionState.success ? (
              <FiCheckCircle className="h-4 w-4" />
            ) : (
              <FiAlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {submissionState.success ? 'Success!' : 'Error'}
            </AlertTitle>
            <AlertDescription className={`${submissionState.success ? 'text-green-500' : 'text-red-500'}`}>
              {submissionState.message}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="How can we help?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Your message here..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </Form>
      </div>

      {/* Contact Info */}
      <div className="space-y-8">
        <div className="bg-green-50 rounded-xl p-8 h-full">
          <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <FiMail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium">Email Us</h3>
                <p className="text-gray-600">support@shopease.com</p>
                <p className="text-gray-600">sales@shopease.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <FiPhone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium">Call Us</h3>
                <p className="text-gray-600">+91 22 1234 5678</p>
                <p className="text-gray-600">Mon-Fri: 9am-5pm</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <FiMapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium">Visit Us</h3>
                <p className="text-gray-600">123 Shop Ease</p>
                <p className="text-gray-600">Delhi, India, 110059</p>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mt-8 aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Map would display here
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}