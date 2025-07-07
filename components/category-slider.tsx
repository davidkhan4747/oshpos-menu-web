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
                className="flex-shrink-0 flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-3 rounded-lg transition-all hover:bg-accent/30 border border-transparent data-[state=active]:border-primary/30 shadow-sm min-w-[100px] justify-center"
              >
                {category.image && category.image !== "" ? (
                  <div className="w-5 h-5 relative">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="20px"
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <span className="text-lg font-medium data-[state=active]:text-white text-primary">
                    {category.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="text-sm font-medium whitespace-nowrap">
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
