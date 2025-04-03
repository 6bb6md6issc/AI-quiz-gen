import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import {Badge} from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, ChevronRight, Headphones, Mic, Sparkles } from "lucide-react";
import Link from 'next/link';

export default function Home() {
  return (
      <MaxWidthWrapper className="bg-background text-foreground">
        <section className='flex flex-col-reverse lg: flex-row items-center justify-between py-20 px-6 gap-10'>
          <div className="max-w-xl text-center lg:text-left space-y-6">
            <Badge variant={'secondary'} className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered Quiz Generator
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm: text-6xl leading-tight">
              Assess your mastery of any tutorial through <span className="text-primary relative">AI Quiz
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20 rounded-full"></div>
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Solidify your knowledge mastering journey with AI-powered exercises
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href='/about' className={buttonVariants({variant: "default" })}>
              Get Started
              <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
              <Link href='/about' className={buttonVariants({variant: "default" })}>
              Learn More
              <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          <div className="relative w-full lg:w-1/2">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
              <div className="absolute insert-0 bg-gradient-to-br from-primary/30 to-background/10 mix-blend-overlay"></div>
              <iframe className="w-full h-full" 
                src="https://www.youtube.com/embed/XqZsoesa55w?si=QH0AfEyqmck-14cd"
                title="Youtube Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="absolute -bottom-6 -right-6 -z-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          </div>
        </section>

        <section className="container mx-auto py-20 px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform makes facilitate your learning process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
                {
                  icon: <Headphones className="w-6 h-6" />,
                  title: "Active Learning",
                  description: "Watch tutorials to understand certain topic"
                },
                {
                  icon: <Brain className="w-6 h-6" />,
                  title: "AI Analysis",
                  description: "Let AI assess your understanding of certain topic"
                },
                {
                  icon: <Mic className="w-6 h-6" />,
                  title: "Speaking Practice",
                  description: "Engage in conversations with AI tutors to build confidence"
                }
              ].map((feature, i) => (
                <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
            ))}
          </div>
        </section>

        <section className="py-10">
        <div className="relative rounded-2xl bg-primary p-8 md:p-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70"></div>
          <div className="relative z-10 max-w-2xl mx-auto text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Take a Quiz?
            </h2>
            <p className="text-primary-foreground/90 mb-8">
              Join thousands of learners who have improved their listening skills with our AI-powered platform.
            </p>
            <Button size="lg" variant="secondary" className="gap-2">
              Get Started Now <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
      </MaxWidthWrapper>
  );
}
