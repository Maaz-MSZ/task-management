import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivity } from '../features/activity/activitySlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ActivityFeed = () => {
  const dispatch = useDispatch();
  const { activity, loading } = useSelector((state) => state.activity);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5;

  useEffect(() => {
    const loadActivity = async () => {
      const result = await dispatch(fetchActivity({ page, limit }));
      if (result.payload?.data?.length < limit) {
        setHasMore(false);
      }
    };
    loadActivity();
  }, [dispatch, page]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm text-gray-700 max-h-32 overflow-y-auto">
          {activity.map((entry, index) => (
            <li key={`${entry.id}-${index}`}>
              {entry.message}{' '}
              <span className="text-xs text-gray-400">({entry.timestamp})</span>
            </li>
          ))}
        </ul>
        {hasMore && (
          <Button
            variant="link"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
            className="mt-2 text-blue-600 p-0 h-auto"
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
