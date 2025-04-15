"use client";
import React from "react";
import {
  Card,
  CardBody,
  Select,
  SelectItem,
  Slider,
  Input,
} from "@heroui/react";
import { useBidFilter } from "@/context/BidFilterContext";
import { SearchCode } from "lucide-react";

type Props = {};

const BidFilter = (props: Props) => {
  const { filter, setFilter, priceValue, setValue } = useBidFilter();

  return (
    <div className="w-full flex gap-4 items-center " dir="rtl">
      <Card>
        <CardBody className="min-w-96 bg-default-100" dir="ltr">
          <Slider
            defaultValue={[100000, 5000000]}
            label="مبلغ"
            value={priceValue}
            onChange={setValue}
            maxValue={5000000}
            minValue={0}
            step={100000}
          />
        </CardBody>
      </Card>

      <Select
        className="max-w-xs"
        label="نوع"
        placeholder="انتخاب نوع"
        selectedKeys={[filter.type || "all"]}
      >
        <SelectItem
          key="all"
          onPress={() =>
            setFilter({
              ...filter,
              type: "all",
            })
          }
        >
          همه
        </SelectItem>
        <SelectItem
          key="tender"
          onPress={() =>
            setFilter({
              ...filter,
              type: "tender",
            })
          }
        >
          مزایده
        </SelectItem>
        <SelectItem
          key="auction"
          onPress={() =>
            setFilter({
              ...filter,
              type: "auction",
            })
          }
        >
          مناقصه
        </SelectItem>
      </Select>

      <Input
        type="text"
        size="lg"
        className="w-96"
        placeholder="مزایده , مناقصه , آموزش و...  "
        startContent={<SearchCode className="fill-none" />}
        onValueChange={(value) => {
          setFilter({
            ...filter,
            search_text: value,
          });
        }}
      />
    </div>
  );
};

export default BidFilter;
