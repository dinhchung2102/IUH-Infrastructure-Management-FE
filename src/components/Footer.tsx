import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
import { Mail, Phone, MapPin, Facebook, Youtube, Linkedin } from "lucide-react";
import iuhLogo from "@/assets/logo/iuh_logo-official.png";

export default function Footer() {
  const quickLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/about", label: "Giới thiệu" },
    { to: "/contact", label: "Liên hệ" },
    { to: "/facilities", label: "Cơ sở vật chất" },
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
    {
      icon: Facebook,
      href: "#",
      label: "Facebook",
      color: "hover:bg-blue-600",
    },
    { icon: Youtube, href: "#", label: "Youtube", color: "hover:bg-red-600" },
    {
      icon: Linkedin,
      href: "#",
      label: "LinkedIn",
      color: "hover:bg-blue-700",
    },
  ];

  return (
    <footer className="relative border-t bg-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container relative py-6 md:py-8 lg:py-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand Section - Enhanced */}
          <div className="lg:col-span-5 ">
            <div className="mb-6 flex items-center gap-3">
              <img
                src={iuhLogo}
                alt="IUH Logo"
                className="h-auto w-40 object-contain"
              />

              <div>
                <span className="block text-lg font-bold text-foreground">
                  PHÒNG QUẢN TRỊ
                </span>
                <span className="text-sm font-medium text-primary">
                  TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TP.HCM
                </span>
              </div>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400 text-justify">
              Hệ thống quản lý cơ sở vật chất trường Đại học Công nghiệp Thành
              phố Hồ Chí Minh. Cung cấp giải pháp báo cáo và theo dõi sự cố
              nhanh chóng, hiệu quả. Hệ thống quản lý cơ sở vật chất trường Đại
              học Công nghiệp Thành phố Hồ Chí Minh. Cung cấp giải pháp báo cáo
              và theo dõi sự cố nhanh chóng, hiệu quả.
            </p>

            {/* Social Links - Enhanced */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Kết nối với chúng tôi
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  const getIconColor = (label: string) => {
                    switch (label) {
                      case "Facebook":
                        return "text-blue-600 group-hover:text-blue-700";
                      case "Youtube":
                        return "text-red-600 group-hover:text-red-700";
                      case "LinkedIn":
                        return "text-blue-700 group-hover:text-blue-800";
                      default:
                        return "text-slate-600 group-hover:text-slate-700";
                    }
                  };

                  const getBgColor = (label: string) => {
                    switch (label) {
                      case "Facebook":
                        return "bg-blue-50 group-hover:bg-blue-100";
                      case "Youtube":
                        return "bg-red-50 group-hover:bg-red-100";
                      case "LinkedIn":
                        return "bg-blue-50 group-hover:bg-blue-100";
                      default:
                        return "bg-slate-50 group-hover:bg-slate-100";
                    }
                  };

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`group relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/60 ${getBgColor(
                        social.label
                      )} backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-transparent hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-800/80 dark:hover:shadow-slate-900/50`}
                    >
                      <Icon
                        className={`h-5 w-5 transition-all duration-300 group-hover:scale-110 ${getIconColor(
                          social.label
                        )} dark:text-slate-400`}
                      />

                      {/* Tooltip effect */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition-all duration-300 group-hover:opacity-100 dark:bg-slate-100 dark:text-slate-900">
                        {social.label}
                        <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-100" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Links - Enhanced */}
          <div className="lg:col-span-3">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-foreground">
              Liên kết nhanh
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center text-sm text-slate-600 transition-colors hover:text-primary dark:text-slate-400"
                  >
                    <span className="mr-2 h-1 w-1 rounded-full bg-slate-300 transition-all group-hover:w-2 group-hover:bg-primary dark:bg-slate-700" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Enhanced */}
          <div className="lg:col-span-4">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-foreground">
              Thông tin liên hệ
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                const getIconColor = (iconName: string) => {
                  switch (iconName) {
                    case "MapPin":
                      return "text-green-600";
                    case "Phone":
                      return "text-blue-600";
                    case "Mail":
                      return "text-red-600";
                    default:
                      return "text-slate-600";
                  }
                };

                const content = (
                  <div className="group flex items-start gap-3 transition-all duration-300 hover:translate-x-1">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <Icon
                        className={`h-5 w-5 transition-all duration-300 group-hover:scale-110 ${getIconColor(
                          contact.icon.name
                        )}`}
                      />
                    </div>
                    <span className="block text-sm leading-relaxed text-slate-600 transition-colors group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-200 mt-1">
                      {contact.text}
                    </span>
                  </div>
                );

                return (
                  <li key={index}>
                    {contact.href ? (
                      <a href={contact.href} className="block">
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

        {/* Separator with gradient */}
        <div className="relative my-10">
          <Separator className="bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />
        </div>

        {/* Bottom Section - Enhanced */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-center text-sm text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Industrial University of Ho Chi Minh City
            </span>
            . All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              to="/privacy"
              className="text-slate-600 transition-colors hover:text-primary dark:text-slate-400"
            >
              Chính sách bảo mật
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              to="/terms"
              className="text-slate-600 transition-colors hover:text-primary dark:text-slate-400"
            >
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
