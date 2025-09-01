// "use client";

// import { ColumnDef } from "@tanstack/react-table";
// import {
//   ArrowUpDown,
//   Calendar,
//   Clock,
//   Eye,
//   Edit,
//   MapPin,
//   MoreHorizontal,
//   Trash2,
//   Users,
//   Star,
//   Ticket,
//   Settings,
// } from "lucide-react";
// import { useRouter } from "next/navigation";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// // Event interfaces
// interface Category {
//   category_id: string;
//   category_name: string;
//   category_slug: string;
//   category_img_thumbnail: string;
// }

// interface Subcategory {
//   id: string;
//   subcategory_id: string;
//   subcategory_name: string;
//   subcategory_slug: string;
//   subcategory_img_thumbnail: string;
// }

// interface Organizer {
//   user_id: string;
//   username: string;
//   profile_picture: string | null;
// }

// interface ExtraData {
//   address?: string;
//   duration?: string;
//   language?: string;
//   organizer?: string;
//   description?: string;
//   additionalInfo?: string;
//   ageRestriction?: string;
// }

// export interface Event {
//   event_id: string;
//   event_title: string;
//   event_slug: string;
//   category: Category | null;
//   subcategory: Subcategory | null;
//   organizer: Organizer | null;
//   card_image: string | null;
//   banner_image: string | null;
//   event_extra_images: string[] | null;
//   extra_data: ExtraData | null;
//   hash_tags: string[] | null;
//   event_status: "ACTIVE" | "INACTIVE" | "PENDING";
//   featured_event?: boolean;
//   created_at: string;
//   updated_at: string;
//   start_date: string;
//   end_date: string;
// }

// // Actions cell component
// const ActionsCell = ({
//   event,
//   onDelete,
// }: {
//   event: Event;
//   onDelete: (id: string) => void;
// }) => {
//   const router = useRouter();

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="h-8 w-8 p-0">
//           <span className="sr-only">Open menu</span>
//           <MoreHorizontal className="h-4 w-4" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//         <DropdownMenuItem
//           onClick={() => navigator.clipboard.writeText(event.event_id)}
//         >
//           Copy event ID
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem
//           onClick={() => router.push(`/Events/view/${event.event_id}`)}
//         >
//           <Eye className="mr-2 h-4 w-4" />
//           View Details
//         </DropdownMenuItem>
//         <DropdownMenuItem
//           onClick={() =>
//             router.push(`/Events/BasicInfo?event_id=${event.event_id}`)
//           }
//         >
//           <Edit className="mr-2 h-4 w-4" />
//           Edit event
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem
//           onClick={() => onDelete(event.event_id)}
//           className="text-red-600"
//         >
//           <Trash2 className="mr-2 h-4 w-4" />
//           Delete event
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };

