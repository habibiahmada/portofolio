import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContactFormData } from "@/hooks/api/public/useContact";

type BasicInfoKey = keyof Omit<ContactFormData, "recaptchaToken">;

interface Props {
  formData: Omit<ContactFormData, "recaptchaToken">;
  onChange: <K extends BasicInfoKey>(
    key: K,
    value: ContactFormData[K]
  ) => void;
}

export default function ContactBasicInfo({
  formData,
  onChange,
}: Props) {
  const handleChange =
    <K extends BasicInfoKey>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(key, e.target.value as ContactFormData[K]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={handleChange("name")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange("email")}
          required
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange("phone")}
        />
      </div>
    </div>
  );
}
