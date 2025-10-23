import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight, CheckCircle2, Shield, Zap } from "lucide-react";
import { Stagger, Parallax } from "@/components/motion";
import nhaEBackground from "@/assets/background/nhaE.png";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${nhaEBackground})` }}
        />
        {/* Dark gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content */}
      <div className="container relative z-10 pt-8 sm:pt-12 md:pt-16 lg:pt-18 pb-20 sm:pb-28 md:pb-32 lg:pb-40">
        <div className="mx-auto md:max-w-7xl  ">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-8 lg:gap-12 items-center">
            {/* Left Content - 6/8 */}
            <div className="lg:col-span-6">
              <Stagger interval={0.2}>
                {/* Badge */}
                <div className="mb-6 flex justify-center sm:justify-start">
                  <Badge
                    variant="secondary"
                    className="bg-primary/20 text-white border-primary/30 backdrop-blur-sm px-4 py-1.5 text-sm"
                  >
                    Phòng quản trị trường Đại học Công Nghiệp TP.HCM
                  </Badge>
                </div>

                {/* Main Title */}
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl text-center sm:text-left">
                  Quản lý{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                    Cơ sở vật chất
                  </span>
                  <br />
                  <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                    Thông minh & Hiệu quả
                  </span>
                </h1>

                {/* Description */}
                <p className="mb-8 text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl leading-relaxed text-center sm:text-justify">
                  Hệ thống quản lý và báo cáo sự cố cơ sở vật chất trường Đại
                  học Công nghiệp TP.HCM. Giải pháp toàn diện giúp sinh viên, Hệ
                  thống quản lý và báo cáo sự cố cơ sở vật chất trường Đại học
                  Công nghiệp TP.HCM. Giải pháp toàn diện giúp sinh viên, giảng
                  viên và ban quản lý theo dõi, xử lý các vấn đề một cách{" "}
                  <span className="font-semibold text-cyan-300">
                    nhanh chóng, minh bạch và dễ dàng
                  </span>
                  .
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-3">
                  <Button
                    asChild
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all border-0 text-base px-8 py-3 h-auto"
                  >
                    <Link to="/report">
                      <FileText className="h-5 w-5" />
                      Báo cáo sự cố
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm hover:scale-105 transition-all text-base px-6 py-3 h-auto"
                  >
                    <Link to="/about">
                      Tìm hiểu thêm
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </Stagger>
            </div>

            {/* Right Content - Features List - 2/8 */}
            <div className="lg:col-span-2">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <motion.div
                  className="relative flex items-center gap-3 text-white/90 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden"
                  whileHover={{
                    scale: 1.02,
                    y: -2,
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.8,
                    }}
                  />
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0,
                    }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                  </motion.div>
                  <span className="text-sm font-medium">
                    Báo cáo nhanh chóng
                  </span>
                </motion.div>
                <motion.div
                  className="relative flex items-center gap-3 text-white/90 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden"
                  whileHover={{
                    scale: 1.02,
                    y: -2,
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2.2,
                    }}
                  />
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  >
                    <Zap className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  </motion.div>
                  <span className="text-sm font-medium">Xử lý tức thì</span>
                </motion.div>
                <motion.div
                  className="relative flex items-center gap-3 text-white/90 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden"
                  whileHover={{
                    scale: 1.02,
                    y: -2,
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                >
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2.6,
                    }}
                  />
                  <motion.div
                    animate={{
                      rotate: [0, -5, 5, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  >
                    <Shield className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  </motion.div>
                  <span className="text-sm font-medium">
                    Minh bạch & An toàn
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <Parallax from={-20} to={20}>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-full">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>
      </Parallax>
    </section>
  );
}
