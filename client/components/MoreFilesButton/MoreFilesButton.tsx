import { Button } from "@/components/ui/button";
import { BazaSpinner } from "@/components/BazaSpinner/BazaSpinner";

interface MoreFilesButtonProps {
  onClick: () => void;
  loading?: boolean;
}

export const MoreFilesButton = ({ onClick, loading }: MoreFilesButtonProps) => {
  return (
    <Button className="mx-auto" onClick={onClick} disabled={loading}>
      {loading ? <BazaSpinner /> : "Show more"}
    </Button>
  );
};
