"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plus,
  Ticket,
  ArrowLeft,
  Trash2,
  Clipboard,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import axiosInstance from "@/lib/axiosinstance";
import useStore from "@/lib/Zustand";

interface Coupon {
  coupon_id: string;
  event_id: string;
  coupon_code: string;
  coupon_name: string;
  coupon_percentage: number;
  no_of_tickets: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const CouponsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");

  const { userId } = useStore();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [eventTitle, setEventTitle] = useState<string>("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [generatedCoupon, setGeneratedCoupon] = useState<Coupon | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    percentage: "5",
    no_of_tickets: "",
  });

  // Fetch coupons and event details
  const fetchCoupons = useCallback(async () => {
    if (!eventId) {
      toast.error("Event ID is missing");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Assuming an endpoint to fetch coupons by eventId
      const response = await axiosInstance.get(`/coupons/coupons/event/${eventId}`);
      if (response.data.statusCode === 200) {
        setCoupons(response.data.data || []);
        setEventTitle(response.data.data.event_title || "Event");
      } else {
        toast.error(response.data.message || "Failed to fetch coupons");
        setCoupons([]);
      }
    } catch (error: any) {
      console.error("Error fetching coupons:", error);
      if (error.response?.status === 404) {
        toast.error("Coupons endpoint not found. Please check the API.");
      } else if (error.code === "ECONNABORTED") {
        toast.error("Request timeout. Please check your connection.");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Failed to fetch coupons. Please try again.");
      }
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  // Generate 6-character random suffix
  const generateSuffix = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  // Handle coupon creation
  const handleGenerateCoupon = async () => {
    if (!eventId) {
      toast.error("Event ID is missing");
      return;
    }

    // Validate name
    if (!formData.name.trim() || !/^[A-Za-z ]+$/.test(formData.name)) {
      toast.error("Coupon name must contain only letters and spaces");
      return;
    }

    // Validate number of tickets
    const tickets = parseInt(formData.no_of_tickets);
    if (!tickets || tickets <= 0) {
      toast.error("Number of tickets must be greater than 0");
      return;
    }

    // Validate percentage
    const percentage = parseInt(formData.percentage);
    if (!percentage || percentage <= 0 || percentage > 100) {
      toast.error("Invalid discount percentage");
      return;
    }

    const code =  generateSuffix();

    const newCoupon = {

      event_id: eventId,
      organizer_id: userId, // Replace with actual organizer_id from user context
      coupon_name: formData.name.trim(),
      coupon_code: code,
      coupon_percentage: percentage,
      number_of_coupons: tickets,

    };

    try {
      const response = await axiosInstance.post("/coupons/coupons", newCoupon);
      if (response.data.statusCode === 201) {
        const createdCoupon: Coupon = {
          ...newCoupon,
          coupon_id: response.data.coupon_id,
          no_of_tickets: response.data.number_of_coupons,
          is_active: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setCoupons((prev) => [...prev, createdCoupon]);
        setGeneratedCoupon(createdCoupon);
        toast.success("Coupon created successfully");
      } else {
        toast.error(response.data.message || "Failed to create coupon");
      }
    } catch (error: any) {
      console.error("Error creating coupon:", error);
      toast.error("Failed to create coupon. Please try again.");
    }
  };

  // Copy coupon code to clipboard
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied!");
  };


  const handleDeleteCoupon = async (couponId: string) => {
    try {
      await axiosInstance.delete(`/coupons/coupons/${couponId}`);
      setCoupons((prev) => prev.filter((c) => c.coupon_id !== couponId));
      toast.success("Coupon deleted successfully");
      setCouponToDelete(null);
    } catch (error: any) {
      console.error("Error deleting coupon:", error);
      toast.error("Failed to delete coupon");
    }
  };

  // // Toggle coupon status
  // const handleToggleStatus = async (couponId: string, currentStatus: boolean) => {
  //   try {
  //     const newStatus = !currentStatus;
  //     await axiosInstance.patch(`/coupons/${couponId}`, {
  //       is_active: newStatus,
  //     });
  //     setCoupons((prev) =>
  //       prev.map((c) =>
  //         c.coupon_id === couponId
  //           ? { ...c, is_active: newStatus, updated_at: new Date().toISOString() }
  //           : c
  //       )
  //     );
  //     toast.success(`Coupon ${newStatus ? "activated" : "deactivated"} successfully`);
  //   } catch (error: any) {
  //     console.error("Error updating coupon status:", error);
  //     toast.error("Failed to update coupon status");
  //   }
  // };

  // Actions cell for dropdown menu
  const ActionsCell = ({ coupon }: { coupon: Coupon }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleCopy(coupon.coupon_code)}>
          Copy coupon code
        </DropdownMenuItem>

        {/* <DropdownMenuItem
          onClick={() => handleToggleStatus(coupon.coupon_id, coupon.is_active)}
        >
          {coupon.is_active ? "Activate" : "Deactivate"}
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setCouponToDelete(coupon)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete coupon
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Table columns
  const columns: ColumnDef<Coupon>[] = [
    {
      accessorKey: "coupon_code",
      header: "Coupon Code",
      cell: ({ row }) => {
        const coupon = row.original;
        return (
          <div className="flex items-center gap-2 font-mono font-semibold text-blue-600">
            <span>{coupon.coupon_code}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(coupon.coupon_code)}
            >
              <Clipboard className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "number_of_coupons",
      header: "No. of Tickets",
      cell: ({ row }) => <div className="text-center">{row.getValue("number_of_coupons")}</div>,
    },
    {
      accessorKey: "coupon_percentage",
      header: "Discount %",
      cell: ({ row }) => (
        <div className="text-center text-green-600">{row.getValue("coupon_percentage")}%</div>
      ),
    },
    {
      accessorKey: "coupon_status",
      header: "Status",
      cell: ({ row }) => {
        const coupon = row.original;
        return (
          <Badge variant={coupon.is_active ? "default" : "secondary"}>
            {coupon.is_active ? "Inactive" : "Active"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionsCell coupon={row.original} />,
    },
  ];

  // Fetch coupons on mount
  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/Events")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Events
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Coupons Management</h1>
            <p className="text-gray-600">
              Manage coupons for: <span className="font-semibold">{eventTitle}</span>
            </p>
            {!loading && (
              <p className="text-sm text-gray-500 mt-1">{coupons.length} coupons found</p>
            )}
          </div>

          <Button
            onClick={() => {
              setGeneratedCoupon(null);
              setFormData({ name: "", percentage: "10", no_of_tickets: "" });
              setShowCreateDialog(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Coupon
          </Button>
        </div>

        {/* Coupons Table */}
        {loading ? (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
                    </div>
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : coupons.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Coupons Found</h3>
              <p className="text-gray-500 mb-6">
                You haven&apos;t created any coupons for this event yet. Create your first coupon to get started!
              </p>
              <Button
                onClick={() => {
                  setGeneratedCoupon(null);
                  setFormData({ name: "", percentage: "10", no_of_tickets: "" });
                  setShowCreateDialog(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Coupon
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <DataTable
                columns={columns}
                data={coupons}
                searchKey="coupon_code"
                searchPlaceholder="Search coupons..."
              />
            </CardContent>
          </Card>
        )}

        {/* Create Coupon Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
              <DialogDescription>
                Enter details and generate a unique coupon code for this event.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Coupon Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Enter coupon name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="percentage" className="text-right">
                  Discount % *
                </Label>
                <select
                  id="percentage"
                  value={formData.percentage}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, percentage: e.target.value }))
                  }
                  className="col-span-3 p-2 border rounded-md"
                >
                  <option value="5">5%</option>
                  <option value="10">10%</option>
                  <option value="15">15%</option>
                  <option value="20">20%</option>
                  <option value="25">25%</option>
                  <option value="30">30%</option>
                  <option value="35">35%</option>
                  <option value="40">40%</option>
                  <option value="45">45%</option>
                  <option value="50">50%</option>
                  <option value="55">55%</option>
                  <option value="60">60%</option>
                  <option value="65">65%</option>
                  <option value="70">70%</option>
                  <option value="75">75%</option>
                  <option value="80">80%</option>
                  <option value="85">85%</option>
                  <option value="90">90%</option>
                  <option value="95">95%</option>
                  <option value="100">100%</option>
                </select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="no_of_tickets" className="text-right">
                  No. of Tickets *
                </Label>
                <Input
                  id="no_of_tickets"
                  type="number"
                  placeholder="Enter number of tickets"
                  value={formData.no_of_tickets}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, no_of_tickets: e.target.value }))
                  }
                  className="col-span-3"
                />
              </div>

              {generatedCoupon && (
                <div className="mt-4 p-4 border rounded-md bg-gray-50 flex justify-between items-center">
                  <span className="font-mono font-semibold text-blue-600">
                    {generatedCoupon.coupon_code}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleCopy(generatedCoupon.coupon_code)}
                  >
                    <Clipboard className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              )}
            </div>

            <DialogFooter>
              {generatedCoupon ? (
                <Button
                  className="bg-gray-500 text-white"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Close
                </Button>
              ) : (
                <Button
                  onClick={handleGenerateCoupon}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                >
                  Generate Coupon
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={!!couponToDelete}
          onOpenChange={(open) => !open && setCouponToDelete(null)}
        >
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Delete Coupon</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the coupon{" "}
                <span className="font-mono font-semibold text-blue-600">
                  {couponToDelete?.coupon_code}
                </span>
                ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setCouponToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white"
                onClick={() => {
                  if (couponToDelete) {
                    handleDeleteCoupon(couponToDelete.coupon_id);
                  }
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CouponsPage;
