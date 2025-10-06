import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Mail, Phone, MapPin, Facebook, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/about", label: "Giới thiệu" },
    { to: "/news", label: "Tin tức" },
    { to: "/report", label: "Báo cáo sự cố" },
  ];

  const contactInfo = [
    {
      icon: MapPin,
      text: "12 Nguyễn Văn Bảo, P.4, Q.Gò Vấp, TP.HCM",
    },
    {
      icon: Phone,
      text: "(028) 3894 2223",
      href: "tel:+842838942223",
    },
    {
      icon: Mail,
      text: "dhcn@iuh.edu.vn",
      href: "mailto:dhcn@iuh.edu.vn",
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Youtube, href: "#", label: "Youtube" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="border-t bg-background px-6">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <img
                src="../assets/logo/iuh_logo-official.png"
                alt="IUH Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="text-lg font-semibold">
                IUH Facilities Management
              </span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Hệ thống quản lý cơ sở vật chất trường Đại học Công nghiệp Thành
              phố Hồ Chí Minh. Cung cấp giải pháp báo cáo và theo dõi sự cố
              nhanh chóng, hiệu quả.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.label}
                    variant="outline"
                    size="icon-sm"
                    asChild
                  >
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 font-semibold">Liên hệ</h3>
            <ul className="space-y-3">
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                const content = (
                  <div className="flex gap-2">
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {contact.text}
                    </span>
                  </div>
                );

                return (
                  <li key={index}>
                    {contact.href ? (
                      <a
                        href={contact.href}
                        className="transition-colors hover:text-primary"
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Industrial University of Ho Chi Minh
            City. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary">
              Chính sách bảo mật
            </Link>
            <Link to="/terms" className="hover:text-primary">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
