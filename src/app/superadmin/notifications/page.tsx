"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Bell,
  Send,
  Eye,
  Edit,
  Trash2,
  Plus,
  Settings,
  Users,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";

// Mock email templates
const emailTemplates = [
  {
    id: 1,
    name: "DMC Welcome",
    subject: "Welcome to Roam Southeast - Your DMC Journey Begins!",
    type: "welcome",
    status: "active",
    lastModified: "2024-01-15",
    usage: 23,
    openRate: 85.2,
  },
  {
    id: 2,
    name: "Booking Confirmation",
    subject: "Your booking is confirmed - Get ready for an amazing trip!",
    type: "booking",
    status: "active",
    lastModified: "2024-01-12",
    usage: 156,
    openRate: 92.1,
  },
  {
    id: 3,
    name: "Payout Processed",
    subject: "Great news! Your payout has been processed",
    type: "payout",
    status: "active",
    lastModified: "2024-01-10",
    usage: 45,
    openRate: 88.7,
  },
  {
    id: 4,
    name: "Package Rejected",
    subject: "Package submission requires attention",
    type: "moderation",
    status: "draft",
    lastModified: "2024-01-08",
    usage: 12,
    openRate: 76.3,
  },
];

// Mock notification history
const notificationHistory = [
  {
    id: 1,
    type: "email",
    template: "Booking Confirmation",
    recipient: "customer@example.com",
    status: "delivered",
    sentAt: "2024-01-15 14:30",
    openedAt: "2024-01-15 14:35",
    subject: "Your Thailand adventure is confirmed!",
  },
  {
    id: 2,
    type: "push",
    template: "Payout Alert",
    recipient: "dmc@paradise.com",
    status: "delivered",
    sentAt: "2024-01-15 12:15",
    openedAt: null,
    subject: "New payout request requires action",
  },
  {
    id: 3,
    type: "email",
    template: "DMC Welcome",
    recipient: "newdmc@travel.com",
    status: "failed",
    sentAt: "2024-01-15 10:20",
    openedAt: null,
    subject: "Welcome to Roam Southeast platform",
  },
];

