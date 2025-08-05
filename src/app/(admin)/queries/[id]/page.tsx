"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Send, 
  User, 
  Clock, 
  MessageSquare,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import axiosInstance from "@/lib/axiosinstance";
import useStore from "@/lib/Zustand";
import { toast } from "sonner";

// Types
interface ThreadMessage {
  type: string;
  sender_type: string;
  user_id: string;
  username: string;
  message: string;
  timestamp: string;
}

interface Query {
  id: number;
  sender_user_id: string;
  receiver_user_id: string | null;
  title: string;
  category: string;
  thread: ThreadMessage[];
  query_status: 'open'  | 'resolved' | 'in-progress'|'closed';
  created_at: string;
  updated_at: string;
  last_message: string;
  unread_count: number;
}

interface QueryResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  method: string;
  path: string;
  data: Query;
}

const QueryDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const { userId, user } = useStore();
  const [query, setQuery] = useState<Query | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [followUpMessage, setFollowUpMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittingFollowUp, setSubmittingFollowUp] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<'open' | 'resolved'  | 'in-progress' |'closed'| null>(null);



  useEffect(() => {
    fetchQuery();
  }, [params.id,userId]);

  const fetchQuery = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<QueryResponse>(`/organizers/queries/${params.id}?user_id=${userId}`,);
      setQuery(response.data.data);
    } catch (error) {
      console.error("Error fetching query:", error);
      toast.error("Failed to fetch query details");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        user_id: userId,
        message: newMessage
      };

      // Send message to the query thread
      await axiosInstance.post(`/organizers/queries/${params.id}/reply`, payload);
      
      // Refresh the query to get updated thread
      await fetchQuery();
      
      setNewMessage("");
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendFollowUp = async () => {
    if (!followUpMessage.trim()) {
      toast.error("Please enter a follow-up message");
      return;
    }

    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setSubmittingFollowUp(true);
      
      const payload = {
        user_id: userId,
        message: followUpMessage,
        message_type: "followup"
      };

      // Send follow-up message
      await axiosInstance.post(`/organizers/queries/${params.id}/messages`, payload);
      
      // Refresh the query to get updated thread
      await fetchQuery();
      
      setFollowUpMessage("");
      toast.success("Follow-up message sent successfully");
    } catch (error) {
      console.error("Error sending follow-up message:", error);
      toast.error("Failed to send follow-up message");
    } finally {
      setSubmittingFollowUp(false);
    }
  };

  const handleStatusUpdateClick = (newStatus: 'open' | 'resolved'  | 'in-progress'|'closed') => {
    setPendingStatus(newStatus);
    setStatusUpdateMessage("");
    setShowStatusModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!userId || !pendingStatus) {
      toast.error("User not authenticated or no status selected");
      return;
    }

    if (!statusUpdateMessage.trim()) {
      toast.error("Please provide a message for the status update");
      return;
    }

    try {
      setUpdatingStatus(true);
      
      const payload = {
        user_id: userId,
        query_status: pendingStatus,
        message: statusUpdateMessage
      };

      // Update query status
      await axiosInstance.patch(`/organizers/queries/${params.id}/status`, payload);
      
      // Refresh the query to get updated data
      await fetchQuery();
      
      toast.success(`Query status updated to ${pendingStatus}`);
      setShowStatusModal(false);
      setPendingStatus(null);
      setStatusUpdateMessage("");
    } catch (error) {
      console.error("Error updating query status:", error);
      toast.error("Failed to update query status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCancelStatusUpdate = () => {
    setShowStatusModal(false);
    setPendingStatus(null);
    setStatusUpdateMessage("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
       case 'closed': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/queries")}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Query Not Found</h1>
          </div>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">The requested query could not be found.</p>
            <Button 
              onClick={() => router.push("/queries")} 
              className="mt-4"
            >
              Back to Queries
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push("/queries")}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Query Details</h1>
          <p className="text-muted-foreground">
            View and manage query communication
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {getStatusIcon(query.query_status)}
            <Badge className={getStatusColor(query.query_status)}>
              {query.query_status}
            </Badge>
          </div>
          
          {/* Status Action Buttons */}
          <div className="flex items-center gap-2">
            {query.query_status !== 'in-progress' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusUpdateClick('in-progress')}
                disabled={updatingStatus}
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                In Progress
              </Button>
            )}
            
            {query.query_status !== 'resolved' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusUpdateClick('resolved')}
                disabled={updatingStatus}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Resolve
              </Button>
            )}
            {query.query_status !== 'closed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusUpdateClick('closed')}
                disabled={updatingStatus}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                closed
              </Button>
            )}         
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Query Information */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-xl">{query.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Query ID: {query.id}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(query.created_at).toLocaleDateString()}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {query.category}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Sender User ID</Label>
                  <p>{query.sender_user_id}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Last Updated</Label>
                  <p>{new Date(query.updated_at).toLocaleString()}</p>
                </div>
              </div>
              {query.unread_count > 0 && (
                <Badge variant="outline" className="bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                  {query.unread_count} unread messages
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Conversation Thread */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5" />
              Conversation Thread
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {query.thread.map((message, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg ${
                    message.sender_type === 'admin' 
                      ? 'bg-blue-50 dark:bg-blue-900/20 ml-8' 
                      : 'bg-gray-50 dark:bg-gray-900/20 mr-8'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          message.sender_type === 'admin' 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}
                      >
                        {message.sender_type === 'admin' ? 'Admin' : 'Organizer'}
                      </Badge>
                      <span className="text-sm font-medium">{message.username}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{message.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Send Message Form */}
        {/* {query.query_status !== 'resolved' && query.query_status !== 'closedd' && (
          <Card>
            <CardHeader>
              <CardTitle>Send Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={4}
                  disabled={submitting}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={submitting || !newMessage.trim()}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )} */}

        {/* Follow-up Message Form */}
        {query.query_status !== 'resolved' &&  query.query_status !== 'closed' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Send Follow-up Message
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Use this form if you need additional clarification or if the previous response didn't resolve your issue.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe your follow-up question or issue in detail..."
                  value={followUpMessage}
                  onChange={(e) => setFollowUpMessage(e.target.value)}
                  rows={4}
                  disabled={submittingFollowUp}
                />
                <Button 
                  onClick={handleSendFollowUp} 
                  disabled={submittingFollowUp || !followUpMessage.trim()}
                  variant="outline"
                >
                  {submittingFollowUp ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Sending Follow-up...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Follow-up Message
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Status Update Modal */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Update Query Status to {pendingStatus?.replace('_', ' ').toUpperCase()}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status-message" className="text-sm font-medium">
                Message (Required)
              </Label>
              <p className="text-xs text-muted-foreground mb-2">
                Provide a message explaining the status change
              </p>
              <Textarea
                id="status-message"
                placeholder={`Enter a message explaining why you're changing the status to ${pendingStatus?.replace('_', ' ')}...`}
                value={statusUpdateMessage}
                onChange={(e) => setStatusUpdateMessage(e.target.value)}
                rows={4}
                disabled={updatingStatus}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancelStatusUpdate}
              disabled={updatingStatus}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={updatingStatus || !statusUpdateMessage.trim()}
            >
              {updatingStatus ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                `Update to ${pendingStatus?.replace('_', ' ')}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QueryDetailsPage;