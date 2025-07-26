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
  Image,
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Globe,
  Layout,
  Settings,
  Calendar,
  Users,
  BarChart3,
} from "lucide-react";

// Mock banner data
const banners = [
  {
    id: 1,
    title: "Summer Sale 2024",
    description: "Get 25% off on all Thailand packages",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop",
    ctaText: "Book Now",
    ctaUrl: "/packages?destination=thailand",
    position: "hero",
    isActive: true,
    startDate: "2024-01-15",
    endDate: "2024-03-31",
    priority: 1,
    clicks: 1250,
    impressions: 15600,
  },
  {
    id: 2,
    title: "New Destination: Vietnam",
    description: "Discover the beauty of Vietnam with our curated packages",
    imageUrl:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2f?w=800&h=300&fit=crop",
    ctaText: "Explore",
    ctaUrl: "/packages?destination=vietnam",
    position: "secondary",
    isActive: true,
    startDate: "2024-01-10",
    endDate: "2024-12-31",
    priority: 2,
    clicks: 890,
    impressions: 12400,
  },
  {
    id: 3,
    title: "DMC Partner Program",
    description: "Join our network of trusted travel partners",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=300&fit=crop",
    ctaText: "Join Now",
        ctaUrl: "/?register=agent",
    position: "sidebar",
    isActive: false,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    priority: 3,
    clicks: 345,
    impressions: 5200,
  },
];

// Mock static pages data
const staticPages = [
  {
    id: 1,
    title: "About Us",
    slug: "about",
    status: "published",
    lastModified: "2024-01-15",
    author: "Admin",
    views: 2340,
  },
  {
    id: 2,
    title: "Terms & Conditions",
    slug: "terms",
    status: "published",
    lastModified: "2024-01-12",
    author: "Legal Team",
    views: 1580,
  },
  {
    id: 3,
    title: "Privacy Policy",
    slug: "privacy",
    status: "published",
    lastModified: "2024-01-12",
    author: "Legal Team",
    views: 1420,
  },
  {
    id: 4,
    title: "How It Works",
    slug: "how-it-works",
    status: "draft",
    lastModified: "2024-01-10",
    author: "Content Team",
    views: 0,
  },
  {
    id: 5,
    title: "DMC Guidelines",
    slug: "dmc-guidelines",
    status: "published",
    lastModified: "2024-01-08",
    author: "Operations",
    views: 890,
  },
];

