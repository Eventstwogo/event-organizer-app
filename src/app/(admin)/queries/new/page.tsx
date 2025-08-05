"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send } from "lucide-react";
import axiosInstance from "@/lib/axiosinstance";
import useStore from "@/lib/Zustand";
import { toast } from "sonner";

interface NewQuery {
  title: string;
  description: string;
  category: string;
}

const NewQueryPage = () => {
  const router = useRouter();
  const { userId } = useStore();
  const [loading, setLoading] = useState(false);
  const [newQuery, setNewQuery] = useState<NewQuery>({
    title: "",
    description: "",
    category: ""
  });

  const categories = [
    "Technical",
    "Payment",
    "Feature Request",
    "Account",
    "General",
    "Bug Report",
    "Integration"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newQuery.title.trim() || !newQuery.description.trim() || !newQuery.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        user_id: userId,
        title: newQuery.title,
        category: newQuery.category,
        message: newQuery.description
      };

      const response = await axiosInstance.post('/organizers/queries', payload);
      
      toast.success("Query submitted successfully");
      router.push("/queries");
    } catch (error) {
      console.error("Error creating query:", error);
      toast.error("Failed to submit query");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/queries");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleCancel}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">New Query</h1>
          <p className="text-muted-foreground">
            Submit a new query to get help from administrators
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Query Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter a brief title for your query"
                value={newQuery.title}
                onChange={(e) => setNewQuery(prev => ({ ...prev, title: e.target.value }))}
                disabled={loading}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={newQuery.category} 
                onValueChange={(value) => setNewQuery(prev => ({ ...prev, category: value }))}
                disabled={loading}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your query in detail. Include any relevant information that might help us assist you better."
                value={newQuery.description}
                onChange={(e) => setNewQuery(prev => ({ ...prev, description: e.target.value }))}
                disabled={loading}
                rows={6}
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Query
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewQueryPage;