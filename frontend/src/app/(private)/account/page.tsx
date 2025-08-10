'use client'
import { useEffect, useState } from 'react';
import {useRouter} from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import toast from 'react-hot-toast';
import { clientApi } from '@/lib/client-api';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const router = useRouter()

  useEffect(() => {
    setLoading(true);
    clientApi<User>('/users/profile', {protected: true})
      .then((data: any) => {
        setUser(data);
        setFormData({
          name: data.name,
          email: data.email
        });
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load profile');
        toast('Could not load your profile');
      })
      .finally(() => setLoading(false));
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Add your save logic here
    toast('Your changes have been saved');
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="w-full mx-auto p-6 space-y-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 space-y-8">
      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">My Profile</h1>
            {!editMode ? (
              <Button variant="outline" onClick={() => setEditMode(true)}>
                Edit Profile
              </Button>
            ) : (
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
            </div>

            <div className="flex-1 space-y-4">
              {editMode ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled // Typically emails shouldn't be changed directly
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="text-lg font-medium">{user?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-lg font-medium">{user?.email}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <h2 className="text-xl font-semibold">Security</h2>
        </CardHeader>
        <CardContent className="pt-6">
          <Button onClick={() => router.push('/account/password')} variant="outline">Change Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <h2 className="text-xl font-semibold">Addresses</h2>
        </CardHeader>
        <CardFooter className="pt-6">
          <Button variant="outline">Add New Address</Button>
        </CardFooter>
      </Card>
    </div>
  );
}