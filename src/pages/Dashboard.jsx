import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTask, deleteTask } from '../features/tasks/taskSlice';
import { fetchActivity } from '../features/activity/activitySlice';
import { Link } from 'react-router-dom';
import ActivityFeed from '@/components/ActivityFeed';
import {
    Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import DeleteDialog from "@/components/DeleteDialog";
import { can } from '@/utils/permissions';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { tasks, loading, error } = useSelector((state) => state.tasks);
    const { user } = useSelector((state) => state.auth);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingData, setEditingData] = useState({});
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const limit = 5;

    useEffect(() => {
        const load = async () => {
            const res = await dispatch(fetchTasks({ page, limit }));
            if (res.payload?.length < limit) setHasNextPage(false);
            else setHasNextPage(true);
            dispatch(fetchActivity({ page: 1, limit: 5 }));
        };
        load();
    }, [dispatch, page]);

    // const isAdmin = user?.role === 'admin';

    const startEdit = (task) => {
        setEditingTaskId(task.id);
        setEditingData({
            title: task.title,
            description: task.description,
            status: task.status,
            assignedTo: task.assignedTo || '',
            attachment: task.attachment || null,
        });
    };

    const submitEdit = async () => {
        const result = await dispatch(updateTask({ id: editingTaskId, data: editingData }));

        if (updateTask.fulfilled.match(result)) {
            toast({
                title: '✅ Task updated successfully',
                duration: 2000,
            });
            await dispatch(fetchTasks({ page, limit }));
            await dispatch(fetchActivity({ page: 1, limit: 5 }));
            setEditingTaskId(null);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });

        setEditingData((prev) => ({
            ...prev,
            attachment: {
                name: file.name,
                type: file.type,
                content: base64,
            },
        }));
    };

    const deleteTaskData = async (id) => {
        const result = await dispatch(deleteTask(id));
        if (deleteTask.fulfilled.match(result)) {
            toast({
                title: '🗑️ Task deleted successfully',
                duration: 2000,
            });
            dispatch(fetchTasks({ page, limit }));
            dispatch(fetchActivity({ page: 1, limit: 5 }));
        }
    };

    return (
        <div className="p-6">
            <ActivityFeed />
            <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
            {loading && <p>Loading tasks...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="mt-6 border rounded-md overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead>Attachment</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => {
                            // const isOwner = task.assignedTo === user.email;
                            // const canEdit = isAdmin || isOwner;
                            // const canDelete = isAdmin;

                            const canEdit = can('canEditTask', user, task);
                            const canDelete = can('canDeleteTask', user, task);   

                            return (
                                <TableRow key={task.id}>
                                    {editingTaskId === task.id ? (
                                        canEdit ? (
                                            <>
                                                <TableCell>
                                                    <Input value={editingData.title} onChange={(e) => setEditingData({ ...editingData, title: e.target.value })} />
                                                </TableCell>
                                                <TableCell>
                                                    <Textarea value={editingData.description} onChange={(e) => setEditingData({ ...editingData, description: e.target.value })} />
                                                </TableCell>
                                                <TableCell>
                                                    <Select value={editingData.status} onValueChange={(val) => setEditingData({ ...editingData, status: val })}>
                                                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="todo">To Do</SelectItem>
                                                            <SelectItem value="in-progress">In Progress</SelectItem>
                                                            <SelectItem value="done">Done</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <Input value={editingData.assignedTo} onChange={(e) => setEditingData({ ...editingData, assignedTo: e.target.value })} />
                                                </TableCell>
                                                <TableCell>
                                                    <Input type="file" onChange={handleFileChange} />
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button onClick={submitEdit} size="sm">Save</Button>
                                                    <Button variant="ghost" size="sm" onClick={() => setEditingTaskId(null)}>Cancel</Button>
                                                </TableCell>
                                            </>
                                        ) : (
                                            <TableCell colSpan={6} className="italic text-sm text-gray-400">
                                                You cannot edit this task
                                            </TableCell>
                                        )
                                    ) : (
                                        <>
                                            <TableCell>{task.title}</TableCell>
                                            <TableCell>{task.description}</TableCell>
                                            <TableCell>{task.status}</TableCell>
                                            <TableCell>{task.assignedTo || 'Unassigned'}</TableCell>
                                            <TableCell>
                                                {task.attachment && (
                                                    <a
                                                        href={task.attachment.content}
                                                        download={task.attachment.name}
                                                        className="text-blue-600 text-sm underline"
                                                    >
                                                        📎 {task.attachment.name}
                                                    </a>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                                                    <Link to={`/task/${task.id}`} className="text-blue-500 underline text-sm">
                                                        View
                                                    </Link>
                                                    <Button
                                                        onClick={() => startEdit(task)}
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={!canEdit}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <DeleteDialog
                                                        open={deleteDialogOpen}
                                                        setOpen={setDeleteDialogOpen}
                                                        onConfirm={() => deleteTaskData(confirmDeleteId)}
                                                        trigger={
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                disabled={!canDelete}
                                                                onClick={() => {
                                                                    setConfirmDeleteId(task.id);
                                                                    setDeleteDialogOpen(true);
                                                                }}
                                                            >
                                                                Delete
                                                            </Button>
                                                        }
                                                    />
                                                </div>
                                            </TableCell>

                                        </>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-4 flex justify-center gap-3 items-center">
                {/* Math.max(p - 1, 1) ensures the value never goes below 1*/}
                <Button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}> 
                    Previous
                </Button>
                <span className="text-sm font-medium">Page {page}</span>
                <Button onClick={() => setPage((p) => p + 1)} disabled={!hasNextPage}>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Dashboard;
