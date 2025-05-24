"use client";

import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchInput(
  { placeholder, paramString = "query" }: 
  { placeholder: string, paramString?: string }
) {
    const searchParams = useSearchParams();
    const query = searchParams.get(paramString) || "";
    const pathname = usePathname();
    const { replace } = useRouter();
  
    function handleSearch(term: string) {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set(paramString, term);
      } else {
        params.delete(paramString);
      }
      replace(`${pathname}?${params.toString()}`);
    }
  
    return (
      <>        
        <div className="relative flex max-w-xs flex-1 flex-shrink-0">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <input
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            placeholder={placeholder}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            defaultValue={query}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>        
      </>
    )
  }