export default function SuperAdminNotificationsPage() {
  const { toast } = useToast();
  const [templates, setTemplates] = React.useState(emailTemplates);
  const [notifications, setNotifications] = React.useState(notificationHistory);
  const [selectedTemplate, setSelectedTemplate] = React.useState<any>(null);
  const [templateDialog, setTemplateDialog] = React.useState(false);
  const [broadcastDialog, setBroadcastDialog] = React.useState(false);
  const [emailSettings, setEmailSettings] = React.useState({
    provider: "resend",
    apiKey: "re_xxxxxxxxxxxxx",
    fromEmail: "noreply@roamsoutheast.com",
    fromName: "Roam Southeast",
    replyTo: "support@roamsoutheast.com",
  });

  const [newTemplate, setNewTemplate] = React.useState({
    name: "",
    subject: "",
    type: "general",
    content: "",
  });

  const [broadcastMessage, setBroadcastMessage] = React.useState({
    audience: "all",
    template: "",
    subject: "",
    content: "",
    scheduleType: "now",
  });

  const handleCreateTemplate = () => {
    const template = {
      id: templates.length + 1,
      ...newTemplate,
      status: "draft",
      lastModified: new Date().toISOString().split("T")[0],
      usage: 0,
      openRate: 0,
    };

    setTemplates((prev) => [...prev, template]);
    setNewTemplate({ name: "", subject: "", type: "general", content: "" });
    setTemplateDialog(false);

    toast({
      title: "Template Created",
      description: `Email template "${template.name}" has been created successfully.`,
    });
  };

  const handleSendBroadcast = () => {
    // Mock broadcast sending
    const newNotification = {
      id: notifications.length + 1,
      type: "email",
      template: broadcastMessage.template || "Custom Broadcast",
      recipient: `${broadcastMessage.audience} users`,
      status: "delivered",
      sentAt: new Date().toLocaleString(),
      openedAt: null,
      subject: broadcastMessage.subject,
    };

    setNotifications((prev) => [newNotification, ...prev]);
    setBroadcastMessage({
      audience: "all",
      template: "",
      subject: "",
      content: "",
      scheduleType: "now",
    });
    setBroadcastDialog(false);

    toast({
      title: "Broadcast Sent",
      description: `Message sent to ${broadcastMessage.audience} users successfully.`,
    });
  };

  const stats = {
    totalSent: notifications.length,
    delivered: notifications.filter((n) => n.status === "delivered").length,
    opened: notifications.filter((n) => n.openedAt).length,
    failed: notifications.filter((n) => n.status === "failed").length,
    openRate:
      (notifications.filter((n) => n.openedAt).length /
        notifications.filter((n) => n.status === "delivered").length) *
      100,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Notification Center
          </h1>
          <p className="text-gray-600">
            Manage email templates and platform notifications
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={() => setBroadcastDialog(true)}>
            <Send className="h-4 w-4 mr-2" />
            Send Broadcast
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold">{stats.totalSent}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.delivered}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Opened</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.opened}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.failed}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.openRate.toFixed(1)}%
                </p>
              </div>
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="history">Notification History</TabsTrigger>
          <TabsTrigger value="settings">Email Settings</TabsTrigger>
        </TabsList>

        {/* Email Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Email Templates</CardTitle>
                  <CardDescription>
                    Manage email templates for automated notifications
                  </CardDescription>
                </div>
                <Button onClick={() => setTemplateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-gray-500">
                            {template.subject}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {template.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            template.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            template.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {template.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{template.usage}</TableCell>
                      <TableCell>{template.openRate}%</TableCell>
                      <TableCell>
                        {new Date(template.lastModified).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>
                Track all sent notifications and their delivery status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead>Opened At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {notification.type === "email" ? (
                            <Mail className="h-4 w-4 mr-2 text-blue-600" />
                          ) : (
                            <Bell className="h-4 w-4 mr-2 text-green-600" />
                          )}
                          {notification.type}
                        </div>
                      </TableCell>
                      <TableCell>{notification.template}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {notification.recipient}
                      </TableCell>
                      <TableCell>{notification.subject}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            notification.status === "delivered"
                              ? "default"
                              : "destructive"
                          }
                          className={
                            notification.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {notification.status === "delivered" && (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          )}
                          {notification.status === "failed" && (
                            <AlertTriangle className="h-3 w-3 mr-1" />
                          )}
                          {notification.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{notification.sentAt}</TableCell>
                      <TableCell>
                        {notification.openedAt ? (
                          <span className="text-green-600">
                            {notification.openedAt}
                          </span>
                        ) : (
                          <span className="text-gray-400">Not opened</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Provider Settings</CardTitle>
              <CardDescription>
                Configure email service provider and SMTP settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Email Provider</Label>
                  <Select
                    value={emailSettings.provider}
                    onValueChange={(value) =>
                      setEmailSettings((prev) => ({ ...prev, provider: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resend">Resend</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="smtp">Custom SMTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    value={emailSettings.apiKey}
                    onChange={(e) =>
                      setEmailSettings((prev) => ({
                        ...prev,
                        apiKey: e.target.value,
                      }))
                    }
                    placeholder="Enter API key"
                  />
                </div>
                <div className="space-y-2">
                  <Label>From Email</Label>
                  <Input
                    value={emailSettings.fromEmail}
                    onChange={(e) =>
                      setEmailSettings((prev) => ({
                        ...prev,
                        fromEmail: e.target.value,
                      }))
                    }
                    placeholder="noreply@yourdomain.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>From Name</Label>
                  <Input
                    value={emailSettings.fromName}
                    onChange={(e) =>
                      setEmailSettings((prev) => ({
                        ...prev,
                        fromName: e.target.value,
                      }))
                    }
                    placeholder="Your Company Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reply To</Label>
                  <Input
                    value={emailSettings.replyTo}
                    onChange={(e) =>
                      setEmailSettings((prev) => ({
                        ...prev,
                        replyTo: e.target.value,
                      }))
                    }
                    placeholder="support@yourdomain.com"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <Button variant="outline">Test Configuration</Button>
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure automatic notification triggers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">DMC Registration</div>
                    <div className="text-sm text-gray-500">
                      Send welcome email to new DMCs
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Booking Confirmations</div>
                    <div className="text-sm text-gray-500">
                      Automatic booking confirmation emails
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Payout Notifications</div>
                    <div className="text-sm text-gray-500">
                      Notify DMCs about payout status
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Package Moderation</div>
                    <div className="text-sm text-gray-500">
                      Alert DMCs about package approval/rejection
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Template Dialog */}
      <Dialog open={templateDialog} onOpenChange={setTemplateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Email Template</DialogTitle>
            <DialogDescription>
              Design a new email template for automated notifications
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g., Welcome Email"
                />
              </div>
              <div className="space-y-2">
                <Label>Template Type</Label>
                <Select
                  value={newTemplate.type}
                  onValueChange={(value) =>
                    setNewTemplate((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome</SelectItem>
                    <SelectItem value="booking">Booking</SelectItem>
                    <SelectItem value="payout">Payout</SelectItem>
                    <SelectItem value="moderation">Moderation</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email Subject</Label>
              <Input
                value={newTemplate.subject}
                onChange={(e) =>
                  setNewTemplate((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
                placeholder="Enter email subject line"
              />
            </div>
            <div className="space-y-2">
              <Label>Email Content</Label>
              <Textarea
                value={newTemplate.content}
                onChange={(e) =>
                  setNewTemplate((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                placeholder="Enter email content with HTML support..."
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateTemplate}
              disabled={!newTemplate.name || !newTemplate.subject}
            >
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Broadcast Dialog */}
      <Dialog open={broadcastDialog} onOpenChange={setBroadcastDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Broadcast Message</DialogTitle>
            <DialogDescription>
              Send a message to specific user groups
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select
                  value={broadcastMessage.audience}
                  onValueChange={(value) =>
                    setBroadcastMessage((prev) => ({
                      ...prev,
                      audience: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="dmcs">DMCs Only</SelectItem>
                    <SelectItem value="customers">Customers Only</SelectItem>
                    <SelectItem value="active-dmcs">Active DMCs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Schedule</Label>
                <Select
                  value={broadcastMessage.scheduleType}
                  onValueChange={(value) =>
                    setBroadcastMessage((prev) => ({
                      ...prev,
                      scheduleType: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Send Now</SelectItem>
                    <SelectItem value="scheduled">Schedule Later</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={broadcastMessage.subject}
                onChange={(e) =>
                  setBroadcastMessage((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
                placeholder="Enter message subject"
              />
            </div>
            <div className="space-y-2">
              <Label>Message Content</Label>
              <Textarea
                value={broadcastMessage.content}
                onChange={(e) =>
                  setBroadcastMessage((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                placeholder="Enter your message..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBroadcastDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendBroadcast}
              disabled={!broadcastMessage.subject || !broadcastMessage.content}
            >
              {broadcastMessage.scheduleType === "now"
                ? "Send Now"
                : "Schedule Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
