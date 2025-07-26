"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { testimonials } from "@/lib/data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface TestimonialsSectionProps {
  title?: string;
  backgroundColor?: string;
  children?: ReactNode;
}

export const TestimonialsSection = (props: TestimonialsSectionProps) => {
  const { title = "What Our Travelers Say", backgroundColor = "#f8f9fa" } =
    props;

  return (
    <section className="py-12 px-6" style={{ backgroundColor }}>
      <h3 className="text-xl font-bold font-headline text-center mb-6">
        {title}
      </h3>

      <Carousel
        opts={{ align: "start", loop: true }}
        className="w-full max-w-2xl mx-auto"
      >
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem
              key={testimonial.id}
              className="md:basis-1/1 lg:basis-1/1"
            >
              <div className="p-1">
                <Card className="border-none shadow-lg">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <Avatar className="w-16 h-16 mb-4 border-2 border-accent">
                      <AvatarImage
                        src={testimonial.avatar}
                        data-ai-hint={testimonial.hint}
                      />
                      <AvatarFallback>
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-500 fill-current"
                        />
                      ))}
                    </div>

                    <p className="italic mb-4">"{testimonial.quote}"</p>
                    <p className="font-bold font-headline text-foreground">
                      - {testimonial.name}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="hidden sm:block">
          <CarouselPrevious className="left-[-50px]" />
          <CarouselNext className="right-[-50px]" />
        </div>
      </Carousel>

      {props.children}
    </section>
  );
};
