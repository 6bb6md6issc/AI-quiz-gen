"use client"
import React, { useState } from 'react';
import { Brain, LinkIcon, Youtube } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { Label } from './ui/label';
import { generateQuiz } from '@/app/dashboard/actions';
 
const VideoUrlForm = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (isSubmitting) return; // Prevent multiple submissions
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget);
            const videoUrl = formData.get("video-url");
            if (!videoUrl) {
                console.error("No video URL provided");
                return;
            }
            
            const result = await generateQuiz(formData);
            console.log("Server response:", result);

            if (result.success && result.quizId) {
                console.log("Attempting to redirect to:", `/dashboard/quizzes/${result.quizId}`);
                router.refresh(); // Force a refresh of the current page data
                await router.push(`/dashboard/quizzes/${result.quizId}`);
            } else {
                console.error("Error:", result.error);
            }
        } catch (error) {
            console.error("Form submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };


  return (
    <Card className="p-6 md:p-8 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col space-y-2">
                <Label htmlFor='video-url'
                    className='text-sm font-medium'
                >YouTube Video URL</Label>
                <div className='flex gap-3'>
                    <div className='relative flex-1'>
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="video-url" 
                            name="video-url"
                            placeholder='https://www.youtube.com/watch?v=XqZsoesa55w'
                            className='pl-9'
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <Button type="submit" className={`gap-2 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`} disabled={isSubmitting}>
                        {isSubmitting ? "Generating..." : "Generate Quiz"}
                        <Brain className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <div className='relative aspect-video mt-4 rounded-lg overflow-hidden bg-muted'>
                <div className="absolute inset-0 flex items-center justify-center">
                <Youtube className="w-16 h-16 text-muted-foreground/50" />
                </div>
            </div>
        </form>
    </Card>
  )
}

export default VideoUrlForm