// export const createColumns = (
//   onDelete: (id: string) => void,
//   onFeaturedToggle?: (
//     eventId: string,
//     eventTitle: string,
//     currentStatus: boolean,
//     startDate: string,
//     endDate: string
//   ) => void,
//   onCreateCoupons?: (eventId: string) => void,
//   onStatusToggle?: (
//     eventId: string,
//     currentStatus: "ACTIVE" | "INACTIVE" | "PENDING"
//   ) => void,
//   onCreateSlots?: (eventId: string) => void
// ): ColumnDef<Event>[] => [
//   {
//     id: "sno",
//     header: "S.No",
//     cell: ({ row }) => row.index + 1,
//     size: 60,
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "event_title",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Event Details
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => {
//       const event = row.original;
//       return (
//         <div className="space-y-1 w-full max-w-[320px] pr-4">
//           <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm leading-tight">
//             {event.event_title}
//           </h3>
//           {event.extra_data?.address && (
//             <div className="flex items-center text-xs text-gray-600">
//               <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
//               <span className="line-clamp-1 truncate">
//                 {event.extra_data.address}
//               </span>
//             </div>
//           )}
//            <Badge
//             variant="outline"
//             className="text-xs truncate max-w-[150px]"
//             title={event.category.category_name}
//           >
//             {event.category.category_name.length > 18
//               ? `${event.category.category_name.substring(0, 18)}...`
//               : event.category.category_name}
//           </Badge>
//         </div>
//       );
//     },
//     size: 350,
//   },
 
//   {
//     accessorKey: "organizer",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Organizer
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => {
//       const event = row.original;
//       const organizerName =
//         event.extra_data?.organizer ||
//         event.organizer?.username ||
//         "No organizer";
//       return (
//         <div className="flex items-center space-x-2 w-full pl-2">
//           <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
//           <span
//             className="text-sm text-gray-600 truncate max-w-[150px]"
//             title={organizerName}
//           >
//             {organizerName}
//           </span>
//         </div>
//       );
//     },
//     sortingFn: (rowA, rowB) =>
//       (rowA.original.organizer?.username || "").localeCompare(
//         rowB.original.organizer?.username || ""
//       ),
//     size: 180,
//   },
//   {
//     accessorKey: "event_status",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Status
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => {
//       const event = row.original;
// console.log(event)
//       if (event.event_status === "PENDING") {
//         return (
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => onCreateSlots?.(event.event_id)}
//             className="flex items-center gap-2 hover:bg-orange-50 hover:text-orange-600 border-orange-200"
//           >
//             <Settings className="h-4 w-4" />
//             Create Slots
//           </Button>
//         );
//       }

//       const isActive = event.event_status === "ACTIVE";
//       return (
//         <Switch
//           checked={isActive}
//           onCheckedChange={() =>
//             onStatusToggle?.(event.event_id, event.event_status)
//           }
//           className="data-[state=checked]:bg-green-500"
//         />
//       );
//     },
//     size: 150,
//   },

//   {
//     id: "featured",
//     header: "Featured List",
//     cell: ({ row }) => {
//       const event = row.original;
//       const isFeatured = event.featured_event || false;
// console.log(event)
//       return (
//         <Button
//           variant={isFeatured ? "default" : "outline"}
//           size="sm"
//           onClick={() =>
//             onFeaturedToggle?.(
//               event.event_id,
//               event.event_title,
//               isFeatured,
//               event.event_dates[0],
//               event.event_dates[event.event_dates.length - 1] // Assuming event_dates is an array of date strings
//             )
//           }
//           disabled={isFeatured} // Disable if already featured
//           className={`flex items-center gap-2 ${
//             isFeatured
//               ? "bg-yellow-500 text-white cursor-not-allowed opacity-60"
//               : "hover:bg-yellow-50 hover:text-yellow-600"
//           }`}
//         >
//           <Star className={`h-4 w-4 ${isFeatured ? "fill-current" : ""}`} />
//           {isFeatured ? "Featured" : "Not Featured"}
//         </Button>
//       );
//     },
//     enableSorting: false,
//     size: 140,
//   },
//   {
//     id: "coupons",
//     header: "Coupons",
//     cell: ({ row }) => (
//       <Button
//         variant="outline"
//         size="sm"
//         onClick={() => onCreateCoupons?.(row.original.event_id)}
//         className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600"
//       >
//         <Ticket className="h-4 w-4" />
//         Create Coupons
//       </Button>
//     ),
//     enableSorting: false,
//     size: 140,
//   },
//   {
//     id:'view bookings',
//     header: "View Bookings",

//     cell: ({ row }) => {
//     const router = useRouter();
//       return (
//       <Button
//         variant="outline"
//         size="sm"
//         onClick={() => router.push(`/Events/EventBookings?event_id=${row.original.event_id}`)}
//         className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600"
//       >
//         <Calendar className="h-4 w-4" />
//         View Bookings
//       </Button>
//       )
//     }
//   },
//   {
//     id: "actions",
//     header: "Actions",
//     enableHiding: false,
//     cell: ({ row }) => <ActionsCell event={row.original} onDelete={onDelete} />,
//     size: 80,
//   },
// ];




"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Calendar,
  Clock,
  Eye,
  Edit,
  MapPin,
  MoreHorizontal,
  Trash2,
  Users,
  Star,
  Ticket,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// ---------------- Interfaces ----------------
interface Category {
  category_id: string;
  category_name: string;
  category_slug: string;
  category_img_thumbnail: string;
}

interface Subcategory {
  id: string;
  subcategory_id: string;
  subcategory_name: string;
  subcategory_slug: string;
  subcategory_img_thumbnail: string;
}

interface Organizer {
  user_id: string;
  username: string;
  profile_picture: string | null;
}

interface ExtraData {
  address?: string;
  duration?: string;
  language?: string;
  organizer?: string;
  description?: string;
  additionalInfo?: string;
  ageRestriction?: string;
}

export interface Event {
  event_id: string;
  event_title: string;
  event_slug: string;
  category: Category | null;
  subcategory: Subcategory | null;
  organizer: Organizer | null;
  card_image: string | null;
  banner_image: string | null;
  event_extra_images: string[] | null;
  extra_data: ExtraData | null;
  hash_tags: string[] | null;
  event_status: "ACTIVE" | "INACTIVE" | "PENDING";
  featured_event?: boolean;
  created_at: string;
  updated_at: string;
  start_date: string;
  end_date: string;
}

const EditOptions = ({ event }: { event: Event }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Event
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose Edit Option</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-3 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              router.push(`/Events/BasicInfo?event_id=${event.event_id}`);
              setOpen(false); // close after navigation
            }}
          >
            ✏️ Edit Event Details
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              router.push(`/Events/BasicInfo?event_id=${event.event_id}&edit_slots=true`);
              setOpen(false);
            }}
          >
            📅 Edit Existing Slots
          </Button>
          {/* <Button
            variant="outline"
            onClick={() => {
              router.push(`/Events/CreateSlots?event_id=${event.event_id}`);
              setOpen(false);
            }}
          >
            ➕ Create New Dates + Slots
          </Button> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ---------------- Actions Cell ----------------
const ActionsCell = ({
  event,
  onDelete,
}: {
  event: Event;
  onDelete: (id: string) => void;
}) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(event.event_id)}
        >
          Copy event ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/Events/view/${event.event_id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        {/* Edit with 3 options */}
        <EditOptions event={event} />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(event.event_id)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete event
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// ---------------- Columns ----------------
export const createColumns = (
  onDelete: (id: string) => void,
  onFeaturedToggle?: (
    eventId: string,
    eventTitle: string,
    currentStatus: boolean,
    startDate: string,
    endDate: string
  ) => void,
  onCreateCoupons?: (eventId: string) => void,
  onStatusToggle?: (
    eventId: string,
    currentStatus: "ACTIVE" | "INACTIVE" | "PENDING"
  ) => void,
  onCreateSlots?: (eventId: string) => void
): ColumnDef<Event>[] => [
  {
    id: "sno",
    header: "S.No",
    cell: ({ row }) => row.index + 1,
    size: 60,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "event_title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Event Details
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="space-y-1 w-full max-w-[320px] pr-4">
          <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm leading-tight">
            {event.event_title}
          </h3>
          {event.extra_data?.address && (
            <div className="flex items-center text-xs text-gray-600">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="line-clamp-1 truncate">
                {event.extra_data.address}
              </span>
            </div>
          )}
          {event.category && (
            <Badge
              variant="outline"
              className="text-xs truncate max-w-[150px]"
              title={event.category.category_name}
            >
              {event.category.category_name.length > 18
                ? `${event.category.category_name.substring(0, 18)}...`
                : event.category.category_name}
            </Badge>
          )}
        </div>
      );
    },
    size: 350,
  },
  {
    accessorKey: "organizer",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Organizer
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const event = row.original;
      const organizerName =
        event.extra_data?.organizer ||
        event.organizer?.username ||
        "No organizer";
      return (
        <div className="flex items-center space-x-2 w-full pl-2">
          <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span
            className="text-sm text-gray-600 truncate max-w-[150px]"
            title={organizerName}
          >
            {organizerName}
          </span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) =>
      (rowA.original.organizer?.username || "").localeCompare(
        rowB.original.organizer?.username || ""
      ),
    size: 180,
  },
  {
    accessorKey: "event_status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const event = row.original;

      if (event.event_status === "PENDING") {
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCreateSlots?.(event.event_id)}
            className="flex items-center gap-2 hover:bg-orange-50 hover:text-orange-600 border-orange-200"
          >
            <Settings className="h-4 w-4" />
            Create Slots
          </Button>
        );
      }

      const isActive = event.event_status === "ACTIVE";
      return (
        <Switch
          checked={isActive}
          onCheckedChange={() =>
            onStatusToggle?.(event.event_id, event.event_status)
          }
          className="data-[state=checked]:bg-green-500"
        />
      );
    },
    size: 150,
  },
  {
    id: "featured",
    header: "Featured List",
    cell: ({ row }) => {
      const event = row.original;
      const isFeatured = event.featured_event || false;

      return (
        <Button
          variant={isFeatured ? "default" : "outline"}
          size="sm"
          onClick={() =>
            onFeaturedToggle?.(
              event.event_id,
              event.event_title,
              isFeatured,
              event.start_date,
              event.end_date
            )
          }
          disabled={isFeatured}
          className={`flex items-center gap-2 ${
            isFeatured
              ? "bg-yellow-500 text-white cursor-not-allowed opacity-60"
              : "hover:bg-yellow-50 hover:text-yellow-600"
          }`}
        >
          <Star className={`h-4 w-4 ${isFeatured ? "fill-current" : ""}`} />
          {isFeatured ? "Featured" : "Not Featured"}
        </Button>
      );
    },
    enableSorting: false,
    size: 140,
  },
  {
    id: "coupons",
    header: "Coupons",
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="sm"
        onClick={() => onCreateCoupons?.(row.original.event_id)}
        className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600"
      >
        <Ticket className="h-4 w-4" />
        Create Coupons
      </Button>
    ),
    enableSorting: false,
    size: 140,
  },
  {
    id: "view bookings",
    header: "View Bookings",
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            router.push(`/Events/EventBookings?event_id=${row.original.event_id}`)
          }
          className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600"
        >
          <Calendar className="h-4 w-4" />
          View Bookings
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell event={row.original} onDelete={onDelete} />,
    size: 80,
  },
];
