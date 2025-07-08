"use client";

import React from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { ProductType } from "@/lib/api";
import { Skeleton } from "./ui/skeleton";

interface CategorySliderProps {
  categories: ProductType[];
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
  isLoading?: boolean;
}

export function CategorySlider({
  categories,
  selectedCategory,
  onSelectCategory,
  isLoading = false,
}: CategorySliderProps) {
  if (isLoading) {
    return (
      <div className="w-full py-2">
        <div className="flex gap-4 px-4 md:px-6 overflow-x-auto pb-2 no-scrollbar">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-2">
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        <Tabs 
          value={selectedCategory ? selectedCategory.toString() : undefined}
          onValueChange={(value) => onSelectCategory(Number(value))}
          className="flex gap-3"
        >
          <TabsList className="bg-transparent p-0 flex gap-3">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id.toString()}
                className="flex-shrink-0 flex items-center 
                  data-[state=active]:bg-highlight data-[state=active]:text-white 
                  px-6 py-3 rounded-full transition-all 
                  hover:bg-accent/20 hover:border-primary/30
                  border border-accent/30 
                  data-[state=active]:border-highlight 
                  shadow-md min-w-fit w-auto
                  font-medium text-base"
              >
                <span className="whitespace-normal text-center">
                  {category.name}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
