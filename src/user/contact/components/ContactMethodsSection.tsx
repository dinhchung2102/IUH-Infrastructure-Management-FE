import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal } from "@/components/motion";
import { Mail, Phone, MapPin } from "lucide-react";

const contactMethods = [
  {
    icon: Phone,
    title: "Điện thoại",
    value: "(028) 3894 2223",
    description: "Thứ 2 - Thứ 6, 7:30 - 17:00",
    href: "tel:+842838942223",
  },
  {
    icon: Mail,
    title: "Email",
    value: "dhcn@iuh.edu.vn",
    description: "Phản hồi trong vòng 24h",
    href: "mailto:dhcn@iuh.edu.vn",
  },
  {
    icon: MapPin,
    title: "Địa chỉ",
    value: "12 Nguyễn Văn Bảo, P.4",
    description: "Q.Gò Vấp, TP.HCM",
    href: "https://maps.google.com",
  },
];

export function ContactMethodsSection() {
  return (
    <section className="container py-16">
      <div className="grid gap-6 md:grid-cols-3">
        {contactMethods.map((method, index) => {
          const Icon = method.icon;
          return (
            <Reveal key={index} delay={index * 0.15}>
              <Card className="transition-all hover:shadow-xl hover:scale-105 cursor-pointer">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{method.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <a
                    href={method.href}
                    className="mb-1 block font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {method.value}
                  </a>
                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
