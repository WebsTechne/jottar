import { Field, FieldDescription, FieldTitle } from "@/components/ui/field";

const AuthMessage = ({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) => {
  return (
    <Field className="gap-0!">
      <FieldTitle
        className="w-fit text-4xl leading-tight font-extrabold"
        id={id}
      >
        {title}
      </FieldTitle>
      <FieldDescription className="text-base">{description}</FieldDescription>
    </Field>
  );
};

export { AuthMessage };
