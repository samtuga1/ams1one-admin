import { Label, ListBox, Select } from "@heroui/react";
import { IoChevronDown } from "react-icons/io5";
import React from "react";

type Props = {
  list: { key: string; label: string }[];
  initialItemKey?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  shouldFlip?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  endContent?: React.ReactNode;
  selectionMode?: "single" | "multiple";
  onSelectionChange: (value: { key: string; label: string }) => void;
  showDropDownIcon?: boolean;
  renderItem?: (item: { key: string; label: string }) => React.ReactNode;
};

export default function CustomSelectComponent({
  list,
  onSelectionChange,
  label,
  initialItemKey,
  placeholder,
  isRequired,
  className,
  labelClassName,
  selectionMode,
  isDisabled,
  endContent,
  shouldFlip,
  renderItem,
  showDropDownIcon,
}: Props) {
  const [value, setValue] = React.useState(initialItemKey);

  const handleSelectionChange = (key: React.Key | null) => {
    if (key == null) return;
    const selectedKey = String(key);

    const item = list.find((entry) => entry.key === selectedKey);

    if (item) {
      setValue(item.key);
      onSelectionChange({
        key: item.key,
        label: item.label,
      });
    }
  };

  return (
    <div className="relative w-full">
      <Select
        isRequired={isRequired}
        className={className}
        defaultSelectedKey={initialItemKey}
        selectedKey={value}
        selectionMode={selectionMode}
        placeholder={placeholder}
        isDisabled={isDisabled}
        onSelectionChange={handleSelectionChange}
      >
        {label && (
          <Label className={`text-xs ${labelClassName}`}>{label}</Label>
        )}
        <Select.Trigger className="border border-gray-300 rounded-lg shadow-none text-xs cursor-pointer h-[2.3rem]">
          <Select.Value className="text-xs" />
          {(showDropDownIcon || endContent) && (
            <Select.Indicator>
              {endContent ?? <IoChevronDown className="w-4 h-4 text-black" />}
            </Select.Indicator>
          )}
        </Select.Trigger>
        <Select.Popover shouldFlip={shouldFlip} className="rounded-lg">
          <ListBox className="text-xs">
            {list.map((item) => (
              <ListBox.Item
                key={item.key}
                id={item.key}
                textValue={item.label}
                className="rounded-lg"
              >
                {renderItem ? renderItem(item) : item.label}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
