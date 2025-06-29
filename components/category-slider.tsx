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
      <div className="w-full overflow-x-auto pb-2 no-scrollbar">
        <Tabs 
          value={selectedCategory ? selectedCategory.toString() : ""}
          onValueChange={(value) => onSelectCategory(Number(value))}
          className="w-full"
        >
          <TabsList className="h-auto p-2 bg-transparent flex gap-3 pl-4 pr-12 md:px-4 min-w-max">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id.toString()}
                className="flex-shrink-0 flex flex-col items-center gap-1 data-[state=active]:bg-orange-500/10 px-3 py-2 rounded-xl data-[state=active]:text-orange-600 data-[state=active]:border-orange-500"
              >
                <div className="w-12 h-12 rounded-full bg-muted relative overflow-hidden">
                  {category.image && category.image !== "" ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.backgroundColor = "#f1f5f9";
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-orange-100 dark:bg-orange-900/30">
                      <span className="text-lg font-medium text-orange-500">
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium whitespace-nowrap">
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
