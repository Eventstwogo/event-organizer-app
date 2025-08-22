"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Key, ReactNode } from "react";

export interface EventType {
  event_type: ReactNode;
  eventtype_name: ReactNode;
  eventtype_id: Key | null | undefined;
  id: string;
  type: string;
  status: "ACTIVE" | "INACTIVE";
}

const ActionsCell = ({
  eventType,
  onEdit,
}: {
  eventType: EventType;
  onEdit: (event: EventType) => void;
}) => {
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
        <DropdownMenuItem onClick={() => onEdit(eventType)}>
          <Edit className="mr-2 h-4 w-4 text-blue-600" />
          Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const createColumns = (
  handleEditEvent: (event: EventType) => void,
  handleStatusToggle: (id: string, currentStatus: "INACTIVE" | "ACTIVE") => void
): ColumnDef<EventType>[] => [
  {
    id: "serialNumber",
    header: "S.No",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    size: 50,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        Event Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const eventType = row.original;
      return (
        <span className="font-medium text-gray-800">{eventType.type}</span>
      );
    },
  },
 {
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => {
    const eventType = row.original;
    const isActive = eventType.status === "ACTIVE";

    return (
     <Switch
        checked={isActive}
        onCheckedChange={() =>
          handleStatusToggle(eventType.id, eventType.status)
        }
        className={` 
          data-[state=checked]:bg-green-500
          data-[state=unchecked]:bg-red-500
        `}
      />
    );
  },
  size: 150,
},

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const eventType = row.original;
      return <ActionsCell eventType={eventType} onEdit={handleEditEvent} />;
    },
    enableHiding: false,
    size: 80,
  },
];
