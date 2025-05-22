"use client";
import React, { useState } from "react";
import {
  Card,
  CardBody,
  Select,
  SelectItem,
  Slider,
  Input,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  Button,
  DropdownMenu,
  Badge,
} from "@heroui/react";
import { useBidFilter } from "@/context/BidFilterContext";
import { Backpack, Search, SearchCode, SlidersHorizontal } from "lucide-react";

type Props = {};

const BidFilter = (props: Props) => {
  const { filter, setFilter, priceValue, setValue } = useBidFilter();

  return (
    <div className="w-full flex gap-4 items-center justify-center" dir="rtl">
      {/* <Card>
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
      </Card> */}

      {/* <Select
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
      </Select> */}
      <FilterMenu />
      <Input
        type="text"
        size="lg"
        className="w-[512px]"
        classNames={{
          inputWrapper: "bg-input border border-default-100",
        }}
        placeholder="جستجو..."
        isClearable
        startContent={<Search className="fill-none" />}
        onValueChange={(value) => {
          setFilter({
            ...filter,
            search_text: value,
          });
        }}
      />
      <NotifMenu />
    </div>
  );
};

export default BidFilter;

const FilterMenu = () => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          isIconOnly
          startContent={<SlidersHorizontal />}
        ></Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="new">New file</DropdownItem>
        <DropdownItem key="copy">Copy link</DropdownItem>
        <DropdownItem key="edit">Edit file</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete file
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
const NotifMenu = () => {
  const [number, setNumber] = useState(5);

  return (
    <Dropdown>
        <Badge content={number} placement="bottom-left" color="danger">
      <DropdownTrigger>
          <Button
            variant="light"
            isIconOnly
            startContent={<Backpack />}
            ></Button>
      </DropdownTrigger>
        </Badge>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="new">New file</DropdownItem>
        <DropdownItem key="copy">Copy link</DropdownItem>
        <DropdownItem key="edit">Edit file</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete file
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
