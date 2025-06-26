import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from '../api/axios'; 
import { toast } from "@/hooks/use-toast";

const ProfileSettings = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.patch(
        `/users/${user.id}`,
        {
          ...(name && { name }),
          ...(password && { password }),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.setItem('user', JSON.stringify(res.data));
      toast({ title: "✅ Profile updated successfully!",  duration: 2000 });
    } catch (err) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="max-w-md mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
        </CardHeader>
        <form onSubmit={handleUpdate}>
          <CardContent className="space-y-4">
            <Input type="email" value={user?.email}  placeholder="email" disabled/>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ProfileSettings;
