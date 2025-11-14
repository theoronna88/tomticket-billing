import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface CalendarComponentProps {
  label: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const CalendarComponent = ({
  label,
  open,
  setOpen,
  date,
  setDate,
}: CalendarComponentProps) => {
  return (
    <>
      <div className="flex flex-col gap-3">
        <Label htmlFor="start" className="px-1">
          {label}
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="start"
              className="w-48 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Selecione a data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default CalendarComponent;