export default function SuperAdminContentPage() {
  const { toast } = useToast();
  const [bannerList, setBannerList] = React.useState(banners);
  const [pageList, setPageList] = React.useState(staticPages);
  const [selectedBanner, setSelectedBanner] = React.useState<any>(null);
  const [selectedPage, setSelectedPage] = React.useState<any>(null);
  const [bannerDialog, setBannerDialog] = React.useState(false);
  const [pageDialog, setPageDialog] = React.useState(false);

  const [newBanner, setNewBanner] = React.useState({
    title: "",
    description: "",
    imageUrl: "",
    ctaText: "",
    ctaUrl: "",
    position: "hero",
    startDate: "",
    endDate: "",
    priority: 1,
  });

  const [newPage, setNewPage] = React.useState({
    title: "",
    slug: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    status: "draft",
  });

  const handleCreateBanner = () => {
    const banner = {
      id: bannerList.length + 1,
      ...newBanner,
      isActive: true,
      clicks: 0,
      impressions: 0,
    };

    setBannerList((prev) => [...prev, banner]);
    setNewBanner({
      title: "",
      description: "",
      imageUrl: "",
      ctaText: "",
      ctaUrl: "",
      position: "hero",
      startDate: "",
      endDate: "",
      priority: 1,
    });
    setBannerDialog(false);

    toast({
      title: "Banner Created",
      description: `Banner "${banner.title}" has been created successfully.`,
    });
  };

  const handleCreatePage = () => {
    const page = {
      id: pageList.length + 1,
      ...newPage,
      lastModified: new Date().toISOString().split("T")[0],
      author: "Admin",
      views: 0,
    };

    setPageList((prev) => [...prev, page]);
    setNewPage({
      title: "",
      slug: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      status: "draft",
    });
    setPageDialog(false);

    toast({
      title: "Page Created",
      description: `Page "${page.title}" has been created successfully.`,
    });
  };

  const toggleBannerStatus = (bannerId: number) => {
    setBannerList((prev) =>
      prev.map((banner) =>
        banner.id === bannerId
          ? { ...banner, isActive: !banner.isActive }
          : banner,
      ),
    );

    const banner = bannerList.find((b) => b.id === bannerId);
    toast({
      title: "Banner Updated",
      description: `Banner "${banner?.title}" has been ${banner?.isActive ? "deactivated" : "activated"}.`,
    });
  };

  const togglePageStatus = (pageId: number) => {
    setPageList((prev) =>
      prev.map((page) =>
        page.id === pageId
          ? {
              ...page,
              status: page.status === "published" ? "draft" : "published",
            }
          : page,
      ),
    );

    const page = pageList.find((p) => p.id === pageId);
    toast({
      title: "Page Updated",
      description: `Page "${page?.title}" has been ${page?.status === "published" ? "unpublished" : "published"}.`,
    });
  };

  const bannerStats = {
    total: bannerList.length,
    active: bannerList.filter((b) => b.isActive).length,
    totalClicks: bannerList.reduce((sum, b) => sum + b.clicks, 0),
    totalImpressions: bannerList.reduce((sum, b) => sum + b.impressions, 0),
    avgCTR:
      bannerList.reduce((sum, b) => sum + (b.clicks / b.impressions) * 100, 0) /
        bannerList.length || 0,
  };

  const pageStats = {
    total: pageList.length,
    published: pageList.filter((p) => p.status === "published").length,
    draft: pageList.filter((p) => p.status === "draft").length,
    totalViews: pageList.reduce((sum, p) => sum + p.views, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Content Management
          </h1>
          <p className="text-gray-600">
            Manage banners, static pages, and website content
          </p>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="banners" className="space-y-6">
        <TabsList>
          <TabsTrigger value="banners">Banners & Promotions</TabsTrigger>
          <TabsTrigger value="pages">Static Pages</TabsTrigger>
          <TabsTrigger value="settings">Content Settings</TabsTrigger>
        </TabsList>

        {/* Banners Tab */}
        <TabsContent value="banners" className="space-y-6">
          {/* Banner Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Banners
                    </p>
                    <p className="text-2xl font-bold">{bannerStats.total}</p>
                  </div>
                  <Layout className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600">
                      {bannerStats.active}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Clicks
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {bannerStats.totalClicks.toLocaleString()}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Impressions
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {bannerStats.totalImpressions.toLocaleString()}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg CTR</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {bannerStats.avgCTR.toFixed(1)}%
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Banners Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Website Banners</CardTitle>
                  <CardDescription>
                    Manage promotional banners and call-to-action sections
                  </CardDescription>
                </div>
                <Button onClick={() => setBannerDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Banner
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Banner Preview</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bannerList.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="w-20 h-12 object-cover rounded"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{banner.title}</div>
                          <div className="text-sm text-gray-500">
                            {banner.description}
                          </div>
                          <div className="text-sm text-blue-600">
                            {banner.ctaText} → {banner.ctaUrl}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {banner.position}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          Priority: {banner.priority}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">{banner.clicks}</span>
                            <span className="text-gray-500 ml-1">clicks</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">
                              {banner.impressions}
                            </span>
                            <span className="text-gray-500 ml-1">views</span>
                          </div>
                          <div className="text-xs text-green-600">
                            {(
                              (banner.clicks / banner.impressions) * 100 || 0
                            ).toFixed(1)}
                            % CTR
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            Start:{" "}
                            {new Date(banner.startDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm">
                            End: {new Date(banner.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={banner.isActive}
                            onCheckedChange={() =>
                              toggleBannerStatus(banner.id)
                            }
                          />
                          <Badge
                            variant={banner.isActive ? "default" : "secondary"}
                            className={
                              banner.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {banner.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
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

        {/* Static Pages Tab */}
        <TabsContent value="pages" className="space-y-6">
          {/* Page Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Pages
                    </p>
                    <p className="text-2xl font-bold">{pageStats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Published
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {pageStats.published}
                    </p>
                  </div>
                  <Globe className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Draft</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {pageStats.draft}
                    </p>
                  </div>
                  <Edit className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Views
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {pageStats.totalViews.toLocaleString()}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pages Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Static Pages</CardTitle>
                  <CardDescription>
                    Manage website pages like About, Terms, Privacy Policy
                  </CardDescription>
                </div>
                <Button onClick={() => setPageDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Page
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page Title</TableHead>
                    <TableHead>URL Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageList.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <div className="font-medium">{page.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm text-blue-600">
                          /{page.slug}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={page.status === "published"}
                            onCheckedChange={() => togglePageStatus(page.id)}
                          />
                          <Badge
                            variant={
                              page.status === "published"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              page.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {page.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1 text-gray-400" />
                          {page.views.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>{page.author}</TableCell>
                      <TableCell>
                        {new Date(page.lastModified).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
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

        {/* Content Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Settings</CardTitle>
              <CardDescription>
                Configure content management preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      Auto-publish approved content
                    </div>
                    <div className="text-sm text-gray-500">
                      Automatically publish content after admin approval
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Enable content analytics</div>
                    <div className="text-sm text-gray-500">
                      Track page views and engagement metrics
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">SEO optimization</div>
                    <div className="text-sm text-gray-500">
                      Enable automatic meta tags and schema markup
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Banner Dialog */}
      <Dialog open={bannerDialog} onOpenChange={setBannerDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Banner</DialogTitle>
            <DialogDescription>
              Design a promotional banner for the website
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Banner Title</Label>
                <Input
                  value={newBanner.title}
                  onChange={(e) =>
                    setNewBanner((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g., Summer Sale 2024"
                />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Select
                  value={newBanner.position}
                  onValueChange={(value) =>
                    setNewBanner((prev) => ({ ...prev, position: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero Section</SelectItem>
                    <SelectItem value="secondary">Secondary Banner</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                    <SelectItem value="footer">Footer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={newBanner.description}
                onChange={(e) =>
                  setNewBanner((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Brief description of the promotion"
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={newBanner.imageUrl}
                onChange={(e) =>
                  setNewBanner((prev) => ({
                    ...prev,
                    imageUrl: e.target.value,
                  }))
                }
                placeholder="https://example.com/banner-image.jpg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CTA Text</Label>
                <Input
                  value={newBanner.ctaText}
                  onChange={(e) =>
                    setNewBanner((prev) => ({
                      ...prev,
                      ctaText: e.target.value,
                    }))
                  }
                  placeholder="e.g., Book Now"
                />
              </div>
              <div className="space-y-2">
                <Label>CTA URL</Label>
                <Input
                  value={newBanner.ctaUrl}
                  onChange={(e) =>
                    setNewBanner((prev) => ({
                      ...prev,
                      ctaUrl: e.target.value,
                    }))
                  }
                  placeholder="/packages?destination=thailand"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={newBanner.startDate}
                  onChange={(e) =>
                    setNewBanner((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={newBanner.endDate}
                  onChange={(e) =>
                    setNewBanner((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBannerDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateBanner}
              disabled={!newBanner.title || !newBanner.imageUrl}
            >
              Create Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Page Dialog */}
      <Dialog open={pageDialog} onOpenChange={setPageDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
            <DialogDescription>
              Create a new static page for the website
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input
                  value={newPage.title}
                  onChange={(e) =>
                    setNewPage((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g., About Us"
                />
              </div>
              <div className="space-y-2">
                <Label>URL Slug</Label>
                <Input
                  value={newPage.slug}
                  onChange={(e) =>
                    setNewPage((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="about-us"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Meta Title</Label>
              <Input
                value={newPage.metaTitle}
                onChange={(e) =>
                  setNewPage((prev) => ({ ...prev, metaTitle: e.target.value }))
                }
                placeholder="SEO meta title"
              />
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea
                value={newPage.metaDescription}
                onChange={(e) =>
                  setNewPage((prev) => ({
                    ...prev,
                    metaDescription: e.target.value,
                  }))
                }
                placeholder="SEO meta description"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Page Content</Label>
              <Textarea
                value={newPage.content}
                onChange={(e) =>
                  setNewPage((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Enter page content with HTML support..."
                rows={8}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={newPage.status}
                onValueChange={(value) =>
                  setNewPage((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPageDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreatePage}
              disabled={!newPage.title || !newPage.slug}
            >
              Create Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
