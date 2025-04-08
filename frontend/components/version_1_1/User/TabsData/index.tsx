import React, { useEffect, useState } from "react";
import HistoryCard from "../../HistoryCard";
import { Main } from "@/components/types/activity";
import { perform_get } from "@/lib/api";
import Cookies from "js-cookie";

export const GetUserActivityHistoryTab = () => {
  const [activity, setactivity] = useState<Main>();
  useEffect(() => {
    const token = Cookies.get("token");

    const getData = async () => {
      const response = await perform_get("api/v1/report/user_report/", token);
      console.log("response",response);
      setactivity(response);
    };
    getData();
  },[]);

  return (
    <div className="w-full grid grid-cols-3 gap-4 box-border p-5">
      {activity && activity?.incoming_request.debug.map(
        (item) => {
          return <HistoryCard key={item.id} data={item} />;
        }
      )}
      {activity && activity?.incoming_request.consult.map(
        (item) => {
          return <HistoryCard key={item.id} data={item} />;
        }
      )}
      {activity && activity?.my_requests.consult.map(
        (item) => {
          return <HistoryCard key={item.id} data={item} />;
        }
      )}
      {activity && activity?.my_requests.debug.map(
        (item) => {
          return <HistoryCard key={item.id} data={item} />;
        }
      )}
    </div>
  );
};
