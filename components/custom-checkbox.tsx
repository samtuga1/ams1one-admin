import { Checkbox, cn, Label } from "@heroui/react";

const CustomCheckboxItem = ({
  selected,
  label,
  labelClassName,
  isDisabled = false,
  setIsSelected,
}: {
  selected: boolean;
  label?: string;
  labelClassName?: string;
  isDisabled?: boolean;
  setIsSelected?: (isSelected: boolean) => void;
}) => {
  return (
    <Checkbox
      id={label}
      isSelected={selected}
      isDisabled={isDisabled}
      onChange={setIsSelected}
    >
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      {label && (
        <Checkbox.Content>
          <Label
            className={cn("text-xs cursor-pointer select-none", labelClassName)}
          >
            {label}
          </Label>
        </Checkbox.Content>
      )}
    </Checkbox>
  );
};

export default CustomCheckboxItem;
