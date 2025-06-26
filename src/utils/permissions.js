export const permissions = {
  admin: {
    canEditTask: () => true,
    canDeleteTask: () => true,
  },
  member: {
    canEditTask: (user, task) => task.assignedTo === user.email,
    canDeleteTask: () => false,
  },
//   viewer: {
//     canEditTask: () => false,
//     canDeleteTask: () => false,
//   },
  // Add more roles as needed
};


export const can = (action, user, task) => {
  const role = user?.role;
  const rolePermissions = permissions[role];
  
  if (!rolePermissions || typeof rolePermissions[action] !== 'function') {
    return false;
  }

  return rolePermissions[action](user, task);
};
