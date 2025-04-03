import React from "react";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import {Badge} from "@/components/ui/badge";
import { Sparkles } from "lucide-react"
import VideoUrlForm from "@/components/VideoUrlForm"
const page = () => {
    return(
        <MaxWidthWrapper className="mt-20">
            <div className="text-center space-y-4 mb-12">
                <Badge variant="secondary" className="mb-4">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI-Powered Learning
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl leading-tight">
                    Master Anything Through <span className="text-primary relative">AI Quiz
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20 rounded-full"></div>
                    </span>
                </h1>
                <p className="text-lg text-muted-foreground">
                Transform a YouTube Tutorial Video into AI-Powered Quiz
                </p>
            </div>
            <VideoUrlForm />
        </MaxWidthWrapper>
    )
}

export default page