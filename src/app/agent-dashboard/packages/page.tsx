"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Upload,
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  Camera,
  FileText,
  Save,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

// Mock data for existing packages
const mockPackages = [
  {
    id: 1,
    title: "Bangkok Pattaya Discovery",
    slug: "bangkok-pattaya-discovery",
    destination: "Thailand",
    status: "published",
    views: 245,
    bookings: 12,
    rating: 4.8,
    price: 25999,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    title: "Bali Cultural Heritage",
    slug: "bali-cultural-heritage",
    destination: "Indonesia",
    status: "draft",
    views: 89,
    bookings: 3,
    rating: 4.5,
    price: 32999,
    createdAt: "2024-01-20",
  },
];

export default function PackageManagementPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [packages, setPackages] = useState(mockPackages);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);

  // Mock limits (would come from user's subscription plan)
  const planLimits = {
    packages: 3,
    photos: 30,
    currentPackages: packages.length,
    currentPhotos: 15, // Mock current photo count
  };

  const canCreatePackage = planLimits.currentPackages < planLimits.packages;

  const handleCreatePackage = () => {
    if (!canCreatePackage) {
      alert(
        "You have reached your package limit. Please upgrade your plan to create more packages.",
      );
      return;
    }
    setIsCreating(true);
    setActiveTab("create");
  };

  const handleEditPackage = (pkg: any) => {
    setEditingPackage(pkg);
    setActiveTab("create");
  };

  const handleDeletePackage = (id: number) => {
    if (confirm("Are you sure you want to delete this package?")) {
      setPackages(packages.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
            Package Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Create and manage your travel packages
          </p>
        </div>
        <Button
          onClick={handleCreatePackage}
          disabled={!canCreatePackage}
          size="sm"
          className="text-xs sm:text-sm w-full sm:w-auto"
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
          <span className="sm:hidden">Create</span>
          <span className="hidden sm:inline">Create Package</span>
        </Button>
      </div>

      {/* Plan Limits Widget */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="font-medium text-blue-900">Plan Usage</h3>
                <p className="text-sm text-blue-700">
                  Packages: {planLimits.currentPackages}/{planLimits.packages} |
                  Photos: {planLimits.currentPhotos}/{planLimits.photos}
                </p>
              </div>
            </div>
            {!canCreatePackage && (
              <Button size="sm" variant="outline">
                Upgrade Plan
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Package List</TabsTrigger>
          <TabsTrigger value="create">
            {editingPackage ? "Edit Package" : "Create Package"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <PackageList
            packages={packages}
            onEdit={handleEditPackage}
            onDelete={handleDeletePackage}
          />
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <PackageForm
            package={editingPackage}
            onSave={(packageData: any) => {
              if (editingPackage) {
                // Update existing package
                setPackages(prev => prev.map(pkg =>
                  pkg.id === editingPackage.id ? { ...pkg, ...packageData } : pkg
                ));
              } else {
                // Create new package
                const newPackage = {
                  ...packageData,
                  id: Math.max(...packages.map(p => p.id), 0) + 1,
                  status: 'pending',
                  createdAt: new Date().toISOString().split('T')[0],
                  rating: 0,
                };
                setPackages(prev => [...prev, newPackage]);
              }
              setActiveTab("list");
              setIsCreating(false);
              setEditingPackage(null);
            }}
            onCancel={() => {
              setActiveTab("list");
              setIsCreating(false);
              setEditingPackage(null);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PackageList({ packages, onEdit, onDelete }: any) {
  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Your Packages</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Manage all your travel packages in one place
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        {/* Mobile landscape: card view */}
        <div className="block lg:hidden space-y-2 p-3">
          {packages.map((pkg: any) => (
            <Card key={pkg.id} className="p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{pkg.title}</h4>
                  <p className="text-xs text-gray-500 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {pkg.destination}
                  </p>
                </div>
                <Badge
                  variant={pkg.status === "published" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {pkg.status}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1 text-gray-400" />
                  {pkg.views}
                </div>
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1 text-gray-400" />
                  {pkg.bookings}
                </div>
                <div className="flex items-center">
                  <Star className="h-3 w-3 mr-1 text-yellow-400" />
                  {pkg.rating}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">
                  <span className="rupee-font">₹</span>
                  {pkg.price.toLocaleString()}
                </span>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(pkg)}
                    className="p-1"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(pkg.id)}
                    className="p-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop: table view */}
        <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Package</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg: any) => (
              <TableRow key={pkg.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{pkg.title}</div>
                    <div className="text-sm text-gray-500">{pkg.slug}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    {pkg.destination}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      pkg.status === "published" ? "default" : "secondary"
                    }
                  >
                    {pkg.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1 text-gray-400" />
                    {pkg.views}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-400" />
                    {pkg.bookings}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-400" />
                    {pkg.rating}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="rupee-font">₹</span>
                  {pkg.price.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(pkg)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(pkg.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function PackageForm({ package: pkg, onSave, onCancel }: any) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: pkg?.title || "",
    slug: pkg?.slug || "",
    destination: pkg?.destination || "",
    startCity: pkg?.startCity || "",
    minTravelers: pkg?.minTravelers || 2,
    maxTravelers: pkg?.maxTravelers || 8,
    duration: pkg?.duration || 5,
    highlights: pkg?.highlights || [""],
    itinerary: pkg?.itinerary || "",
    inclusions: pkg?.inclusions || [""],
    exclusions: pkg?.exclusions || [""],
    basePricePerPax: pkg?.basePricePerPax || "",
    childPricePerPax: pkg?.childPricePerPax || "",
    infantPricePerPax: pkg?.infantPricePerPax || "",
    availableDates: pkg?.availableDates || [],
    blackoutDates: pkg?.blackoutDates || [],
    autoPublish: pkg?.autoPublish || false,
    images: pkg?.images || [],
    brochure: pkg?.brochure || null,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayAdd = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as any[]), ""],
    }));
  };

  const handleArrayRemove = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as any[]).filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as any[]).map((item, i) =>
        i === index ? value : item,
      ),
    }));
  };

  const uploadImageToSupabase = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `package-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('package-assets')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('package-assets')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleImageUpload = async (index: number, file: File) => {
    const imageUrl = await uploadImageToSupabase(file);
    if (imageUrl) {
      const newImages = [...formData.images];
      newImages[index] = imageUrl;
      setFormData(prev => ({ ...prev, images: newImages }));
      toast({
        title: "Image Uploaded",
        description: "Image uploaded successfully.",
      });
    }
  };

  const handleBrochureUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `package-brochures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('package-assets')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('package-assets')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, brochure: publicUrl }));
      toast({
        title: "Brochure Uploaded",
        description: "Brochure uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload brochure. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{pkg ? "Edit Package" : "Create New Package"}</CardTitle>
        <CardDescription>
          Fill in all the details to create an attractive package listing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Package Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Bangkok Pattaya Discovery"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="e.g., bangkok-pattaya-discovery"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination *</Label>
              <Select
                onValueChange={(value) =>
                  handleInputChange("destination", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thailand">Thailand</SelectItem>
                  <SelectItem value="singapore">Singapore</SelectItem>
                  <SelectItem value="malaysia">Malaysia</SelectItem>
                  <SelectItem value="indonesia">Indonesia</SelectItem>
                  <SelectItem value="vietnam">Vietnam</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startCity">Starting City</Label>
              <Input
                id="startCity"
                value={formData.startCity}
                onChange={(e) => handleInputChange("startCity", e.target.value)}
                placeholder="e.g., Delhi, Mumbai, Bangalore"
              />
            </div>
          </div>
        </div>

        {/* Group Size & Duration */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Group Size & Duration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minTravelers">Minimum Travelers</Label>
              <Input
                id="minTravelers"
                type="number"
                value={formData.minTravelers}
                onChange={(e) =>
                  handleInputChange("minTravelers", parseInt(e.target.value))
                }
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxTravelers">Maximum Travelers</Label>
              <Input
                id="maxTravelers"
                type="number"
                value={formData.maxTravelers}
                onChange={(e) =>
                  handleInputChange("maxTravelers", parseInt(e.target.value))
                }
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (Days)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  handleInputChange("duration", parseInt(e.target.value))
                }
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Package Highlights</h3>
          {formData.highlights.map((highlight: string, index: number) => (
            <div key={index} className="flex space-x-2">
              <Input
                value={highlight}
                onChange={(e) =>
                  handleArrayChange("highlights", index, e.target.value)
                }
                placeholder="Enter package highlight"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleArrayRemove("highlights", index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => handleArrayAdd("highlights")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Highlight
          </Button>
        </div>

        {/* Itinerary */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Detailed Itinerary</h3>
          <Textarea
            value={formData.itinerary}
            onChange={(e) => handleInputChange("itinerary", e.target.value)}
            placeholder="Describe the day-by-day itinerary in detail..."
            rows={8}
          />
          <p className="text-sm text-gray-500">
            Use markdown formatting for better presentation (e.g., **bold**,
            *italic*, bullet points)
          </p>
        </div>

        {/* Inclusions & Exclusions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Inclusions</h3>
            {formData.inclusions.map((inclusion: string, index: number) => (
              <div key={index} className="flex space-x-2">
                <Input
                  value={inclusion}
                  onChange={(e) =>
                    handleArrayChange("inclusions", index, e.target.value)
                  }
                  placeholder="What's included"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleArrayRemove("inclusions", index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleArrayAdd("inclusions")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Inclusion
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Exclusions</h3>
            {formData.exclusions.map((exclusion: string, index: number) => (
              <div key={index} className="flex space-x-2">
                <Input
                  value={exclusion}
                  onChange={(e) =>
                    handleArrayChange("exclusions", index, e.target.value)
                  }
                  placeholder="What's not included"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleArrayRemove("exclusions", index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleArrayAdd("exclusions")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Exclusion
            </Button>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Pricing (Per Person)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="basePricePerPax">Adult Price *</Label>
              <Input
                id="basePricePerPax"
                type="number"
                value={formData.basePricePerPax}
                onChange={(e) =>
                  handleInputChange("basePricePerPax", e.target.value)
                }
                placeholder="Enter price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="childPricePerPax">Child Price (5-12 years)</Label>
              <Input
                id="childPricePerPax"
                type="number"
                value={formData.childPricePerPax}
                onChange={(e) =>
                  handleInputChange("childPricePerPax", e.target.value)
                }
                placeholder="Enter child price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="infantPricePerPax">
                Infant Price (0-5 years)
              </Label>
              <Input
                id="infantPricePerPax"
                type="number"
                value={formData.infantPricePerPax}
                onChange={(e) =>
                  handleInputChange("infantPricePerPax", e.target.value)
                }
                placeholder="Enter infant price"
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Package Images (Max 10)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors"
              >
                {formData.images[index] ? (
                  <div className="relative">
                    <img
                      src={formData.images[index]}
                      alt={`Package image ${index + 1}`}
                      className="w-full h-20 object-cover rounded mb-2"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-0 right-0 h-6 w-6 p-0"
                      onClick={() => {
                        const newImages = [...formData.images];
                        newImages[index] = "";
                        setFormData(prev => ({ ...prev, images: newImages }));
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload Image {index + 1}
                    </p>
                  </>
                )}
                <Input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  id={`image-upload-${index}`}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(index, file);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById(`image-upload-${index}`)?.click()}
                >
                  <Upload className="h-3 w-3 mr-1" />
                  {formData.images[index] ? 'Replace' : 'Upload'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* PDF Brochure Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Package Brochure (Optional)</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
            {formData.brochure ? (
              <div className="space-y-2">
                <FileText className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <p className="text-sm text-green-600">Brochure uploaded successfully</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, brochure: null }))}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <>
                <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload PDF brochure</p>
                <Input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  id="brochure-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleBrochureUpload(file);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('brochure-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Auto-publish toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="autoPublish"
            checked={formData.autoPublish}
            onCheckedChange={(checked) =>
              handleInputChange("autoPublish", checked)
            }
          />
          <Label htmlFor="autoPublish">
            Auto-publish after Super-Admin approval
          </Label>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setIsLoading(true);
              try {
                await onSave(formData);
                toast({
                  title: pkg ? "Package Updated!" : "Package Created!",
                  description: `"${formData.title}" has been ${pkg ? 'updated' : 'created'} successfully.`,
                });
              } catch (error) {
                toast({
                  title: "Error",
                  description: `Failed to ${pkg ? 'update' : 'create'} package. Please try again.`,
                  variant: "destructive",
                });
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                {pkg ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {pkg ? "Update Package" : "Create Package"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
