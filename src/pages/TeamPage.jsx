import React, { useEffect, useState } from 'react';
import axios from '../api/axios'; 
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

const PAGE_LIMIT = 5;

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

const TeamPage = () => {
  const { register, handleSubmit, reset } = useForm();
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`/users?_page=${page}&_limit=${PAGE_LIMIT}`, getAuthHeaders());
      setUsers(res.data);
      setHasNextPage(res.data.length === PAGE_LIMIT);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const onAddUser = async (data) => {
    try {
      await axios.post(`/register`, data);
      reset();
      setPage(1); // reset to first page to show new member
      fetchUsers();
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  const onDeleteUser = async (id) => {
    try {
      await axios.delete(`/users/${id}`, getAuthHeaders());
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Member</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onAddUser)} className="grid gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...register('email')} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password')} required />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                {...register('role')}
                required
                className="w-full p-2 border border-input rounded-md"
              >
                <option value="">Select role</option>
                <option value="member">Member</option>
              </select>
            </div>
            <Button type="submit" className="w-full mt-2">
              Add Member
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell className="text-center">
                    {u.email !== user.email && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeleteUser(u.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-center gap-3 items-center">
            <Button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
              Previous
            </Button>
            <span className="text-sm font-medium">Page {page}</span>
            <Button onClick={() => setPage((p) => p + 1)} disabled={!hasNextPage}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamPage;
