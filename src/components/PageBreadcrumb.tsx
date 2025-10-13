import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbItemConfig {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItemConfig[];
}

/**
 * Reusable PageBreadcrumb component
 *
 * @example
 * <PageBreadcrumb
 *   items={[
 *     { label: "Dashboard", href: "/admin" },
 *     { label: "Quản lý", href: "/admin" },
 *     { label: "Quản lý tài khoản", isCurrent: true }
 *   ]}
 * />
 */
export function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={index} className="contents">
            <BreadcrumbItem>
              {item.isCurrent ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
