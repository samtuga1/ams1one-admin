import { cn, Label } from "@heroui/react";
import { Calendar } from "@heroui/react/calendar";
import { DateField } from "@heroui/react/date-field";
import { DatePicker } from "@heroui/react/date-picker";
import { DateValue, getLocalTimeZone, today } from "@internationalized/date";
import { useEffect, useState } from "react";

type Props = {
  label?: string;
  onDatePicked?: (date: DateValue) => void;
  className?: string;
  labelClassName?: string;
  maxValue?: DateValue;
  defaultValue?: DateValue;
};

function CustomDatePicker({
  label,
  onDatePicked,
  className,
  labelClassName,
  maxValue,
  defaultValue,
}: Props) {
  const todayDate = today(getLocalTimeZone());
  const [value, setValue] = useState<DateValue | null>(
    defaultValue ?? (maxValue && todayDate.compare(maxValue) > 0 ? null : todayDate),
  );

  useEffect(() => {
    if (!value) return;
    onDatePicked?.(value);
  }, [value, onDatePicked]);

  return (
    <DatePicker
      name="date"
      value={value}
      onChange={setValue}
      maxValue={maxValue}
      className="mt-2 w-full"
    >
      {label && (
        <Label
          className={cn(
            "text-[0.6rem] text-gray-500 font-gotham-black",
            labelClassName,
          )}
        >
          {label}
        </Label>
      )}
      <DateField.Group
        fullWidth
        className={cn(
          "bg-transparent border border-black rounded-none transition-colors duration-200",
          "focus-within:ring-0 focus-within:outline-none focus-within:border-black",

          "shadow-none",

          "group-data-[invalid=true]:border-transparent",

          "data-[invalid=true]:border-transparent",

          "data-[invalid=true]:focus-within:border-danger",
          "py-1.5",
          className,
        )}
      >
        <DateField.Input>
          {(segment) => <DateField.Segment segment={segment} />}
        </DateField.Input>
        <DateField.Suffix>
          <DatePicker.Trigger>
            <DatePicker.TriggerIndicator />
          </DatePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      <DatePicker.Popover className="p-1">
        <Calendar aria-label="Event date">
          <Calendar.Header>
            <Calendar.YearPickerTrigger>
              <Calendar.YearPickerTriggerHeading className="text-xs text-black" />
              <Calendar.YearPickerTriggerIndicator className="text-black" />
            </Calendar.YearPickerTrigger>
            <Calendar.NavButton slot="previous" className="w-6 text-black" />
            <Calendar.NavButton slot="next" className="w-6 text-black" />
          </Calendar.Header>
          <Calendar.Grid>
            <Calendar.GridHeader>
              {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
            </Calendar.GridHeader>
            <Calendar.GridBody>
              {(date) => (
                <Calendar.Cell
                  date={date}
                  className={cn(
                    "rounded-full",
                    "p-0",
                    "text-xs",
                    "data-[selected=true]:bg-black data-[selected=true]:text-white",
                    "data-[hovered=true]:bg-gray-100",
                    "data-[today=true]:text-black data-[today=true]:font-black",
                  )}
                />
              )}
            </Calendar.GridBody>
          </Calendar.Grid>
          <Calendar.YearPickerGrid>
            <Calendar.YearPickerGridBody>
              {({ year }) => (
                <Calendar.YearPickerCell
                  year={year}
                  className="text-xs data-[selected=true]:rounded-full data-[selected=true]:bg-black"
                />
              )}
            </Calendar.YearPickerGridBody>
          </Calendar.YearPickerGrid>
        </Calendar>
      </DatePicker.Popover>
    </DatePicker>
  );
}

export default CustomDatePicker;
