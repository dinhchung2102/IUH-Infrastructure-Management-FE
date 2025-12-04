import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, FlaskConical, Users, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    icon: GraduationCap,
    label: "Giảng đường & Phòng học",
    value: "500+",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: FlaskConical,
    label: "Phòng thí nghiệm & Xưởng thực hành",
    value: "350+",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    icon: Users,
    label: "Sức chứa kí túc xá",
    value: "8.000",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    icon: BookOpen,
    label: "Bản sách & tài liệu trong thư viện",
    value: "200.000+",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
  },
];

export function FacilitiesStats() {
  return (
    <section className="border-y bg-muted/30 py-12">
      <div className="container">
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Card className="border cursor-default border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div
                        className={`${stat.bgColor} ${stat.color} p-3 rounded-xl shadow-sm`}
                      >
                        <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                      </div>
                      <div className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
                        {stat.value}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {stat.label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
