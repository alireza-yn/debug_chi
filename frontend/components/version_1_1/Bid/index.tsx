
import Card from "./Card";
import type { Main } from "@/components/types/tender.type";

type Props = {
  data: Main;
};

const Bid = (props: Props) => {
  const { data } = props;

  return (
    <div className="w-full h-full">
      {data.results &&
        data.results.map((result, index) => (
          <Card key={index} tender={result.tender} bids={result.bids} />
        ))}
    </div>
  );
};

export default Bid;
