import { Field, FieldLabel } from "@/components/ui/field";
import {
  Combobox,
  ComboboxInput,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import { ComboboxContent } from "./ui/combobox";

const ComboSearch = ({
  items,
  placeholder,
  emptyMessage,
  ...props
}: {
  items: string[];
  placeholder: string;
  emptyMessage: string;
}) => {
  return (
    <Field>
      <FieldLabel htmlFor="small-form-framework">Framework</FieldLabel>
      <Combobox items={items}>
        <ComboboxInput placeholder={placeholder} {...props} />
        <ComboboxContent>
          <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  );
};

export { ComboSearch };
