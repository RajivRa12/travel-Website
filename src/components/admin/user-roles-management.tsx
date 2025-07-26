"use client";

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Shield,
  Users,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Plus,
  Eye,
  Lock,
  Unlock,
  Settings,
  Crown,
  Star,
  Activity,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

// Enhanced role and permission types
interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'user_management' | 'content_management' | 'financial' | 'analytics' | 'system';
  level: 'read' | 'write' | 'admin';
}

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  permissions: string[];
  userCount: number;
  isActive: boolean;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'suspended' | 'pending';
  lastActive: string;
  createdAt: string;
}

const UserRolesManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock data - in production, this would come from Supabase
  const mockPermissions: Permission[] = [
    // User Management
    { id: 'user_view', name: 'View Users', description: 'View user profiles and information', category: 'user_management', level: 'read' },
    { id: 'user_create', name: 'Create Users', description: 'Create new user accounts', category: 'user_management', level: 'write' },
    { id: 'user_edit', name: 'Edit Users', description: 'Modify user profiles and settings', category: 'user_management', level: 'write' },
    { id: 'user_delete', name: 'Delete Users', description: 'Delete user accounts', category: 'user_management', level: 'admin' },
    { id: 'role_manage', name: 'Manage Roles', description: 'Create and modify user roles', category: 'user_management', level: 'admin' },
    
    // Content Management
    { id: 'package_view', name: 'View Packages', description: 'View travel packages', category: 'content_management', level: 'read' },
    { id: 'package_create', name: 'Create Packages', description: 'Create new travel packages', category: 'content_management', level: 'write' },
    { id: 'package_approve', name: 'Approve Packages', description: 'Approve/reject package submissions', category: 'content_management', level: 'admin' },
    { id: 'agent_approve', name: 'Approve Agents', description: 'Approve/reject agent applications', category: 'content_management', level: 'admin' },
    
    // Financial
    { id: 'booking_view', name: 'View Bookings', description: 'View booking information', category: 'financial', level: 'read' },
    { id: 'payout_manage', name: 'Manage Payouts', description: 'Process agent payouts', category: 'financial', level: 'write' },
    { id: 'financial_reports', name: 'Financial Reports', description: 'Access financial reports and analytics', category: 'financial', level: 'admin' },
    
    // Analytics
    { id: 'analytics_view', name: 'View Analytics', description: 'Access basic analytics dashboards', category: 'analytics', level: 'read' },
    { id: 'analytics_advanced', name: 'Advanced Analytics', description: 'Access detailed analytics and insights', category: 'analytics', level: 'admin' },
    
    // System
    { id: 'system_settings', name: 'System Settings', description: 'Modify system configuration', category: 'system', level: 'admin' },
    { id: 'audit_logs', name: 'Audit Logs', description: 'View system audit logs', category: 'system', level: 'admin' },
  ];

  const mockRoles: Role[] = [
    {
      id: 'super_admin',
      name: 'Super Administrator',
      description: 'Full system access with all permissions',
      color: 'bg-red-100 text-red-800',
      icon: 'Crown',
      permissions: mockPermissions.map(p => p.id),
      userCount: 2,
      isActive: true,
      isSystem: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Administrative access with most permissions',
      color: 'bg-purple-100 text-purple-800',
      icon: 'Shield',
      permissions: mockPermissions.filter(p => p.level !== 'admin' || p.category !== 'system').map(p => p.id),
      userCount: 5,
      isActive: true,
      isSystem: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: 'content_manager',
      name: 'Content Manager',
      description: 'Manages packages and agent approvals',
      color: 'bg-blue-100 text-blue-800',
      icon: 'UserCheck',
      permissions: mockPermissions.filter(p => 
        p.category === 'content_management' || 
        (p.category === 'user_management' && p.level === 'read') ||
        (p.category === 'analytics' && p.level === 'read')
      ).map(p => p.id),
      userCount: 8,
      isActive: true,
      isSystem: false,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
    },
    {
      id: 'financial_manager',
      name: 'Financial Manager',
      description: 'Handles payments and financial operations',
      color: 'bg-green-100 text-green-800',
      icon: 'Star',
      permissions: mockPermissions.filter(p => 
        p.category === 'financial' ||
        (p.category === 'analytics' && p.id === 'analytics_view') ||
        (p.category === 'user_management' && p.level === 'read')
      ).map(p => p.id),
      userCount: 3,
      isActive: true,
      isSystem: false,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-25',
    },
    {
      id: 'support_agent',
      name: 'Support Agent',
      description: 'Customer support with limited access',
      color: 'bg-yellow-100 text-yellow-800',
      icon: 'Users',
      permissions: mockPermissions.filter(p => 
        p.level === 'read' && (p.category === 'user_management' || p.category === 'content_management')
      ).map(p => p.id),
      userCount: 12,
      isActive: true,
      isSystem: false,
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20',
    },
  ];

  const mockUsers: UserWithRole[] = [
    {
      id: '1',
      name: 'Super Admin',
      email: 'admin@roam.com',
      role: mockRoles[0],
      status: 'active',
      lastActive: '2024-01-26T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'John Manager',
      email: 'john@roam.com',
      role: mockRoles[1],
      status: 'active',
      lastActive: '2024-01-26T08:15:00Z',
      createdAt: '2024-01-05T00:00:00Z',
    },
    {
      id: '3',
      name: 'Sarah Content',
      email: 'sarah@roam.com',
      role: mockRoles[2],
      status: 'active',
      lastActive: '2024-01-25T16:45:00Z',
      createdAt: '2024-01-15T00:00:00Z',
    },
    {
      id: '4',
      name: 'Mike Finance',
      email: 'mike@roam.com',
      role: mockRoles[3],
      status: 'active',
      lastActive: '2024-01-26T09:00:00Z',
      createdAt: '2024-01-10T00:00:00Z',
    },
    {
      id: '5',
      name: 'Lisa Support',
      email: 'lisa@roam.com',
      role: mockRoles[4],
      status: 'suspended',
      lastActive: '2024-01-20T14:30:00Z',
      createdAt: '2024-01-20T00:00:00Z',
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // In production, fetch from Supabase
      setPermissions(mockPermissions);
      setRoles(mockRoles);
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch roles and permissions data',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRole = async (roleData: Partial<Role>) => {
    try {
      // In production, save to Supabase
      const newRole: Role = {
        id: `role_${Date.now()}`,
        name: roleData.name || '',
        description: roleData.description || '',
        color: roleData.color || 'bg-gray-100 text-gray-800',
        icon: roleData.icon || 'Users',
        permissions: roleData.permissions || [],
        userCount: 0,
        isActive: true,
        isSystem: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setRoles(prev => [...prev, newRole]);
      setIsRoleDialogOpen(false);
      
      toast({
        title: 'Role Created',
        description: `Role "${newRole.name}" has been created successfully`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create role',
      });
    }
  };

  const handleUpdateUserRole = async (userId: string, newRoleId: string) => {
    try {
      const newRole = roles.find(r => r.id === newRoleId);
      if (!newRole) return;

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: 'Role Updated',
        description: 'User role has been updated successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update user role',
      });
    }
  };

  const getPermissionsByCategory = (category: string) => {
    return permissions.filter(p => p.category === category);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'user_management': return Users;
      case 'content_management': return UserCheck;
      case 'financial': return Star;
      case 'analytics': return Activity;
      case 'system': return Settings;
      default: return Shield;
    }
  };

  const getRoleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Crown': return Crown;
      case 'Shield': return Shield;
      case 'UserCheck': return UserCheck;
      case 'Star': return Star;
      case 'Users': return Users;
      default: return Shield;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Roles & Permissions</h2>
          <p className="text-gray-600">Manage user roles and access permissions</p>
        </div>
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a new role with specific permissions
              </DialogDescription>
            </DialogHeader>
            <RoleFormContent 
              permissions={permissions}
              onSubmit={handleCreateRole}
              onCancel={() => setIsRoleDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => {
              const IconComponent = getRoleIcon(role.icon);
              return (
                <Card key={role.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5" />
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                      </div>
                      <Badge className={role.color}>{role.userCount} users</Badge>
                    </div>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Permissions ({role.permissions.length})</p>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map((permId) => {
                            const perm = permissions.find(p => p.id === permId);
                            return perm ? (
                              <Badge key={permId} variant="outline" className="text-xs">
                                {perm.name}
                              </Badge>
                            ) : null;
                          })}
                          {role.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {role.isActive ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          )}
                          <span className="text-sm text-gray-600">
                            {role.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        {role.isSystem && (
                          <Badge variant="secondary" className="text-xs">System</Badge>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {!role.isSystem && (
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage user accounts and role assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const IconComponent = getRoleIcon(user.role.icon);
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <Badge className={user.role.color}>{user.role.name}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {new Date(user.lastActive).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Select
                              value={user.role.id}
                              onValueChange={(newRoleId) => handleUpdateUserRole(user.id, newRoleId)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {roles.map((role) => (
                                  <SelectItem key={role.id} value={role.id}>
                                    {role.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <div className="space-y-6">
            {['user_management', 'content_management', 'financial', 'analytics', 'system'].map((category) => {
              const IconComponent = getCategoryIcon(category);
              const categoryPermissions = getPermissionsByCategory(category);
              
              return (
                <Card key={category}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" />
                      <CardTitle className="capitalize">
                        {category.replace('_', ' ')} Permissions
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryPermissions.map((permission) => (
                        <div key={permission.id} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{permission.name}</h4>
                            <Badge 
                              variant={permission.level === 'admin' ? 'destructive' : 
                                       permission.level === 'write' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {permission.level}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{permission.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Role form component
const RoleFormContent: React.FC<{
  permissions: Permission[];
  onSubmit: (data: Partial<Role>) => void;
  onCancel: () => void;
}> = ({ permissions, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'bg-blue-100 text-blue-800',
    icon: 'Users',
    permissions: [] as string[],
  });

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Role Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="color">Badge Color</Label>
          <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bg-blue-100 text-blue-800">Blue</SelectItem>
              <SelectItem value="bg-green-100 text-green-800">Green</SelectItem>
              <SelectItem value="bg-purple-100 text-purple-800">Purple</SelectItem>
              <SelectItem value="bg-orange-100 text-orange-800">Orange</SelectItem>
              <SelectItem value="bg-red-100 text-red-800">Red</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div>
        <Label>Permissions</Label>
        <div className="mt-2 space-y-4 max-h-60 overflow-y-auto">
          {['user_management', 'content_management', 'financial', 'analytics', 'system'].map((category) => {
            const categoryPermissions = permissions.filter(p => p.category === category);
            return (
              <div key={category} className="space-y-2">
                <h4 className="font-medium capitalize">{category.replace('_', ' ')}</h4>
                <div className="space-y-2 pl-4">
                  {categoryPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission.id}
                        checked={formData.permissions.includes(permission.id)}
                        onCheckedChange={() => handlePermissionToggle(permission.id)}
                      />
                      <Label htmlFor={permission.id} className="text-sm font-normal">
                        {permission.name}
                      </Label>
                      <Badge 
                        variant={permission.level === 'admin' ? 'destructive' : 
                                 permission.level === 'write' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {permission.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Role</Button>
      </DialogFooter>
    </form>
  );
};

export default UserRolesManagement;
