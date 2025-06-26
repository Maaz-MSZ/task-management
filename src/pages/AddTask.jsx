import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { createTask } from '../features/tasks/taskSlice';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { fetchActivity } from '../features/activity/activitySlice';
import { toast } from "@/hooks/use-toast";

const AddTask = () => {
    const dispatch = useDispatch();
    const { register, handleSubmit, reset } = useForm();
    const [members, setMembers] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await axios.get("/users");
                setMembers(res.data.filter((u) => u.role === "member"));
            } catch (err) {
                console.error("Error fetching members", err);
            }
        };

        fetchMembers();
    }, []);

    const onSubmit = async (data) => {
        const file = data.attachment?.[0];
        let fileData = null;

        if (file) {
            const base64 = await convertToBase64(file);
            fileData = {
                name: file.name,
                type: file.type,
                content: base64,
            };
        }

        const payload = {
            title: data.title,
            description: data.description,
            status: data.status,
            assignedTo: data.assignedTo,
            attachment: fileData,
        };

        const result = await dispatch(createTask(payload));
        if (createTask.fulfilled.match(result)) {
            toast({
                title: '✅ Task Added successfully',
                duration: 2000,
            });
            reset();
            await dispatch(fetchActivity({ page: 1, limit: 5 }));
            navigate('/dashboard');
        }
    };

    const convertToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
        });

    return (
        <div className="p-6 max-w-xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Task</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" {...register('title')} required />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" {...register('description')} required />
                        </div>

                        <div>
                            <Label htmlFor="assignedTo">Assign To</Label>
                            <select
                                id="assignedTo"
                                {...register('assignedTo')}
                                required
                                className="w-full border border-input rounded-md p-2 bg-white"
                            >
                                <option value="">Select Member</option>
                                {members.map((member) => (
                                    <option key={member.id} value={member.email}>
                                        {member.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                {...register('status')}
                                required
                                className="w-full border border-input rounded-md p-2 bg-white"
                            >
                                <option value="">Select Progress</option>
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>

                        <div>
                            <Label htmlFor="attachment">Attachment (optional)</Label>
                            <Input type="file" id="attachment" {...register('attachment')} />
                        </div>

                        <Button type="submit" className="w-full">
                            Create Task
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddTask;
