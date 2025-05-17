"use client";

import { useBidFilter } from "@/context/BidFilterContext";
import Card from "./Card";
import type { Main } from "@/components/types/tender.type";

type Props = {
  data: Main;
};

const Bid = ({ data }: Props) => {
  const { filter, priceValue } = useBidFilter();

  const filterType =
    filter.type === "all" ? ["tender", "auction"] : [filter.type];
  const [minPrice, maxPrice] = priceValue.toString().split(",").map(Number);

  const filteredResults = data.results
    ?.filter((item) => item.tender)
    .filter((item) =>
      filterType.includes(item.tender.mode as "tender" | "auction")
    )
    .filter(
      (item) =>
        item.tender.start_bid >= minPrice && item.tender.start_bid <= maxPrice
    )
    .filter((item) => {
      if (!filter.search_text?.trim()) return true; // اگر متن خالیه، فیلتر نکن
      const text = filter.search_text.toLowerCase();
      return (
        item.tender.title.toLowerCase().includes(text) ||
        item.tender.description.toLowerCase().includes(text)
      );
    });

  return (
    <div className="w-full h-full">
      {filteredResults && filteredResults.length > 0 ? (
        filteredResults.map((result, index) => (
          <Card key={index} tender={result.tender} bids={result.bids} />
        ))
      ) : (
        <div className="flex items-center justify-center w-full h-full text-center text-gray-500">
          مزایده‌ای پیدا نشد
        </div>
      )}
    </div>
  );
};

export default Bid;
