import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios'; 
import CommentBox from '@/components/CommentBox';


const TaskDetails = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 3;

    const user = JSON.parse(localStorage.getItem('user')) || {};

    const fetchTask = async () => {
        const res = await axios.get(`/tasks/${id}`);
        setTask(res.data);
    };

    const fetchComments = async (currentPage = 1) => {
        const res = await axios.get(`/comments?taskId=${id}&_page=${currentPage}&_limit=${limit}`);
        const newComments = res.data;

        if (currentPage === 1) {
            setComments(newComments);
        } else {
            setComments((prev) => [...prev, ...newComments]);
        }

        if (newComments.length < limit) {
            setHasMore(false);
        }
    };

    useEffect(() => {
        fetchTask();
        fetchComments(1); // initial load
    }, [id]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchComments(nextPage);
    };

    if (!task) return <p>Loading...</p>;

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold">{task.title}</h2>
            <p className="text-gray-700">{task.description}</p>
            <p className="text-sm text-muted-foreground">Status: {task.status}</p>
            <p className="text-sm text-muted-foreground">Assigned To: {task.assignedTo}</p>
            <p className="text-sm text-muted-foreground">
                File Attached:{' '}
                {task.attachment && (
                    <a
                        href={task.attachment.content}
                        download={task.attachment.name}
                        className="text-sm text-blue-500 underline"
                    >
                        {task.attachment.name} 📎
                    </a>
                )}
            </p>

            <h3 className="text-xl font-semibold mt-6">Comments</h3>

            <CommentBox
                taskId={task.id}
                userId={user.id}
                userEmail={user.email}
                userRole={user.role}
                assignedTo={task.assignedTo}
                onCommentAdded={() => {
                    setPage(1);
                    setHasMore(true);
                    fetchComments(1);
                }}
            />

            <div className="border rounded bg-white max-h-80 overflow-y-auto space-y-3 p-3">
                {comments.map((c) => (
                    <div key={c.id} className="border p-3 rounded bg-gray-50">
                        <div dangerouslySetInnerHTML={{ __html: c.content }} className="prose prose-sm max-w-none" /> {/*__html-Content (as HTML). dangerouslySetInnerHTML-This is used to safely render HTML content  */}
                        <p className="text-xs text-muted-foreground mt-1">
                            {c.userEmail} • {new Date(c.createdAt).toLocaleString()}
                        </p>
                    </div>
                ))}
                {hasMore && (
                    <button
                        onClick={handleLoadMore}
                        className="text-blue-600 text-sm underline mt-2 disabled:opacity-50"
                    >
                        Load More
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskDetails;
