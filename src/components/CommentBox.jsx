import React from 'react';
import axios from '../api/axios'; 
import TiptapEditor from '@/components/TiptapEditor';
import { Button } from '@/components/ui/button';

const CommentBox = ({ taskId, userId, userEmail, userRole, onCommentAdded, assignedTo }) => {
  const handleSubmit = async (content) => {
    await axios.post(`/comments`, {
      taskId,
      userId,
      userEmail,
      content,
      createdAt: new Date().toISOString()
    });
    onCommentAdded?.();
  };

  if (assignedTo !== userEmail && userRole !== 'admin') {
    return <p className="text-sm text-gray-500 italic">Only assigned member or admin can comment.</p>;
  }

  return (
    <div className="my-4">
      <TiptapEditor onSubmit={handleSubmit} />
    </div>
  );
};

export default CommentBox;
