'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { RootState, useAppDispatch, useAppSelector } from '@/store/store'
import { setCheckoutStep, setShippingAddress } from '@/store/slices/checkoutSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { apiFetch } from '@/lib/api'
import { Check, Plus } from 'lucide-react'
import { useSelector } from 'react-redux'

const addressSchema = z.object({
  firstName: z.string().min(1, 'Required').max(50, 'Too long'),
  lastName: z.string().min(1, 'Required').max(50, 'Too long'),
  address: z.string().min(5, 'Address too short').max(100, 'Address too long'),
  address2: z.string().max(100, 'Too long').optional(),
  city: z.string().min(2, 'Too short').max(50, 'Too long'),
  state: z.string().min(2, 'Too short').max(50, 'Too long'),
  postalCode: z.string().regex(/^\d{5,10}(?:[-\s]\d{4})?$/, 'Invalid postal code'),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, 'Invalid phone number'),
  country: z.string().min(2, 'Too short').max(50, 'Too long'),
  saveAsDefault: z.boolean().default(false).optional()
})

export default function AddressForm() {
  const dispatch = useAppDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      address: '',
      address2: '',
      city: '',
      state: '',
      postalCode: '',
      phone: '',
      country: 'India',
      saveAsDefault: false
    }
  })

  // Fetch addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      if (user) {
        try {
          const data: any = await apiFetch('/users/addresses')
          setAddresses(data)
          const defaultAddr = data.find((addr: any) => addr.saveAsDefault)
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr._id)
          }
        } catch (error) {
          console.error('Failed to fetch addresses:', error)
        }
      }
    }
    fetchAddresses()
  }, [user])

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId)
  }

  const handleUseAddress = () => {
    const address = addresses.find(addr => addr._id === selectedAddressId)
    if (address) {
      dispatch(setShippingAddress({
        firstName: address.firstName,
        lastName: address.lastName,
        address: address.address,
        address2: address.address2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        phone: address.phone
      }))
      dispatch(setCheckoutStep('payment'))
    }
  }

  const onSubmit = async (values: z.infer<typeof addressSchema>) => {
    try {
      let savedAddress: any = values
      
      if (user) {
        const response: any = await apiFetch('/users/addresses', {
          method: 'POST',
          data: values
        })
        savedAddress = response
        setAddresses(prev => [...prev, response])
        setShowForm(false)
        setSelectedAddressId(response._id)
      }

      dispatch(setShippingAddress({
        firstName: savedAddress.firstName,
        lastName: savedAddress.lastName,
        address: savedAddress.address,
        address2: savedAddress.address2,
        city: savedAddress.city,
        state: savedAddress.state,
        postalCode: savedAddress.postalCode,
        country: savedAddress.country,
        phone: savedAddress.phone
      }))

      dispatch(setCheckoutStep('payment'))
    } catch (error: any) {
      form.setError('root', {
        message: error.message || 'Failed to save address'
      })
    }
  }

  // Show form if no addresses or explicitly adding new
  if (showForm || addresses.length === 0) {
    return (
      <div className="w-full mx-auto">
        <h3 className="text-lg font-semibold mb-6">
          {addresses.length > 0 ? 'Add New Address' : 'Shipping Address'}
        </h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Street Address*</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address2"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Apartment, Suite, etc. (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Apt 4B" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City*</FormLabel>
                    <FormControl>
                      <Input placeholder="Mumbai" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province*</FormLabel>
                    <FormControl>
                      <Input placeholder="Maharashtra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code*</FormLabel>
                    <FormControl>
                      <Input placeholder="400001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country*</FormLabel>
                    <FormControl>
                      <Input placeholder="India" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Phone Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {user && (
                <FormField
                  control={form.control}
                  name="saveAsDefault"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 md:col-span-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Save as default shipping address</FormLabel>
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            {form.formState.errors.root && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}
            
            <div className="flex justify-end gap-4 pt-6">
              {addresses.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              )}
              
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Saving...' : 'Save Address'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    )
  }

  // Show address list with side-by-side layout
  return (
    <div className="w-full mx-auto">
      <h3 className="text-lg font-semibold mb-6">Select Shipping Address</h3>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Address List - Left Side */}
        <div className="md:w-2/3 space-y-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              onClick={() => handleAddressSelect(address._id)}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedAddressId === address._id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{address.firstName} {address.lastName}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {address.address}, {address.address2 && `${address.address2}, `}
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{address.country}</p>
                  <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                </div>
                {selectedAddressId === address._id && (
                  <Check className="h-5 w-5 text-green-500" />
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Action Buttons - Right Side */}
        <div className="md:w-1/3 space-y-4 flex flex-col text-center align-middle justify-center">
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={() => setShowForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Address
          </Button>
          
          <Button
            type="button"
            className="w-full"
            onClick={handleUseAddress}
            disabled={!selectedAddressId}
          >
            Use This Address
          </Button>
        </div>
      </div>
    </div>
  )
}