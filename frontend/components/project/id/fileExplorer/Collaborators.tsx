// Collaborators.tsx
import React, { useEffect, useMemo } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import Avatar from '@/components/main/Avatar';
import { shallowEqual } from 'react-redux';
import { FileNode } from '@/types';

type User = { userId: string; fullName: string; avatar?: string };
type Props = { projectId: string; fileId: string; setBg?: (prev: boolean) => void; child?: FileNode[] };

const Collaborators: React.FC<Props> = ({ projectId, fileId, setBg, child }) => {
  // Select collaborators for the project
  const collaboratorsMap = useAppSelector(
    state => state.collabCodeUser.projects?.[projectId] ?? {},
    shallowEqual
  );

  // Helper: get users from file tree nodes
  const childUsers: User[] = useMemo(() => {
    if (!child) return [];
    const users: User[] = [];
    const traverse = (nodes: FileNode[]) => {
      nodes.forEach(node => {
        if (collaboratorsMap[node.id]) users.push(...collaboratorsMap[node.id]);
        if (node.children) traverse(node.children);
      });
    };
    traverse(child);
    return users;
  }, [child, collaboratorsMap]);

  // Determine users to show
  const usersToShow = collaboratorsMap[fileId] ? collaboratorsMap[fileId] : childUsers ?? [];

  // Update background
  useEffect(() => {
    if (setBg) setBg(usersToShow.length > 0);
  }, [usersToShow, setBg]);

  if (usersToShow.length === 0) return null;

  return (
    <div className="flex -space-x-1 items-center">
      {usersToShow.slice(0, 3).map(user => (
        <Avatar key={user.userId} fullName={user.fullName} avatar={user.avatar}  className="w-6 h-6" />
      ))}
      {usersToShow.length > 3 && (
        <div className="w-5 h-5 rounded-full bg-brand text-xs flex items-center justify-center text-white border border-bg-primary">
          +{usersToShow.length - 3}
        </div>
      )}
    </div>
  );
};

export default React.memo(Collaborators);
